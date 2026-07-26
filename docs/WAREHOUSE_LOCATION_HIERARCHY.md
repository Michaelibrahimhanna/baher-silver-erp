# Warehouse Location Hierarchy Specification - Baher Silver ERP

This document details the 7-level physical warehouse location hierarchy and internal QR code tagging system.

---

## 🏛️ 7-Level Location Hierarchy Formula

$$\text{Location Path} = \text{Main Warehouse} \longrightarrow \text{Warehouse} \longrightarrow \text{Cabinet} \longrightarrow \text{Shelf} \longrightarrow \text{Drawer} \longrightarrow \text{Box} \longrightarrow \text{Bag}$$

### Sample Hierarchical Path:
- **Arabic Path**: `مخزن الأحجار الرئيسي ➔ الدولاب 01 ➔ الرف 02 ➔ الدرج A ➔ الصندوق 05 ➔ الكيس B`
- **Internal Bin Code**: `LOC-WH-STONES-CAB01-SH02-DRWA-BX05`
- **Internal Baher Silver QR Identifier**: `QR-BAHER-LOC-STONES-00192`

---

## 🏷️ Internal Barcode & QR Code Identification Rules

> **IMPORTANT NOTICE**:
> The system strictly uses internal Baher Silver QR identifiers (`QR-BAHER-LOC-...`) and internal barcode prefixes (`62910...`).
> Official GS1 company prefixes are NOT assumed until officially registered.
