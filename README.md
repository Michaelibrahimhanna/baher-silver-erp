# Baher Silver ERP System (مصنع باهر سيلفر - نظام إداري ومحاسبي متكامل)

[![Version](https://img.shields.io/badge/version-v0.1.0--alpha-orange.svg)](CHANGELOG.md)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Database](https://img.shields.io/badge/database-PostgreSQL%20%7C%20Prisma-blueviolet.svg)](database/)
[![Build Status](https://img.shields.io/badge/build-passing-brightgreen.svg)]()

Enterprise Resource Planning (ERP) & Double-Entry Accounting System built for **Baher Silver Jewellery & Bullion Factory**.

---

## 📌 Project Overview

Baher Silver ERP is an enterprise-grade industrial ERP system engineered specifically for raw silver processing, gemstones management, workshop casting operations, and double-entry accounting. It provides 100% strict warehouse isolation across 7 core factory warehouses, live weight tracking in grams and kilograms, and real-time integration with a standard Chart of Accounts.

---

## 🏛️ Architecture

The system utilizes a modern decoupled monorepo architecture:
- **Backend API Layer**: Express.js REST API with Prisma ORM connecting to PostgreSQL.
- **Frontend SPA Layer**: Lightweight, high-performance Single Page Application with Vanilla CSS tokenized design system and interactive modals.
- **Database Layer**: Centralized PostgreSQL engine with version-controlled migrations and seed data.
- **Accounting Matrix**: Automated double-entry general ledger posting for all physical inventory receipts, dispatches, and workshop casting activities.

---

## 📁 Folder Structure

```text
baher-silver-erp/
├── apps/
│   ├── backend/             # Express.js REST API Engine & Controllers
│   └── frontend/            # Single Page Application (SPA) & Tailwind/Vanilla CSS
├── database/
│   ├── prisma/              # Primary PostgreSQL Prisma Schema (`schema.prisma`)
│   ├── migrations/          # Version-controlled database migration history
│   ├── seed/                # Standard Chart of Accounts & initial seed data
│   └── backup/              # Daily, manual, and recovery backup utilities
├── docs/                    # Architecture, setup, migration, and rollback documentation
├── assets/                  # Logos, icons, and design artifacts
├── scripts/                 # Automated deployment, migration check, & backup scripts
├── README.md                # Master Enterprise Documentation
├── CHANGELOG.md             # Version Release History (`v0.1.0-alpha`)
├── LICENSE                  # MIT License
└── .gitignore               # Version control rules
```

---

## 🛠️ Technology Stack

- **Frontend**: HTML5, Vanilla JavaScript (ES6+), Vanilla CSS (Design Tokens, Glassmorphism).
- **Backend**: Node.js, Express.js, TypeScript.
- **ORM & Database**: Prisma ORM, PostgreSQL (Development, Testing, Production).
- **Tooling & Deployment**: Puppeteer (E2E Automated Testing), PM2, NGINX.

---

## 🚀 Installation Guide

### 1. Clone Repository & Checkout Branch
```bash
git clone https://github.com/baher-silver/baher-silver-erp.git
cd baher-silver-erp
git checkout develop
```

### 2. Install Backend Dependencies
```bash
cd apps/backend
npm install
```

### 3. Configure Environment Variables
```bash
cp .env.example .env
```
Ensure `DATABASE_URL` is set to your PostgreSQL instance.

---

## 🗄️ Database Setup

Run Prisma migrations and populate standard seed data:
```bash
# Apply migrations
npx prisma migrate dev --name init

# Seed Chart of Accounts & 7 Warehouses
npx prisma db seed
```

---

## ⚡ Backend Services

To run the REST API server locally:
```bash
cd apps/backend
npm run dev
```
The server listens on `http://localhost:3001/api`.

---

## 🖥️ Frontend Services

To serve the frontend Single Page Application locally:
```bash
npx serve -l 3000 ./frontend
```
Access the dashboard at `http://localhost:3000`.

---

## 🔄 Development Workflow & Git Branching Policy

We strictly adhere to GitFlow version control for all feature development:

- **`main`**: Production-ready release branch (stable tagged releases only).
- **`develop`**: Primary integration branch for active development.
- **Feature Branches**:
  - `feature/master-data`: Master Data Center & Category Configuration.
  - `feature/warehouse`: Enterprise 7 Warehouses & Location Hierarchy.
  - `feature/stones`: Gemstone Inventory & Dual File/Cam Picker.
  - `feature/raw-materials`: Workshop Supplies & Chemicals.
  - `feature/components`: Silver Findings, Earring Findings & Locks.
  - `feature/production`: Casting Workshop Trees & Batch Dispatches.
  - `feature/sales`: Wholesale Silver Jewellery Sales & Invoicing.
  - `feature/purchasing`: Silver Bullion & Raw Supplies Purchasing.
  - `feature/reports`: Executive Analytics & Accounting Reports.

---

## 🏷️ Versioning Policy

This project follows [Semantic Versioning 2.0.0](https://semver.org/):
- **Current Version**: `v0.1.0-alpha`
- **Format**: `vMAJOR.MINOR.PATCH-PRERELEASE`
  - `MAJOR`: Breaking architectural changes.
  - `MINOR`: New module or feature implementation.
  - `PATCH`: Bug fixes and optimizations.
  - `alpha/beta`: Pre-production validation phases.
