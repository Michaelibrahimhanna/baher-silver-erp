# Role-Based Access Control (RBAC) Specification - Baher Silver ERP

This document specifies the enterprise Role-Based Access Control (RBAC) permissions matrix across all 10 system roles in the Baher Silver ERP system.

---

## 👥 System Roles Hierarchy

1. **`SYSTEM_ADMIN` (System Administrator)**: Full root access to all system settings, user management, audit logs, and database operations.
2. **`FACTORY_MANAGER` (Factory Executive Manager)**: Executive approval rights across all 7 warehouses, production orders, and master data.
3. **`WAREHOUSE_MANAGER` (Warehouse Manager)**: Approval and management rights over inventory receipts, dispatches, audits, and locations.
4. **`WAREHOUSE_CLERK` (Warehouse Clerk)**: Operational data entry for stock receiving, stock issuing draft requests, and barcode scanning.
5. **`PURCHASING_OFFICER` (Purchasing Officer)**: Creation and management of raw silver bullion, gemstone, and supply purchasing orders.
6. **`PRODUCTION_MANAGER` (Production Manager)**: Creation of casting workshop trees, batch issue requests, and production dispatches.
7. **`SALES_MANAGER` (Sales Manager)**: Customer invoicing, sales orders, wholesale silver dispatches, and sales reporting.
8. **`QUALITY_CONTROL` (Quality Control Specialist)**: Fineness inspection (999/925), gemstone quality grade review (AAA), and item approval/rejection.
9. **`ACCOUNTANT` (Chief Accountant)**: Full access to standard Chart of Accounts, double-entry general journal entries, and financial balance sheet.
10. **`VIEWER` (Read-Only Viewer)**: Read-only access to dashboard KPIs, inventory reports, and movement timelines.

---

## 🔐 Granular Permissions Matrix

| System Role | Create | Read | Update | Soft Delete (Archive) | Master Data Approval | Financial Ledger | Audit Logs |
|---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| **System Administrator** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ (Read Only) |
| **Factory Manager** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ (Read Only) |
| **Warehouse Manager** | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ |
| **Warehouse Clerk** | ✅ (Draft) | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| **Purchasing Officer** | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| **Production Manager** | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| **Sales Manager** | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| **Quality Control** | ❌ | ✅ | ✅ (Status) | ❌ | ✅ (Approve/Reject) | ❌ | ❌ |
| **Accountant** | ✅ (Journals) | ✅ | ✅ | ❌ | ❌ | ✅ | ❌ |
| **Viewer** | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |

---

## 🛡️ Enforced Governance Rules

1. **Least Privilege Enforcement**: Every API request and user transaction is strictly validated against the user's active `SystemRole`.
2. **Immutable Audit Trail**: All permission checks, access attempts, and role modifications are logged in the `audit_logs` table.
