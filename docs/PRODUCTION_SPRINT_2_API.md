# EPIC 05 Sprint 02 – REST API Documentation

**System**: Baher Silver ERP Enterprise System  
**Module**: EPIC 05 – Manufacturing & Production Management  
**Sprint**: Sprint 02 – Production Scheduling, Capacity Planning & Shop Floor Control  

---

## Endpoint Summary

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/v1/production/scheduling/schedule` | Run finite capacity production scheduling & operation dependency enforcement |
| `GET` | `/api/v1/production/scheduling/capacity` | Get work center capacity planning & OEE metrics |
| `POST` | `/api/v1/production/scheduling/labor` | Assign artisan/operator labor & shift tracking |
| `GET` | `/api/v1/production/wip/summary` | Get real-time WIP tracking & aging metrics |
| `POST` | `/api/v1/production/orders/:id/partial-release` | Release partial sub-lot batch from active MO |
| `POST` | `/api/v1/production/rework` | Trigger rework workflow for defective/repaired pieces |
| `GET` | `/api/v1/production/dashboard/summary` | Production Shop Floor Control Dashboard metrics |

---

## API Specifications & Examples

### 1. Finite Capacity Scheduling & Operation Dependency
`POST /api/v1/production/scheduling/schedule`

#### Request Body
```json
{
  "moIdOrCode": "MO-2026-000001",
  "startDate": "2026-07-30T08:00:00Z"
}
```

#### Response (200 OK)
```json
{
  "success": true,
  "message": "Manufacturing Order MO-2026-000001 scheduled successfully",
  "data": {
    "mo": {
      "id": "uuid-mo-01",
      "moCode": "MO-2026-000001",
      "startDate": "2026-07-30T08:00:00.000Z",
      "targetDate": "2026-07-30T14:30:00.000Z"
    },
    "scheduleEntries": [
      {
        "id": "uuid-sch-1",
        "workCenterId": "uuid-wc-casting",
        "sequenceNo": 10,
        "scheduledStartDate": "2026-07-30T08:00:00.000Z",
        "scheduledEndDate": "2026-07-30T09:15:00.000Z",
        "allocatedHours": 0.9
      },
      {
        "id": "uuid-sch-2",
        "workCenterId": "uuid-wc-polishing",
        "sequenceNo": 20,
        "scheduledStartDate": "2026-07-30T09:15:00.000Z",
        "scheduledEndDate": "2026-07-30T10:45:00.000Z",
        "allocatedHours": 1.2
      }
    ]
  }
}
```

---

### 2. Partial Completion Sub-Lot Release
`POST /api/v1/production/orders/MO-2026-000001/partial-release`

#### Request Body
```json
{
  "partialQuantity": 5
}
```

#### Response (200 OK)
```json
{
  "success": true,
  "message": "Partial sub-lot of 5 units released successfully",
  "data": {
    "mo": {
      "id": "uuid-mo-01",
      "moCode": "MO-2026-000001",
      "status": "IN_PROGRESS",
      "completedQuantity": 5,
      "plannedQuantity": 12
    },
    "partialLotsReleasedCount": 5,
    "producedPieces": [
      { "serialNo": "SN-2026-000045", "sku": "PRD-2026-000021-01" }
    ],
    "digitalProductPassportsCount": 5,
    "isFullyCompleted": false
  }
}
```
