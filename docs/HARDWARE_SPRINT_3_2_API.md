# EPIC 02 Sprint 03.2 – Device Health & Monitoring REST API Documentation

**Base Path**: `/api/v1/hardware`  
**Authentication**: Bearer JWT (Optional/Enabled per environment)  
**Format**: `application/json`  

---

## Added Endpoints Summary

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/hardware/health/ping` | Ping device health / heartbeat test |
| `POST` | `/hardware/devices/:id/ping` | Ping specific device by ID or deviceCode |
| `POST` | `/hardware/health/heartbeat` | Trigger system-wide hardware heartbeat check |
| `GET` | `/hardware/health` | Get overall hardware health summary & counts |
| `POST` | `/hardware/devices/:id/reconnect` | Trigger auto-reconnect engine cycle with backoff |
| `POST` | `/hardware/devices/:id/firmware` | Update firmware versioning & check update status |
| `GET` | `/hardware/audit-logs` | Query hardware audit logs with filters |

---

## Sample Request & Response Payloads

### 1. Device Ping
`POST /api/v1/hardware/devices/DEV-SCALE-H1/ping`

**Response (200 OK)**:
```json
{
  "success": true,
  "message": "Device ping completed successfully",
  "data": {
    "deviceId": "dev-scale-uuid-...",
    "deviceCode": "DEV-SCALE-H1",
    "status": "ONLINE",
    "responseTimeMs": 14.85,
    "healthScore": 100,
    "lastPingAt": "2026-07-29T05:08:35.000Z"
  }
}
```

### 2. Hardware Health Summary
`GET /api/v1/hardware/health?branchId=BRANCH-HQ`

**Response (200 OK)**:
```json
{
  "success": true,
  "data": {
    "branchId": "BRANCH-HQ",
    "totalDevices": 5,
    "onlineCount": 5,
    "offlineCount": 0,
    "degradedCount": 0,
    "errorCount": 0,
    "maintenanceCount": 0,
    "connectingCount": 0,
    "overallHealthScore": 100,
    "devicesSummary": [
      {
        "id": "c1f7b901-...",
        "deviceCode": "DEV-SCALE-01",
        "name": "Mettler Toledo Scale",
        "category": "DIGITAL_SCALE",
        "status": "ONLINE",
        "healthScore": 100,
        "lastPingAt": "2026-07-29T05:08:35.000Z"
      }
    ]
  }
}
```

### 3. Auto Reconnect Attempt
`POST /api/v1/hardware/devices/DEV-SCALE-H1/reconnect`

**Response (200 OK)**:
```json
{
  "success": true,
  "message": "Device successfully reconnected and online",
  "data": {
    "success": true,
    "message": "Device successfully reconnected and online",
    "attempt": 1,
    "backoffDelayMs": 3000,
    "device": {
      "id": "dev-scale-uuid-...",
      "deviceCode": "DEV-SCALE-H1",
      "status": "ONLINE",
      "healthScore": 100,
      "reconnectAttemptsCount": 0
    }
  }
}
```

### 4. Firmware Update Info
`POST /api/v1/hardware/devices/DEV-SCALE-H1/firmware`

```json
{
  "firmwareVersion": "v1.0.0",
  "firmwareBuildDate": "2025-06-15",
  "hardwareRevision": "Rev B",
  "manufacturer": "Mettler Toledo Inc.",
  "latestAvailableFirmwareVersion": "v2.1.0"
}
```

**Response (200 OK)**:
```json
{
  "success": true,
  "message": "Firmware information updated successfully",
  "data": {
    "id": "dev-scale-uuid-...",
    "firmwareVersion": "v1.0.0",
    "latestAvailableFirmwareVersion": "v2.1.0",
    "updateAvailable": true,
    "firmwareStatus": "UPDATE_REQUIRED"
  }
}
```
