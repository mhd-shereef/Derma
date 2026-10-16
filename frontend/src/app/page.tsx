'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  ChevronDown,
  ArrowRight,
  ExternalLink,
  Shield,
  Activity,
  Stethoscope,
  Heart,
  Camera,
  CheckCircle2,
  Menu,
  X,
  Sparkles,
  Layers,
  ArrowUpRight,
  SlidersHorizontal,
  Lock,
} from 'lucide-react';

export default function MedNexaHomePage() {
  const [productsOpen, setProductsOpen] = useState(false);
  const [demoOpen, setDemoOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileProductsOpen, setMobileProductsOpen] = useState(true);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const demoDropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setProductsOpen(false);
      }
      if (demoDropdownRef.current && !demoDropdownRef.current.contains(event.target as Node)) {
        setDemoOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="min-h-screen bg-[#FAF6EF] text-[#0C1A2E] font-sans selection:bg-[#0C1A2E] selection:text-[#FAF6EF]">
      {/* 1. TOP HEADER & NAVBAR */}
      <header className="sticky top-0 z-50 bg-[#FAF6EF]/90 backdrop-blur-md border-b border-[#0C1A2E]/10 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 h-20 flex items-center justify-between">
          {/* Left: MedNexa Brand */}
          <div className="flex items-center gap-10">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative w-9 h-9 rounded-xl bg-[#0C1A2E] flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
                {/* MedNexa Signature 3-node motif */}
                <svg className="w-6 h-6" viewBox="0 0 36 36" fill="none">
                  <circle cx="10" cy="18" r="3.2" fill="#FAF6EF" />
                  <circle cx="26" cy="11" r="3.2" fill="#FF4D3D" />
                  <circle cx="26" cy="25" r="3.2" fill="#FAF6EF" />
                  <path d="M12 17L24 12M12 19L24 24" stroke="#FAF6EF" strokeWidth="1.6" strokeLinecap="round" />
                </svg>
              </div>
              <span className="font-serif text-2xl font-bold tracking-tight text-[#0C1A2E]">
                Med<span className="italic font-normal text-[#FF4D3D]">Nexa</span>
              </span>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-1 text-sm font-medium text-[#0C1A2E]/80">
              {/* Products Dropdown */}
              <div className="relative group">
                <button
                  type="button"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full transition-all group-hover:bg-[#0C1A2E]/10 group-hover:text-[#0C1A2E] text-[#0C1A2E]/80"
                  aria-haspopup="true"
                >
                  <span>Products</span>
                  <ChevronDown className="w-4 h-4 transition-transform duration-200 group-hover:rotate-180" />
                </button>

                {/* Dropdown Menu with hover bridge */}
                <div className="absolute top-full left-0 pt-2 hidden group-hover:block group-focus-within:block z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                  <div className="w-[420px] bg-white rounded-2xl shadow-[0_20px_50px_rgba(12,26,46,0.16)] border border-[#0C1A2E]/10 p-3 grid gap-2">
                    {/* Product 1: DERMA */}
                    <Link
                      href="/derma"
                      onClick={() => setProductsOpen(false)}
                      className="p-3.5 rounded-xl hover:bg-[#FAF6EF] transition-colors flex items-start gap-3.5 group border border-transparent hover:border-[#0C1A2E]/10"
                    >
                      <div className="w-10 h-10 rounded-xl bg-[#0D3A35] text-white flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform shadow-sm">
                        <Stethoscope className="w-5 h-5 text-emerald-300" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-serif font-bold text-base text-[#0C1A2E]">DERMA</span>
                          <span className="text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                            Clinical EMR
                          </span>
                        </div>
                        <p className="text-xs text-[#0C1A2E]/70 mt-1 leading-relaxed">
                          Specialized clinical charting, photographic mapping, and appointment management for dermatology.
                        </p>
                      </div>
                    </Link>

                    {/* Product 2: Diagnox */}
                    <a
                      href="https://diagnox-healthcare.vercel.app/"
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => setProductsOpen(false)}
                      className="p-3.5 rounded-xl hover:bg-[#FAF6EF] transition-colors flex items-start gap-3.5 group border border-transparent hover:border-[#0C1A2E]/10"
                    >
                      <div className="w-10 h-10 rounded-xl bg-[#0C1A2E] text-white flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform shadow-sm">
                        <Activity className="w-5 h-5 text-[#FF4D3D]" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-serif font-bold text-base text-[#0C1A2E] flex items-center gap-1">
                            Diagnox
                            <ArrowUpRight className="w-3.5 h-3.5 text-[#0C1A2E]/50 group-hover:text-[#FF4D3D] transition-colors" />
                          </span>
                          <span className="text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full bg-rose-50 text-rose-800 border border-rose-200">
                            Health Screening
                          </span>
                        </div>
                        <p className="text-xs text-[#0C1A2E]/70 mt-1 leading-relaxed">
                          AI-assisted health analysis: multi-factor cancer & diabetes risk screening and wellness tracking.
                        </p>
                      </div>
                    </a>
                  </div>
                </div>
              </div>

              <a href="#showcase" className="px-4 py-2 rounded-full hover:bg-[#0C1A2E]/5 hover:text-[#0C1A2E] transition-colors">
                Two Systems
              </a>
              <a href="#workflow" className="px-4 py-2 rounded-full hover:bg-[#0C1A2E]/5 hover:text-[#0C1A2E] transition-colors">
                How It Works
              </a>
              <a href="#security" className="px-4 py-2 rounded-full hover:bg-[#0C1A2E]/5 hover:text-[#0C1A2E] transition-colors">
                Trust & Security
              </a>
            </nav>
          </div>

          {/* Right Action: DEMO Dropdown */}
          <div className="hidden lg:flex items-center gap-3">
            <div className="relative group">
              <button
                type="button"
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#0C1A2E] hover:bg-[#162B4A] text-white text-sm font-semibold tracking-wide transition-all shadow-md hover:shadow-lg active:scale-95"
                aria-haspopup="true"
              >
                <span>DEMO</span>
                <ChevronDown className="w-4 h-4 transition-transform duration-200 group-hover:rotate-180" />
              </button>

              {/* DEMO Dropdown Menu with hover bridge */}
              <div className="absolute top-full right-0 pt-2 hidden group-hover:block group-focus-within:block z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                <div className="w-72 bg-white rounded-2xl shadow-[0_20px_50px_rgba(12,26,46,0.16)] border border-[#0C1A2E]/10 p-2.5 grid gap-1.5">
                  <div className="px-3 py-1.5 text-[11px] font-semibold tracking-wider uppercase text-[#0C1A2E]/50 border-b border-slate-100">
                    Select Product Demo
                  </div>
                  <Link
                    href="/login"
                    onClick={() => setDemoOpen(false)}
                    className="p-2.5 rounded-xl hover:bg-[#FAF6EF] transition-colors flex items-center justify-between text-xs font-semibold text-[#0C1A2E] group"
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-600" />
                      <span>DERMA Clinical EMR</span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-[#0C1A2E]/40 group-hover:translate-x-1 group-hover:text-emerald-700 transition-all" />
                  </Link>
                  <a
                    href="https://diagnox-healthcare.vercel.app/"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setDemoOpen(false)}
                    className="p-2.5 rounded-xl hover:bg-[#FAF6EF] transition-colors flex items-center justify-between text-xs font-semibold text-[#0C1A2E] group"
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#FF4D3D]" />
                      <span>Diagnox Health Platform</span>
                    </div>
                    <ArrowUpRight className="w-4 h-4 text-[#0C1A2E]/40 group-hover:translate-x-0.5 group-hover:text-[#FF4D3D] transition-all" />
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="lg:hidden p-2 rounded-xl text-[#0C1A2E] hover:bg-[#0C1A2E]/10 transition-colors"
            aria-label="Open navigation menu"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </header>

      {/* MOBILE SLIDE-OUT DRAWER */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-[#0C1A2E]/60 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="fixed inset-y-0 right-0 w-full max-w-sm bg-[#FAF6EF] p-6 shadow-2xl flex flex-col justify-between overflow-y-auto">
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-[#0C1A2E]/10">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-[#0C1A2E] flex items-center justify-center">
                    <span className="text-white font-serif font-bold text-sm">M</span>
                  </div>
                  <span className="font-serif text-xl font-bold text-[#0C1A2E]">
                    Med<span className="italic font-normal text-[#FF4D3D]">Nexa</span>
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 rounded-lg text-[#0C1A2E] hover:bg-[#0C1A2E]/10"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Mobile Products Accordion */}
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => setMobileProductsOpen(!mobileProductsOpen)}
                  className="w-full flex items-center justify-between text-sm font-semibold tracking-wider uppercase text-[#0C1A2E]/70 py-2"
                >
                  <span>Our Products</span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${mobileProductsOpen ? 'rotate-180' : ''}`} />
                </button>

                {mobileProductsOpen && (
                  <div className="space-y-2 pl-2 border-l-2 border-[#FF4D3D]">
                    <Link
                      href="/derma"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block p-3 rounded-xl bg-white shadow-sm border border-[#0C1A2E]/10 space-y-1"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-serif font-bold text-sm text-[#0C1A2E]">DERMA</span>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-50 text-emerald-800">Clinical EMR</span>
                      </div>
                      <p className="text-xs text-[#0C1A2E]/70">Dermatology clinical charting, photo mapping & visits.</p>
                    </Link>

                    <a
                      href="https://diagnox-healthcare.vercel.app/"
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block p-3 rounded-xl bg-white shadow-sm border border-[#0C1A2E]/10 space-y-1"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-serif font-bold text-sm text-[#0C1A2E] flex items-center gap-1">
                          Diagnox <ArrowUpRight className="w-3.5 h-3.5 text-[#FF4D3D]" />
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-rose-50 text-rose-800">Health Screening</span>
                      </div>
                      <p className="text-xs text-[#0C1A2E]/70">AI health risk analysis & personal tracking.</p>
                    </a>
                  </div>
                )}
              </div>

              {/* Navigation Links */}
              <nav className="space-y-3 pt-4 border-t border-[#0C1A2E]/10 text-sm font-medium">
                <a
                  href="#showcase"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-2 text-[#0C1A2E]/80 hover:text-[#0C1A2E]"
                >
                  Two Systems Overview
                </a>
                <a
                  href="#workflow"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-2 text-[#0C1A2E]/80 hover:text-[#0C1A2E]"
                >
                  How It Works
                </a>
                <a
                  href="#security"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-2 text-[#0C1A2E]/80 hover:text-[#0C1A2E]"
                >
                  Trust & Security
                </a>
              </nav>
            </div>

            {/* Mobile Actions */}
            <div className="pt-6 border-t border-[#0C1A2E]/10 space-y-2.5">
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-full bg-[#0C1A2E] text-white font-semibold text-sm shadow-md"
              >
                <span>Launch DERMA Demo</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href="https://diagnox-healthcare.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-full bg-white border border-[#0C1A2E]/20 text-[#0C1A2E] font-semibold text-sm shadow-sm"
              >
                <span>Open Diagnox App</span>
                <ArrowUpRight className="w-4 h-4 text-[#FF4D3D]" />
              </a>
            </div>
          </div>
        </div>
      )}

      {/* 2. HERO SECTION */}
      <section className="relative pt-16 pb-20 px-4 sm:px-8 max-w-7xl mx-auto overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Hero Text */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#0C1A2E]/15 text-xs font-semibold tracking-wider text-[#0C1A2E] uppercase shadow-sm">
              <span className="w-2 h-2 rounded-full bg-[#FF4D3D]" />
              <span>MedNexa · Two systems, one nexus</span>
            </div>

            <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-[#0C1A2E] leading-[1.1]">
              Where care meets <span className="italic font-normal">intelligence</span>.<br />
              <span className="relative inline-block mt-1">
                Clarity for every decision.
                {/* Signature coral curve */}
                <svg className="absolute -bottom-3 left-0 w-full h-3 text-[#FF4D3D]" viewBox="0 0 300 20" preserveAspectRatio="none">
                  <path d="M4 14 C 60 4, 120 16, 180 8 S 260 12, 296 6" fill="none" stroke="currentColor" strokeWidth="4.5" strokeLinecap="round" />
                </svg>
              </span>
            </h1>

            <p className="text-base sm:text-lg text-[#0C1A2E]/80 font-normal leading-relaxed max-w-2xl pt-2">
              MedNexa builds quiet, precise software for health. <strong>Diagnox</strong> helps people and clinics identify risk early. <strong>Derma</strong> equips dermatology physicians with an unhurried clinical record of every patient, visit, and photograph.
            </p>

            {/* Hero CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link
                href="/derma"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-[#0C1A2E] hover:bg-[#162B4A] text-white font-semibold text-sm transition-all shadow-md hover:shadow-lg active:scale-95"
              >
                <span>Explore DERMA</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href="https://diagnox-healthcare.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-white hover:bg-[#FAF6EF] text-[#0C1A2E] font-semibold text-sm border border-[#0C1A2E]/20 transition-all shadow-sm active:scale-95"
              >
                <span>Explore Diagnox</span>
                <ArrowUpRight className="w-4 h-4 text-[#FF4D3D]" />
              </a>
            </div>

            {/* Trust points */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-[#0C1A2E]/10 text-xs text-[#0C1A2E]/70">
              <div>
                <strong className="block text-[#0C1A2E] font-semibold">Built for clinics</strong>
                <span>Solo practitioners & team practices</span>
              </div>
              <div>
                <strong className="block text-[#0C1A2E] font-semibold">Private by design</strong>
                <span>Role-based access & encryption</span>
              </div>
              <div>
                <strong className="block text-[#0C1A2E] font-semibold">No hyperbole</strong>
                <span>Screening insight, never over-claims</span>
              </div>
            </div>
          </div>

          {/* Right Column: Code-Drawn Interactive Nexus Preview */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-[0_20px_50px_rgba(12,26,46,0.08)] border border-[#0C1A2E]/10 space-y-6">
              {/* Card top */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-slate-200" />
                    <span className="w-2.5 h-2.5 rounded-full bg-slate-200" />
                    <span className="w-2.5 h-2.5 rounded-full bg-slate-200" />
                  </div>
                  <span className="font-serif font-bold text-xs text-[#0C1A2E] ml-2">
                    MedNexa Health Ecosystem
                  </span>
                </div>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#FAF6EF] text-[#0C1A2E]/70">
                  Live Preview
                </span>
              </div>

              {/* Diagnox Mock Card */}
              <div className="p-4 rounded-2xl bg-[#FAF6EF] border border-[#0C1A2E]/10 space-y-3">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="flex items-center gap-1.5 text-[#0C1A2E]">
                    <Activity className="w-4 h-4 text-[#FF4D3D]" />
                    <span>Diagnox · Health Risk Index</span>
                  </span>
                  <a
                    href="https://diagnox-healthcare.vercel.app/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] text-[#FF4D3D] hover:underline flex items-center gap-0.5"
                  >
                    Open ↗
                  </a>
                </div>

                <div className="space-y-2">
                  <div>
                    <div className="flex justify-between text-[11px] text-[#0C1A2E]/70 mb-1">
                      <span>Cardiovascular Stability</span>
                      <strong className="text-emerald-700">78 Optimal</strong>
                    </div>
                    <div className="h-2 rounded-full bg-slate-200 overflow-hidden">
                      <div className="h-full bg-emerald-600 rounded-full" style={{ width: '78%' }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-[11px] text-[#0C1A2E]/70 mb-1">
                      <span>Metabolic Risk Assessment</span>
                      <strong className="text-amber-700">42 Low-Mod</strong>
                    </div>
                    <div className="h-2 rounded-full bg-slate-200 overflow-hidden">
                      <div className="h-full bg-amber-500 rounded-full" style={{ width: '42%' }} />
                    </div>
                  </div>
                </div>
              </div>

              {/* DERMA Mock Card */}
              <div className="p-4 rounded-2xl bg-[#FAF6EF] border border-[#0C1A2E]/10 space-y-3">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="flex items-center gap-1.5 text-[#0C1A2E]">
                    <Stethoscope className="w-4 h-4 text-emerald-800" />
                    <span>DERMA · Patient Record & Mapping</span>
                  </span>
                  <Link href="/derma" className="text-[11px] text-emerald-800 hover:underline flex items-center gap-0.5">
                    View →
                  </Link>
                </div>

                <div className="p-2.5 rounded-xl bg-white border border-slate-200 flex items-center justify-between text-xs">
                  <div>
                    <p className="font-semibold text-slate-800">Visit #14 • Lesion Progression</p>
                    <p className="text-[11px] text-slate-500">Atypical nevus mapping • Photographed</p>
                  </div>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                    Stable
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1 text-[11px] text-[#0C1A2E]/60">
                <span>Screening insights — not a diagnosis</span>
                <span className="flex items-center gap-1">
                  <Lock className="w-3 h-3" /> Encrypted records
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. DEDICATED PRODUCT SHOWCASE (One Nexus. Two Careful Tools) */}
      <section id="showcase" className="py-20 px-4 sm:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-14">
          <p className="text-xs font-bold tracking-widest uppercase text-[#FF4D3D]">
            The Two Products
          </p>
          <h2 className="font-serif text-3xl sm:text-5xl font-bold text-[#0C1A2E]">
            One nexus. Two careful tools.
          </h2>
          <p className="text-sm sm:text-base text-[#0C1A2E]/70 leading-relaxed">
            Different jobs, same temperament: unhurried, legible, and honest about what software can and cannot do.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* PRODUCT CARD 1: DIAGNOX */}
          <article className="bg-white rounded-3xl p-8 sm:p-10 shadow-sm border border-[#0C1A2E]/10 flex flex-col justify-between hover:shadow-md transition-shadow">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold tracking-wider uppercase text-[#0C1A2E]/60">
                  01 — For Individuals & Wellness Screening
                </span>
                <span className="text-[11px] font-semibold px-3 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
                  Diagnox Health
                </span>
              </div>

              <div>
                <h3 className="font-serif text-3xl sm:text-4xl font-bold text-[#0C1A2E]">
                  Diagnox
                </h3>
                <p className="text-sm text-[#0C1A2E]/80 mt-2 leading-relaxed">
                  AI-assisted health analysis: multi-factor cancer risk screening questionnaires, diabetes risk calculation, general wellness analysis, BMI tracking, and longitudinal monitoring.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-[#FAF6EF] border border-[#0C1A2E]/10 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#0C1A2E]">
                  Core Capabilities
                </h4>
                <ul className="text-xs text-[#0C1A2E]/80 space-y-2">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Guided health screening assessments in clear, plain language</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Longitudinal tracking over time rather than one-off isolated scores</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Printable, clinic-ready summary cards to bring to your physician</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="pt-8 border-t border-[#0C1A2E]/10 mt-6 flex items-center justify-between">
              <a
                href="https://diagnox-healthcare.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm font-bold text-[#0C1A2E] hover:text-[#FF4D3D] transition-colors group"
              >
                <span>Launch Diagnox Live Application</span>
                <ArrowUpRight className="w-4 h-4 text-[#FF4D3D] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </a>
            </div>
          </article>

          {/* PRODUCT CARD 2: DERMA */}
          <article className="bg-white rounded-3xl p-8 sm:p-10 shadow-sm border border-[#0C1A2E]/10 flex flex-col justify-between hover:shadow-md transition-shadow">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold tracking-wider uppercase text-[#0C1A2E]/60">
                  02 — For Dermatologists & Aesthetic Clinics
                </span>
                <span className="text-[11px] font-semibold px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                  DERMA Platform
                </span>
              </div>

              <div>
                <h3 className="font-serif text-3xl sm:text-4xl font-bold text-[#0C1A2E]">
                  DERMA
                </h3>
                <p className="text-sm text-[#0C1A2E]/80 mt-2 leading-relaxed">
                  An electronic medical records system shaped specifically for dermatology: standardized photographic mapping, facial vector charting, biopsy tracking, and daily clinic queues.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-[#FAF6EF] border border-[#0C1A2E]/10 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#0C1A2E]">
                  Core Capabilities
                </h4>
                <ul className="text-xs text-[#0C1A2E]/80 space-y-2">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Chronological photo comparison sliders with fixed anatomical angles</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Interactive facial & body vector charting for injectables and lasers</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Instant practitioner DEMO access with auto-filled clinical demo account</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="pt-8 border-t border-[#0C1A2E]/10 mt-6 flex flex-wrap items-center justify-between gap-3">
              <Link
                href="/derma"
                className="inline-flex items-center gap-2 text-sm font-bold text-[#0C1A2E] hover:text-emerald-800 transition-colors group"
              >
                <span>Explore DERMA Features</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#0D3A35] hover:bg-[#134E48] text-white text-xs font-semibold tracking-wide transition-all shadow-sm active:scale-95"
              >
                <span>Launch DEMO</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </article>
        </div>
      </section>

      {/* 4. HOW IT WORKS (Three Unhurried Steps) */}
      <section id="workflow" className="py-20 px-4 sm:px-8 max-w-7xl mx-auto">
        <div className="bg-white rounded-3xl p-8 sm:p-14 border border-[#0C1A2E]/10 shadow-sm space-y-12">
          <div className="max-w-2xl space-y-3">
            <p className="text-xs font-bold tracking-widest uppercase text-[#FF4D3D]">
              Care Workflow
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#0C1A2E]">
              Three unhurried steps.
            </h2>
            <p className="text-sm text-[#0C1A2E]/70 leading-relaxed">
              Software is designed to support the consultation, not replace the human clinician.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-3">
              <div className="w-11 h-11 rounded-2xl bg-[#0C1A2E] text-white flex items-center justify-center font-serif font-bold text-base shadow-sm">
                01
              </div>
              <h3 className="font-serif text-xl font-bold text-[#0C1A2E]">
                Connect
              </h3>
              <p className="text-xs sm:text-sm text-[#0C1A2E]/70 leading-relaxed">
                Tell us who you are — an individual, a wellness screening program, or a dermatology practice. Diagnox greets you with structured questions; DERMA loads your daily schedule seamlessly.
              </p>
            </div>

            <div className="space-y-3">
              <div className="w-11 h-11 rounded-2xl bg-[#0C1A2E] text-white flex items-center justify-center font-serif font-bold text-base shadow-sm">
                02
              </div>
              <h3 className="font-serif text-xl font-bold text-[#0C1A2E]">
                Understand
              </h3>
              <p className="text-xs sm:text-sm text-[#0C1A2E]/70 leading-relaxed">
                Diagnox converts user inputs and physical measures into readable risk indicators. DERMA turns patient visits, photographs, and treatment notes into a unified medical timeline.
              </p>
            </div>

            <div className="space-y-3">
              <div className="w-11 h-11 rounded-2xl bg-[#0C1A2E] text-white flex items-center justify-center font-serif font-bold text-base shadow-sm">
                03
              </div>
              <h3 className="font-serif text-xl font-bold text-[#0C1A2E]">
                Act, with a human
              </h3>
              <p className="text-xs sm:text-sm text-[#0C1A2E]/70 leading-relaxed">
                Bring the summary to your physician. Software screens and documents; licensed physicians make diagnoses and prescribe treatments. Every DERMA record is signed by one.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. TRUST & SECURITY */}
      <section id="security" className="py-16 px-4 sm:px-8 max-w-7xl mx-auto">
        <div className="bg-[#0C1A2E] text-white rounded-3xl p-8 sm:p-14 shadow-xl space-y-10">
          <div className="max-w-2xl space-y-3">
            <p className="text-xs font-bold tracking-widest uppercase text-[#FF4D3D]">
              Trust & Data Governance
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold">
              Health data is intimate. We treat it that way.
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed font-light">
              End-to-end encryption in transit and at rest, role-based boundaries so clinical staff access only what their duties require, and immutable audit logs.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-4 border-t border-white/10">
            <div className="space-y-2">
              <strong className="block text-white text-sm font-semibold">Encryption</strong>
              <p className="text-xs text-slate-300 leading-relaxed">
                TLS in transit and AES-256 at rest. Photographic clinical records stored with short-lived authenticated access tokens.
              </p>
            </div>

            <div className="space-y-2">
              <strong className="block text-white text-sm font-semibold">Access Controls</strong>
              <p className="text-xs text-slate-300 leading-relaxed">
                Doctor, nurse, receptionist, clinic administrator — each role operates strictly within its clinical scope.
              </p>
            </div>

            <div className="space-y-2">
              <strong className="block text-white text-sm font-semibold">Transparent Scoring</strong>
              <p className="text-xs text-slate-300 leading-relaxed">
                Diagnox explains exactly which answers shaped its health observations, and always defers to a qualified doctor.
              </p>
            </div>

            <div className="space-y-2">
              <strong className="block text-white text-sm font-semibold">Data Ownership</strong>
              <p className="text-xs text-slate-300 leading-relaxed">
                Clinics maintain full ownership and can export patient charts anytime. Zero proprietary lock-in.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. CALL TO ACTION */}
      <section className="py-12 px-4 sm:px-8 max-w-7xl mx-auto text-center">
        <div className="bg-white rounded-3xl p-8 sm:p-16 border border-[#0C1A2E]/10 shadow-sm space-y-6 max-w-4xl mx-auto">
          <p className="text-xs font-bold tracking-widest uppercase text-[#FF4D3D]">
            Begin
          </p>
          <h2 className="font-serif text-3xl sm:text-5xl font-bold text-[#0C1A2E]">
            See your own clinical nexus.
          </h2>
          <p className="text-sm sm:text-base text-[#0C1A2E]/70 max-w-xl mx-auto leading-relaxed">
            Test the live platforms today. Walk through the DERMA clinical practice demo or explore health risk analysis with Diagnox.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link
              href="/login"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-[#0C1A2E] hover:bg-[#162B4A] text-white font-semibold text-sm transition-all shadow-md active:scale-95"
            >
              <span>Launch DERMA Demo</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href="https://diagnox-healthcare.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-[#FAF6EF] hover:bg-slate-200 text-[#0C1A2E] font-semibold text-sm border border-[#0C1A2E]/20 transition-all active:scale-95"
            >
              <span>Launch Diagnox ↗</span>
            </a>
          </div>
          <div className="pt-4 text-xs text-[#0C1A2E]/50">
            <strong>Medical note:</strong> Diagnox provides health risk screening insights, not a clinical diagnosis. Consult a qualified medical practitioner.
          </div>
        </div>
      </section>

      {/* 7. MEDNEXA FOOTER */}
      <footer className="bg-[#0C1A2E] text-slate-300 pt-16 pb-12 mt-16 border-t border-[#0C1A2E]">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-10 pb-12 border-b border-white/10">
            {/* Brand Col */}
            <div className="md:col-span-2 space-y-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center">
                  <span className="text-[#0C1A2E] font-serif font-bold text-base">M</span>
                </div>
                <span className="font-serif text-2xl font-bold tracking-tight text-white">
                  Med<span className="italic font-normal text-[#FF4D3D]">Nexa</span>
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-400 max-w-sm leading-relaxed">
                Where care meets intelligence. Two integrated health software systems: Diagnox for risk insight, DERMA for dermatology clinical practice.
              </p>
              <div className="text-xs text-slate-400">
                Contact: <span className="text-slate-200">care@mednexa.health</span>
              </div>
            </div>

            {/* Products Col */}
            <div className="space-y-3">
              <h5 className="text-xs font-semibold uppercase tracking-wider text-white">
                Products
              </h5>
              <ul className="text-xs space-y-2 text-slate-400">
                <li>
                  <Link href="/derma" className="hover:text-white transition-colors">
                    DERMA Clinical EMR
                  </Link>
                </li>
                <li>
                  <a
                    href="https://diagnox-healthcare.vercel.app/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white transition-colors flex items-center gap-1"
                  >
                    Diagnox Screening ↗
                  </a>
                </li>
                <li>
                  <Link href="/login" className="hover:text-white transition-colors">
                    Practitioner DEMO
                  </Link>
                </li>
              </ul>
            </div>

            {/* System Info Col */}
            <div className="space-y-3">
              <h5 className="text-xs font-semibold uppercase tracking-wider text-white">
                Architecture
              </h5>
              <ul className="text-xs space-y-2 text-slate-400">
                <li><a href="#showcase" className="hover:text-white transition-colors">Two Systems Nexus</a></li>
                <li><a href="#workflow" className="hover:text-white transition-colors">Workflow & Integration</a></li>
                <li><a href="#security" className="hover:text-white transition-colors">Data Privacy & Security</a></li>
              </ul>
            </div>

            {/* Legal Col */}
            <div className="space-y-3">
              <h5 className="text-xs font-semibold uppercase tracking-wider text-white">
                Standards
              </h5>
              <ul className="text-xs space-y-2 text-slate-400">
                <li><span className="text-slate-400">Role-Based Access</span></li>
                <li><span className="text-slate-400">Encrypted Storage</span></li>
                <li><span className="text-slate-400">Exportable Records</span></li>
              </ul>
            </div>
          </div>

          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
            <p>© {new Date().getFullYear()} MedNexa Health Systems. All rights reserved.</p>
            <p className="text-slate-400">Screening insights are not a medical diagnosis.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
