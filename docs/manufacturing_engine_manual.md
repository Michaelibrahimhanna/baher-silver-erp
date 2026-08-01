# Enterprise Manufacturing Engine Operations Manual — Baher Silver ERP v4.0

## 1. Overview & Architecture

The Manufacturing Engine powers core factory operations for Baher Silver Factory. It controls product structure (BOMs), 8 specialized work centers, work order execution state machine, material reservations, material consumption, production returns, scrap & silver recovery, finished goods vault receipts, and 8-factor production cost rollups.

---

## 2. Bill of Materials (BOM) & Variant Support

The engine supports both **Template BOMs** (`ProductMaster`) and **Independent Variant BOMs** (`ProductVariant`):

### Supported Material Line Types:
1. **`SILVER`**: Fine Silver (999), Standard Alloys (925, 835), Casting Trees.
2. **`STONE`**: Cubic Zirconia, Synthetic Gemstones, Natural Precious Stones.
3. **`COMPONENT`**: Earring Posts, Clasps, Bezels, Bail Loops.
4. **`CHEMICAL`**: Pickling Acids, Rhodium Plating Baths, Degreasing Solvents.
5. **`CONSUMABLE`**: Polishing Compounds, Sanding Discs, Rubber Molds.

---

## 3. The 8 Factory Work Centers

| Work Center Code | Name (Arabic) | Station Purpose | Capacity Rate | Hourly Cost |
|---|---|---|---|---|
| `WC-CASTING` | قسم السباكة والصب الأولي | Vacuum Investment Casting & Induction Melting | 15 Pcs/hr | 120 EGP/hr |
| `WC-CLEANING` | قسم الكحت والغسيل الكيميائي | Tree Removal, Ultrasonic & Acid Cleaning | 25 Pcs/hr | 70 EGP/hr |
| `WC-SETTING` | قسم تركيب وحشو الأحجار | Precision Micro-pave & Prong Gemstone Setting | 8 Pcs/hr | 150 EGP/hr |
| `WC-POLISHING` | قسم الصقل والتلميع | Sawing, Filing, Sanding & High-Luster Buffing | 12 Pcs/hr | 90 EGP/hr |
| `WC-RHODIUM` | قسم الطلاء بالروديوم | Anti-Tarnish Electroplating & Rhodium Bath | 20 Pcs/hr | 180 EGP/hr |
| `WC-HALLMARK` | قسم الختم الحكومي والليزر | Official Stamp & High-Precision Laser Marking | 30 Pcs/hr | 60 EGP/hr |
| `WC-QC` | مختبر فحص ومراقبة الجودة | Dimensional Inspection & Optical Stone Audit | 40 Pcs/hr | 100 EGP/hr |
| `WC-PACKAGING` | قسم التغليف والبطاقة QR | Tagging, Passport QR Labeling & Vault Box | 50 Pcs/hr | 50 EGP/hr |

---

## 4. Work Order State Machine & Operator Tracking

Every Manufacturing Order (MO) follows an enforced state sequence:
$$\text{PLANNED} \longrightarrow \text{CONFIRMED} \longrightarrow \text{IN\_PROGRESS} \underset{\text{Resume}}{\overset{\text{Pause}}{\rightleftharpoons}} \text{PAUSED} \longrightarrow \text{QUALITY\_CHECK} \longrightarrow \text{COMPLETED}$$

### Key Fields Logged:
- `assignedOperatorId` & `assignedOperatorName`: Bench technician assigned to the job.
- `startedByUserId` & `finishedByUserId`: Users initiating and concluding operations.
- `workingTimeMinutes`, `pauseTimeMinutes`, `totalDurationMinutes`: Active lead time metrics.
- `ManufacturingOrderTimeline`: Immutable log recording every transition with actor ID, timestamp, and metadata.

---

## 5. Categorized Scrap & Silver Recovery Ledger

Factory scrap is tracked across 6 distinct categories:

1. **`CASTING_SCRAP`**: Sprues, gates, buttons from casting trees.
2. **`BENCH_FILINGS`**: Sawing and filing dust collected at benches.
3. **`POLISHING_DUST`**: Fine dust collected by suction hoods during polishing.
4. **`STONE_DAMAGE`**: Chipped or cracked stones incurred during setting.
5. **`CHEMICAL_LOSS`**: Pickling and plating solution losses.
6. **`RECOVERED_SILVER`**: Refined pure silver (999) credited back into raw warehouse stock.

---

## 6. Enriched Finished Goods Receipt

Upon completion of production:
- System generates an enriched receipt (`FinishedGoodsReceipt`).
- Stores `lotNumber` (`LOT-MO-2026-XXXXXX`), `batchNumber`, `serialNumber`, `hallmarkNumber` (e.g. `HAL-EGY-925-2026`).
- Logs `qcResult` (`PASSED`, `PASSED_WITH_CONCERN`, `FAILED`).
- Transfers finished jewelry to **Showroom Vault / Finished Goods Warehouse** (`wh-finished`).

---

## 7. 8-Factor Production Cost Rollup Formula

$$\text{UnitCost} = \frac{\text{MaterialCost} + \text{LaborCost} + \text{MachineCost} + \text{ChemicalCost} + \text{Electricity} + \text{Overhead} + \text{ScrapCost} - \text{RecoveryValue}}{\text{CompletedQuantity}}$$

---

## 8. Manufacturing Event Engine

Central event emitter (`ManufacturingEventsService`) emits structured events for integration with audit, notification, and AI modules:

- `MO_CREATED`
- `MO_CONFIRMED`
- `MO_STARTED`
- `MO_PAUSED`
- `MO_RESUMED`
- `MO_COMPLETED`
- `QC_FAILED`
- `SCRAP_CREATED`
- `FINISHED_RECEIVED`

---

## 9. Manufacturing REST API Reference

| Endpoint | Method | Purpose |
|---|---|---|
| `/api/v1/production/work-centers` | `GET` | List/Initialize 8 Factory Work Centers |
| `/api/v1/production/boms` | `POST` | Create/Update Template or Variant BOM |
| `/api/v1/production/orders` | `POST` | Create new Manufacturing Order (MO) |
| `/api/v1/production/orders/:id/state` | `PATCH` | Transition MO state (Start, Pause, Resume, Complete, Cancel) |
| `/api/v1/production/orders/:moId/reservations` | `GET` | Get/Calculate material stock reservations |
| `/api/v1/production/orders/:moId/consumption` | `POST` | Record actual material consumption |
| `/api/v1/production/returns` | `POST` | Record unused material returns to stock |
| `/api/v1/production/scrap` | `POST` | Record categorized scrap & silver recovery |
| `/api/v1/production/finished-goods/receive` | `POST` | Generate Finished Goods Receipt & transfer to vault |
| `/api/v1/production/orders/:moId/cost-rollup` | `GET` | Calculate 8-factor production cost rollup |
| `/api/v1/production/dashboard/kpis` | `GET` | Fetch real-time dashboard KPIs & bottlenecks |
| `/api/v1/production/events` | `GET` | Query recent Manufacturing Event Logs |
