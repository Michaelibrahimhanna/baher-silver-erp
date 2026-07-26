# Production Setup & Deployment Guide - Baher Silver ERP

This document outlines the step-by-step procedure for deploying the Baher Silver ERP system to a production PostgreSQL environment.

---

## 🏛️ Infrastructure Requirements

- **Production Server**: Dedicated Linux (Ubuntu 22.04 LTS) or Windows Server.
- **Database Engine**: PostgreSQL 14+ with SSL enabled.
- **Process Manager**: PM2 or Docker Container Engine.
- **Reverse Proxy**: NGINX with SSL (Let's Encrypt / Certbot).

---

## 🚀 Production Deployment Checklist

1. **Configure Environment Variables**:
   Configure `.env.production` in `apps/api-backend/.env`. Ensure `DATABASE_URL` points to the primary PostgreSQL production instance with connection pooling enabled.

2. **Database Migrations**:
   Run `npx prisma migrate deploy` to safely apply version-controlled PostgreSQL migrations without data loss.

3. **Build API Bundle**:
   Run `npm run build` in `apps/api-backend`.

4. **PM2 Service Startup**:
   ```bash
   pm2 start dist/server.js --name "baher-silver-api"
   pm2 save
   pm2 startup
   ```

5. **Automated Daily Backups**:
   Schedule `database/backup/backup_daily.ps1` or cron equivalent to run daily at 00:00.
