# System Configuration Engine Specification - Baher Silver ERP

This document details the dynamic System Configuration Module where all system constants are moved from hardcoded source files into database-backed configuration entities (`SystemConfig`).

---

## 🔑 Dynamic Configuration Key-Value Matrix

| Configuration Key | Description | Default Dynamic Value | Category |
|---|---|---|---|
| `COMPANY_NAME` | Official Enterprise Name | `شركة مصنع باهر سيلفر للسبائك والمجوهرات` | `GENERAL` |
| `CURRENCY_SYMBOL` | System Currency Symbol | `ج.م` | `FINANCIAL` |
| `SILVER_PURITY_DEFAULT` | Default Raw Silver Fineness | `999` | `PRODUCTION` |
| `BARCODE_PREFIX` | EAN-13 Barcode Prefix | `62910` | `INVENTORY` |
| `QR_PREFIX` | Mobile QR Data Header | `QR-BAHER` | `INVENTORY` |
| `WAREHOUSE_PREFIX` | Warehouse Identifier Prefix | `WH` | `INVENTORY` |
| `INVOICE_PREFIX` | Sales Invoice Prefix | `IV` | `SALES` |
| `PURCHASE_PREFIX` | Purchase Order Prefix | `PO` | `PURCHASING` |
| `PRODUCTION_PREFIX` | Casting Tree Work Order Prefix | `WO` | `PRODUCTION` |
| `TAX_PERCENTAGE` | Value Added Tax (VAT %) | `14` | `FINANCIAL` |
| `DATE_FORMAT` | Standard Timestamp Format | `yyyy-MM-dd HH:mm:ss` | `SYSTEM` |
| `DEFAULT_LANGUAGE` | Primary User Interface Language | `ar` | `SYSTEM` |

---

## 🛠️ API & Function Access

- **`getSystemConfig(key, defaultFallback)`**: Dynamically queries setting with fallback guarantee.
- All ERP screens and API controllers consume settings from this configuration engine.
