# Master Data Approval Workflow Specification - Baher Silver ERP

This document details the lifecycle management, approval workflow, and transaction eligibility rules for all master data items in the Baher Silver ERP system.

---

## 📌 Master Data Record Status Lifecycle

Every master item record (Gemstone, Raw Silver Bullion, Workshop Material, Chemical, Component) must strictly belong to one of five statuses:

```text
[ DRAFT ] ──➔ [ PENDING_REVIEW ] ──┬──➔ [ APPROVED ] (Used in Transactions)
                                   ├──➔ [ REJECTED ]
                                   └──➔ [ ARCHIVED ] (Soft Deleted)
```

1. **`DRAFT`**: Initial record entry created by Warehouse Clerks or Purchasing Officers. Not visible in active inventory.
2. **`PENDING_REVIEW`**: Record submitted for executive and quality control review.
3. **`APPROVED`**: Record validated by Quality Control / Factory Manager / Warehouse Manager. **ONLY APPROVED RECORDS CAN BE USED IN INVENTORY TRANSACTIONS, DISPATCHES, AND ACCOUNTING LEDGERS.**
4. **`REJECTED`**: Record rejected during review due to failing purity specs (e.g. non-compliant silver purity or gemstone defect).
5. **`ARCHIVED`**: Soft-deleted record preserved for immutable historical audit.

---

## 🔒 Transaction Governance Rule

> **CRITICAL RULE**: The inventory engine and double-entry general ledger strictly enforce that NO item with status `DRAFT`, `PENDING_REVIEW`, `REJECTED`, or `ARCHIVED` can be issued for casting, transferred, or posted to accounting entries.
>
> Attempting to issue a non-`APPROVED` item triggers an immediate governance violation exception: `403 FORBIDDEN: ITEM_NOT_APPROVED`.
