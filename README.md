# DERMA — Aesthetic Dermatology Clinical OS

[![Next.js](https://img.shields.io/badge/Next.js-14-000000?logo=nextdotjs&logoColor=white)](https://nextjs.org)
[![NestJS](https://img.shields.io/badge/NestJS-10-E0234E?logo=nestjs&logoColor=white)](https://nestjs.com)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-4169E1?logo=postgresql&logoColor=white)](https://www.postgresql.org)
[![Prisma](https://img.shields.io/badge/Prisma-5-2D3748?logo=prisma&logoColor=white)](https://www.prisma.io)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?logo=vercel&logoColor=white)](https://vercel.com)
[![Render](https://img.shields.io/badge/Deployed%20on-Render-46E3B7?logo=render&logoColor=white)](https://render.com)

A multi-tenant, cloud-based Electronic Medical Record (EMR) system built specifically for aesthetic dermatology clinics. It covers the complete clinical journey: patient registration, real-time appointment queue, standardized visits with procedure templates, clinical photographic mapping with before/after comparisons, digital prescriptions, session packages, and GST-ready billing.

---

## 🏛 Architecture (Diagnox Pattern)

```
┌─────────────────────────────────┐           ┌─────────────────────────────────┐
│   Vercel (Next.js 14 Frontend)  │           │    Render (NestJS 10 API)       │
│   Root Directory: "frontend"    │ ───REST──▶│    Root Directory: "backend"    │
│   Landing Page at "/"           │◀──WSS─────│    Port: 3001, Prefix: /api/v1  │
│   Clinician Portal at "/login"  │           └────────────────┬────────────────┘
└─────────────────────────────────┘                            │
                                                               ▼
                                              ┌─────────────────────────────────┐
                                              │    Render PostgreSQL Database   │
                                              │    Prisma Schema & Migrations   │
                                              └─────────────────────────────────┘
```

---

## 📁 Repository Structure

```
Derma/
├── frontend/               # Next.js 14 App Router (Tailwind CSS, TanStack Query, Radix UI)
│   ├── src/app/            # Routes: / (Landing Page), /login (DEMO Login), /dashboard (EMR)
│   └── package.json
├── backend/                # NestJS 10 REST API, WebSocket Queue, Prisma ORM
│   ├── prisma/             # Schema, migrations, seed data
│   ├── src/                # Modules: auth, patients, appointments, visits, photos, billing
│   └── package.json
├── nginx/                  # Nginx reverse proxy configuration for Docker deployments
├── docs/                   # Implementation plan & engineering playbooks
├── docker-compose.yml      # Local development container stack
├── docker-compose.prod.yml # Production multi-container stack
└── README.md
```

---

## 🚀 Cloud Deployment Guide

### 1. Render Deployment (Backend API & Database)

#### A. Create PostgreSQL Database on Render
1. Go to [Render Dashboard](https://dashboard.render.com/) → **New +** → **PostgreSQL**.
2. **Name**: `derma-postgres`
3. **Database**: `derma_ai`
4. Click **Create Database**, then copy the **Internal Database URL**.

#### B. Create Web Service for Backend
1. In Render Dashboard, click **New +** → **Web Service** → Connect `mhd-shereef/Derma`.
2. Configure settings:
   - **Name**: `derma-backend`
   - **Root Directory**: `backend`
   - **Runtime**: `Node`
   - **Build Command**:
     ```bash
     npm install && npm run prisma:generate && npm run prisma:migrate:prod && npm run build
     ```
   - **Start Command**:
     ```bash
     npm run start:prod
     ```
3. Add Environment Variables:
   - `NODE_ENV`: `production`
   - `DATABASE_URL`: `[Paste Render Internal Database URL]`
   - `JWT_SECRET`: `[Random 32+ character string]`
   - `JWT_EXPIRES_IN`: `15m`
   - `JWT_REFRESH_SECRET`: `[Random 32+ character string]`
   - `JWT_REFRESH_EXPIRES_IN`: `7d`
   - `FRONTEND_URL`: `https://[your-vercel-app].vercel.app` (for CORS allowlist)

---

### 2. Vercel Deployment (Frontend Application)

1. Go to [Vercel Dashboard](https://vercel.com/dashboard) → **Add New…** → **Project**.
2. Import repository `mhd-shereef/Derma`.
3. In **Configure Project**:
   - **Framework Preset**: `Next.js`
   - **Root Directory**: Click **Edit** and set to `frontend`
4. Add Environment Variables:
   - `NEXT_PUBLIC_API_URL`: `https://[your-render-backend].onrender.com/api/v1`
   - `NEXT_PUBLIC_WS_URL`: `https://[your-render-backend].onrender.com`
5. Click **Deploy**.

---

## 💻 Local Development

### Prerequisites
- Node.js 20+
- Docker & Docker Compose (optional for local Postgres/Redis/MinIO)

### Option 1 — Run with Docker Compose
```bash
docker compose up -d --build
docker exec derma-ai-backend npx prisma migrate deploy
docker exec derma-ai-backend npm run prisma:seed
```
- Frontend: `http://localhost:3000`
- API & Swagger: `http://localhost:3001/docs`

### Option 2 — Run Locally

```bash
# 1. Backend
cd backend
npm install
npx prisma migrate dev
npm run prisma:seed
npm run start:dev

# 2. Frontend (in new terminal)
cd frontend
npm install
npm run dev
```

### 🔑 Demo Accounts
All seeded accounts use password: `password123`
- Owner: `owner@demo-clinic.com`
- Doctor: `dr.arjun@demo-clinic.com`
- Doctor: `dr.sneha@demo-clinic.com`
- Admin: `admin@demo-clinic.com`

---

## 🔒 Security & Compliance
- Multi-tenancy isolation enforced on every Prisma query.
- Role-based Access Control (RBAC) on all API endpoints.
- Immutable audit log for HIPAA-aligned clinical data access.
- Clinical photography secured in private object storage with time-limited signed URLs.

## 📄 License
Proprietary. Copyright (c) MedNexa / DERMA. All rights reserved.
