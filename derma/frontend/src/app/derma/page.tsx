'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Camera,
  FileText,
  CheckCircle2,
  ArrowRight,
  Shield,
  Calendar,
  Users,
  Activity,
  Layers,
  Microscope,
  Pill,
  Clock,
  ChevronRight,
  Building2,
  Stethoscope,
  Heart,
  BarChart3,
  SlidersHorizontal,
  ClipboardCheck,
  Check,
} from 'lucide-react';

export default function LandingPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'charting' | 'imaging' | 'prescriptions'>('overview');

  return (
    <div className="min-h-screen bg-[#F5F2EB] text-slate-800 font-sans selection:bg-[#0D3A35] selection:text-white">
      {/* 1. TOP FLOATING NAVIGATION BAR */}
      <header className="sticky top-4 z-50 px-4 sm:px-8 max-w-7xl mx-auto">
        <nav className="bg-white/90 backdrop-blur-md rounded-full px-6 py-3.5 shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-black/[0.05] flex items-center justify-between transition-all">
          {/* Brand & Ecosystem Link */}
          <div className="flex items-center gap-3 sm:gap-4">
            <Link
              href="/"
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#FAF6EF] hover:bg-[#F0EBE1] border border-[#0C1A2E]/10 text-xs font-medium text-[#0C1A2E] transition-colors"
              title="Return to MedNexa Home"
            >
              <span>← MedNexa</span>
            </Link>
            <Link href="/derma" className="flex items-center gap-2 group">
              <div className="h-8 w-8 rounded-full bg-[#0D3A35] text-white flex items-center justify-center font-serif text-sm font-bold shadow-sm group-hover:scale-105 transition-transform">
                D
              </div>
              <span className="font-serif text-xl font-bold tracking-tight text-[#0D3A35]">
                DERMA
              </span>
            </Link>
          </div>

          {/* Center Links */}
          <div className="hidden md:flex items-center gap-1 text-sm font-medium text-slate-600">
            <a
              href="#overview"
              className="px-4 py-2 rounded-full hover:bg-slate-100 hover:text-slate-900 transition-colors"
            >
              Overview
            </a>
            <a
              href="#capabilities"
              className="px-4 py-2 rounded-full hover:bg-slate-100 hover:text-slate-900 transition-colors"
            >
              Clinical Solutions
            </a>
            <a
              href="#imaging"
              className="px-4 py-2 rounded-full hover:bg-slate-100 hover:text-slate-900 transition-colors"
            >
              Photo Records
            </a>
            <a
              href="#workflow"
              className="px-4 py-2 rounded-full hover:bg-slate-100 hover:text-slate-900 transition-colors"
            >
              Practice Flow
            </a>
            <a
              href="#specialties"
              className="px-4 py-2 rounded-full hover:bg-slate-100 hover:text-slate-900 transition-colors"
            >
              Specialties
            </a>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            <a
              href="https://diagnox-healthcare.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-1 text-xs font-semibold text-slate-600 hover:text-[#0D3A35] px-3.5 py-1.5 rounded-full hover:bg-slate-100 transition-colors"
            >
              <span>Diagnox ↗</span>
            </a>
            <Link
              href="/login"
              className="inline-flex items-center justify-center px-6 py-2 rounded-full bg-[#0D3A35] hover:bg-[#134E48] text-white text-sm font-semibold tracking-wide transition-all shadow-sm hover:shadow-md active:scale-95"
            >
              <span>DEMO</span>
            </Link>
          </div>
        </nav>
      </header>

      {/* 2. HERO SECTION */}
      <section className="pt-16 pb-20 px-4 sm:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto space-y-6">
          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-slate-200/80 text-xs font-semibold tracking-wider text-slate-600 uppercase shadow-sm">
            <span className="h-2 w-2 rounded-full bg-[#0D3A35]" />
            <span>Clinical Dermatology & Practice Management</span>
          </div>

          {/* Main Headline */}
          <h1 className="font-serif text-4xl sm:text-6xl lg:text-6xl font-bold tracking-tight text-[#0D3A35] leading-[1.15]">
            Precision Clinical Care for Modern Dermatology
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-slate-600 font-normal leading-relaxed max-w-2xl mx-auto">
            A comprehensive clinical platform engineered specifically for medical and aesthetic dermatology. Standardize photographic documentation, record facial and body treatment mappings, and manage everyday clinical appointments seamlessly.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link
              href="/login"
              className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-full bg-[#0D3A35] hover:bg-[#134E48] text-white font-semibold text-sm tracking-wide transition-all shadow-md hover:shadow-lg active:scale-95"
            >
              <span>DEMO</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href="#capabilities"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-white hover:bg-slate-50 text-slate-800 font-medium text-sm border border-slate-200/90 transition-all shadow-sm active:scale-95"
            >
              <span>Explore Clinical Features</span>
            </a>
          </div>

          {/* Clinical Trust Bar */}
          <div className="pt-6 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs font-medium text-slate-500">
            <span className="flex items-center gap-2">
              <Check className="w-4 h-4 text-[#0D3A35]" /> Standardized Photo Positioning
            </span>
            <span className="flex items-center gap-2">
              <Check className="w-4 h-4 text-[#0D3A35]" /> Facial & Body Anatomical Mapping
            </span>
            <span className="flex items-center gap-2">
              <Check className="w-4 h-4 text-[#0D3A35]" /> Biopsy & Lab Log Tracking
            </span>
          </div>
        </div>

        {/* 3. HERO VISUAL / INTERACTIVE PRACTICE DASHBOARD PREVIEW (Diagnox Style) */}
        <div id="overview" className="mt-14 max-w-6xl mx-auto">
          <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-[0_12px_40px_rgb(0,0,0,0.06)] border border-black/[0.04] space-y-8">
            {/* Dashboard Header Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2 text-xs font-semibold tracking-wider text-slate-500 uppercase">
                  <Activity className="w-4 h-4 text-[#0D3A35]" />
                  <span>Practice Health Dashboard</span>
                </div>
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#0D3A35] mt-1">
                  Daily Consultation & Procedure Overview
                </h2>
                <p className="text-sm text-slate-500 mt-0.5">
                  Live operational snapshot for Saint Jude Dermatology Clinic
                </p>
              </div>

              {/* Status Switcher */}
              <div className="flex items-center gap-2 bg-[#F5F2EB] p-1 rounded-full text-xs font-medium self-start sm:self-auto">
                <button
                  type="button"
                  onClick={() => setActiveTab('overview')}
                  className={`px-4 py-1.5 rounded-full transition-all ${
                    activeTab === 'overview'
                      ? 'bg-[#0D3A35] text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Consultations
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('charting')}
                  className={`px-4 py-1.5 rounded-full transition-all ${
                    activeTab === 'charting'
                      ? 'bg-[#0D3A35] text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Treatment Mapping
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('imaging')}
                  className={`px-4 py-1.5 rounded-full transition-all ${
                    activeTab === 'imaging'
                      ? 'bg-[#0D3A35] text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Photo Records
                </button>
              </div>
            </div>

            {/* Diagnox-Style Vital Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Metric 1 */}
              <div className="bg-[#FAF8F5] rounded-2xl p-5 border border-slate-200/60 flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Today&apos;s Appointments
                  </span>
                  <div className="h-8 w-8 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center">
                    <Heart className="w-4 h-4" />
                  </div>
                </div>
                <div className="mt-4">
                  <div className="text-3xl font-serif font-bold text-slate-900">28</div>
                  <div className="mt-2 inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700">
                    <span>+4 scheduled today</span>
                  </div>
                </div>
              </div>

              {/* Metric 2 */}
              <div className="bg-[#FAF8F5] rounded-2xl p-5 border border-slate-200/60 flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Procedures Logged
                  </span>
                  <div className="h-8 w-8 rounded-full bg-sky-50 text-sky-600 flex items-center justify-center">
                    <Stethoscope className="w-4 h-4" />
                  </div>
                </div>
                <div className="mt-4">
                  <div className="text-3xl font-serif font-bold text-slate-900">14</div>
                  <div className="mt-2 inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-0.5 rounded-full bg-slate-200/60 text-slate-700">
                    <span>9 injectables • 5 lasers</span>
                  </div>
                </div>
              </div>

              {/* Metric 3 */}
              <div className="bg-[#FAF8F5] rounded-2xl p-5 border border-slate-200/60 flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Biopsy Specimens
                  </span>
                  <div className="h-8 w-8 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center">
                    <Microscope className="w-4 h-4" />
                  </div>
                </div>
                <div className="mt-4">
                  <div className="text-3xl font-serif font-bold text-slate-900">6</div>
                  <div className="mt-2 inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700">
                    <span>Histopathology in progress</span>
                  </div>
                </div>
              </div>

              {/* Metric 4 (Circular Gauge Style) */}
              <div className="bg-[#FAF8F5] rounded-2xl p-5 border border-slate-200/60 flex flex-col items-center justify-center text-center">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                  Clinical Efficiency
                </span>
                <div className="relative flex items-center justify-center my-1">
                  <div className="h-16 w-16 rounded-full border-4 border-[#0D3A35] border-t-transparent flex items-center justify-center">
                    <span className="text-lg font-serif font-bold text-[#0D3A35]">94%</span>
                  </div>
                </div>
                <div className="mt-2 text-xs text-slate-500">
                  <span className="font-semibold text-slate-700">Optimal Flow</span> • 7 min wait avg.
                </div>
              </div>
            </div>

            {/* Clinical Observations / Structured Guidance (Diagnox Style) */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#0D3A35] uppercase tracking-wider">
                <ClipboardCheck className="w-4 h-4 text-[#0D3A35]" />
                <span>Clinical Notes & Active Reminders</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-5 rounded-2xl border border-slate-200/70 hover:border-slate-300 transition-colors space-y-2">
                  <div className="h-7 w-7 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <h4 className="text-sm font-semibold text-slate-900">
                    Dermoscopic Follow-ups
                  </h4>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Four patients have reached their 6-month interval for repeat photographic mapping of atypical nevus lesions.
                  </p>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200/70 hover:border-slate-300 transition-colors space-y-2">
                  <div className="h-7 w-7 rounded-lg bg-sky-50 text-sky-700 flex items-center justify-center">
                    <Activity className="w-4 h-4" />
                  </div>
                  <h4 className="text-sm font-semibold text-slate-900">
                    Laser Treatment Tolerability
                  </h4>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Post-procedure redness resolution reported at day 3 for all pulsed dye laser patients treated this week.
                  </p>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200/70 hover:border-slate-300 transition-colors space-y-2">
                  <div className="h-7 w-7 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
                    <Clock className="w-4 h-4" />
                  </div>
                  <h4 className="text-sm font-semibold text-slate-900">
                    Topical Regimen Compliance
                  </h4>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Patient portal reports indicate 92% adherence to prescribed retinoid and barrier restoration regimens.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. CORE CLINICAL CAPABILITIES / POINTS */}
      <section id="capabilities" className="py-20 px-4 sm:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white border border-slate-200 text-xs font-semibold text-[#0D3A35] tracking-wider uppercase">
            <span>Specialized Capabilities</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-5xl font-bold text-[#0D3A35]">
            Engineered Around the Clinical Realities of Skin Care
          </h2>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            Generic medical record systems force dermatologists into rigid text boxes. DERMA provides structured clinical tools designed for visual, procedural, and longitudinal patient care.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="bg-white rounded-3xl p-7 shadow-sm border border-black/[0.04] hover:shadow-md transition-shadow space-y-4">
            <div className="h-12 w-12 rounded-2xl bg-[#EAF2F0] text-[#0D3A35] flex items-center justify-center">
              <Camera className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-xl font-bold text-slate-900">
              Standardized Photographic Mapping
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Capture clinical photographs using standardized anatomical grids and lighting angles. Side-by-side chronological views allow immediate evaluation of lesion evolution and cosmetic results.
            </p>
            <ul className="text-xs text-slate-500 space-y-2 pt-2 border-t border-slate-100">
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-[#0D3A35]" /> Fixed anatomical projection angles
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-[#0D3A35]" /> Calibrated color & dermoscopic tagging
              </li>
            </ul>
          </div>

          {/* Card 2 */}
          <div className="bg-white rounded-3xl p-7 shadow-sm border border-black/[0.04] hover:shadow-md transition-shadow space-y-4">
            <div className="h-12 w-12 rounded-2xl bg-[#E8F0F8] text-[#1E6091] flex items-center justify-center">
              <SlidersHorizontal className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-xl font-bold text-slate-900">
              Interactive Anatomical Charting
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Mark exact injection sites, laser passes, and surgical margins on anatomical facial and full-body vector templates. Record units, dilution, needle gauges, and depths with point-and-click ease.
            </p>
            <ul className="text-xs text-slate-500 space-y-2 pt-2 border-t border-slate-100">
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-[#0D3A35]" /> Facial zone vector charts
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-[#0D3A35]" /> Accurate consumable dosage logging
              </li>
            </ul>
          </div>

          {/* Card 3 */}
          <div className="bg-white rounded-3xl p-7 shadow-sm border border-black/[0.04] hover:shadow-md transition-shadow space-y-4">
            <div className="h-12 w-12 rounded-2xl bg-[#FBF0EA] text-[#B54708] flex items-center justify-center">
              <Microscope className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-xl font-bold text-slate-900">
              Biopsy & Pathology Tracking
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Generate electronic lab requisitions, assign specimen barcodes, and monitor specimen transport. Histopathology reports automatically link to the documented anatomical site in the patient record.
            </p>
            <ul className="text-xs text-slate-500 space-y-2 pt-2 border-t border-slate-100">
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-[#0D3A35]" /> Barcoded specimen custody
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-[#0D3A35]" /> Histological margin documentation
              </li>
            </ul>
          </div>

          {/* Card 4 */}
          <div className="bg-white rounded-3xl p-7 shadow-sm border border-black/[0.04] hover:shadow-md transition-shadow space-y-4">
            <div className="h-12 w-12 rounded-2xl bg-[#F0EBF8] text-[#5925DC] flex items-center justify-center">
              <Pill className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-xl font-bold text-slate-900">
              Specialized Topical Prescriptions
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Access pre-configured dermatological compounding formulas, topical corticosteroids regimens with step-down schedules, and automated checks for systemic contradictions.
            </p>
            <ul className="text-xs text-slate-500 space-y-2 pt-2 border-t border-slate-100">
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-[#0D3A35]" /> Compounded dermatologic formulas
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-[#0D3A35]" /> Step-down steroid tapering schedules
              </li>
            </ul>
          </div>

          {/* Card 5 */}
          <div className="bg-white rounded-3xl p-7 shadow-sm border border-black/[0.04] hover:shadow-md transition-shadow space-y-4">
            <div className="h-12 w-12 rounded-2xl bg-[#EBF7F2] text-[#0D6E54] flex items-center justify-center">
              <Calendar className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-xl font-bold text-slate-900">
              Multi-Provider Appointment Queue
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Coordinate patient check-in, treatment room allocation, and procedure preparation across multiple dermatologists, aesthetic nurses, and physician assistants without room conflicts.
            </p>
            <ul className="text-xs text-slate-500 space-y-2 pt-2 border-t border-slate-100">
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-[#0D3A35]" /> Room occupancy live indicators
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-[#0D3A35]" /> Fast provider handoff workflows
              </li>
            </ul>
          </div>

          {/* Card 6 */}
          <div className="bg-white rounded-3xl p-7 shadow-sm border border-black/[0.04] hover:shadow-md transition-shadow space-y-4">
            <div className="h-12 w-12 rounded-2xl bg-[#FAF0F0] text-[#B42318] flex items-center justify-center">
              <Shield className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-xl font-bold text-slate-900">
              Clinical Security & Audit Logs
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Role-based access boundaries ensure doctors, nurses, and billing staff access only authorized clinical data. Detailed audit trails maintain permanent records of all record accesses and edits.
            </p>
            <ul className="text-xs text-slate-500 space-y-2 pt-2 border-t border-slate-100">
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-[#0D3A35]" /> Role-specific chart permissions
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-[#0D3A35]" /> Immutable audit trails
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* 5. VISUAL CLINICAL WORKFLOW / PRACTICE FLOW */}
      <section id="workflow" className="py-20 px-4 sm:px-8 max-w-7xl mx-auto">
        <div className="bg-white rounded-3xl p-8 sm:p-14 border border-black/[0.04] shadow-sm">
          <div className="max-w-3xl space-y-3 mb-12">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#F5F2EB] text-xs font-semibold text-[#0D3A35] tracking-wider uppercase">
              <span>Patient Journey</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#0D3A35]">
              Seamless Workflow from Intake to Follow-up
            </h2>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              How DERMA coordinates the day-to-day clinical experience for patients and medical practitioners.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
            {/* Step 1 */}
            <div className="space-y-3">
              <div className="h-10 w-10 rounded-full bg-[#0D3A35] text-white flex items-center justify-center font-serif font-bold text-sm">
                01
              </div>
              <h3 className="font-serif text-lg font-bold text-slate-900">
                Patient Intake
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Digital health questionnaire, allergy recording, Fitzpatrick phototype classification, and previous cosmetic history.
              </p>
            </div>

            {/* Step 2 */}
            <div className="space-y-3">
              <div className="h-10 w-10 rounded-full bg-[#0D3A35] text-white flex items-center justify-center font-serif font-bold text-sm">
                02
              </div>
              <h3 className="font-serif text-lg font-bold text-slate-900">
                Photo Series
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Standardized capture using calibrated angles. Lesions, asymmetry, and baseline pigmentation recorded.
              </p>
            </div>

            {/* Step 3 */}
            <div className="space-y-3">
              <div className="h-10 w-10 rounded-full bg-[#0D3A35] text-white flex items-center justify-center font-serif font-bold text-sm">
                03
              </div>
              <h3 className="font-serif text-lg font-bold text-slate-900">
                Vector Charting
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Dermatologist plots injection landmarks, device fluence settings, or biopsy excision coordinates.
              </p>
            </div>

            {/* Step 4 */}
            <div className="space-y-3">
              <div className="h-10 w-10 rounded-full bg-[#0D3A35] text-white flex items-center justify-center font-serif font-bold text-sm">
                04
              </div>
              <h3 className="font-serif text-lg font-bold text-slate-900">
                Follow-up Review
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Scheduled review visits compare pre/post photography to measure tissue response and patient satisfaction.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. CLINICAL PHOTOGRAPHY SHOWCASE (Featuring our high-res clinic image) */}
      <section id="imaging" className="py-12 px-4 sm:px-8 max-w-7xl mx-auto">
        <div className="bg-[#FAF8F5] rounded-3xl p-8 sm:p-12 border border-slate-200/80 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div className="space-y-5">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white border border-slate-200 text-xs font-semibold text-[#0D3A35] tracking-wider uppercase">
              <span>Standardized Environment</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#0D3A35] leading-tight">
              Designed for Clinical Environments of Every Scale
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              Whether you operate a private aesthetic practice, a specialized dermatology clinic, or an academic medical center, DERMA brings structure, speed, and elegance to clinical charting.
            </p>

            <div className="space-y-3 pt-2">
              <div className="flex items-start gap-3">
                <div className="h-5 w-5 rounded-full bg-emerald-100 text-[#0D3A35] flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-slate-800">
                    Cross-Platform Accessibility
                  </h4>
                  <p className="text-xs text-slate-500">
                    Runs on clinical desktop workstations, tablets in treatment suites, and mobile cameras.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="h-5 w-5 rounded-full bg-emerald-100 text-[#0D3A35] flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-slate-800">
                    Direct Patient Photo Upload
                  </h4>
                  <p className="text-xs text-slate-500">
                    Patients securely submit follow-up recovery photographs directly into their timeline.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="h-5 w-5 rounded-full bg-emerald-100 text-[#0D3A35] flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-slate-800">
                    Integrated Practice Billing
                  </h4>
                  <p className="text-xs text-slate-500">
                    Automatic procedure itemization with package tracking and invoice generation.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <Link
                href="/login"
                className="inline-flex items-center gap-2 text-sm font-semibold text-[#0D3A35] hover:text-[#134E48] group"
              >
                <span>Access your clinic account</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

          {/* Right Image Container */}
          <div className="relative h-80 sm:h-[420px] rounded-2xl overflow-hidden shadow-lg border border-slate-200">
            <Image
              src="/clinic-hero.jpg"
              alt="Dermatology Clinic Interior"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 text-white space-y-1">
              <span className="text-xs font-semibold tracking-wider uppercase text-emerald-300">
                Modern Treatment Suite
              </span>
              <p className="text-sm font-medium">
                Optimized for private dermatology consultations and aesthetic procedures.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. CLINICAL SPECIALTIES SUPPORTED */}
      <section id="specialties" className="py-20 px-4 sm:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white border border-slate-200 text-xs font-semibold text-[#0D3A35] tracking-wider uppercase">
            <span>Clinical Disciplines</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#0D3A35]">
            Tailored to Your Dermatology Practice Discipline
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 space-y-2">
            <h4 className="font-serif text-lg font-bold text-slate-900">Medical Dermatology</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Acne, psoriasis, eczema, rosacea, and longitudinal treatment response tracking.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 space-y-2">
            <h4 className="font-serif text-lg font-bold text-slate-900">Aesthetic Medicine</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Neuromodulators, dermal fillers, biostimulators, skin boosters, and chemical peels.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 space-y-2">
            <h4 className="font-serif text-lg font-bold text-slate-900">Dermatologic Surgery</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Excision margins, punch biopsies, Mohs stage tracking, and wound healing notes.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 space-y-2">
            <h4 className="font-serif text-lg font-bold text-slate-900">Laser & Energy Devices</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Fluence settings, spot sizes, wavelength records, and skin reaction observations.
            </p>
          </div>
        </div>
      </section>

      {/* 8. CALL TO ACTION BANNER */}
      <section className="py-12 px-4 sm:px-8 max-w-7xl mx-auto">
        <div className="bg-[#0D3A35] rounded-3xl p-8 sm:p-16 text-white text-center space-y-6 shadow-xl">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/15 text-xs font-medium text-emerald-200 tracking-wider uppercase">
            <span>Practice Readiness</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight max-w-2xl mx-auto">
            Ready to Modernize Your Dermatology Practice?
          </h2>
          <p className="text-slate-300 text-sm sm:text-base max-w-xl mx-auto leading-relaxed font-light">
            Sign in to your clinical account or contact our team for a personalized demonstration configured to your clinic&apos;s procedure workflows.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link
              href="/login"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-white text-[#0D3A35] font-semibold text-sm hover:bg-slate-100 transition-all shadow-md active:scale-95"
            >
              <span>DEMO</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* 9. REAL WEBSITE FOOTER (Diagnox Deep Green Aesthetic) */}
      <footer className="bg-[#082622] text-slate-300 pt-16 pb-12 mt-20 border-t border-emerald-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-10 pb-12 border-b border-emerald-900/60">
            {/* Col 1: Brand */}
            <div className="md:col-span-2 space-y-4">
              <div className="flex items-center gap-2.5">
                <div className="h-9 w-9 rounded-full bg-white text-[#0D3A35] flex items-center justify-center font-serif text-lg font-bold">
                  D
                </div>
                <span className="font-serif text-2xl font-bold tracking-tight text-white">
                  DERMA
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-400 max-w-sm leading-relaxed">
                Specialized electronic medical records and clinical workflow software designed exclusively for medical, surgical, and aesthetic dermatology practices worldwide.
              </p>
              <div className="text-xs text-slate-500 pt-1">
                Clinical Support: <span className="text-slate-400">support@derma-clinic.health</span>
              </div>
            </div>

            {/* Col 2: Platform */}
            <div className="space-y-3">
              <h5 className="text-xs font-semibold uppercase tracking-wider text-white">
                Clinical Platform
              </h5>
              <ul className="text-xs space-y-2 text-slate-400">
                <li><a href="#overview" className="hover:text-white transition-colors">Daily Practice Overview</a></li>
                <li><a href="#capabilities" className="hover:text-white transition-colors">Photographic Mapping</a></li>
                <li><a href="#capabilities" className="hover:text-white transition-colors">Anatomical Charting</a></li>
                <li><a href="#capabilities" className="hover:text-white transition-colors">Biopsy Specimen Logs</a></li>
                <li><a href="#capabilities" className="hover:text-white transition-colors">Topical Formulations</a></li>
                <li><Link href="/login" className="hover:text-white transition-colors">Clinical Queue</Link></li>
              </ul>
            </div>

            {/* Col 3: Specialties */}
            <div className="space-y-3">
              <h5 className="text-xs font-semibold uppercase tracking-wider text-white">
                Specialties
              </h5>
              <ul className="text-xs space-y-2 text-slate-400">
                <li><a href="#specialties" className="hover:text-white transition-colors">Medical Dermatology</a></li>
                <li><a href="#specialties" className="hover:text-white transition-colors">Aesthetic Medicine</a></li>
                <li><a href="#specialties" className="hover:text-white transition-colors">Mohs & Dermatologic Surgery</a></li>
                <li><a href="#specialties" className="hover:text-white transition-colors">Pediatric Dermatology</a></li>
                <li><a href="#specialties" className="hover:text-white transition-colors">Laser & Device Centers</a></li>
              </ul>
            </div>

            {/* Col 4: Portal & Standards */}
            <div className="space-y-3">
              <h5 className="text-xs font-semibold uppercase tracking-wider text-white">
                Practice Portal
              </h5>
              <ul className="text-xs space-y-2 text-slate-400">
                <li><Link href="/login" className="text-emerald-300 font-semibold hover:underline">Practitioner DEMO</Link></li>
                <li><Link href="/forgot-password" className="hover:text-white transition-colors">Password Recovery</Link></li>
                <li><span className="text-slate-500">Security & Access Controls</span></li>
                <li><span className="text-slate-500">Clinical Data Confidentiality</span></li>
                <li><span className="text-slate-500">Immutable Audit Trail</span></li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
            <p>© {new Date().getFullYear()} DERMA Clinical Healthcare Systems. All rights reserved.</p>
            <div className="flex items-center gap-6">
              <span className="hover:text-slate-400 cursor-pointer">Privacy Guidelines</span>
              <span className="hover:text-slate-400 cursor-pointer">Clinical Terms of Service</span>
              <span className="hover:text-slate-400 cursor-pointer">Practice Data Protection</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
