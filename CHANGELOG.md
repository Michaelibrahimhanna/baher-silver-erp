# Changelog - Baher Silver ERP System

All notable changes to the Baher Silver ERP project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [v0.1.0-alpha] - 2026-07-26

### Initial Pre-Release Architecture & Modules

#### Completed ERP Modules:
- **✓ Master Data Center (`master_data`)**:
  - Reference data management for categories, origins, gem shapes, colors, and quality grades.
  - Master item creation, custom category additions, and CSV data export.
- **✓ Warehouse Engine (`warehouses`)**:
  - 7 Enterprise Factory Warehouses (`WH-STONES`, `WH-SILVER`, `WH-RAW`, `WH-CHEMICALS`, `WH-COMPONENTS`, `WH-SEMI`, `WH-FINISHED`).
  - 100% strict warehouse isolation ensuring items never bleed across warehouses.
  - Dedicated Raw Silver & Bullion Warehouse (`silver_store`) with Asset Account `1105`.
- **✓ Stone Inventory (`stones_store`)**:
  - Gemstone identity, dual file/camera picture upload, barcode generation, and mobile-scannable QR codes.
  - Weight in grams (g) and carats (ct), color palette selector, manual size inputs.
- **✓ Raw Materials (`raw_store`)**:
  - Workshop casting supplies, wax, borax, gypsum, nitric acid, and plating rhodium inventory.
  - Unit cost tracking, stock replenishment, and casting issue forms.
- **✓ Inventory Movements (`transactions`)**:
  - Immutable movement timeline ledger tracking all receipts, production issues, transfers, and adjustments.
  - Dedicated Movement Passport modal (`movementDetailModal`) displaying real-time live stock, recipient employee, batch order numbers, and timestamp logs.
  - Specific Item Movement History Timeline (`itemMovementHistoryModal`).
- **✓ Inventory Audit (`inventory_audit`)**:
  - Physical inventory audit sessions, variance calculation, and automated stock adjustment entries.
- **✓ Universal Search Engine (`universal_search`)**:
  - Real-time multi-attribute super search across stones, silver, raw materials, 7 warehouses, movements, and accounting journal entries.
- **✓ Dashboard & Financial Executive Center (`wh_dashboard`)**:
  - KPI overview metrics, asset valuation, raw silver weight totals (g/kg), and double-entry accounting summary.
- **✓ PostgreSQL Database Foundation**:
  - Relational PostgreSQL data schema for multi-environment deployments (Development, Testing, Production).
- **✓ Prisma ORM Engine**:
  - Strongly-typed Prisma client, automated migration management, and database seed scripts (`database/prisma/schema.prisma`).
