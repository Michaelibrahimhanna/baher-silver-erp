# Production Master Data Foundation Architecture Guide - Baher Silver ERP

This document synthesizes the Production Master Data Foundation implemented in Phase 20 for Baher Silver Factory.

---

## 🏛️ Master Data Architecture Overview

1. **7 Core Master Entities**: Gemstones, Raw Silver & Bullion, Raw Materials, Chemicals, Components, Semi-Finished WIP, Finished Goods.
2. **Sub-System Models**:
   - `LotBatch`: Traceability for silver bullion batches, chemical lots, and gemstone parcels.
   - `Attachment`: Images, technical spec sheets, safety data sheets (SDS).
   - `Certificate`: Silver assay hallmarking stamps and gemstone authenticity certificates.
   - `PricingHistory`: Purchase & selling price change tracking with audit rationale.
   - `StockHistory`: Physical stock change log per item.
3. **7-Level Hierarchical Storage Location Grid**:
   - `Main Warehouse ➔ Warehouse ➔ Cabinet ➔ Shelf ➔ Drawer ➔ Box ➔ Bag`.
   - 100% unique internal Baher Silver QR code tag per location (`QR-BAHER-LOC-...`).
4. **Clean Production State**:
   - Fake inventory replaced with clean, production-ready master reference structures ready for operational launch.
