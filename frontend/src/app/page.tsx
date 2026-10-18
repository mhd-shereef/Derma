'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Activity,
  ArrowRight,
  Calendar,
  Camera,
  Check,
  CheckCircle2,
  ChevronRight,
  ClipboardCheck,
  Clock,
  FileText,
  Heart,
  Layers,
  Microscope,
  Pill,
  Shield,
  SlidersHorizontal,
  Stethoscope,
  type LucideIcon,
} from 'lucide-react';

type DashboardTab = 'encounters' | 'charting' | 'imaging';

interface DashboardStat {
  label: string;
  value: string;
  note: string;
  noteClass: string;
  icon: LucideIcon;
  iconClass: string;
}

interface DashboardReminder {
  title: string;
  body: string;
  icon: LucideIcon;
  iconClass: string;
}

interface DashboardView {
  stats: DashboardStat[];
  gauge: { label: string; value: string; emphasis: string; caption: string };
  reminders: DashboardReminder[];
}

const dashboardTabs: { id: DashboardTab; label: string }[] = [
  { id: 'encounters', label: 'Encounters & Consultations' },
  { id: 'charting', label: 'Anatomical Charting' },
  { id: 'imaging', label: 'Photo Surveillance' },
];

const dashboardData: Record<DashboardTab, DashboardView> = {
  encounters: {
    stats: [
      {
        label: 'Encounter Queue',
        value: '28',
        note: '+4 surgical / punch biopsies today',
        noteClass: 'bg-emerald-50 text-emerald-700',
        icon: Heart,
        iconClass: 'bg-rose-50 text-rose-600',
      },
      {
        label: 'Documented Interventions',
        value: '14',
        note: '9 injectable vector charts • 5 laser logs',
        noteClass: 'bg-slate-200/60 text-slate-700',
        icon: Stethoscope,
        iconClass: 'bg-sky-50 text-sky-600',
      },
      {
        label: 'Pathology Chain of Custody',
        value: '6',
        note: 'Histopathology transport in progress',
        noteClass: 'bg-emerald-50 text-emerald-700',
        icon: Microscope,
        iconClass: 'bg-amber-50 text-amber-600',
      },
    ],
    gauge: {
      label: 'Clinical Throughput',
      value: '94%',
      emphasis: 'On-Schedule Flow',
      caption: 'Average intake-to-charting: 6.8 min',
    },
    reminders: [
      {
        title: 'Dermoscopic Surveillance',
        body: '4 patients due for 6-month longitudinal digital surveillance of dysplastic nevi.',
        icon: CheckCircle2,
        iconClass: 'bg-emerald-50 text-emerald-700',
      },
      {
        title: 'Laser Endpoint Tolerability',
        body: 'Day 3 post-procedure erythema clearance confirmed on all pulsed dye laser follow-ups.',
        icon: Activity,
        iconClass: 'bg-sky-50 text-sky-700',
      },
      {
        title: 'Compounded Rx Adherence',
        body: '92% portal compliance on customized tretinoin / hydroquinone compounding regimens.',
        icon: Clock,
        iconClass: 'bg-amber-50 text-amber-700',
      },
    ],
  },
  charting: {
    stats: [
      {
        label: 'Vector Charts Rendered',
        value: '17',
        note: '9 facial • 5 body • 3 scalp',
        noteClass: 'bg-emerald-50 text-emerald-700',
        icon: SlidersHorizontal,
        iconClass: 'bg-sky-50 text-sky-600',
      },
      {
        label: 'Injectable Units Logged',
        value: '268',
        note: 'Botox / Dysport across 9 charts',
        noteClass: 'bg-slate-200/60 text-slate-700',
        icon: Layers,
        iconClass: 'bg-violet-50 text-violet-600',
      },
      {
        label: 'Laser Parameters Captured',
        value: '12',
        note: 'Avg 7.4 J/cm² • 1064 nm Nd:YAG',
        noteClass: 'bg-emerald-50 text-emerald-700',
        icon: Activity,
        iconClass: 'bg-amber-50 text-amber-600',
      },
    ],
    gauge: {
      label: 'Documentation Accuracy',
      value: '98%',
      emphasis: 'Template Coverage',
      caption: 'Zero unmatched dosages this week',
    },
    reminders: [
      {
        title: 'Template Coverage',
        body: 'All six procedure templates refreshed with current dilution ratios, needle gauges, and injection planes.',
        icon: SlidersHorizontal,
        iconClass: 'bg-emerald-50 text-emerald-700',
      },
      {
        title: 'Margin Mapping',
        body: 'Mohs stage maps reconciled against pathology reports within 24 hours of receipt.',
        icon: ClipboardCheck,
        iconClass: 'bg-sky-50 text-sky-700',
      },
      {
        title: 'Dosage Integrity',
        body: '100% of injectable notes include units, dilution, and anatomical coordinates.',
        icon: CheckCircle2,
        iconClass: 'bg-amber-50 text-amber-700',
      },
    ],
  },
  imaging: {
    stats: [
      {
        label: 'Dermoscopic Series Captured',
        value: '22',
        note: 'This week across 4 providers',
        noteClass: 'bg-emerald-50 text-emerald-700',
        icon: Camera,
        iconClass: 'bg-amber-50 text-amber-600',
      },
      {
        label: 'Baseline Coverage',
        value: '96%',
        note: 'All four projection angles on new intakes',
        noteClass: 'bg-slate-200/60 text-slate-700',
        icon: FileText,
        iconClass: 'bg-sky-50 text-sky-600',
      },
      {
        label: 'Longitudinal Comparisons',
        value: '8',
        note: 'Dysplastic nevi due this week',
        noteClass: 'bg-emerald-50 text-emerald-700',
        icon: Layers,
        iconClass: 'bg-violet-50 text-violet-600',
      },
    ],
    gauge: {
      label: 'Body-Map Tagging',
      value: '99%',
      emphasis: 'Region & Sub-Region Complete',
      caption: 'Forehead • periorbital • nasolabial • malar',
    },
    reminders: [
      {
        title: 'Dermoscopic Surveillance',
        body: '4 patients due for 6-month repeat capture of atypical nevi with polarized dermoscopy.',
        icon: Camera,
        iconClass: 'bg-emerald-50 text-emerald-700',
      },
      {
        title: 'Follow-Up Review Queue',
        body: '3 patient-submitted recovery photos awaiting physician sign-off in the secure review queue.',
        icon: CheckCircle2,
        iconClass: 'bg-sky-50 text-sky-700',
      },
      {
        title: 'Projection Calibration',
        body: 'Lighting and projection calibration verified weekly for every capture station.',
        icon: Activity,
        iconClass: 'bg-amber-50 text-amber-700',
      },
    ],
  },
};

const clinicalModules = [
  {
    image: '/facial-cleansing.jpg',
    imageAlt: 'Pre-operative skin protocol and asepsis charting',
    category: 'Pre-Op Asepsis & Protocol',
    categoryClass: 'bg-[#0D3A35]/90',
    moduleId: 'Clinical Module 01',
    moduleIdClass: 'text-emerald-300',
    title: 'Pre-Operative Skin Protocol & Asepsis Charting',
    objective:
      'Document antiseptic preparation, skin barrier baseline, and protocol clearance prior to peels, minor surgical excisions, or laser interventions.',
    fields: [
      'Antiseptic agent logged (chlorhexidine, isopropyl, povidone-iodine)',
      'Skin barrier assessment & erythema grading',
      'Follicle prep & degreasing protocol sign-off',
      'Fitzpatrick phototype verified vs. treatment parameters',
    ],
    tags: ['Antiseptic Protocol', 'Fitzpatrick Phototype', 'Barrier Grade', 'Pre-Op Sign-off'],
    discipline: 'Medical Dermatology',
    disciplineClass: 'text-[#0D3A35]',
    checkClass: 'text-emerald-600',
  },
  {
    image: '/facial-massage.jpg',
    imageAlt: 'Anatomical palpation and soft-tissue assessment',
    category: 'Aesthetic & Structural Examination',
    categoryClass: 'bg-[#1E6091]/90',
    moduleId: 'Clinical Module 02',
    moduleIdClass: 'text-sky-300',
    title: 'Anatomical Palpation & Soft-Tissue Assessment',
    objective:
      'Document physical palpation findings, SMAS tissue laxity, volume deficits, and post-injection product placement for aesthetic and procedural dermatology.',
    fields: [
      'Fat pad assessment (malar, temple, submental)',
      'Dynamic vs. static rhytid grading (Glogau)',
      'Post-injection integration & vascular refill check',
      'Edema grade 0–3 & lymphatic drainage monitoring',
    ],
    tags: ['Tissue Palpation', 'Vector Coordinates', 'Edema Grade 0-3', 'Vascular Refill Log'],
    discipline: 'Aesthetic & Procedural Medicine',
    disciplineClass: 'text-[#1E6091]',
    checkClass: 'text-sky-600',
  },
  {
    image: '/face-testing.jpg',
    imageAlt: 'Polarized dermoscopy and lesion surveillance log',
    category: 'Diagnostic Dermatology & Oncology',
    categoryClass: 'bg-[#B54708]/90',
    moduleId: 'Clinical Module 03',
    moduleIdClass: 'text-amber-300',
    title: 'Polarized Dermoscopy & Lesion Surveillance Log',
    objective:
      'High-resolution digital dermoscopic documentation for pigmented and non-pigmented lesions, atypical nevi surveillance, and melanoma triage.',
    fields: [
      'Dermoscopy magnification & polarized lighting mode',
      'ABCD rule evaluation (asymmetry, border, color, diameter)',
      'Dermal pigment depth & vascular pattern class',
      'Body-map pin linked to automated biopsy requisition',
    ],
    tags: ['ABCD Melanoma Index', 'Dermoscopic Grid', 'Body Map Tag', 'Specimen Biopsy Link'],
    discipline: 'Diagnostic Dermatology',
    disciplineClass: 'text-[#B54708]',
    checkClass: 'text-amber-600',
  },
  {
    image: '/laser-rejuvenation.jpg',
    imageAlt: 'Laser parameter and energy device documentation',
    category: 'Laser & Energy Device Registry',
    categoryClass: 'bg-[#5925DC]/90',
    moduleId: 'Clinical Module 04',
    moduleIdClass: 'text-purple-300',
    title: 'Energy-Based Device & Laser Parameter Registry',
    objective:
      'Structured logging of laser surgical settings to ensure reproducibility, audit compliance, and safety across multi-provider clinics.',
    fields: [
      'Wavelength logged (532 / 755 / 1064 / 2940 nm)',
      'Fluence (J/cm²), pulse duration (ms/ns/ps), spot size',
      'Total pulse count & pass density',
      'Endpoint observed (erythema, follicular edema, whitening)',
    ],
    tags: ['Fluence (J/cm²)', 'Spot Size & Pulses', 'Endpoint Reaction', 'Safety Lockouts'],
    discipline: 'Energy-Based Therapeutics',
    disciplineClass: 'text-[#5925DC]',
    checkClass: 'text-purple-600',
  },
];

const encounterSteps = [
  {
    step: '01',
    title: 'Clinical Triage & Fitzpatrick Classification',
    body: 'Medical history intake, dermatological allergy flagging, Fitzpatrick phototyping (I–VI), and previous cosmetic or laser exposure records.',
  },
  {
    step: '02',
    title: 'Calibrated Clinical & Dermoscopic Capture',
    body: 'Standardized positioning guidance, polarized dermoscopic lesion inspection, and cross-session baseline image logging.',
  },
  {
    step: '03',
    title: 'Anatomical Vector Charting & Dosing',
    body: 'Attending physicians plot injection landmarks, device fluence parameters, spot sizes, and surgical margins directly onto anatomical vector charts.',
  },
  {
    step: '04',
    title: 'Longitudinal Outcome Tracking & Sign-Off',
    body: 'Split-screen comparison sliders evaluate therapeutic response against baseline before the visit record is electronically signed.',
  },
];

export default function LandingPage() {
  const [activeTab, setActiveTab] = useState<DashboardTab>('encounters');
  const dashboard = dashboardData[activeTab];

  return (
    <div className="min-h-screen bg-[#F5F2EB] text-slate-800 font-sans selection:bg-[#0D3A35] selection:text-white">
      {/* 1. TOP FLOATING NAVIGATION BAR */}
      <header className="sticky top-4 z-50 px-4 sm:px-8 max-w-7xl mx-auto">
        <nav className="bg-white/90 backdrop-blur-md rounded-full px-6 py-3.5 shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-black/[0.05] flex items-center justify-between transition-all">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="h-9 w-9 rounded-full bg-[#0D3A35] text-white flex items-center justify-center font-serif text-sm font-bold shadow-sm group-hover:scale-105 transition-transform">
                D
              </div>
              <div className="flex flex-col">
                <span className="font-serif text-xl font-bold tracking-tight text-[#0D3A35] leading-none">
                  DERMA
                </span>
                <span className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold mt-0.5">
                  Clinical OS
                </span>
              </div>
            </Link>
          </div>

          {/* Center Links */}
          <div className="hidden md:flex items-center gap-1 text-sm font-medium text-slate-600">
            <a
              href="#overview"
              className="px-4 py-2 rounded-full hover:bg-slate-100 hover:text-slate-900 transition-colors"
            >
              Practice Overview
            </a>
            <a
              href="#capabilities"
              className="px-4 py-2 rounded-full hover:bg-slate-100 hover:text-slate-900 transition-colors"
            >
              EMR Capabilities
            </a>
            <a
              href="#imaging"
              className="px-4 py-2 rounded-full hover:bg-slate-100 hover:text-slate-900 transition-colors"
            >
              Dermoscopic Imaging
            </a>
            <a
              href="#workflow"
              className="px-4 py-2 rounded-full hover:bg-slate-100 hover:text-slate-900 transition-colors"
            >
              Encounter Workflow
            </a>
            <a
              href="#specialties"
              className="px-4 py-2 rounded-full hover:bg-slate-100 hover:text-slate-900 transition-colors"
            >
              Clinical Modules
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
            <span>Electronic Medical Records (EMR) & Dermatology Clinical OS</span>
          </div>

          {/* Main Headline */}
          <h1 className="font-serif text-4xl sm:text-6xl lg:text-6xl font-bold tracking-tight text-[#0D3A35] leading-[1.15]">
            The Purpose-Built EMR for Dermatologists & Clinical Practices
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-slate-600 font-normal leading-relaxed max-w-2xl mx-auto">
            Generic EHRs force dermatologists into rigid, unstructured text boxes. DERMA provides
            structured clinical documentation engineered specifically for medical, surgical, and
            aesthetic dermatology: visual anatomical vector charting, calibrated dermoscopic photo
            surveillance, laser parameter registries, and biopsy chain-of-custody tracking in a
            single secure, HIPAA-aligned workspace.
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
              <span>Explore EMR Capabilities</span>
            </a>
          </div>

          {/* Clinical Trust Bar */}
          <div className="pt-6 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs font-medium text-slate-500">
            <span className="flex items-center gap-2">
              <Check className="w-4 h-4 text-[#0D3A35]" /> Standardized Photographic Projection Grids
            </span>
            <span className="flex items-center gap-2">
              <Check className="w-4 h-4 text-[#0D3A35]" /> Anatomical Vector Landmarks & Dosage Tracking
            </span>
            <span className="flex items-center gap-2">
              <Check className="w-4 h-4 text-[#0D3A35]" /> Barcoded Biopsy Custody & Histopathology Linking
            </span>
            <span className="flex items-center gap-2">
              <Check className="w-4 h-4 text-[#0D3A35]" /> 21 CFR Part 11-Aligned Electronic Sign-Off
            </span>
          </div>
        </div>

        {/* 3. HERO VISUAL / INTERACTIVE PRACTICE DASHBOARD PREVIEW (Diagnox Style) */}
        <div id="overview" className="mt-14 max-w-6xl mx-auto scroll-mt-28">
          <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-[0_12px_40px_rgb(0,0,0,0.06)] border border-black/[0.04] space-y-8">
            {/* Dashboard Header Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2 text-xs font-semibold tracking-wider text-slate-500 uppercase">
                  <Activity className="w-4 h-4 text-[#0D3A35]" />
                  <span>Practice Health Dashboard</span>
                </div>
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#0D3A35] mt-1">
                  Daily Consultation & Clinical Encounter Overview
                </h2>
                <p className="text-sm text-slate-500 mt-0.5">
                  Live clinical operational snapshot for Saint Jude Dermatology & Dermatologic Surgery
                </p>
              </div>

              {/* Status Switcher */}
              <div className="flex flex-wrap items-center gap-2 bg-[#F5F2EB] p-1 rounded-full text-xs font-medium self-start sm:self-auto">
                {dashboardTabs.map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-4 py-1.5 rounded-full transition-all whitespace-nowrap ${
                      activeTab === tab.id
                        ? 'bg-[#0D3A35] text-white shadow-sm'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Diagnox-Style Vital Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {dashboard.stats.map((stat) => {
                const StatIcon = stat.icon;
                return (
                  <div
                    key={stat.label}
                    className="bg-[#FAF8F5] rounded-2xl p-5 border border-slate-200/60 flex flex-col justify-between"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                        {stat.label}
                      </span>
                      <div
                        className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 ${stat.iconClass}`}
                      >
                        <StatIcon className="w-4 h-4" />
                      </div>
                    </div>
                    <div className="mt-4">
                      <div className="text-3xl font-serif font-bold text-slate-900">{stat.value}</div>
                      <div
                        className={`mt-2 inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-0.5 rounded-full ${stat.noteClass}`}
                      >
                        <span>{stat.note}</span>
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Fourth Card (Circular Gauge Style) */}
              <div className="bg-[#FAF8F5] rounded-2xl p-5 border border-slate-200/60 flex flex-col items-center justify-center text-center">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                  {dashboard.gauge.label}
                </span>
                <div className="relative flex items-center justify-center my-1">
                  <div className="h-16 w-16 rounded-full border-4 border-[#0D3A35] border-t-transparent flex items-center justify-center">
                    <span className="text-lg font-serif font-bold text-[#0D3A35]">
                      {dashboard.gauge.value}
                    </span>
                  </div>
                </div>
                <div className="mt-2 text-xs text-slate-500">
                  <span className="font-semibold text-slate-700">{dashboard.gauge.emphasis}</span> •{' '}
                  {dashboard.gauge.caption}
                </div>
              </div>
            </div>

            {/* Physician Clinical Reminders (Diagnox Style) */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#0D3A35] uppercase tracking-wider">
                <ClipboardCheck className="w-4 h-4 text-[#0D3A35]" />
                <span>Physician Clinical Reminders</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {dashboard.reminders.map((reminder) => {
                  const ReminderIcon = reminder.icon;
                  return (
                    <div
                      key={reminder.title}
                      className="bg-white p-5 rounded-2xl border border-slate-200/70 hover:border-slate-300 transition-colors space-y-2"
                    >
                      <div
                        className={`h-7 w-7 rounded-lg flex items-center justify-center ${reminder.iconClass}`}
                      >
                        <ReminderIcon className="w-4 h-4" />
                      </div>
                      <h4 className="text-sm font-semibold text-slate-900">{reminder.title}</h4>
                      <p className="text-xs text-slate-500 leading-relaxed">{reminder.body}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. CORE CLINICAL EMR CAPABILITIES (THE 6 PILLARS) */}
      <section id="capabilities" className="py-20 px-4 sm:px-8 max-w-7xl mx-auto scroll-mt-28">
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white border border-slate-200 text-xs font-semibold text-[#0D3A35] tracking-wider uppercase">
            <span>EMR Capabilities</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-5xl font-bold text-[#0D3A35]">
            Engineered Around the Clinical Realities of Dermatology
          </h2>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            Generic EHRs force dermatologists into rigid, unstructured text boxes. DERMA provides
            structured clinical documentation designed for visual, procedural, and longitudinal
            patient care.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="bg-white rounded-3xl p-7 shadow-sm border border-black/[0.04] hover:shadow-md transition-shadow space-y-4">
            <div className="h-12 w-12 rounded-2xl bg-[#EAF2F0] text-[#0D3A35] flex items-center justify-center">
              <Camera className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-xl font-bold text-slate-900">
              Standardized Dermoscopic & Macro Photographic Mapping
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Fixed anatomical projection angles (anterior, lateral, oblique) with calibrated
              ambient lighting guidance. Every capture is tagged by body region and sub-region and
              linked to the patient timeline for longitudinal comparison.
            </p>
            <ul className="text-xs text-slate-500 space-y-2 pt-2 border-t border-slate-100">
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-[#0D3A35]" /> Fixed anatomical projection angles
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-[#0D3A35]" /> Region & sub-region tagging (forehead, malar, nasolabial)
              </li>
            </ul>
          </div>

          {/* Card 2 */}
          <div className="bg-white rounded-3xl p-7 shadow-sm border border-black/[0.04] hover:shadow-md transition-shadow space-y-4">
            <div className="h-12 w-12 rounded-2xl bg-[#E8F0F8] text-[#1E6091] flex items-center justify-center">
              <SlidersHorizontal className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-xl font-bold text-slate-900">
              Interactive Anatomical Vector Charting
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Point-and-click facial and body vector templates. Log exact consumable units
              (Botox / Dysport), needle gauges, injection planes (subcutaneous, periosteal), and
              dilution ratios directly on the anatomical map.
            </p>
            <ul className="text-xs text-slate-500 space-y-2 pt-2 border-t border-slate-100">
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-[#0D3A35]" /> Facial zone vector templates
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-[#0D3A35]" /> Units, dilution & injection-plane logging
              </li>
            </ul>
          </div>

          {/* Card 3 */}
          <div className="bg-white rounded-3xl p-7 shadow-sm border border-black/[0.04] hover:shadow-md transition-shadow space-y-4">
            <div className="h-12 w-12 rounded-2xl bg-[#FBF0EA] text-[#B54708] flex items-center justify-center">
              <Microscope className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-xl font-bold text-slate-900">
              Biopsy Chain of Custody & Histopathology Integration
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Electronic lab requisition generation with barcode specimen custody. Anatomical
              margin tracking — Mohs stage mapping, punch excision depths — with automated
              pathology report linking.
            </p>
            <ul className="text-xs text-slate-500 space-y-2 pt-2 border-t border-slate-100">
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-[#0D3A35]" /> Barcoded specimen chain of custody
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-[#0D3A35]" /> Automated histopathology linking & margin maps
              </li>
            </ul>
          </div>

          {/* Card 4 */}
          <div className="bg-white rounded-3xl p-7 shadow-sm border border-black/[0.04] hover:shadow-md transition-shadow space-y-4">
            <div className="h-12 w-12 rounded-2xl bg-[#F0EBF8] text-[#5925DC] flex items-center justify-center">
              <Pill className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-xl font-bold text-slate-900">
              Compounded Formulations & Taper Schedules
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Pre-configured dermatologic compounding formulas (triple-combination creams,
              customized keratolytics) with structured topical corticosteroid step-down schedules
              and automated contraindication warnings.
            </p>
            <ul className="text-xs text-slate-500 space-y-2 pt-2 border-t border-slate-100">
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-[#0D3A35]" /> Triple-combination & keratolytic formulas
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-[#0D3A35]" /> Steroid step-down with contraindication checks
              </li>
            </ul>
          </div>

          {/* Card 5 */}
          <div className="bg-white rounded-3xl p-7 shadow-sm border border-black/[0.04] hover:shadow-md transition-shadow space-y-4">
            <div className="h-12 w-12 rounded-2xl bg-[#EBF7F2] text-[#0D6E54] flex items-center justify-center">
              <Calendar className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-xl font-bold text-slate-900">
              Multi-Provider Clinical Queue & Room Orchestration
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Live room occupancy tracking across dermatologists, laser nurses, and physician
              assistants. Fast handoff protocols carry intake notes and capture series straight to
              the attending physician&apos;s queue.
            </p>
            <ul className="text-xs text-slate-500 space-y-2 pt-2 border-t border-slate-100">
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-[#0D3A35]" /> Live room occupancy indicators
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-[#0D3A35]" /> Structured intake-to-attending handoffs
              </li>
            </ul>
          </div>

          {/* Card 6 */}
          <div className="bg-white rounded-3xl p-7 shadow-sm border border-black/[0.04] hover:shadow-md transition-shadow space-y-4">
            <div className="h-12 w-12 rounded-2xl bg-[#FAF0F0] text-[#B42318] flex items-center justify-center">
              <Shield className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-xl font-bold text-slate-900">
              Regulatory Security & Audit Logging
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Role-based clinical boundaries (Doctor, Nurse, Receptionist, Owner) with detailed
              logging of every chart view, photo download, and electronic amendment — designed for
              HIPAA-aligned workflows and defensible documentation.
            </p>
            <ul className="text-xs text-slate-500 space-y-2 pt-2 border-t border-slate-100">
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-[#0D3A35]" /> Role-specific chart permissions
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-[#0D3A35]" /> Complete amendment & access logging
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* 5. CLINICAL ENCOUNTER WORKFLOW */}
      <section id="workflow" className="py-20 px-4 sm:px-8 max-w-7xl mx-auto scroll-mt-28">
        <div className="bg-white rounded-3xl p-8 sm:p-14 border border-black/[0.04] shadow-sm">
          <div className="max-w-3xl space-y-3 mb-12">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#F5F2EB] text-xs font-semibold text-[#0D3A35] tracking-wider uppercase">
              <span>Clinical Encounter Workflow</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#0D3A35]">
              The Physician Clinical Encounter Life Cycle
            </h2>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              How DERMA carries each encounter — from intake and calibrated capture to vector
              charting, electronic sign-off, and longitudinal review.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
            {encounterSteps.map((step) => (
              <div key={step.step} className="space-y-3">
                <div className="h-10 w-10 rounded-full bg-[#0D3A35] text-white flex items-center justify-center font-serif font-bold text-sm">
                  {step.step}
                </div>
                <h3 className="font-serif text-lg font-bold text-slate-900">{step.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{step.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. CLINICAL ENVIRONMENT SHOWCASE (Featuring our high-res clinic image) */}
      <section id="imaging" className="py-12 px-4 sm:px-8 max-w-7xl mx-auto scroll-mt-28">
        <div className="bg-[#FAF8F5] rounded-3xl p-8 sm:p-12 border border-slate-200/80 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div className="space-y-5">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white border border-slate-200 text-xs font-semibold text-[#0D3A35] tracking-wider uppercase">
              <span>Clinical Environment</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#0D3A35] leading-tight">
              Engineered for Clinical Environments of Every Scale
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              From private practices to dermatologic surgery centers and academic clinics, DERMA
              brings structure, speed, and precision to clinical charting.
            </p>

            <div className="space-y-3 pt-2">
              <div className="flex items-start gap-3">
                <div className="h-5 w-5 rounded-full bg-emerald-100 text-[#0D3A35] flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-slate-800">
                    Sterile Procedure Room Synchronization
                  </h4>
                  <p className="text-xs text-slate-500">
                    Workstation, tablet, and mobile devices stay synchronized across sterile
                    procedure rooms and exam suites.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="h-5 w-5 rounded-full bg-emerald-100 text-[#0D3A35] flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-slate-800">
                    Secure Follow-Up Photo Review
                  </h4>
                  <p className="text-xs text-slate-500">
                    Patients submit recovery photos through an encrypted portal straight into the
                    physician&apos;s review queue — no unencrypted email or messaging required.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="h-5 w-5 rounded-full bg-emerald-100 text-[#0D3A35] flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-slate-800">
                    Multi-Provider Procedure Billing
                  </h4>
                  <p className="text-xs text-slate-500">
                    Automated CPT and dermatology procedure code capture linked to signed encounter
                    notes and invoices.
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
                Configured for dermatologic consultations, procedures, and dermoscopic capture.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. PHYSICIAN CLINICAL CHARTING MODULES */}
      <section id="specialties" className="py-20 px-4 sm:px-8 max-w-7xl mx-auto scroll-mt-28">
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white border border-slate-200 text-xs font-semibold text-[#0D3A35] tracking-wider uppercase shadow-sm">
            <span>Specialized Clinical Charting Modules</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-5xl font-bold text-[#0D3A35] tracking-tight">
            Physician Charting Modules for Real Dermatology Workflows
          </h2>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl mx-auto">
            From pre-operative asepsis to laser parameter registries, DERMA documents every
            clinical touchpoint with structured EMR fields, anatomical tags, and standardized
            photo records.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {clinicalModules.map((module) => (
            <div
              key={module.moduleId}
              className="bg-white rounded-3xl overflow-hidden border border-slate-200/90 shadow-sm hover:shadow-xl transition-all duration-300 group flex flex-col justify-between"
            >
              <div>
                <div className="relative h-56 w-full overflow-hidden bg-slate-100">
                  <Image
                    src={module.image}
                    alt={module.imageAlt}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  <div className="absolute top-3 left-3">
                    <span
                      className={`px-2.5 py-1 rounded-full ${module.categoryClass} backdrop-blur-md text-white text-[11px] font-semibold tracking-wide border border-white/10`}
                    >
                      {module.category}
                    </span>
                  </div>
                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <span
                      className={`text-[11px] font-mono uppercase tracking-wider ${module.moduleIdClass}`}
                    >
                      {module.moduleId}
                    </span>
                    <h3 className="font-serif text-lg font-bold leading-tight">{module.title}</h3>
                  </div>
                </div>
                <div className="p-5 space-y-3">
                  <p className="text-xs text-slate-600 leading-relaxed">{module.objective}</p>
                  <ul className="space-y-1.5">
                    {module.fields.map((field) => (
                      <li key={field} className="flex items-start gap-1.5 text-[11px] text-slate-500 leading-snug">
                        <Check className="w-3 h-3 text-[#0D3A35] shrink-0 mt-0.5" />
                        <span>{field}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {module.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-slate-100 text-slate-700"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <div
                className={`px-5 pb-5 pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-semibold ${module.disciplineClass}`}
              >
                <span>{module.discipline}</span>
                <CheckCircle2 className={`w-4 h-4 ${module.checkClass}`} />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 8. CALL TO ACTION BANNER */}
      <section className="py-12 px-4 sm:px-8 max-w-7xl mx-auto">
        <div className="bg-[#0D3A35] rounded-3xl p-8 sm:p-16 text-white text-center space-y-6 shadow-xl">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/15 text-xs font-medium text-emerald-200 tracking-wider uppercase">
            <span>Clinical Onboarding</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight max-w-2xl mx-auto">
            Ready to Equip Your Practice with a Dedicated Dermatology EMR?
          </h2>
          <p className="text-slate-300 text-sm sm:text-base max-w-xl mx-auto leading-relaxed font-light">
            Experience a live clinical workspace configured with real patient records, anatomical
            charting templates, and dermoscopy workflows.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link
              href="/login"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-white text-[#0D3A35] font-semibold text-sm hover:bg-slate-100 transition-all shadow-md active:scale-95"
            >
              <span>Launch Practitioner DEMO</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <p className="text-xs text-emerald-200/80 font-light">
            Auto-loads the Dr. Arjun Patel clinical demo workspace — no setup required.
          </p>
        </div>
      </section>

      {/* 9. PROFESSIONAL CLINICAL FOOTER */}
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
                DERMA is an enterprise electronic medical records (EMR) and clinical operating
                system engineered exclusively for medical, surgical, and aesthetic dermatology
                practices worldwide.
              </p>
              <div className="text-xs text-slate-500 pt-1">
                Clinical Support: <span className="text-slate-400">support@derma-clinic.health</span>
              </div>
            </div>

            {/* Col 2: Clinical Platform */}
            <div className="space-y-3">
              <h5 className="text-xs font-semibold uppercase tracking-wider text-white">
                Clinical Platform
              </h5>
              <ul className="text-xs space-y-2 text-slate-400">
                <li><a href="#capabilities" className="hover:text-white transition-colors">Patient Charting</a></li>
                <li><a href="#imaging" className="hover:text-white transition-colors">Photographic Surveillance</a></li>
                <li><a href="#capabilities" className="hover:text-white transition-colors">Anatomical Vector Maps</a></li>
                <li><a href="#capabilities" className="hover:text-white transition-colors">Biopsy Custody</a></li>
                <li><a href="#capabilities" className="hover:text-white transition-colors">Compounded Formulations</a></li>
                <li><Link href="/login" className="hover:text-white transition-colors">Clinical Queue</Link></li>
              </ul>
            </div>

            {/* Col 3: Clinical Modules */}
            <div className="space-y-3">
              <h5 className="text-xs font-semibold uppercase tracking-wider text-white">
                Clinical Modules
              </h5>
              <ul className="text-xs space-y-2 text-slate-400">
                <li><a href="#specialties" className="hover:text-white transition-colors">Pre-Op Skin Protocols</a></li>
                <li><a href="#specialties" className="hover:text-white transition-colors">Tissue Palpation Logs</a></li>
                <li><a href="#specialties" className="hover:text-white transition-colors">Polarized Dermoscopy</a></li>
                <li><a href="#specialties" className="hover:text-white transition-colors">Laser & Energy Registry</a></li>
                <li><a href="#specialties" className="hover:text-white transition-colors">Mohs Surgical Notes</a></li>
              </ul>
            </div>

            {/* Col 4: Governance & Compliance */}
            <div className="space-y-3">
              <h5 className="text-xs font-semibold uppercase tracking-wider text-white">
                Governance & Compliance
              </h5>
              <ul className="text-xs space-y-2 text-slate-400">
                <li><Link href="/login" className="text-emerald-300 font-semibold hover:underline">Practitioner DEMO</Link></li>
                <li><span className="text-slate-500">Role-Based Access Controls</span></li>
                <li><span className="text-slate-500">21 CFR Part 11-Aligned Electronic Signatures</span></li>
                <li><span className="text-slate-500">Tamper-Evident Audit Trails</span></li>
                <li><span className="text-slate-500">HIPAA-Aligned Security Safeguards</span></li>
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
