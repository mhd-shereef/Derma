import { api } from './api-client';
import {
  AuthTokens,
  User,
  getAccessToken,
  getRefreshToken,
  getUser,
  setTokens,
  clearTokens,
  refreshAccessToken,
} from './token-storage';

export type { AuthTokens, User };
export {
  getAccessToken,
  getRefreshToken,
  getUser,
  setTokens,
  clearTokens,
  refreshAccessToken,
};

export function isAuthenticated(): boolean {
  return !!getAccessToken();
}

export function hasRole(roles: string[]): boolean {
  const user = getUser();
  if (!user) return false;
  return roles.includes(user.role);
}

export function isOwnerOrAdmin(): boolean {
  return hasRole(['OWNER', 'ADMIN']);
}

export function isDoctorOrAbove(): boolean {
  return hasRole(['OWNER', 'ADMIN', 'DOCTOR']);
}

export function canAccess(requiredRoles: string[]): boolean {
  return hasRole(requiredRoles);
}