# MedNexa — DERMA EMR

[![NestJS](https://img.shields.io/badge/NestJS-10-E0234E?logo=nestjs&logoColor=white)](https://nestjs.com)
[![Next.js](https://img.shields.io/badge/Next.js-14-000000?logo=nextdotjs&logoColor=white)](https://nextjs.org)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-4169E1?logo=postgresql&logoColor=white)](https://www.postgresql.org)
[![Prisma](https://img.shields.io/badge/Prisma-5-2D3748?logo=prisma&logoColor=white)](https://www.prisma.io)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?logo=docker&logoColor=white)](https://docs.docker.com/compose)

A multi-tenant, cloud-based EMR built for aesthetic dermatology clinics. It covers the full
patient journey — registration, appointments and queue, visits with procedure templates,
clinical photos with before/after comparison, prescriptions, session packages, and
GST-ready billing — with an immutable audit trail on every patient-data access.

Part of the MedNexa health ecosystem. Proprietary software; all rights reserved.

## Repository layout

| Path | Description |
| --- | --- |
| `backend/` | NestJS REST API, WebSocket queue, Prisma schema and migrations |
| `frontend/` | Next.js 14 clinic application (App Router) |
| `mednexa/` | Static marketing and sales site for the MedNexa products |
| `nginx/` | Reverse proxy configuration for production |
| `docs/` | Planning and engineering documentation |
| `docker-compose.yml` | Local development stack (Postgres, Redis, MinIO, app) |
| `docker-compose.prod.yml` | Production stack (includes Nginx) |

## Modules

| ID | Module | Status |
| --- | --- | --- |
| M1 | Auth, RBAC, multi-tenancy, audit logging | Implemented |
| M2 | Patient registration and search (duplicate detection) | Implemented |
| M3 | Appointments and live queue (WebSocket) | Implemented |
| M4 | Visits, procedure templates, clinical notes, ICD-10 | Implemented |
| M5 | Clinical photo management and secure access | Implemented |
| M6 | Prescriptions and reusable regimens | Implemented |
| M7 | Procedure catalog and session packages | Implemented |
| M8 | Billing, invoices, payments, GST | Implemented |
| M9 | Reports and dashboards | Implemented |

Planned after v1: body map with lesion tracking, severity scores (PASI, EASI, IGA, DLQI,
SALT), digital consent forms, biopsy tracking, patient portal, and WhatsApp/SMS reminders.
See `docs/implementation-plan.md` for the full scope.

## Tech stack

| Layer | Technology |
| --- | --- |
| Frontend | Next.js 14 (App Router), React 18, TanStack Query, Zustand, Tailwind CSS, Radix UI |
| Backend | NestJS 10, Prisma 5, Passport JWT, Socket.IO, Swagger, Jest |
| Database | PostgreSQL 15 |
| Storage | MinIO / S3 (private buckets, signed short-lived URLs) |
| Cache / queue | Redis 7 |
| Infrastructure | Docker Compose, Nginx, Helmet, rate limiting |

## Architecture

```mermaid
graph LR
    UI["Next.js frontend<br/>(port 3000)"] --> API["NestJS API<br/>(port 3001, /api/v1)"]
    API --> PG[("PostgreSQL 15")]
    API --> RD[("Redis 7")]
    API --> S3[("MinIO / S3<br/>photo storage")]
    API -.->|WebSocket| UI
```

Request pipeline: CORS → rate limiter → tenant extraction → JWT auth → RBAC guard →
validation → audit interceptor.

## Getting started

### Prerequisites

- Docker and Docker Compose (recommended path), or
- Node.js 20+, npm, and a local PostgreSQL 15 / Redis / MinIO for manual setup

### Option 1 — Docker Compose

```bash
cp .env.example .env                  # review values; defaults are dev-only
docker compose up -d --build
docker exec derma-ai-backend npx prisma migrate deploy
docker exec derma-ai-backend npm run prisma:seed
```

| Service | URL |
| --- | --- |
| Clinic app | http://localhost:3000 |
| API | http://localhost:3001/api/v1 |
| API docs (Swagger) | http://localhost:3001/docs |
| MinIO console | http://localhost:9001 |
| PostgreSQL (host port) | `localhost:5433` |

### Option 2 — Local development

```bash
# 1. Start infrastructure only
docker compose up -d postgres redis minio

# 2. Backend
cd backend
npm ci
cp .env.example .env
# When using the Dockerized Postgres, change the .env port to 5433:
# DATABASE_URL=postgresql://derma_ai:derma_ai_dev@localhost:5433/derma_ai?schema=public
npx prisma migrate deploy
npm run prisma:seed
npm run start:dev

# 3. Frontend (new terminal)
cd frontend
npm ci
cp .env.example .env
npm run dev
```

### Demo accounts (after seeding)

Seeded tenant "Demo Clinic". All accounts use the password `password123`.

| Role | Email |
| --- | --- |
| Owner | `owner@demo-clinic.com` |
| Admin | `admin@demo-clinic.com` |
| Doctor | `dr.arjun@demo-clinic.com` |
| Doctor | `dr.sneha@demo-clinic.com` |

## Testing

```bash
cd backend
npm test               # Jest unit tests
npm run test:cov       # coverage report

cd frontend
npm run type-check     # TypeScript
npm run lint           # ESLint
```

## Documentation

| Document | Contents |
| --- | --- |
| `docs/implementation-plan.md` | Full 9-phase plan: scope, architecture, database schema, API design, testing |
| `docs/engineering-playbook.md` | Delivery process, phases, and working rules |
| `docs/mednexa-website-brief.md` | Brief behind the marketing site |
| `mednexa/README.md` | How to run and customize the marketing site |

## Security and compliance

- Tenant isolation on every query; cross-tenant access is rejected.
- RBAC guard on all endpoints, with JWT access tokens (15 min) and rotating refresh tokens.
- Immutable audit log for every create/read/update/delete on patient data.
- Soft deletes and versioning — clinical data is never hard-deleted.
- Photos stored in private object storage, served via short-lived signed URLs, with access logging.
- Helmet headers, rate limiting, CORS allowlist, and input validation (whitelist mode).
- Secrets are read from environment variables; no credentials are committed.

## License

Proprietary. Copyright (c) MedNexa. All rights reserved. No part of this software may be
copied, modified, or distributed without prior written permission.
