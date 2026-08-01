# Deployment Guide - Commercial SaaS Production

This guide covers deployment options for Frontend (Vercel), Backend (Railway & Docker + VPS), PostgreSQL Database, and PrintAgent packaging.

---

## 1. Deploying Backend API (Railway / Docker VPS)

### Option A: Railway Deployment
1. Connect your GitHub repository to Railway.
2. Add a **PostgreSQL** service plugin.
3. Configure environment variables in Railway:
   ```env
   PORT=5000
   NODE_ENV=production
   DATABASE_URL=${POSTGRESQL_URL}
   JWT_SECRET=your-production-jwt-secret
   BASE_SERVER_URL=https://api.yourdomain.com
   FRONTEND_URL=https://print.yourdomain.com
   RAZORPAY_KEY_ID=rzp_live_xxx
   RAZORPAY_KEY_SECRET=xxx
   ```
4. Run Prisma database migration build command:
   ```bash
   npx prisma migrate deploy
   ```

### Option B: Docker + VPS Deployment (Recommended for High Scale)
1. Copy project files to your Ubuntu VPS (`/var/www/autoprint`).
2. Update `.env` with production keys and domain names.
3. Launch with Docker Compose:
   ```bash
   docker-compose up -d --build
   ```

---

## 2. Deploying Frontend Web Portal (Vercel)

1. Import the `frontend/` folder into Vercel.
2. Set Build Command: `npm run build`
3. Set Output Directory: `dist`
4. Configure Environment Variables in Vercel:
   ```env
   VITE_API_BASE_URL=https://api.yourdomain.com/api/v1
   ```
5. Deploy to Production.

---

## 3. Building Standalone Portable `PrintAgent.exe`

Execute on a Windows machine or CI/CD runner:
```bash
cd print-agent
npm install
npm run build:exe
```

The output single portable executable will be placed in `print-agent/dist/PrintAgent.exe`. Upload this executable binary to your backend storage server so Cyber Cafe owners can download it with 1-click from their dashboard.
