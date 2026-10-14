# Production Deployment Guide
## AI-Based Internship Recommendation Engine for PM Internship Scheme

This document provides step-by-step instructions for deploying the full-stack system to production.

---

## 🏗️ Architecture Overview

The system consists of two primary components:
1. **Backend API (`/backend`)**:
   - Runtime: Node.js (v20+) / Express / TypeScript
   - ORM: Prisma ORM with native support for MongoDB Atlas (or PostgreSQL / SQLite)
   - AI Engine: Local ML Vector TF-IDF + Cosine Similarity with optional Google Gemini LLM fallback
2. **Frontend Web App (`/frontend`)**:
   - Framework: React 18 / Vite / TypeScript / Tailwind CSS
   - Production Build: Static SPA served via Nginx or CDN (Vercel, Netlify, Cloudflare Pages)

---

## 🗄️ Database: MongoDB Atlas (Current Configured Database)

### 1. Connection String Format
In `backend/.env` (or cloud dashboard environment settings):
```bash
DATABASE_URL="mongodb+srv://<username>:<password>@<cluster>.mongodb.net/pminternship?retryWrites=true&w=majority&appName=Intership"
```
*Note: Always make sure the database name (e.g. `/pminternship`) is included after `.mongodb.net` before query parameters.*

### 2. Schema Synchronization & Prisma Client Generation
```bash
cd backend
npm run prisma:mongo:push
npm run prisma:mongo:generate
```

### 3. Production Clean Seeding (Zero Candidate Records)
To initialize the database with official scheme master data (40 skills, 16 organizations, 52 internships, recommendation configuration, and the Super Admin account) with **0 dummy candidate profiles**:
```bash
cd backend
npm run seed:clean
```

To verify the database state at any time:
```bash
npm run db:check
```
Expected output:
```text
📊 Current Database State:
  Users: 1 (Super Admin)
  Student Profiles: 0 (Clean & ready for public registration)
  Admins: 1
  Organizations: 16
  Internships: 52
  Skills: 40
  Applications: 0
```

---

## 🚀 Option 1: Docker Deployment (Recommended for VPS / Cloud VM)

The project includes multi-stage Dockerfiles and a `docker-compose.yml` for turnkey container deployment.

### Steps:
1. Clone the repository on your server:
   ```bash
   git clone <your-repo-url>
   cd intership
   ```
2. Configure `.env` in the root directory:
   ```bash
   cp .env.example .env
   # Edit .env with your production values and DATABASE_URL
   ```
3. Build and launch containers:
   ```bash
   docker compose up -d --build
   ```
4. Verify running health:
   ```bash
   docker compose ps
   ```
   - Frontend is accessible at: `http://<your-server-ip>:3000` (or configured reverse proxy port 80/443).
   - Backend API is accessible at: `http://<your-server-ip>:5000/api/health`.

---

## ☁️ Option 2: Cloud PaaS Deployment (Render / Railway / Vercel)

### Backend Deployment (Render or Railway):
1. **Root Directory**: `backend`
2. **Build Command**: 
   ```bash
   npm install && npm run prisma:mongo:generate && npm run build
   ```
3. **Start Command**: 
   ```bash
   npm run start
   ```
4. **Environment Variables**:
   | Variable | Value |
   |---|---|
   | `NODE_ENV` | `production` |
   | `PORT` | `5000` (or assigned by platform) |
   | `DATABASE_URL` | Your MongoDB Atlas connection string |
   | `JWT_SECRET` | Super secure random string (32+ chars) |
   | `JWT_REFRESH_SECRET` | Super secure random string (32+ chars) |
   | `CLIENT_URL` | Your production frontend URL (e.g. `https://pminternship.vercel.app`) |
   | `AI_PROVIDER` | `LOCAL_ML` (or `GEMINI` / `HYBRID`) |
   | `GEMINI_API_KEY` | *(Optional)* Google Gemini API key if using LLM |

### Frontend Deployment (Vercel or Netlify):
1. **Root Directory**: `frontend`
2. **Build Command**: `npm run build`
3. **Output Directory**: `dist`
4. **Environment Variables**:
   | Variable | Value |
   |---|---|
   | `VITE_API_URL` | Your deployed backend URL (e.g. `https://pminternship-api.onrender.com/api`) |

---

## 🛡️ Production Security & Performance Best Practices

1. **JWT Secret Entropy**:
   Generate secure 256-bit random keys for production:
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```
2. **CORS Hardening**:
   Ensure `CLIENT_URL` strictly matches your frontend domain in production so unauthorized websites cannot call API endpoints.
3. **Admin Credential Rotation**:
   The default super admin account is:
   - Email: `admin@pminternship.gov.in`
   - Default Password: `Admin@12345`
   Immediately log in upon deployment and update the password or create dedicated regional administrator accounts through the Admin Console.
4. **Database Backups**:
   Enable continuous backup snapshots in MongoDB Atlas cluster settings.

---

## 📋 Post-Deployment Verification Checklist

- [ ] Healthcheck endpoint responds: `GET /api/health` -> `{"status":"ok"}`
- [ ] Database check script confirms 0 dummy students: `npm run db:check`
- [ ] Super Admin login succeeds: `/login` using `admin@pminternship.gov.in`
- [ ] Public internship catalogue loads: `/internships` displays 52 verified scheme positions
- [ ] Candidate registration functions end-to-end: `/register` -> profile creation -> recommendation generation
- [ ] Responsive design verified on desktop, tablet, and mobile browsers
