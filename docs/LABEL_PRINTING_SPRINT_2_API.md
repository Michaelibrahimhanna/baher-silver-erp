# EPIC 03 Sprint 02 – Label Printing Engine REST API Documentation

**Base Path**: `/api/v1/printing`  
**Authentication**: Bearer JWT (Optional/Enabled per environment)  
**Format**: `application/json`  

---

## Endpoints Summary

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/printing/jobs` | Enqueue & dispatch print job for piece / label template |
| `POST` | `/printing/jobs/batch` | Enqueue multi-printer simultaneous batch print jobs |
| `GET` | `/printing/jobs` | Query print queue with filters (`status`, `printerDeviceId`, dates) |
| `GET` | `/printing/jobs/:id` | Get print job details and audit trail history |
| `POST` | `/printing/jobs/:id/retry` | Re-dispatch and retry a failed print job |
| `POST` | `/printing/jobs/:id/cancel` | Cancel queued or failed print job |
| `GET` | `/printing/printers/select` | Auto-select target printer for branch/station based on status |

---

## Sample Request & Response Payloads

### 1. Enqueue & Dispatch Print Job
`POST /api/v1/printing/jobs`

```json
{
  "pieceIdOrSerial": "SN-2026-000003",
  "printerDeviceId": "DEV-PRN-ZPL01",
  "commandLanguage": "ZPL",
  "copies": 2,
  "requestedBy": "فني طابعات الفضة"
}
```

**Response (201 Created)**:
```json
{
  "success": true,
  "message": "Print job executed successfully on 'Zebra Industrial ZT411 (ZPL 600dpi)'",
  "data": {
    "job": {
      "id": "job-uuid-...",
      "jobNo": "JOB-2026-000001",
      "printerDeviceId": "DEV-PRN-ZPL01",
      "commandLanguage": "ZPL",
      "copies": 2,
      "status": "PRINTED",
      "printedAt": "2026-07-29T06:04:09.000Z",
      "rawCommandStream": "^XA\n^PW720\n^LL360\n...^PQ2\n^XZ"
    }
  }
}
```

### 2. Multi-Printer Simultaneous Batch Dispatch
`POST /api/v1/printing/jobs/batch`

```json
{
  "pieceIds": ["piece-uuid-1"],
  "printerDeviceIds": ["DEV-PRN-ZPL01", "DEV-PRN-EPL02"],
  "commandLanguage": "ZPL"
}
```

**Response (201 Created)**:
```json
{
  "success": true,
  "message": "Enqueued batch of 2 print jobs",
  "data": {
    "batchSize": 2,
    "jobs": [
      {
        "success": true,
        "message": "Print job executed successfully on 'Zebra Industrial ZT411 (ZPL 600dpi)'",
        "job": { "jobNo": "JOB-2026-000002", "status": "PRINTED" }
      },
      {
        "success": true,
        "message": "Print job executed successfully on 'Zebra Desktop GC420t (EPL 203dpi)'",
        "job": { "jobNo": "JOB-2026-000003", "status": "PRINTED" }
      }
    ]
  }
}
```

### 3. Retry Failed Print Job
`POST /api/v1/printing/jobs/JOB-2026-000004/retry`

**Response (200 OK)**:
```json
{
  "success": true,
  "message": "Print job executed successfully on 'Zebra Industrial ZT411 (ZPL 600dpi)'",
  "data": {
    "job": {
      "id": "job-failed-uuid-...",
      "jobNo": "JOB-2026-000004",
      "status": "PRINTED",
      "retryCount": 1,
      "maxRetries": 3,
      "errorMessage": null,
      "printedAt": "2026-07-29T06:04:09.000Z"
    }
  }
}
```
