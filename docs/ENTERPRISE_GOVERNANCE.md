# Enterprise Data Governance & Security Architecture Guide - Baher Silver ERP

This document synthesizes the complete Data Governance and Security Layer of the Baher Silver ERP system prior to production deployment.

---

## 🏛️ Governance Architectural Pillars

1. **Master Data Approval Lifecycle (`DRAFT` ➔ `PENDING_REVIEW` ➔ `APPROVED` / `REJECTED` / `ARCHIVED`)**:
   - Strictly enforces that only `APPROVED` records enter inventory transactions and general ledger accounting.

2. **Role-Based Access Control (RBAC)**:
   - 10 System Roles (`SYSTEM_ADMIN`, `FACTORY_MANAGER`, `WAREHOUSE_MANAGER`, `WAREHOUSE_CLERK`, `PURCHASING_OFFICER`, `PRODUCTION_MANAGER`, `SALES_MANAGER`, `QUALITY_CONTROL`, `ACCOUNTANT`, `VIEWER`).
   - Granular CRUD permissions per API endpoint and UI function.

3. **Immutable Audit Logging System (`audit_logs`)**:
   - Appends User ID, Name, Action, Entity Type, Entity ID, Old Value snapshot, New Value snapshot, IP Address, and Device.
   - Strictly append-only; zero deletion policy.

4. **Soft Delete Policy**:
   - Zero hard deletes. Records are soft-deleted by toggling `isArchived: true` and `status: ARCHIVED`.

5. **Backup Strategy & Restore Wizard**:
   - Daily backups, manual pre-deployment backups, integrity validation, and prompt-protected restore wizard.
