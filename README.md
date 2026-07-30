# Baher Silver ERP Enterprise System v4.0

Enterprise Resource Planning (ERP), Manufacturing, Digital Product Passport (DPP), and Customer Portal System built for **Baher Silver Jewellery & Bullion Factory**.

---

## 🚀 Quick Startup Guide (Single Command)

To clone and start the system on a clean Windows/Linux/macOS machine:

```bash
# 1. Install Node.js dependencies
npm install
cd apps/api-backend && npm install && cd ../..

# 2. Synchronize Database Schema (SQLite dev.db)
npm run db:push

# 3. Seed Master Data & Admin Credentials
npm run seed

# 4. Start Full Enterprise Application (Backend API + Web App)
npm start
```

Once started:
- **Web App URL**: `http://localhost:4000`
- **Backend API Health Check**: `http://localhost:4000/health`
- **Default Login Credentials**:
  - Username: `admin` | Password: `Admin@Baher2026`
  - Username: `baher` | Password: `michael`

---

## 🏛️ Architecture & Services

- **Unified Server**: Express.js REST API Engine running on Port 4000, serving both `/api/v1` REST endpoints and static SPA web assets (`index.html`, `customer_portal.html`, `passport.html`).
- **Database Layer**: SQLite database (`apps/api-backend/prisma/dev.db`) managed via Prisma ORM v5.22.
- **Frontend Layer**: Modular Vanilla CSS Design Tokens system with 11 stylesheets in `css/`, 9 reusable JavaScript component modules in `js/components/`, `Ctrl+K` Command Palette, and Multi-Tab Navigation.
- **Hardware Integration Layer (HAL)**: Drivers for XRF Spectrometers, Digital HAL Scale (0.001g sensitivity), and Zebra 600DPI Barcode Label Printers.

---

## 📜 Available NPM Scripts

- `npm start` — Launches the unified Enterprise API Server & Web App on `http://localhost:4000`.
- `npm run dev` — Development mode server with ts-node-dev auto-reload.
- `npm run db:push` — Pushes Prisma schema to `dev.db` and generates TypeScript Prisma Client.
- `npm run seed` — Populates 7 core factory warehouses, standard Chart of Accounts, and master items.
- `npm run build` — Compiles TypeScript backend to `dist/`.

---

## 🏷️ Version

- **Current Version**: `v4.0.0-Enterprise`
- **Status**: Stable Production Release
