'use client';

import { useAuthStore } from '@/stores/auth.store';
import { Sidebar } from '@/components/ui/Sidebar';
import { Header } from '@/components/ui/Header';
import { cn } from '@/lib/utils';
import { ReactNode, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { api } from '@/lib/api-client';
import { getUser, isAuthenticated } from '@/lib/auth';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { setUser, setLoading, isLoading: storeLoading } = useAuthStore();

  useEffect(() => {
    const initAuth = async () => {
      if (!isAuthenticated()) {
        router.push('/login');
        return;
      }

      const user = getUser();
      if (user) {
        setUser(user);
        setLoading(false);
      } else {
        try {
          const response = await api.get<{ user: { id: string; email: string; firstName: string; lastName: string; role: string; tenantId: string } }>('/auth/me');
          const payload: any = response.data;
          const userData = payload?.data?.user ?? payload?.user;
          if (userData) {
            setUser(userData);
          }
          setLoading(false);

        } catch {
          router.push('/login');
        }
      }
    };

    initAuth();
  }, [router, setUser, setLoading]);

  if (storeLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <div className={cn('lg:pl-64 transition-all duration-200', 'flex flex-col min-h-screen')}>
        <Header />
        <main className="flex-1 p-4 lg:p-6">{children}</main>
      </div>
    </div>
  );
}