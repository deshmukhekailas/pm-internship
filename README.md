# AI-Based Internship Recommendation Engine for PM Internship Scheme

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Node.js Version](https://img.shields.io/badge/Node.js-v20%2B-brightgreen.svg)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.3-cyan.svg)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.4-38B2AC.svg)](https://tailwindcss.com/)
[![Prisma ORM](https://img.shields.io/badge/Prisma-5.21-2D3748.svg)](https://www.prisma.io/)
[![Vitest](https://img.shields.io/badge/Tests-17%2F17%20Passing-success.svg)](https://vitest.dev/)

A production-grade, full-stack, enterprise-ready web application engineered to connect Indian youth to top corporate internships under the **Prime Minister Internship Scheme (PMIS)** initiated by the Ministry of Corporate Affairs (MCA), Government of India.

The application pairs a deterministic government statutory eligibility engine with a multi-factor AI/ML compatibility engine (TF-IDF vectorization, Cosine similarity, and Google Gemini LLM fallback) to deliver transparent, bias-free, and explainable recommendations.

---

## 🏛️ Scheme Background & Alignment

The Prime Minister's Internship Scheme aims to provide **1 crore internships in Top 500 companies** over a period of 5 years. Key institutional parameters enforced by this platform include:
- **Duration**: 12 months hands-on industry exposure with structured learning.
- **Financial Support**: ₹5,000 monthly allowance (₹4,500 from MCA Direct Benefit Transfer + ₹500 from CSR partner contributions) plus a one-time grant of ₹6,000.
- **Statutory Age Bracket**: 21 to 24 years of age as of application deadline.
- **Education Eligibility**: High school, ITI certificate holders, Polytechnic diploma holders, and college graduates (B.A., B.Sc., B.Com., B.E., B.Tech., B.Pharm., BCA, BBA). Postgraduates and graduates from IITs/IIMs/IISERs are systematically filtered according to statutory scheme exclusions.

---

## 🧠 Recommendation Architecture & Responsible AI

```
                                  STUDENT PROFILE / RESUME
                                             │
                                             ▼
                       ┌───────────────────────────────────────────┐
                       │   Stage 1: Deterministic Eligibility Gate  │
                       │   - Age Bracket (21 - 24 years)           │
                       │   - Degree Whitelist & Postgrad Exclusion │
                       │   - Minimum CGPA Baseline Threshold       │
                       │   - Mandatory Technical Prerequisites     │
                       └─────────────────────┬─────────────────────┘
                                             │
                                    Eligible / Ineligible
                                             ▼
                       ┌───────────────────────────────────────────┐
                       │   Stage 2: Multi-Vector Feature Extractor │
                       │   - Skills & Proficiency Weights          │
                       │   - Domain & Industry Affinity            │
                       │   - Experience & Academic Projects        │
                       │   - Location Proximity & State Quotas     │
                       └─────────────────────┬─────────────────────┘
                                             │
                                             ▼
                       ┌───────────────────────────────────────────┐
                       │   Stage 3: Multi-Factor Scoring Engine    │
                       │   - Skill Match (30%)                     │
                       │   - Academic Match (20%)                  │
                       │   - Domain Match (15%)                    │
                       │   - Geographic Proximity (10%)            │
                       │   - Verified Projects (10%)               │
                       │   - Career Aspirations (10%)              │
                       │   - Work Mode / Preferences (5%)          │
                       └─────────────────────┬─────────────────────┘
                                             │
                                             ▼
                       ┌───────────────────────────────────────────┐
                       │   Stage 4: AI Strategy Layer (Pluggable)  │
                       │   ├── Strategy A: Rule-Based Deterministic│
                       │   ├── Strategy B: ML TF-IDF & Cosine      │
                       │   └── Strategy C: Hybrid Gemini LLM       │
                       │       (Auto-fallback to ML on API limits) │
                       └─────────────────────┬─────────────────────┘
                                             │
                                             ▼
                       ┌───────────────────────────────────────────┐
                       │   Stage 5: Explainability & Action Plan   │
                       │   - Compatibility Score: XX%              │
                       │   - Factor Contribution Breakdown         │
                       │   - Skill Gap Analysis (Missing Skills)   │
                       │   - Curated Free Learning Resources       │
                       └───────────────────────────────────────────┘
```

### Responsible AI Principles
1. **Compatibility Fit, Never Selection Guarantees**: Metrics are presented as *"Compatibility Score: XX%"* reflecting profile alignment, never misleading probabilistic claims of hiring selection.
2. **Neutrality & Anti-Bias**: The algorithm does not consume or evaluate caste, gender, religion, family income, or non-educational demographic variables.
3. **Transparent Explainability**: Every recommendation specifies exact positive contributing factors (e.g., *"Matched Python & SQL"*) and action items (e.g., *"Familiarize with Docker to boost fit"*).

---

## 💻 Tech Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 18, TypeScript, Vite, Tailwind CSS, Lucide Icons, Recharts, React Router v6, TanStack Query |
| **Backend** | Node.js v20+, Express.js, TypeScript, Prisma ORM, Zod, JWT, Helmet, Morgan, Winston, Rate-Limiting |
| **AI / ML** | TF-IDF Vectorizer, Cosine Similarity, Jaccard Index, Google Gemini 1.5 Flash (via `@google/generative-ai`), Regex/NLP Resume Extractor |
| **Databases** | PostgreSQL 16 (Production/Docker), SQLite (Zero-dependency local Windows environment) |
| **Cache & DevOps** | Redis 7, Docker, Docker Compose, Nginx, Multi-Stage Dockerfiles |
| **Documentation & QA** | Swagger UI (`/api/docs`), Vitest (17 Unit & Integration test suites) |

---

## 👥 Demo Credentials & Seed Data

The database comes pre-seeded with **16 Top Indian Corporate & PSU Partners** (TCS, L&T, BHEL, Reliance, SBI, Infosys, Maruti Suzuki, ONGC, etc.), **52 Real-world Internships**, **40 Core Skills**, and **32 Verified Student Profiles**.

| Role | Email | Password | Access Privileges |
| :--- | :--- | :--- | :--- |
| **Administrator** | `admin@pminternship.gov.in` | `Admin@12345` | Management Portal, CRUD Postings, Review Applicants, Algorithm Weights, CSV/JSON Exports |
| **Student** | `student@pminternship.gov.in` | `Student@12345` | Candidate Portal, Recommendations, Resume Analyzer, Applications Tracker, Saved Jobs |

---

## 🚀 Quick Start (Local Development)

### Prerequisites
- **Node.js** v18+ or v20+
- **npm** v9+

### 1. Clone & Setup Repository
```bash
git clone https://github.com/your-org/pm-internship-recommendation-engine.git
cd pm-internship-recommendation-engine
```

### 2. Backend Setup
```bash
cd backend

# Install dependencies
npm install

# Setup environment
cp .env.example .env

# Generate Prisma Client & Run SQLite Seed (Zero external database required)
npm run prisma:generate
npm run prisma:seed

# Run tests
npm run test

# Start backend server
npm run dev
# Server running at: http://localhost:5000
# Swagger API Docs at: http://localhost:5000/api/docs
```

### 3. Frontend Setup
In a new terminal window:
```bash
cd frontend

# Install dependencies
npm install

# Setup environment
cp .env.example .env

# Start Vite dev server
npm run dev
# Frontend running at: http://localhost:5173
```

---

## 🐳 Docker Deployment

Run the entire full-stack application (PostgreSQL, Redis, Backend API, Frontend Web with Nginx) with a single command:

```bash
docker-compose up --build -d
```

- **Frontend Client**: [http://localhost:3000](http://localhost:3000)
- **Backend API**: [http://localhost:5000](http://localhost:5000)
- **Swagger Documentation**: [http://localhost:5000/api/docs](http://localhost:5000/api/docs)
- **Health Check**: [http://localhost:5000/health](http://localhost:5000/health)

To view logs:
```bash
docker-compose logs -f backend
```

---

## 📁 Repository Structure

```
.
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma            # PostgreSQL Production Schema
│   │   └── schema.sqlite.prisma     # SQLite Zero-Dependency Dev Schema
│   ├── src/
│   │   ├── ai/                      # Pluggable AI Strategies (RuleBased, ML TF-IDF, Gemini LLM)
│   │   ├── config/                  # DB, Environment & Swagger Configuration
│   │   ├── controllers/             # Auth, Student, Internship, Recommendation, Admin
│   │   ├── database/seed.ts         # High-fidelity realistic Indian corporate seed dataset
│   │   ├── middleware/              # Auth, RBAC, Rate-Limiting, Error Handling, File Uploads
│   │   ├── recommendation/          # Scoring Engine, Eligibility Filter, TF-IDF, Skill Gap
│   │   ├── routes/                  # Express REST Router Definitions
│   │   ├── services/                # Business Logic & Resume Parsing Service
│   │   ├── utils/                   # JWT, Password Hasher, Logger, API Response Wrappers
│   │   ├── validators/              # Zod Schemas for Strict Input Validation
│   │   ├── app.ts                   # Express Application Initialization
│   │   └── server.ts                # Server Entrypoint
│   ├── Dockerfile                   # Multi-stage production container build
│   └── tsconfig.json
│
├── frontend/
│   ├── src/
│   │   ├── api/                     # Axios Client with Auto-Token Refresh Interceptors
│   │   ├── components/              # Common UI, Badges, Modals, Filters, Cards
│   │   ├── context/                 # Authentication & User Session Context
│   │   ├── layouts/                 # PublicLayout, StudentLayout, AdminLayout
│   │   ├── pages/
│   │   │   ├── public/              # Home, About, HowItWorks, Search, Login, Register, Contact, Privacy, Terms
│   │   │   ├── student/             # Dashboard, Recommendations, Applications, Detail, Profile, Resume, Saved, Notifications, Settings
│   │   │   └── admin/               # Dashboard, Internships, Students, Applications, Companies, Analytics, Eligibility, Settings, Import/Export
│   │   ├── types/                   # Frontend TypeScript Interface Declarations
│   │   ├── App.tsx                  # Full React Router Route Tree
│   │   └── main.tsx                 # Application Entrypoint
│   ├── nginx.conf                   # Production Nginx reverse proxy & SPA configuration
│   ├── Dockerfile                   # Production Nginx image build
│   └── vite.config.ts
│
├── database/
│   └── migrations/
│       └── 001_initial_schema.sql   # PostgreSQL Native Schema Migration
├── docker-compose.yml               # Multi-service production orchestration
├── .env.example                     # Environment template
└── README.md
```

---

## 📡 API Reference Overview

The API is fully documented via OpenAPI 3.0 / Swagger UI at `/api/docs`.

### Authentication & Profiles
- `POST /api/auth/register` - Register a new candidate account.
- `POST /api/auth/login` - Authenticate student or administrator credentials.
- `POST /api/auth/refresh` - Refresh expiring JWT tokens.
- `GET /api/student/profile` - Fetch authenticated candidate dossier.
- `PUT /api/student/profile` - Update skills, education, and preferences.
- `POST /api/student/resume` - Upload resume (PDF/DOCX) for NLP skill extraction.

### Internships & Recommendations
- `GET /api/internships` - Public searchable catalogue with domain & location filters.
- `GET /api/internships/:id` - Opportunity details, requirements, and eligibility rules.
- `GET /api/recommendations` - Compute & retrieve personalized recommendations.
- `POST /api/recommendations/generate` - Trigger on-demand recommendation batch.
- `POST /api/recommendations/:id/feedback` - Submit candidate relevance feedback.

### Candidate Applications
- `GET /api/applications` - List student's submitted applications.
- `POST /api/applications` - Submit application with cover letter & declaration.
- `GET /api/applications/:id` - Detailed application status and review notes.

### Administrative Controls
- `GET /api/admin/dashboard` - Platform statistics, domain demand, and skill shortage heatmap.
- `GET /api/admin/students` - Query candidate profiles with education details.
- `POST /api/admin/internships` - Publish new corporate internship opportunity.
- `PUT /api/admin/internships/:id` - Edit internship details and eligibility rules.
- `DELETE /api/admin/internships/:id` - Remove or archive internship.
- `GET /api/admin/applications` - List and filter candidate applications.
- `PUT /api/admin/applications/:id/status` - Update application review stage with notes.
- `GET /api/admin/config` - Retrieve active AI engine strategy and scoring weights.
- `PUT /api/admin/config` - Update scoring weights and algorithm parameters.
- `GET /api/admin/export/:entity` - Download verified datasets in JSON format.

---

## 🚀 Production Deployment & Database Operations

For full deployment instructions covering Docker, Cloud PaaS (Render, Railway, Fly.io, Vercel), and custom servers, consult the [Production Deployment Guide](file:///C:/Users/deshm/Documents/web_dev/intership/docs/DEPLOYMENT_GUIDE.md).

### Quick Database Operations:
- **Production Clean Seed** (Resets DB and populates Master Data: Super Admin, 40 skills, 16 organizations, 52 internships, with **0 dummy students**):
  ```bash
  npm run seed:clean
  ```
- **Purge Student Data Only** (Deletes all candidate profiles, applications, and resumes, preserving admin & scheme internships):
  ```bash
  npm run db:purge
  ```
- **Verify Database State**:
  ```bash
  npm run db:check
  ```
- **MongoDB Atlas Schema Synchronization**:
  ```bash
  npm run prisma:mongo:push
  npm run prisma:mongo:generate
  ```

---

## 🧪 Testing & Verification

The test suite exercises the eligibility rules, TF-IDF calculation, multi-factor scoring formula, JWT security, and factory fallback:

```bash
cd backend
npm run test
```

```
 RUN  v2.1.9 C:/Users/deshm/Documents/web_dev/intership/backend

 ✓ src/__tests__/eligibility.test.ts (5 tests)
 ✓ src/__tests__/tfidf.test.ts (4 tests)
 ✓ src/__tests__/scoringEngine.test.ts (3 tests)
 ✓ src/__tests__/integration.test.ts (5 tests)

 Test Files  4 passed (4)
      Tests  17 passed (17)
```

---

## 🔒 Security Best Practices Implemented

- **Password Hashing**: Strong Argon2/Bcrypt with configurable work factors.
- **JWT Authentication**: Short-lived access tokens with HttpOnly-compatible refresh tokens.
- **Rate Limiting**: Protects against brute-force attacks (`express-rate-limit`).
- **HTTP Header Hardening**: Protection via `helmet` including strict CSP and XSS mitigation.
- **Strict Input Validation**: All incoming requests validated at the boundary via Zod schemas.
- **Safe File Upload Pipeline**: Mime-type sniffing, extension whitelisting, file size caps, and non-executable storage.
- **CORS Protection**: Restricted to authorized frontend origins.

---

## 📄 License
This project is open-source under the [MIT License](LICENSE).
#   i n t e r n s h i p  
 #   i n t e r n s h i p  
 