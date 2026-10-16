'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/stores/auth.store';
import { useUIStore } from '@/stores/ui.store';
import {
  LayoutDashboard,
  Users,
  UserPlus,
  Calendar,
  ListTodo,
  FileText,
  Camera,
  ClipboardList,
  Package,
  CreditCard,
  BarChart3,
  Settings,
  Shield,
  LogOut,
  Menu,
  ChevronLeft,
  ChevronRight,
  Building2,
  Stethoscope,
} from 'lucide-react';
import { Button } from './Button';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, roles: ['OWNER', 'ADMIN', 'DOCTOR', 'NURSE', 'RECEPTIONIST'] },
  { name: 'Patients', href: '/patients', icon: Users, roles: ['OWNER', 'ADMIN', 'DOCTOR', 'NURSE', 'RECEPTIONIST'] },
  { name: 'Appointments', href: '/appointments', icon: Calendar, roles: ['OWNER', 'ADMIN', 'DOCTOR', 'NURSE', 'RECEPTIONIST'] },
  { name: 'Queue', href: '/appointments/queue', icon: ListTodo, roles: ['OWNER', 'ADMIN', 'DOCTOR', 'NURSE'] },
  { name: 'Visits', href: '/visits', icon: FileText, roles: ['OWNER', 'ADMIN', 'DOCTOR', 'NURSE'] },
  { name: 'Photos', href: '/photos', icon: Camera, roles: ['OWNER', 'ADMIN', 'DOCTOR', 'NURSE'] },
  { name: 'Prescriptions', href: '/prescriptions', icon: ClipboardList, roles: ['OWNER', 'ADMIN', 'DOCTOR', 'NURSE', 'RECEPTIONIST'] },
  { name: 'Procedures', href: '/procedures', icon: Stethoscope, roles: ['OWNER', 'ADMIN', 'DOCTOR'] },
  { name: 'Packages', href: '/packages', icon: Package, roles: ['OWNER', 'ADMIN', 'RECEPTIONIST'] },
  { name: 'Billing', href: '/billing', icon: CreditCard, roles: ['OWNER', 'ADMIN', 'RECEPTIONIST'] },
  { name: 'Reports', href: '/reports', icon: BarChart3, roles: ['OWNER', 'ADMIN'] },
  { name: 'Settings', href: '/settings', icon: Settings, roles: ['OWNER', 'ADMIN'] },
  { name: 'Audit Logs', href: '/audit', icon: Shield, roles: ['OWNER', 'ADMIN'] },
];

export function Sidebar() {
  const pathname = usePathname();
  const { user, hasRole } = useAuthStore();
  const { sidebarOpen, setSidebarOpen, mobileMenuOpen, setMobileMenuOpen } = useUIStore();

  const filteredNav = navigation.filter((item) => item.roles.some((r) => hasRole([r])));

  if (typeof window === 'undefined') return null;

  return (
    <>
      <button
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-md bg-background border"
        onClick={() => setMobileMenuOpen(true)}
        aria-label="Open menu"
      >
        <Menu className="h-6 w-6" />
      </button>

      <div
        className={cn(
          'fixed inset-y-0 left-0 z-40 w-64 bg-card border-r transition-transform duration-200 ease-in-out lg:translate-x-0',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full',
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
        )}
        aria-label="Sidebar"
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between h-16 px-4 border-b">
            <Link href="/dashboard" className="flex items-center gap-2">
              <Building2 className="h-8 w-8 text-primary" />
              <span className="font-bold text-lg">DERMA</span>
            </Link>
            <button
              className="lg:hidden p-1 rounded-md hover:bg-accent"
              onClick={() => setMobileMenuOpen(false)}
              aria-label="Close menu"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
          </div>

          <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto" aria-label="Main navigation">
            {filteredNav.map((item) => {
              const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
                  )}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <item.icon className="h-5 w-5 shrink-0" aria-hidden="true" />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          <div className="border-t p-4">
            <div className="flex items-center gap-3 px-3 py-2">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{user?.firstName} {user?.lastName}</p>
                <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
              </div>
            </div>
            <div className="mt-3 space-y-1">
              <Link
                href="/settings/profile"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
              >
                <Settings className="h-5 w-5" />
                Profile
              </Link>
              <button
                onClick={() => useAuthStore.getState().logout()}
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
              >
                <LogOut className="h-5 w-5" />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
          aria-hidden="true"
        />
      )}
    </>
  );
}