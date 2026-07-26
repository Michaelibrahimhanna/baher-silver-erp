# Centralized Numbering Engine Specification - Baher Silver ERP

This document details the centralized, configurable Numbering Engine service used across all 18 business entities in the Baher Silver ERP system.

---

## 🏛️ Supported Business Entities & Formats

| Entity Type | Entity Name | Sample Code Format | Use Year | Reset Policy | Padded Length |
|---|---|---|:---:|:---:|:---:|
| **`STN`** | Gemstones (الأحجار الكريمة) | `STN-000001` | No | NEVER | 6 Digits |
| **`SIL`** | Raw Silver & Bullion (الفضة الخام) | `SIL-000001` | No | NEVER | 6 Digits |
| **`RAW`** | Raw Materials (الخامات والمستلزمات) | `RAW-000001` | No | NEVER | 6 Digits |
| **`COMP`** | Components (الإكسسوارات والمكونات) | `COMP-000001` | No | NEVER | 6 Digits |
| **`SEMI`** | Semi-Finished (تحت التشغيل) | `SEMI-000001` | No | NEVER | 6 Digits |
| **`FG`** | Finished Goods (المنتجات النهائية) | `FG-000001` | No | NEVER | 6 Digits |
| **`SUP`** | Suppliers (الموردين) | `SUP-000001` | No | NEVER | 6 Digits |
| **`CUS`** | Customers (العملاء) | `CUS-000001` | No | NEVER | 6 Digits |
| **`WH`** | Warehouses (المخازن السبعة) | `WH-000001` | No | NEVER | 6 Digits |
| **`PO`** | Purchase Orders (أوامر الشراء) | `PO-2026-000001` | Yes | YEARLY | 6 Digits |
| **`GRN`** | Goods Receipts (أذون التوريد) | `GRN-2026-000001` | Yes | YEARLY | 6 Digits |
| **`IV`** | Sales Invoices (فواتير المبيعات) | `IV-2026-000001` | Yes | YEARLY | 6 Digits |
| **`WO`** | Work Orders / Casting Trees (الإنتاج) | `WO-2026-000001` | Yes | YEARLY | 6 Digits |
| **`SO`** | Sales Orders (أوامر البيع) | `SO-2026-000001` | Yes | YEARLY | 6 Digits |
| **`INV`** | Inventory Vouchers (أذون الصرف) | `INV-2026-000001` | Yes | YEARLY | 6 Digits |
| **`PAY`** | Payments (سندات الصرف والقبض) | `PAY-2026-000001` | Yes | YEARLY | 6 Digits |
| **`JV`** | Journal Vouchers (قيود اليومية) | `JV-2026-000001` | Yes | YEARLY | 6 Digits |
| **`AUD`** | Inventory Audits (جلسات الجرد) | `AUD-2026-000001` | Yes | YEARLY | 6 Digits |

---

## 🛠️ Service Interface & Functions

1. **`generateNextNumber(entityType, manualOverride = null)`**:
   Increments sequence and returns formatted unique code string.
2. **`previewNextNumber(entityType)`**:
   Returns the next sequential code preview without mutating current counter.
3. **Manual Override**:
   Permitted only for `SYSTEM_ADMIN` and `FACTORY_MANAGER` roles. Triggers audit log entry.
