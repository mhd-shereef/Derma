# DERMA — Aesthetic Dermatology Clinical OS

<div align="center">

![DERMA Clinical OS](https://img.shields.io/badge/System-DERMA%20Clinical%20OS-0D3A35?style=for-the-badge&logoColor=white)
![Next.js 14](https://img.shields.io/badge/Next.js-14.0-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![NestJS 10](https://img.shields.io/badge/NestJS-10.3-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)
![PostgreSQL 15](https://img.shields.io/badge/PostgreSQL-15-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)
![Prisma 5](https://img.shields.io/badge/Prisma-5.10-2D3748?style=for-the-badge&logo=prisma&logoColor=white)
![TypeScript 5](https://img.shields.io/badge/TypeScript-5.3-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![HIPAA Ready](https://img.shields.io/badge/HIPAA-Audit%20Logged-0D3A35?style=for-the-badge)

<p align="center">
  <b>A cloud-native Electronic Medical Record (EMR) engineered for specialized aesthetic and medical dermatology practices.</b>
</p>

</div>

---

## 🔬 System Overview

**DERMA** covers the complete patient journey from initial digital intake to post-procedure follow-ups. Designed in close collaboration with dermatology practitioners, it replaces generic EMR templates with specialized photography comparison, vector anatomical charting, and an active clinic queue.

Part of the **[MedNexa Health Ecosystem](https://github.com/mhd-shereef/MedNexa)**.

---

## 🏛 High-Performance System Architecture

```
┌─────────────────────────────────┐           ┌─────────────────────────────────┐
│   Client Layer (Next.js 14)     │           │    Core API Layer (NestJS 10)   │
│   • Diagnox Design Aesthetic    │ ───REST──▶│    • Multi-Tenant Isolation     │
│   • Photographic Comparison UI  │◀──WSS─────│    • Live WebSocket Gateway     │
│   • Practitioner Portal         │           │    • Automated Audit Pipeline   │
└─────────────────────────────────┘           └────────────────┬────────────────┘
                                                               │
                                      ┌────────────────────────┴────────────────────────┐
                                      ▼                                                 ▼
                       ┌─────────────────────────────┐                   ┌─────────────────────────────┐
                       │     PostgreSQL Database     │                   │     Secure Object Store     │
                       │    Prisma ORM & Migrations  │                   │   Encrypted Clinical Photos │
                       │    Immutable Audit Logs     │                   │   Signed Ephemeral URLs     │
                       └─────────────────────────────┘                   └─────────────────────────────┘
```

---

## 🩺 Clinical Capabilities & Modules

| Module | Scope | Highlights |
| :--- | :--- | :--- |
| **M1: Multi-Tenancy & RBAC** | Identity & Access | Role-based authorization (`Owner`, `Admin`, `Doctor`, `Nurse`, `Receptionist`) with cryptographic session rotation. |
| **M2: Patient Registry** | Demographics & Intake | Duplicate-detection algorithms, demographic indexing, medical history timeline. |
| **M3: Live Queue & Triage** | Clinic Operations | Real-time WebSocket queue board synchronizing reception, triage, consultation, and recovery bays. |
| **M4: Clinical Encounters** | Visits & Charting | Dermatology-tailored procedure templates, ICD-10 diagnostic search, treatment notes, and anatomical vector charting. |
| **M5: Photographic Mapping** | Clinical Imaging | High-resolution multi-view photography records, side-by-side comparative views, time-lapse tracking. |
| **M6: Prescription Engine** | Pharmacy & Care Plans | Pre-configured dermatological regimens (acne, eczema, post-laser care), dosing schedules, print-ready scripts. |
| **M7: Procedure Catalog** | Session Management | Multi-session packages (laser, peels, PRP, injectables) with automated consumption deductions. |
| **M8: Billing & GST** | Revenue Cycle | Clinic invoicing, itemized procedure billing, GST tax-compliance, payment reconciliation. |
| **M9: Analytics & Audit** | Compliance & Intel | Clinic performance dashboard, appointment conversion metrics, and tamper-evident access logs. |

---

## 🔒 Enterprise Security & Compliance

- **Immutable Audit Logging**: Every read, write, export, and search action on patient records generates a non-repudiable audit event.
- **Strict Tenant Separation**: Cross-tenant data leakage is structurally impossible via Prisma middleware tenant guards.
- **Zero Raw Exposure**: Clinical images are never publicly accessible; served exclusively through short-lived signed URLs.
- **Transport & Storage Encryption**: Strict TLS 1.3 in transit and AES-256 encryption at rest.

---

<div align="center">
  <sub>Proprietary Clinical Software. Copyright © MedNexa / DERMA. All rights reserved.</sub>
</div>
