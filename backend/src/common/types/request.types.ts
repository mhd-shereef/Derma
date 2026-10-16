import { Request } from 'express';
import { UserRole, SubscriptionStatus } from '@prisma/client';

export interface AuthenticatedUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  tenantId: string;
  licenseNumber?: string;
  specialization?: string;
}

export interface TenantContext {
  id: string;
  name: string;
  slug: string;
  subscriptionStatus: SubscriptionStatus;
  settings: Record<string, unknown>;
}

export interface AuthenticatedRequest extends Request {
  user?: AuthenticatedUser;
  tenant?: TenantContext;
  ip: string;
  params: Record<string, string>;
}