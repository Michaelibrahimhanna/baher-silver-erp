# EPIC 05 Sprint 01 – REST API Documentation

**System**: Baher Silver ERP Enterprise System  
**Module**: EPIC 05 – Manufacturing & Production Management  
**Sprint**: Sprint 01 – Manufacturing Orders, BOM, Work Centers, Routing & Material Reservation  

---

## Endpoint Summary

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/v1/production/orders` | Create new Manufacturing Order (MO) |
| `GET` | `/api/v1/production/orders` | List Manufacturing Orders with status filtering |
| `GET` | `/api/v1/production/orders/:idOrCode` | Get full MO details with material reservations & logs |
| `POST` | `/api/v1/production/orders/:id/status` | Transition MO workflow status (`PLANNED` → `CONFIRMED` → `IN_PROGRESS` → `COMPLETED`) |
| `POST` | `/api/v1/production/orders/:id/reserve` | Trigger material reservation from BOM lines |
| `POST` | `/api/v1/production/orders/:id/operations` | Record work center operation log & scrap reason classification |
| `POST` | `/api/v1/production/orders/:id/complete` | Complete MO and auto-generate Piece Identities (EPIC 02), Barcode Tags (EPIC 03) & Passports (EPIC 04) |
| `GET` | `/api/v1/production/work-centers` | List active work centers |
| `POST` | `/api/v1/production/work-centers` | Register new work center |

---

## API Specifications & Examples

### 1. Create Manufacturing Order
`POST /api/v1/production/orders`

#### Request Body
```json
{
  "productModelId": "uuid-product-model-01",
  "plannedQuantity": 10,
  "priority": "HIGH",
  "supervisorName": "أحمد محمود — مدير الإنتاج"
}
```

#### Response (201 Created)
```json
{
  "success": true,
  "message": "Manufacturing Order MO-2026-000001 created successfully",
  "data": {
    "id": "uuid-mo-01",
    "moCode": "MO-2026-000001",
    "productModelId": "uuid-product-model-01",
    "plannedQuantity": 10,
    "completedQuantity": 0,
    "scrappedQuantity": 0,
    "targetSilverPurity": "925",
    "estimatedSilverWeightGrams": 168.0,
    "status": "PLANNED",
    "priority": "HIGH",
    "createdAt": "2026-07-30T04:49:44.000Z"
  }
}
```

---

### 2. Complete MO & Trigger Integrations (EPIC 02 + 03 + 04)
`POST /api/v1/production/orders/MO-2026-000001/complete`

#### Response (200 OK)
```json
{
  "success": true,
  "message": "MO completed! Produced 9 physical pieces and generated DPP drafts.",
  "data": {
    "mo": {
      "id": "uuid-mo-01",
      "moCode": "MO-2026-000001",
      "status": "COMPLETED",
      "completedQuantity": 9,
      "scrappedQuantity": 1,
      "silverLossWeightGrams": 16.8
    },
    "producedPiecesCount": 9,
    "producedPieces": [
      { "serialNo": "SN-2026-000032", "sku": "PRD-2026-000019-01", "weightGrams": 15.5 }
    ],
    "digitalProductPassports": [
      { "dppCode": "DPP-2026-000032", "dppUrl": "https://passport.bahersilver.com/v/SN-2026-000032" }
    ],
    "labelPrintJobsEnqueued": 9
  }
}
```
