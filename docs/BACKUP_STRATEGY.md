# Backup Strategy & Disaster Recovery Specification - Baher Silver ERP

This document details the multi-tiered backup strategy, validation procedures, and recovery wizard utilities in the Baher Silver ERP system.

---

## 📦 Backup Tiers Overview

| Backup Type | Execution Schedule | Automation Script | Retention | Destination |
|---|---|---|---|---|
| **Daily Automatic Backup** | Every midnight (00:00 UTC) | `database/backup/backup_daily.ps1` | 30 Days (Auto-purged) | Local & Remote Storage |
| **Manual Pre-Deploy Backup** | Triggered before releases | `database/backup/backup_manual.ps1` | Permanent (Tagged) | Encrypted Cold Vault |
| **Transaction Point-in-Time** | Continuous WAL Archiving | PostgreSQL Write-Ahead Logs | 7 Days | Cloud Object Storage |

---

## 🛠️ Recovery Wizard & Validation Utility

### 1. Backup Integrity Validation
Before any backup is restored, the validation tool executes structural checks:
```powershell
# Verify SQL dump syntax & checksum
powershell ./scripts/verify_migrations.ps1
```

### 2. Database Restore Wizard (`restore_db.ps1`)
The prompt-guarded interactive restore script safely restores backups:
```powershell
powershell ./database/backup/restore_db.ps1 -BackupFilePath "./database/backup/baher_silver_erp_daily_2026-07-26.sql"
```
