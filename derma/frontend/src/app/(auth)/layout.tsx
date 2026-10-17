import { ReactNode } from 'react';

export default function AuthLayout({ children }: { children: ReactNode }) {
  return <div className="min-h-screen bg-[#F5F2EB] text-slate-900 antialiased font-sans">{children}</div>;
}