# Multi-Tenant SaaS Auto Print Platform for Cyber Cafes

A commercial, production-ready Multi-Tenant SaaS platform that empowers Cyber Cafes to offer instant online mobile printing to their customers. Customers scan a counter QR code on their mobile phone, upload a PDF document, configure page ranges, copies, and color mode, pay via Razorpay, and silently print the file directly on the Cyber Cafe's laptop printer via a portable Windows `PrintAgent.exe`.

---

## Key Features

- 🏢 **Isolated Multi-Tenant Architecture**: Each Cyber Cafe receives its own unique Website URL (`/cafe/:slug`), Backend API URL, API Secret Key (`pk_...`), Agent Token (`ag_...`), and isolated database print queue.
- 🚀 **Real-time Print Agent (WebSocket + Polling Fallback)**: Built with Socket.IO for sub-second print job dispatch and seamless HTTP long-polling fallback.
- 🖨️ **Portable Windows `PrintAgent.exe`**: Zero dependencies required on target laptop (No Node.js installation needed!). Portable EXE runs in System Tray, auto-starts on Windows boot, and silently prints on saved Windows printers.
- 🔐 **Hardware Device Security & Fingerprinting**: Registers signed hardware fingerprints (MAC, CPU UUID, Hostname) to bind executables securely to authorized laptops.
- 📱 **Customer Mobile Web App**: Drag & drop PDF uploader with client-side PDF.js preview, page range parser (`1-3,5`), B&W vs. Color price calculator, and Razorpay checkout popup.
- ⏰ **10-Minute PDF TTL & Auto-Purge**: Deletes PDF files immediately post-print confirmation, or automatically purges expired uncollected files after 10 minutes via background cron.
- 📊 **Cyber Cafe Dashboard & QR Standee Generator**: View today's print count, revenue earned, printer online status, credentials, download pre-configured agents, and generate printable counter QR standees.
- 🛡️ **Super Admin Dashboard**: Platform analytics, global metrics, and account management.
- 🐳 **Docker + VPS Ready**: Production-ready `Dockerfile` and `docker-compose.yml` for high-volume VPS hosting.

---

## Directory Structure

```text
malti print center/
├── backend/
│   ├── prisma/
│   │   └── schema.prisma        # PostgreSQL Multi-Tenant Database Schema
│   ├── src/
│   │   ├── config/              # Prisma DB Client
│   │   ├── controllers/         # Auth, Public, Cafe, Admin & Agent Controllers
│   │   ├── middleware/          # JWT Auth, Tenant Resolution & Rate Limiting
│   │   ├── routes/              # Express API Routes
│   │   ├── services/            # Socket.IO Gateway & 10-Min PDF Purge Cron
│   │   ├── utils/               # Token Generator & QR Code Service
│   │   └── index.js             # Express Server Bootstrap
│   ├── Dockerfile
│   ├── package.json
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── components/          # Navbar, PDF Previewer, Tracker Modal, QR Modal
│   │   ├── pages/               # Customer Portal, Cafe Dashboard, Admin Dashboard
│   │   ├── services/            # Axios API Client
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── vite.config.js
│   └── tailwind.config.js
├── print-agent/
│   ├── src/
│   │   ├── agent.js             # Main Print Agent Engine
│   │   ├── hardwareFingerprint.js # SHA-256 Hardware Fingerprinting
│   │   ├── printerService.js    # Silent Printer & SumatraPDF Engine
│   │   ├── autoStartService.js  # Windows Boot Registry Setup
│   │   ├── configManager.js     # APPDATA Config Persistence
│   │   └── gui.js               # First Launch Setup GUI Screen
│   ├── build.js                 # Pkg Single EXE Compiler Script
│   └── package.json
├── docs/
│   ├── API.md                   # Complete REST & Realtime API Specs
│   ├── DEPLOYMENT.md            # Vercel, Railway & Docker VPS Guides
│   └── INSTALLATION.md          # Local Setup Walkthrough
├── docker-compose.yml
└── README.md
```

---

## Quick Start

See [docs/INSTALLATION.md](file:///c:/Users/mdsha/Desktop/Antigravity/malti%20print%20center/docs/INSTALLATION.md) for local development instructions and [docs/DEPLOYMENT.md](file:///c:/Users/mdsha/Desktop/Antigravity/malti%20print%20center/docs/DEPLOYMENT.md) for production hosting.

---

## Security Audit

- All multi-tenant queries filter strictly by `tenantId`.
- Rate limiting active on upload and payment endpoints.
- Agent tokens verified via HMAC signatures and hardware device hashes.
- PDF files auto-purged from disk post-print or after 10-minute TTL.
