# Local Development Setup Guide - Baher Silver ERP

This document describes how to set up and run the Baher Silver ERP system locally for development and testing.

---

## 📋 Prerequisites

- **Node.js**: v18.x or higher
- **npm**: v9.x or higher
- **PostgreSQL**: v14.x or higher (or SQLite for dev fallback)

---

## 🛠️ Step-by-Step Setup Instructions

### 1. Repository Setup
```bash
git clone https://github.com/baher-silver/baher-silver-erp.git
cd baher-silver-erp
```

### 2. Backend Environment & Dependencies
```bash
cd apps/api-backend
npm install
cp .env.example .env.development
```

### 3. Database Migration & Seeding
```bash
npx prisma migrate dev --name init
npx prisma db seed
```

### 4. Start Local Development Servers
- **Backend API**:
  ```bash
  cd apps/api-backend
  npm run dev
  ```
  API Server will run on `http://localhost:3001/api`.

- **Frontend Server**:
  ```bash
  npx serve -l 3000 ./frontend
  ```
  App will be accessible at `http://localhost:3000`.
