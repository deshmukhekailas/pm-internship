# 🇮🇳 AI-Based Internship Recommendation Engine
### For Prime Minister's National Internship Scheme (PMIS)

[![Node.js](https://img.shields.io/badge/Node.js-v20+-green.svg?logo=node.js)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18.x-61DAFB.svg?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg?logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5.x-646CFF.svg?logo=vite)](https://vitejs.dev/)
[![Prisma](https://img.shields.io/badge/Prisma-5.22.0-2D3748.svg?logo=prisma)](https://www.prisma.io/)
[![MongoDB Atlas](https://img.shields.io/badge/MongoDB_Atlas-Replica_Set-47A248.svg?logo=mongodb)](https://www.mongodb.com/atlas)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.x-38B2AC.svg?logo=tailwind-css)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

---

## 📌 Table of Contents

- [Overview & Vision](#-overview--vision)
- [System Architecture](#-system-architecture)
- [Key Features](#-key-features)
  - [Candidate Portal](#1-candidate--student-experience)
  - [Administrative & Ministry Portal](#2-administrative--ministry-portal)
  - [AI Recommendation & Eligibility Engine](#3-intelligent-ai-recommendation-engine)
- [Partner Corporations & Live Database](#-partner-corporations--live-database)
- [Technology Stack](#-technology-stack)
- [Repository Structure](#-repository-structure)
- [Getting Started & Local Setup](#-getting-started--local-setup)
- [Environment Configuration](#-environment-configuration)
- [NPM Scripts Reference](#-npm-scripts-reference)
- [Default Demo Credentials](#-default-demo-credentials)
- [API Endpoints Overview](#-api-endpoints-overview)
- [Security & Compliance](#-security--compliance)
- [License & Acknowledgment](#-license--acknowledgment)

---

## 🌟 Overview & Vision

The **Prime Minister's Internship Scheme (PMIS)** is an ambitious national initiative by the Government of India designed to empower youth across the country by offering 1 crore valuable corporate internship opportunities over 5 years across India's top 500 leading companies.

Matching millions of young candidates with diverse qualifications (High School, ITI, Polytechnic Diplomas, BA, B.Sc, B.Com, B.Tech, MCA) across 28+ states and union territories with specialized industry roles presents severe challenges:
1. **Scale & Heterogeneity**: Thousands of companies publish roles requiring varying prerequisite skills and degree disciplines.
2. **Fairness & Constitutional Eligibility**: Strict rules apply regarding age (21–24), qualification thresholds, and scheme quotas.
3. **Explainability**: Students need transparent reasons for why a role was recommended and actionable guidance on bridging any skill gaps.

This project delivers an end-to-end, enterprise-grade **AI-Based Internship Recommendation Engine** featuring:
- A **Deterministic Multi-Constraint Eligibility Engine** enforcing mandatory scheme qualifications, semantic branch equivalence, age rules, and pan-India geographic criteria.
- An **Explainable Multi-Factor Scoring Engine** that combines vector-space **TF-IDF cosine similarity**, skill gap quantification, degree branch alignment, location preference, and career aspirations into a transparent 0–100% compatibility rating.
- A modern, accessible candidate and administrative web experience built strictly in compliance with official National Informatics Centre (NIC) and Government of India digital design patterns.

---

## 🏗️ System Architecture

```
                       +-------------------------------------------------+
                       |            Candidate & Admin Portals            |
                       |       React 18 + Vite + Tailwind CSS + Lucide   |
                       +-------------------------------------------------+
                                                |
                                        REST API / HTTPS
                                                |
                                                v
                       +-------------------------------------------------+
                       |               Express.js Backend API            |
                       |      Node.js + TypeScript + Helmet + CORS       |
                       +-------------------------------------------------+
                         |                      |                      |
                         v                      v                      v
              +--------------------+  +--------------------+  +--------------------+
              |   Authentication   |  | Recommendation     |  | Administrative     |
              |   & Verification   |  | Advisory Engine    |  | Analytics & Quota  |
              |  - JWT (Access+Ref)|  |  - Feature Extractor|  |  - Dynamic Weights |
              |  - SMTP Email OTP  |  |  - Eligibility Check|  |  - Model Switcher  |
              |  - Google OAuth 2.0|  |  - Vector TF-IDF    |  |  - Platform Metrics|
              +--------------------+  |  - Skill Gap Radar  |  +--------------------+
                                      +--------------------+
                                                |
                                       Prisma ORM Client
                                                |
                                                v
                       +-------------------------------------------------+
                       |             MongoDB Atlas Database              |
                       |   - 40+ Partner Corporations                    |
                       |   - 90+ Live Multi-Disciplinary Roles           |
                       |   - 89 Technical & Industry Skills              |
                       |   - Dynamic Recommendation Config Matrix        |
                       +-------------------------------------------------+
```

---

## ✨ Key Features

### 1. Candidate / Student Experience
- **Smart Profile Builder**: Seamlessly capture education history (degree, branch, CGPA, graduation year), technical and soft skills, portfolio projects, prior experience, and geographic/work-mode preferences.
- **Secure Dual Authentication**:
  - **Email OTP Verification**: Real-time 6-digit OTP delivery via SMTP with expiration tracking and rate limiting.
  - **Google OAuth 2.0**: Fast, secure single sign-on using verified Google accounts.
- **Personalized AI Career Advisory**: Top internships ordered descending by compatibility score (0–100%) with verified eligibility badges (`ELIGIBLE`, `NOT_ELIGIBLE`, `UNKNOWN`).
- **Explainable AI Breakdown**: Modal detailing individual factor scores (Skills, Academic Readiness, Domain, Location, and Experience) along with plain-language rationales.
- **Skill Gap Radar & Learning Roadmaps**: Real-time identification of missing required and preferred skills with direct curated learning recommendations (SWAYAM, NPTEL, FreeCodeCamp, W3Schools, Kaggle).
- **One-Click Application & Real-Time Tracking**: Submit applications with cover notes and track application status (`APPLIED`, `UNDER_REVIEW`, `SHORTLISTED`, `ACCEPTED`, `REJECTED`).
- **Bookmark & Save Roles**: Save internships to review and apply later.
- **Interactive FAQ & Help Center**: Clarifies common PM Scheme inquiries (eligibility, stipend, certificate issuance) directly without burdensome contact forms.

### 2. Administrative & Ministry Portal
- **Real-Time KPI Dashboard**: At-a-glance analytics tracking registered candidates, participating corporate partners, published openings, and total applications.
- **Live AI Calibration Panel**: Dynamically adjust recommendation factor weights without restarting the server:
  - Skill Weight
  - Education Weight
  - Domain Weight
  - Location Weight
  - Experience Weight
  - Career Goal Weight
  - Preference Weight
  - Minimum Compatibility Score Threshold
- **AI Model Switcher**: Hot-swap between **Local Vector ML (TF-IDF)**, **Rule-Based**, **Hybrid**, or **Google Gemini LLM** inference.
- **Opportunity Moderation**: Publish, modify, and review corporate internship postings and monitor affirmative action quota allocations.

### 3. Intelligent AI Recommendation Engine
1. **Deterministic Eligibility Evaluation**:
   - Compares academic level, degree equivalence (B.Tech / B.E. / BCA / B.Sc), and semantic branch synonym groups (e.g. *Computer Engineering* $\leftrightarrow$ *Computer Science* $\leftrightarrow$ *Information Technology* $\leftrightarrow$ *Software Engineering*).
   - Enforces age limits (21–24 years) and graduation eligibility windows (with allowances for currently enrolled students).
   - Validates mandatory prerequisite skills with alias awareness (`C++` / `CPP`, `JS` / `JavaScript`, `React` / `React.js`).
   - Ensures pan-India geographic inclusivity (`All India` allows all 28 states and 8 union territories).
2. **Feature Extraction & Multi-Factor Scoring**:
   - Converts candidate profile documents and internship requirements into normalized feature vectors.
   - Computes weighted score contributions:
     $$\text{Score} = \sum (\text{Factor Score}_i \times \text{Normalized Weight}_i)$$
   - Analyzes experience and project narratives using Vector Space TF-IDF Cosine Similarity.
3. **Fresh Candidate Fallback**:
   - Automatically surfaces top explore/starter opportunities for newly registered students who have not yet fully completed their profiles, guiding them on how adding skills boosts compatibility.

---

## 🏢 Partner Corporations & Live Database

The platform includes seed data for **40 top Indian corporate enterprises** and **90 live technical and engineering internships**:

| Sector | Example Partner Enterprises |
| :--- | :--- |
| **Information Technology & Software** | Tata Consultancy Services (TCS), Infosys Limited, Wipro Limited, Tech Mahindra, HCL Technologies |
| **Banking & Financial Services** | State Bank of India (SBI), HDFC Bank, ICICI Bank, Axis Bank, Punjab National Bank |
| **Aerospace, Electronics & Defense** | Defence Research and Development Organisation (DRDO), Bharat Electronics Limited (BEL), Hindustan Aeronautics (HAL) |
| **Automotive & Manufacturing** | Tata Motors, Mahindra & Mahindra, Bosch India, Cummins India, Maruti Suzuki |
| **Energy, Petroleum & Infrastructure** | Reliance Industries Limited (Jio), Larsen & Toubro (L&T), Bharat Petroleum (BPCL), Oil & Natural Gas Corp (ONGC) |
| **Power & Automation** | Schneider Electric India, NTPC Limited, Power Grid Corporation of India, BHEL |
| **Pharmaceuticals & Healthcare** | Dr. Reddy's Laboratories, Sun Pharma, Cipla Limited |

---

## 💻 Technology Stack

### Frontend
- **Framework**: React 18 with TypeScript
- **Bundler & Tooling**: Vite 5
- **Styling**: Tailwind CSS 3 with official Government of India tri-color theme palette (`#0B2545` Navy, `#FF9933` Saffron, `#138808` Green)
- **Icons**: Lucide React
- **Routing**: React Router DOM v6
- **HTTP Client**: Axios with JWT authentication interceptors

### Backend
- **Runtime**: Node.js (v20+ recommended)
- **Framework**: Express.js with TypeScript
- **Database ORM**: Prisma ORM (v5.22.0)
- **Database Engine**: MongoDB Atlas (Replica Set) via `prisma/schema.mongo.prisma`
- **Security**: Helmet, CORS, Express Rate Limit, BCrypt.js password hashing
- **Validation**: Zod schema validation middleware
- **Email Service**: Nodemailer for SMTP OTP delivery
- **AI / NLP**: Custom in-memory TF-IDF Vector Cosine Similarity Engine & Google Gemini Generative AI SDK (`@google/generative-ai`)

---

## 📂 Repository Structure

```
pm-internship/
├── .env.example                      # Root environment reference
├── .gitignore                        # Git exclusion rules (node_modules, reports, env, etc.)
├── package.json                      # Workspace orchestration scripts
├── README.md                         # Project documentation
│
├── backend/                          # Backend Express + TypeScript Service
│   ├── .env.example                  # Backend environment template
│   ├── package.json                  # Backend dependencies and scripts
│   ├── tsconfig.json                 # TypeScript compiler configuration
│   ├── prisma/
│   │   ├── schema.mongo.prisma       # Active MongoDB Atlas Prisma schema
│   │   ├── schema.prisma             # PostgreSQL / generic relational schema
│   │   └── schema.sqlite.prisma      # Local SQLite fallback schema
│   └── src/
│       ├── ai/                       # AI Factory, Gemini LLM, and Local ML services
│       ├── config/                   # Database, environment, and constants
│       ├── controllers/              # Request handlers (auth, recommendation, internship, admin)
│       ├── middleware/               # Auth (JWT), roles, rate limiting, and validation
│       ├── recommendation/           # ScoringEngine, EligibilityEngine, FeatureExtractor, TF-IDF
│       ├── routes/                   # Express API routing definitions
│       ├── scripts/                  # Production seed scripts for MongoDB Atlas
│       ├── services/                 # Business logic, OTP, email, and recommendation app service
│       ├── utils/                    # API response formatters, token generators
│       ├── validators/               # Zod validation schemas
│       ├── app.ts                    # Express application entrypoint
│       └── server.ts                 # HTTP server listener
│
└── frontend/                         # Frontend React 18 + Vite SPA
    ├── .env.example                  # Frontend environment template
    ├── package.json                  # Frontend dependencies and scripts
    ├── tsconfig.json                 # TypeScript compiler configuration
    ├── vite.config.ts                # Vite build configuration
    ├── tailwind.config.js            # Government theme color extensions
    ├── public/                       # Favicons, logos, and static assets
    └── src/
        ├── api/                      # Axios client and interceptors
        ├── components/               # Common UI widgets, cards, modals, badges, layout
        ├── context/                  # AuthContext (JWT session state, login, logout)
        ├── pages/
        │   ├── admin/                # AdminDashboard, Calibration, Application Review
        │   ├── public/               # Home, About, Contact, FAQ, Login, Register
        │   └── student/              # StudentDashboard, Recommendations, Applications, Profile
        ├── types/                    # Frontend TypeScript interfaces
        ├── App.tsx                   # Main route tree
        └── main.tsx                  # React DOM mount point
```

---

## 🚀 Getting Started & Local Setup

### Prerequisites
- **Node.js**: v18.x or v20.x or higher
- **npm**: v9.x or higher
- **MongoDB Atlas Connection URI** (or local MongoDB replica set)

### 1. Clone the Repository
```bash
git clone https://github.com/deshmukhekailas/pm-internship.git
cd pm-internship
```

### 2. Backend Setup
```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env
# Edit .env with your MongoDB Atlas DATABASE_URL and JWT secrets

# Generate Prisma Client for MongoDB Atlas
npm run prisma:mongo:generate

# Push schema to MongoDB Atlas (if setting up fresh database)
npm run prisma:mongo:push

# Seed the master database with 40 companies, 90 internships, and 89 skills
npm run seed:clean

# Verify the database counts
npm run db:check

# Start backend development server
npm run dev
```
The backend API will start at: `http://localhost:5000` (Health check: `http://localhost:5000/health`)

### 3. Frontend Setup
Open a second terminal window:
```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env
# Ensure VITE_API_URL points to http://localhost:5000/api

# Start frontend development server
npm run dev
```
The frontend portal will be live at: `http://localhost:5173`

---

## ⚙️ Environment Configuration

### Backend (`backend/.env`)

| Variable | Description | Example / Default |
| :--- | :--- | :--- |
| `PORT` | Port for Express server | `5000` |
| `NODE_ENV` | Application runtime environment | `development` / `production` |
| `DATABASE_URL` | MongoDB Atlas replica set URI | `mongodb+srv://<user>:<pwd>@cluster.mongodb.net/pminternship?retryWrites=true&w=majority` |
| `JWT_SECRET` | Secret key for signing Access Tokens | Strong random string (64+ chars) |
| `JWT_EXPIRES_IN` | Access token lifetime | `15m` |
| `JWT_REFRESH_SECRET` | Secret key for Refresh Tokens | Strong random string (64+ chars) |
| `JWT_REFRESH_EXPIRES_IN` | Refresh token lifetime | `7d` |
| `CLIENT_URL` | Allowed CORS frontend origins | `http://localhost:5173` |
| `AI_PROVIDER` | Active recommendation provider | `LOCAL_ML` (Options: `LOCAL_ML`, `RULE_BASED`, `GEMINI`, `HYBRID`) |
| `GEMINI_API_KEY` | Optional: Google Gemini API Key | `AIzaSy...` (Optional for LLM mode) |
| `SMTP_HOST` | SMTP server for OTP delivery | `smtp.gmail.com` |
| `SMTP_PORT` | SMTP port | `587` |
| `SMTP_USER` | SMTP username / email address | `your-email@gmail.com` |
| `SMTP_PASS` | SMTP application password | `your-app-password` |

### Frontend (`frontend/.env`)

| Variable | Description | Example / Default |
| :--- | :--- | :--- |
| `VITE_API_URL` | Base endpoint of backend API | `http://localhost:5000/api` |
| `VITE_GOOGLE_CLIENT_ID` | Optional: Google OAuth Client ID | `your-google-client-id.apps.googleusercontent.com` |

---

## 📋 NPM Scripts Reference

### Root Directory
- `npm run dev:backend` — Starts backend server in watch mode
- `npm run dev:frontend` — Starts frontend Vite development server
- `npm run build:all` — Compiles both backend TypeScript and frontend Vite assets
- `npm run db:check` — Prints current MongoDB database record statistics
- `npm run seed:clean` — Runs clean seed script without dummy candidate accounts

### Backend Directory (`/backend`)
- `npm run dev` — Run server using `tsx watch`
- `npm run build` — Generate Prisma client and compile TypeScript with `tsc`
- `npm run start` — Run compiled production build from `dist/server.js`
- `npm run prisma:mongo:generate` — Generate Prisma Client from `schema.mongo.prisma`
- `npm run prisma:mongo:push` — Synchronize MongoDB collections and indexes
- `npm run test` — Run test suite via Vitest

### Frontend Directory (`/frontend`)
- `npm run dev` — Launch Vite dev server with hot module replacement
- `npm run build` — TypeScript typecheck and production bundle generation into `dist/`
- `npm run preview` — Locally serve production build

---

## 🔑 Default Demo Credentials

To test the system immediately with administrative permissions:

- **Portal URL**: `http://localhost:5173/login`
- **Super Administrator Email**: `admin@pminternship.gov.in`
- **Default Password**: `Admin@12345`

*Note: For student access, you can register a new candidate account via `/register` using email OTP or Google Sign-In, or log in with existing registered candidate profiles.*

---

## 📡 API Endpoints Overview

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Public | Register new candidate with profile basics |
| `POST` | `/api/auth/login` | Public | Authenticate with email/password; returns JWT |
| `POST` | `/api/auth/otp/send` | Public | Send 6-digit verification code to email |
| `POST` | `/api/auth/otp/verify` | Public | Verify code and generate authenticated session |
| `POST` | `/api/auth/google` | Public | Single Sign-On with verified Google Token |
| `GET` | `/api/recommendations` | Student | Fetch ranked recommendations with explanations |
| `POST` | `/api/recommendations/generate` | Student | Trigger AI recommendation recalculation |
| `GET` | `/api/recommendations/skill-gap` | Student | Retrieve aggregated skill gap radar and resources |
| `POST` | `/api/recommendations/:id/feedback` | Student | Submit calibration feedback on recommendation quality |
| `GET` | `/api/internships` | Public | Search and filter internships by domain, state, etc. |
| `GET` | `/api/internships/:id` | Public | Retrieve comprehensive internship requirements |
| `POST` | `/api/internships/:id/apply` | Student | Submit internship application |
| `GET` | `/api/student/profile` | Student | Retrieve personal student profile details |
| `PUT` | `/api/student/profile` | Student | Update education, skills, and preferences |
| `GET` | `/api/admin/dashboard` | Admin | Retrieve platform KPIs and analytics |
| `GET` | `/api/admin/config` | Admin | Retrieve active recommendation scoring weights |
| `PUT` | `/api/admin/config` | Admin | Calibrate scoring weights and minimum thresholds |

---

## 🔒 Security & Compliance

- **Authentication & Sessions**: Short-lived JSON Web Tokens (15 min) paired with cryptographically secure refresh tokens.
- **Header Protection**: Standard HTTP security headers enforced via `helmet`.
- **CORS Protection**: Dynamic origin allowlisting ensuring only authorized frontend domains communicate with the API.
- **Rate Limiting**: Rate limiters placed on public authentication and OTP dispatch routes to prevent brute-force attacks.
- **Data Protection**: Passwords securely salted and hashed using `bcryptjs` (salt rounds: 12).
- **Type Safety**: End-to-end TypeScript enforcement across all entities, API responses, and database transactions.

---

## 📜 License & Acknowledgment

This project is developed as part of the **Engineering Major Project** showcasing modern, transparent, and scalable Artificial Intelligence solutions for national public benefit initiatives.

Licensed under the [MIT License](LICENSE).
