# Database & System Rollback Procedure - Baher Silver ERP

This document outlines the standard emergency procedure to roll back failed production deployments or database schema migrations.

---

## 🚨 Emergency Rollback Steps

### Step 1: Stop Application Services
```bash
pm2 stop baher-silver-api
```

### Step 2: Restore Pre-Deployment Database Backup
Execute the restore utility using the pre-deployment manual backup generated prior to release:
```powershell
powershell ./database/backup/restore_db.ps1 -BackupFilePath "./database/backup/baher_silver_erp_pre_prod_deploy_YYYY-MM-DD.sql"
```

### Step 3: Rollback Git Commit Tag
```bash
git checkout v1.0.0-beta
```

### Step 4: Re-generate Prisma Client & Restart Service
```bash
cd apps/api-backend
npx prisma generate
npm run build
pm2 restart baher-silver-api
```
