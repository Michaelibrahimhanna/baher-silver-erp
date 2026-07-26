# Soft Delete & Archival Policy - Baher Silver ERP

This document outlines the Soft Delete policy governing all master data records across the Baher Silver ERP system.

---

## 📌 Soft Delete Core Principle

> **ZERO PERMANENT DATA LOSS**: No master data record (Gemstone, Raw Silver Bullion, Workshop Supply, Warehouse Location, Customer, Supplier) can be permanently deleted (`HARD DELETE`) from the database.

---

## ⚙️ Technical Implementation

1. **`isArchived` Flag & Status Tracking**:
   Every database table contains boolean flag `isArchived` (default: `false`) and status `RecordStatus` (set to `ARCHIVED` upon soft delete).

2. **Query Filtering**:
   All active inventory lookups, search indices, warehouse balance queries, and transactional forms automatically apply condition:
   ```sql
   WHERE isArchived = false AND status = 'APPROVED'
   ```

3. **Restoration Capability**:
   Archived items can be audited and restored by `SYSTEM_ADMIN` or `FACTORY_MANAGER` if required, maintaining a complete audit log of the restoration action.
