# 🚀 Complete Free Online Deployment Guide

This guide explains how to deploy both the **Backend** and **Frontend** online **100% for free** using **Render** (or Koyeb) and **Vercel** with your existing **MongoDB Atlas** database.

---

## 🏗️ Architecture Overview

| Component | Recommended Free Host | Free Tier Benefits |
| :--- | :--- | :--- |
| **Database** | **MongoDB Atlas** | 512 MB Free Cluster (M0), persistent, already active |
| **Backend API** | **Render.com** | 750 free compute hours/month, automatic HTTPS |
| **Frontend UI** | **Vercel** | Unlimited deployments, global Edge CDN, automatic HTTPS |

---

## 🛠️ Step 0: Push Code to GitHub

If your project is not yet on GitHub:

1. Open your terminal in the project root:
   ```bash
   cd "C:\Users\deshm\Documents\Major Project\pm-internship"
   ```
2. Initialize and commit all files:
   ```bash
   git add .
   git commit -m "feat: ready for production free deployment"
   ```
3. Create a new repository on [GitHub](https://github.com/new) (e.g. `pm-internship`).
4. Link and push:
   ```bash
   git remote add origin https://github.com/<YOUR_GITHUB_USERNAME>/pm-internship.git
   git branch -M main
   git push -u origin main
   ```

---

## 📦 Step 1: Deploy Backend on Render (Free)

1. Sign up / Log in to [Render.com](https://render.com) using your GitHub account.
2. In the Render Dashboard, click **New +** → **Web Service**.
3. Select **Build and deploy from a Git repository** and connect your `pm-internship` repo.
4. Fill in the service configuration:
   - **Name**: `pm-internship-api` (or any preferred name)
   - **Region**: `Singapore` or `Frankfurt` (choose closest to your users)
   - **Branch**: `main`
   - **Root Directory**: `backend`
   - **Runtime**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Instance Type**: `Free` ($0/month)
5. Scroll down to **Environment Variables** and add the following:

   | Key | Value | Notes |
   | :--- | :--- | :--- |
   | `NODE_ENV` | `production` | Enables production optimizations |
   | `PORT` | `5000` | Render will bind to this port |
   | `DATABASE_URL` | *Your MongoDB Atlas connection string* | Found in `backend/.env` |
   | `JWT_SECRET` | *Your JWT secret key* | Copy from `backend/.env` |
   | `JWT_REFRESH_SECRET` | *Your Refresh secret key* | Copy from `backend/.env` |
   | `AI_PROVIDER` | `LOCAL_ML` | Runs fast in-memory TF-IDF AI engine |
   | `CLIENT_URL` | `http://localhost:5173` | *(Update this in Step 3 after getting Vercel URL)* |
   | `SMTP_HOST` | `smtp.gmail.com` | Optional: for real email OTP |
   | `SMTP_PORT` | `587` | Optional |
   | `SMTP_USER` | *your-email@gmail.com* | Optional |
   | `SMTP_PASS` | *your-gmail-app-password* | Optional |

6. Click **Create Web Service**.
7. Wait 2–3 minutes for the build to finish. Once live, Render will provide a public URL like:
   `https://pm-internship-api.onrender.com`
8. Test your backend health by visiting in your browser:
   `https://pm-internship-api.onrender.com/health` (should return `{"status":"HEALTHY",...}`)

---

## 🌐 Step 2: Deploy Frontend on Vercel (Free)

1. Sign up / Log in to [Vercel.com](https://vercel.com) using your GitHub account.
2. In the Vercel Dashboard, click **Add New...** → **Project**.
3. Import your `pm-internship` repository from GitHub.
4. Configure the project settings:
   - **Framework Preset**: `Vite` (automatically detected)
   - **Root Directory**: Click **Edit** and select `frontend`
   - **Build Command**: `npm run build` (default)
   - **Output Directory**: `dist` (default)
5. Under **Environment Variables**, add:

   | Key | Value | Example |
   | :--- | :--- | :--- |
   | `VITE_API_URL` | *Your Render Backend URL + `/api`* | `https://pm-internship-api.onrender.com/api` |

6. Click **Deploy**.
7. In ~1 minute, Vercel will deploy your site and provide a live URL, for example:
   `https://pm-internship.vercel.app`

---

## 🔄 Step 3: Link Frontend & Backend

1. Copy your new Vercel URL (e.g. `https://pm-internship.vercel.app`).
2. Go back to your [Render Dashboard](https://dashboard.render.com) → click your `pm-internship-api` service.
3. Go to **Environment** tab.
4. Update `CLIENT_URL` with your Vercel URL:
   - `CLIENT_URL` = `https://pm-internship.vercel.app`
5. Click **Save Changes** (Render will automatically redeploy with the updated CORS policy).

---

## ✨ Features Ready for Production

- **Single Page App Routing**: `vercel.json` and `_redirects` ensure direct navigation to `/login`, `/register`, `/student/dashboard`, and `/admin/dashboard` never return 404 on refresh.
- **Dynamic CORS**: The backend automatically allows your Vercel production domain and preview URLs.
- **Prisma & MongoDB**: Pre-compiled client generates cleanly during cloud builds.
- **Admin Access**: Sign in with `admin@pminternship.gov.in` and `Admin@12345`.
