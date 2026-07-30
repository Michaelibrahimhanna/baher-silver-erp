# EPIC 02 Sprint 03.1 – Hardware REST API Documentation

**Base Path**: `/api/v1/hardware`  
**Authentication**: Bearer JWT (Optional/Enabled per environment)  
**Format**: `application/json`  

---

## Endpoints Summary

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/hardware/devices` | Register a new hardware device |
| `GET` | `/hardware/devices` | Query devices with filters (`branchId`, `stationId`, `category`, `status`, `search`) |
| `GET` | `/hardware/devices/:id` | Get device details by ID or deviceCode |
| `PUT` | `/hardware/devices/:id` | Update device config and attributes |
| `DELETE` | `/hardware/devices/:id` | Remove device from registry |
| `POST` | `/hardware/devices/:id/set-default` | Set device as default for station/category |
| `POST` | `/hardware/devices/:id/maintenance` | Toggle maintenance mode state & reason |
| `POST` | `/hardware/devices/:id/bind-driver` | Bind driver manifest to device |
| `POST` | `/hardware/stations` | Create hardware station (`Branch` ➔ `Station` ➔ `Device`) |
| `GET` | `/hardware/stations` | List hardware stations |
| `GET` | `/hardware/stations/:id` | Get station details with assigned devices |
| `DELETE` | `/hardware/stations/:id` | Delete station |
| `POST` | `/hardware/profiles` | Create branch hardware profile |
| `GET` | `/hardware/profiles` | List branch hardware profiles |
| `GET` | `/hardware/profiles/:id` | Get profile details |
| `POST` | `/hardware/drivers` | Register hardware driver manifest |
| `GET` | `/hardware/drivers` | List installed driver manifests |
| `GET` | `/hardware/drivers/:id` | Get driver manifest details |
| `POST` | `/hardware/devices/:id/calibrations` | Record device calibration log |
| `GET` | `/hardware/devices/:id/calibrations` | Query device calibration logs |

---

## Sample Request & Response Payloads

### 1. Register Hardware Device
`POST /api/v1/hardware/devices`

```json
{
  "deviceCode": "DEV-SCALE-01",
  "name": "Mettler Toledo Precision Analytical Scale",
  "category": "DIGITAL_SCALE",
  "brand": "Mettler Toledo",
  "model": "XS205 Dual Range",
  "serialNumber": "SN-MT-994821",
  "branchId": "BRANCH-HQ",
  "stationId": "stn-pos-01-uuid",
  "connectionType": "RS232",
  "portName": "COM3",
  "baudRate": 9600,
  "isDefault": true
}
```

**Response (201 Created)**:
```json
{
  "success": true,
  "message": "Hardware device registered successfully",
  "data": {
    "id": "c1f7b901-...",
    "deviceCode": "DEV-SCALE-01",
    "name": "Mettler Toledo Precision Analytical Scale",
    "category": "DIGITAL_SCALE",
    "brand": "Mettler Toledo",
    "model": "XS205 Dual Range",
    "serialNumber": "SN-MT-994821",
    "branchId": "BRANCH-HQ",
    "stationId": "stn-pos-01-uuid",
    "connectionType": "RS232",
    "status": "OFFLINE",
    "isDefault": true,
    "createdAt": "2026-07-29T05:06:00.000Z"
  }
}
```

### 2. Record Calibration Log
`POST /api/v1/hardware/devices/:id/calibrations`

```json
{
  "calibratedBy": "فني معايرة الجودة",
  "referenceWeightGrams": 100.0,
  "measuredWeightGrams": 100.02,
  "certificateNo": "CERT-CAL-2026-089",
  "nextCalibrationDueDate": "2027-01-25T00:00:00.000Z",
  "notes": "Standard 100g test mass check - Pass"
}
```

**Response (201 Created)**:
```json
{
  "success": true,
  "message": "Calibration recorded successfully",
  "data": {
    "id": "cal-uuid-...",
    "deviceId": "c1f7b901-...",
    "calibratedBy": "فني معايرة الجودة",
    "referenceWeightGrams": 100.0,
    "measuredWeightGrams": 100.02,
    "offsetErrorGrams": 0.02,
    "status": "PASS",
    "certificateNo": "CERT-CAL-2026-089"
  }
}
```
