# Lot and Batch Tracking Specification - Baher Silver ERP

This document details the batch management architecture (`LotBatch`) for tracking silver bullion ingots, chemical lots, and gemstone parcels.

---

## 📌 LotBatch Data Attributes

- **`batchNumber`**: Unique batch identifier (e.g. `LOT-SLV-202607-001`).
- **`entityType` & `entityId`**: Linked master item record.
- **`manufactureDate` & `expiryDate`**: Date tracking (critical for chemicals and acids).
- **`initialQuantity` & `remainingQty`**: Stock movement reconciliation.
- **`purityGrade`**: Silver fineness (999.9 / 925) or Gemstone clarity (AAA).
- **`supplierId`**: Supplier batch traceability.

---

## 🔒 Batch Traceability Rule

Every issue of silver bullion for casting or raw chemical dispatch must explicitly record the source `batchNumber` to guarantee 100% manufacturing quality auditability.
