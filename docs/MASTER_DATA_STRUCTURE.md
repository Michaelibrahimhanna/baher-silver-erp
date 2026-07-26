# Master Data Structure Specification - Baher Silver ERP

This document details the production master data structures for all 7 master entities in the Baher Silver ERP system.

---

## 🏛️ Master Entities Specification

1. **Stone Master (`Stone`)**:
   - Primary Code: Internal Baher Silver Code (`STN-000001`).
   - Attributes: Name, Stone Type, Category, Origin, Color, Shape, Size, Quality Grade (AAA), Weight (g/ct), Purchase Price, Selling Price.
   - Identifiers: Internal Barcode (`62910XXXXX`) and Mobile QR Code (`QR-BAHER-STN-XXXXX`).

2. **Silver Master (`SilverItem`)**:
   - Primary Code: `SIL-000001`.
   - Attributes: Fineness Grade (999 Pure Silver / 925 Sterling Silver), Stock in Grams (g) & Kilograms (kg), Unit Cost per Gram.
   - Asset Account Link: `1105 - مخزون الفضة الخام والسبائك`.

3. **Raw Materials Master (`RawMaterial`)**:
   - Primary Code: `RAW-000001`.
   - Attributes: Workshop Supplies (Casting Wax, Borax, Gypsum), Unit of Measure, Unit Cost.
   - Asset Account Link: `1102 - مخزون الخامات والمستلزمات`.

4. **Chemicals Master (`RawMaterial` - Chemicals)**:
   - Primary Code: `CHEM-000001`.
   - Attributes: Nitric Acid, Cleaning Acids, Rhodium Plating Solutions, Safety Data Sheet (SDS) references.

5. **Components Master (`RawMaterial` - Components)**:
   - Primary Code: `COMP-000001`.
   - Attributes: Silver Clasps, Earring Findings, Jump Rings, Chains, Unit Weight in Grams.

6. **Semi-Finished Products (`RawMaterial` - Semi-Finished)**:
   - Primary Code: `SEMI-000001`.
   - Attributes: Raw Cast Silver Trees, Unpolished Silver Rings, Work-in-Progress (WIP) Batch Numbers.

7. **Finished Products (`Stone` / Finished Goods)**:
   - Primary Code: `FG-000001`.
   - Attributes: Fully Setting Gemstone Silver Rings, Bracelets, Necklaces, Hallmarked 925 Certificate Links.
