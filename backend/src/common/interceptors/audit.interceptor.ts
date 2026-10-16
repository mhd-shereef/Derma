import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { Reflector } from '@nestjs/core';
import { PrismaService } from '../../prisma/prisma.service';
import { AuditAction as PrismaAuditAction } from '@prisma/client';
import { AUDIT_ACTION_KEY } from '../decorators/audit-action.decorator';
import { AuthenticatedRequest } from '../types/request.types';

@Injectable()
export class AuditInterceptor implements NestInterceptor {
  constructor(
    private readonly prisma: PrismaService,
    private readonly reflector: Reflector,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const handler = context.getHandler();

    const auditAction = this.reflector.get<PrismaAuditAction>(AUDIT_ACTION_KEY, handler);

    const method = request.method;
    let action = auditAction;

    if (!action && ['POST', 'PATCH', 'PUT', 'DELETE'].includes(method)) {
      action = this.mapMethodToAction(method);
    }

    if (!action) {
      return next.handle();
    }

    const startTime = Date.now();
    const user = request.user;
    const tenantId = request.tenant?.id ?? user?.tenantId;

    return next.handle().pipe(
      tap({
        next: async (response: unknown) => {
          if (!tenantId || !user) return;

          try {
            await this.logAudit({
              tenantId,
              userId: user.id,
              action: action!,
              entityType: this.getEntityType(handler, request),
              entityId: this.getEntityId(request, response),
              oldValue: (request as any).oldValue,
              newValue: this.extractNewValue(response),
              ipAddress: request.ip ?? 'unknown',
              userAgent: (request.headers['user-agent'] as string) ?? 'unknown',
              metadata: {
                method,
                url: request.url,
                duration: Date.now() - startTime,
              },
            });
          } catch (error) {
            console.error('Audit logging failed:', error);
          }
        },
        error: async (error: Error) => {
          if (!tenantId || !user) return;

          try {
            await this.logAudit({
              tenantId,
              userId: user.id,
              action: PrismaAuditAction.READ,
              entityType: this.getEntityType(handler, request),
              entityId: this.getEntityId(request, null),
              oldValue: null,
              newValue: null,
              ipAddress: request.ip ?? 'unknown',
              userAgent: (request.headers['user-agent'] as string) ?? 'unknown',
              metadata: {
                method,
                url: request.url,
                error: error.message,
                duration: Date.now() - startTime,
              },
            });
          } catch (e) {
            console.error('Audit logging failed:', e);
          }
        },
      }),
    );
  }

  private mapMethodToAction(method: string): PrismaAuditAction {
    switch (method) {
      case 'POST':
        return PrismaAuditAction.CREATE;
      case 'PATCH':
      case 'PUT':
        return PrismaAuditAction.UPDATE;
      case 'DELETE':
        return PrismaAuditAction.DELETE;
      default:
        return PrismaAuditAction.READ;
    }
  }

  private getEntityType(handler: unknown, request: AuthenticatedRequest): string {
    const className = handler?.constructor?.name ?? '';
    const match = className.match(/(\w+)Controller/);
    if (match) {
      return match[1].replace('Controller', '');
    }

    const urlParts = request.url.split('/').filter(Boolean);
    const apiIndex = urlParts.indexOf('api');
    if (apiIndex !== -1 && urlParts[apiIndex + 1] === 'v1') {
      return urlParts[apiIndex + 2] ?? 'Unknown';
    }

    return 'Unknown';
  }

  private getEntityId(request: AuthenticatedRequest, response: unknown): string | undefined {
    const params = (request.params ?? {}) as Record<string, string>;
    if (params.id && this.isValidUuid(params.id)) {
      return params.id;
    }

    if (response && typeof response === 'object' && 'data' in response) {
      const data = (response as { data: { id?: string } }).data;
      if (data?.id && this.isValidUuid(data.id)) {
        return data.id;
      }
    }

    return undefined;
  }

  private isValidUuid(value: string): boolean {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(value);
  }

  private extractNewValue(response: unknown): unknown {
    if (!response || typeof response !== 'object') return null;

    const resp = response as { data?: unknown; meta?: unknown };
    return resp.data ?? null;
  }

  private async logAudit(data: {
    tenantId: string;
    userId: string;
    action: PrismaAuditAction;
    entityType: string;
    entityId?: string;
    oldValue?: unknown;
    newValue?: unknown;
    ipAddress?: string;
    userAgent?: string;
    metadata?: Record<string, unknown>;
  }) {
    await this.prisma.auditLog.create({
      data: {
        tenantId: data.tenantId,
        userId: data.userId,
        action: data.action,
        entityType: data.entityType,
        entityId: data.entityId,
        oldValue: data.oldValue as any,
        newValue: data.newValue as any,
        ipAddress: data.ipAddress,
        userAgent: data.userAgent,
        metadata: data.metadata as any,
      },
    });
  }
}