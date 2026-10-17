import { SetMetadata } from '@nestjs/common';
import { AuditAction as PrismaAuditAction } from '@prisma/client';

export const AUDIT_ACTION_KEY = 'auditAction';
export const AuditActionDec = (action: PrismaAuditAction) => SetMetadata(AUDIT_ACTION_KEY, action);