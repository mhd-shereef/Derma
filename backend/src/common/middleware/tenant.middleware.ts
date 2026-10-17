import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { AsyncLocalStorage } from 'async_hooks';
import { TenantContext } from '../types/request.types';

export const tenantStorage = new AsyncLocalStorage<{ tenantId: string }>();

@Injectable()
export class TenantMiddleware implements NestMiddleware {
  private readonly logger = new Logger(TenantMiddleware.name);

  use(req: Request, res: Response, next: NextFunction) {
    let tenantId = (req as any).user?.tenantId || (req.headers['x-tenant-id'] as string);

    if (!tenantId && req.headers.authorization) {
      const parts = req.headers.authorization.split(' ');
      if (parts.length === 2 && /^Bearer$/i.test(parts[0])) {
        try {
          const payloadBase64 = parts[1].split('.')[1];
          if (payloadBase64) {
            const decoded = JSON.parse(Buffer.from(payloadBase64, 'base64').toString('utf8'));
            if (decoded?.tenantId) {
              tenantId = decoded.tenantId;
            }
          }
        } catch {
          // Ignore invalid JWT tokens in middleware; guard will reject
        }
      }
    }

    if (tenantId) {
      const tenantContext: TenantContext = {
        id: tenantId,
        name: '',
        slug: '',
        subscriptionStatus: 'ACTIVE',
        settings: {},
      };

      (req as any).tenant = tenantContext;
      this.logger.debug(`Tenant context set: ${tenantId}`);
      return tenantStorage.run({ tenantId }, () => next());
    }

    next();
  }
}