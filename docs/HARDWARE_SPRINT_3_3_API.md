# EPIC 02 Sprint 03.3 – Hardware Simulator REST API Documentation

**Base Path**: `/api/v1/hardware`  
**Authentication**: Bearer JWT (Optional/Enabled per environment)  
**Format**: `application/json`  

---

## Simulator Endpoints Summary

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/hardware/devices/:id/simulate` | Execute hardware simulator action (Scale, Printer, Scanner, Cash Drawer, Display) |
| `POST` | `/hardware/devices/:id/test-connection` | Execute connection handshake test & latency diagnostic |
| `GET` | `/hardware/simulators/status` | Get simulator engine status, supported categories & scenarios |

---

## Sample Request & Response Payloads

### 1. Digital Scale Simulation (Poll Weight)
`POST /api/v1/hardware/devices/DEV-SIM-SCALE/simulate`

```json
{
  "action": "READ_WEIGHT",
  "scenario": "SUCCESS",
  "payload": {
    "grossWeightGrams": 17.35,
    "tareWeightGrams": 2.50,
    "isStable": true
  }
}
```

**Response (200 OK)**:
```json
{
  "success": true,
  "message": "Simulation 'READ_WEIGHT' executed successfully (SUCCESS)",
  "data": {
    "deviceId": "scale-uuid-...",
    "deviceCode": "DEV-SIM-SCALE",
    "category": "DIGITAL_SCALE",
    "action": "READ_WEIGHT",
    "scenario": "SUCCESS",
    "simulationResult": {
      "deviceId": "scale-uuid-...",
      "grossWeightGrams": 17.35,
      "tareWeightGrams": 2.50,
      "netWeightGrams": 14.85,
      "unit": "g",
      "isStable": true,
      "stabilityState": "STABLE",
      "rawFrame": "ST,GS,+0017.35g",
      "timestamp": "2026-07-29T05:17:00.000Z"
    }
  }
}
```

### 2. Barcode Printer Simulation (Print Tag)
`POST /api/v1/hardware/devices/DEV-SIM-PRN/simulate`

```json
{
  "action": "PRINT_TAG",
  "scenario": "SUCCESS",
  "payload": {
    "tagData": {
      "sku": "BS-RNG-001",
      "serialNo": "SN-2026-991",
      "titleAr": "خاتم فضة إيطالي 925"
    },
    "copies": 2
  }
}
```

**Response (200 OK)**:
```json
{
  "success": true,
  "message": "Simulation 'PRINT_TAG' executed successfully (SUCCESS)",
  "data": {
    "deviceId": "prn-uuid-...",
    "deviceCode": "DEV-SIM-PRN",
    "category": "BARCODE_PRINTER",
    "action": "PRINT_TAG",
    "scenario": "SUCCESS",
    "simulationResult": {
      "deviceId": "prn-uuid-...",
      "jobId": "JOB-PRN-1785295023835",
      "status": "COMPLETED",
      "copiesPrinted": 2,
      "paperStatus": "PAPER_OK",
      "dpiResolution": 600,
      "simulatedZplCommands": "^XA^FO50,50^BQN,2,4^FDMM,BS-RNG-001^FS^FO150,50^A0N,25,25^FDخاتم فضة إيطالي 925^FS^XZ"
    }
  }
}
```

### 3. Connection Test Handshake
`POST /api/v1/hardware/devices/DEV-SIM-SCALE/test-connection`

```json
{
  "forceFail": false
}
```

**Response (200 OK)**:
```json
{
  "success": true,
  "message": "Handshake SUCCESSFUL for DIGITAL_SCALE [DEV-SIM-SCALE] via RS232 (COM1)",
  "data": {
    "deviceId": "scale-uuid-...",
    "deviceCode": "DEV-SIM-SCALE",
    "category": "DIGITAL_SCALE",
    "connectionType": "RS232",
    "status": "SUCCESS",
    "latencyMs": 121,
    "handshakeMessage": "Handshake SUCCESSFUL for DIGITAL_SCALE [DEV-SIM-SCALE] via RS232 (COM1)",
    "diagnostics": {
      "driverBound": true,
      "driverCode": "DRV-METTLER-RS232",
      "portOrIp": "COM1",
      "baudRateOrPort": 9600
    }
  }
}
```

### 4. Simulator Engine Status
`GET /api/v1/hardware/simulators/status`

**Response (200 OK)**:
```json
{
  "success": true,
  "data": {
    "status": "ACTIVE",
    "engineVersion": "3.3.0",
    "supportedCategories": [
      "DIGITAL_SCALE",
      "BARCODE_PRINTER",
      "BARCODE_SCANNER",
      "CASH_DRAWER",
      "CUSTOMER_DISPLAY"
    ],
    "supportedScenarios": [
      "SUCCESS",
      "TIMEOUT",
      "OFFLINE",
      "ERROR"
    ],
    "isolationMode": "STRICT_HAL_ISOLATED"
  }
}
```
