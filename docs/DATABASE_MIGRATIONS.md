# Database Migration & Schema Management - Baher Silver ERP

This document specifies the rules and commands for managing PostgreSQL database migrations using Prisma ORM.

---

## 🔒 Strict Rules for Production Database Migrations

1. **NO Hardcoded Schema Changes**: All schema changes must originate from `database/schema/schema.prisma`.
2. **NO `prisma migrate reset` in Production**: Never execute `prisma migrate reset` on testing or production databases.
3. **Mandatory Backup Before Migration**: Always execute `database/backup/backup_manual.ps1` before running migrations.

---

## 🛠️ Migration Workflows

### Creating a New Development Migration
```bash
npx prisma migrate dev --name <descriptive_migration_name>
```

### Verifying Pending Migrations
```bash
powershell ./scripts/verify_migrations.ps1
```

### Applying Migrations to Production
```bash
npx prisma migrate deploy
```
