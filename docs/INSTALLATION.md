# Local Development & Installation Guide

Follow these steps to run the complete Multi-Tenant SaaS platform locally on your machine.

---

## Prerequisites
- Node.js (v18.x or higher)
- PostgreSQL Database
- Git

---

## 1. Setup Backend API

```bash
# Navigate to backend folder
cd backend

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env

# Generate Prisma Client & Migrate Database
npx prisma migrate dev --name init

# Start backend server in development mode
npm run dev
```

The backend server will start at `http://localhost:5000`.

---

## 2. Setup Frontend Web Portal

```bash
# Open new terminal and navigate to frontend folder
cd frontend

# Install dependencies
npm install

# Start Vite dev server
npm run dev
```

The React Web Portal will start at `http://localhost:5173`.

---

## 3. Setup & Test Print Agent

```bash
# Open new terminal and navigate to print-agent folder
cd print-agent

# Install dependencies
npm install

# Launch Agent in setup GUI mode
npm start
```

1. Browser will open `http://localhost:49152`.
2. Enter Backend URL: `http://localhost:5000`
3. Enter Agent Token (`ag_...` generated from Cyber Cafe Dashboard).
4. Select your Windows Printer.
5. Click **Save & Run Silent Agent**.
