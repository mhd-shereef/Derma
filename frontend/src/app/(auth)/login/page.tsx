'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  Lock,
  Mail,
  Eye,
  EyeOff,
  ArrowRight,
  ArrowLeft,
  KeyRound,
} from 'lucide-react';
import { useAuthStore } from '@/stores/auth.store';
import { api } from '@/lib/api-client';
import { setTokens } from '@/lib/auth';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const router = useRouter();
  const { setUser } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showMfa, setShowMfa] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    mfaCode: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // If user clicks DEMO without typing, default to the demo credentials
    const targetEmail = formData.email.trim() || 'owner@demo-clinic.com';
    const targetPassword = formData.password.trim() || 'password123';

    setIsLoading(true);
    setErrors({});
    try {
      const response = await api.post<{
        user: { id: string; email: string; firstName: string; lastName: string; role: string; tenantId: string };
        accessToken: string;
        refreshToken: string;
      }>('/auth/login', {
        email: targetEmail,
        password: targetPassword,
        mfaCode: formData.mfaCode || undefined,
      });

      const { user, accessToken, refreshToken } = response.data;
      setTokens({ accessToken, refreshToken }, user);
      setUser(user);
      toast.success(`Welcome, Dr. ${user.lastName || user.firstName || 'Demo'}!`);
      router.push('/dashboard');
    } catch (error: unknown) {
      const axiosError = error as { response?: { data?: { error?: { message?: string } } } };
      const message = axiosError.response?.data?.error?.message ?? 'Invalid credentials';

      if (message.toLowerCase().includes('mfa')) {
        setShowMfa(true);
        setErrors({ mfaCode: 'MFA code is required for this account' });
        toast.error('Please enter your 6-digit MFA code');
      } else if (message.toLowerCase().includes('locked')) {
        toast.error('Account temporarily locked. Please try again later.');
      } else {
        toast.error(message);
        setErrors({ general: message });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen w-full flex flex-col lg:flex-row bg-[#F5F2EB] text-slate-800 selection:bg-[#0D3A35] selection:text-white">
      {/* LEFT SIDE: Pure Clinical Environment Showcase (Card removed as requested) */}
      <div className="relative hidden lg:flex lg:w-1/2 xl:w-7/12 flex-col justify-between p-12 xl:p-16 overflow-hidden border-r border-[#E5E0D8]">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/clinic-hero.jpg"
            alt="Dermatology Clinic Interior"
            fill
            priority
            quality={90}
            className="object-cover object-center filter brightness-[0.94]"
          />
          {/* Subtle soft gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#082622]/40 via-transparent to-[#082622]/20" />
        </div>

        {/* Top Back Link */}
        <div className="relative z-10">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 hover:bg-white text-slate-800 text-xs font-medium shadow-sm border border-slate-200/80 transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </Link>
        </div>

        {/* Clean bottom spacer without text overlay */}
        <div className="relative z-10" />
      </div>

      {/* RIGHT SIDE: Clean Sign In / DEMO Form */}
      <div className="w-full lg:w-1/2 xl:w-5/12 min-h-screen flex flex-col justify-center px-6 sm:px-12 xl:px-16 py-12 relative z-10">
        <div className="w-full max-w-md mx-auto space-y-8">
          {/* Top Mobile Home Link */}
          <div className="lg:hidden">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-xs font-medium text-slate-600 hover:text-slate-900"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Home</span>
            </Link>
          </div>

          {/* Heading Section */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#0D3A35]" />
              <span className="text-xs font-semibold tracking-wider uppercase text-slate-500">
                Clinical Access
              </span>
            </div>

            {/* Wonderful Serif DERMA Heading */}
            <div className="flex items-baseline gap-1">
              <h1 className="font-serif text-4xl sm:text-5xl font-bold tracking-tight text-[#0D3A35]">
                DERMA
              </h1>
            </div>

            <p className="text-sm text-slate-600 font-normal">
              Sign in or click DEMO to access the practice workspace.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* General Error Alert */}
            {errors.general && (
              <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2">
                <span className="font-semibold">Error:</span>
                <span>{errors.general}</span>
              </div>
            )}

            {/* Email / Username Field */}
            <div className="space-y-1.5">
              <label
                htmlFor="login-email"
                className="block text-xs font-semibold uppercase tracking-wider text-slate-700"
              >
                Username or Email
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-[#0D3A35]">
                  <Mail className="w-5 h-5" />
                </div>
                <input
                  id="login-email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => {
                    setFormData({ ...formData, email: e.target.value });
                    if (errors.email) setErrors({ ...errors, email: '' });
                  }}
                  disabled={isLoading}
                  autoComplete="email"
                  placeholder="doctor@clinic.com (or leave empty for demo)"
                  className="w-full h-12 pl-11 pr-4 rounded-2xl bg-white border border-slate-200 hover:border-slate-300 focus:border-[#0D3A35] focus:ring-2 focus:ring-[#0D3A35]/15 text-slate-900 text-sm placeholder:text-slate-400 focus:outline-none transition-all"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="login-password"
                  className="block text-xs font-semibold uppercase tracking-wider text-slate-700"
                >
                  Password
                </label>
                <Link
                  href="/forgot-password"
                  className="text-xs text-[#0D3A35] hover:underline transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-[#0D3A35]">
                  <Lock className="w-5 h-5" />
                </div>
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => {
                    setFormData({ ...formData, password: e.target.value });
                    if (errors.password) setErrors({ ...errors, password: '' });
                  }}
                  disabled={isLoading}
                  autoComplete="current-password"
                  placeholder="•••••••••••• (or leave empty for demo)"
                  className="w-full h-12 pl-11 pr-11 rounded-2xl bg-white border border-slate-200 hover:border-slate-300 focus:border-[#0D3A35] focus:ring-2 focus:ring-[#0D3A35]/15 text-slate-900 text-sm placeholder:text-slate-400 focus:outline-none transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-700 focus:outline-none"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Optional MFA Field */}
            {showMfa && (
              <div className="space-y-1.5 pt-1">
                <label
                  htmlFor="login-mfa"
                  className="block text-xs font-semibold uppercase tracking-wider text-[#0D3A35]"
                >
                  Authenticator 6-Digit MFA Code
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#0D3A35]">
                    <KeyRound className="w-5 h-5" />
                  </div>
                  <input
                    id="login-mfa"
                    type="text"
                    maxLength={6}
                    value={formData.mfaCode}
                    onChange={(e) => setFormData({ ...formData, mfaCode: e.target.value })}
                    disabled={isLoading}
                    placeholder="123456"
                    className="w-full h-12 pl-11 pr-4 rounded-2xl bg-white border border-[#0D3A35] text-slate-900 tracking-widest text-base font-mono focus:outline-none focus:ring-2 focus:ring-[#0D3A35]/20"
                  />
                </div>
              </div>
            )}

            {/* DEMO Button (as requested instead of Sign In) */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 mt-3 rounded-full bg-[#0D3A35] hover:bg-[#134E48] text-white font-semibold text-sm tracking-wide transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 group disabled:opacity-50 active:scale-95"
            >
              {isLoading ? (
                <span>Loading Demo...</span>
              ) : (
                <>
                  <span>DEMO</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          {/* Clean Footer Note */}
          <div className="pt-6 border-t border-slate-200/80 text-center">
            <p className="text-xs text-slate-500">
              © {new Date().getFullYear()} DERMA Clinical Systems. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}