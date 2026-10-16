import axios from 'axios';

const ACCESS_TOKEN_KEY = 'derma_ai_access_token';
const REFRESH_TOKEN_KEY = 'derma_ai_refresh_token';
const USER_KEY = 'derma_ai_user';

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  tenantId: string;
  licenseNumber?: string;
  specialization?: string;
}

export function getAccessToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function getRefreshToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(REFRESH_TOKEN_KEY);
}

export function getUser(): User | null {
  if (typeof window === 'undefined') return null;
  const userStr = localStorage.getItem(USER_KEY);
  if (!userStr) return null;
  try {
    return JSON.parse(userStr);
  } catch {
    return null;
  }
}

export function setTokens(tokens: AuthTokens, user?: User | null): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(ACCESS_TOKEN_KEY, tokens.accessToken);
  localStorage.setItem(REFRESH_TOKEN_KEY, tokens.refreshToken);
  if (user) {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }
}

export function clearTokens(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

export async function refreshAccessToken(): Promise<string> {
  const refreshToken = getRefreshToken();
  if (!refreshToken) {
    throw new Error('No refresh token available');
  }

  const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001/api/v1';

  // Use plain axios instance to avoid circular dependency and interceptor loops
  const response = await axios.post<{ data: { accessToken: string; refreshToken: string } } | { accessToken: string; refreshToken: string }>(
    `${apiUrl}/auth/refresh`,
    { refreshToken },
    { headers: { 'Content-Type': 'application/json' } }
  );

  const payload: any = response.data;
  const tokens = payload.data ? payload.data : payload;
  const accessToken = tokens.accessToken;
  const newRefreshToken = tokens.refreshToken;

  const user = getUser();
  setTokens({ accessToken, refreshToken: newRefreshToken }, user);

  return accessToken;
}
