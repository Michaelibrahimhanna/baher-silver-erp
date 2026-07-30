# EPIC 03 Sprint 03 – Jewelry Label Designer REST API Documentation

**Base Path**: `/api/v1`  
**Authentication**: Bearer JWT (Optional/Enabled per environment)  
**Format**: `application/json`  

---

## Endpoints Summary

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/printing/presets` | Create print preset for branch / station |
| `GET` | `/printing/presets` | List print presets with branch / station filters |
| `GET` | `/printing/presets/resolve` | Resolve active default print preset for station |
| `DELETE` | `/printing/presets/:id` | Delete print preset |
| `POST` | `/barcode/templates/:id/versions` | Create version snapshot for label template |
| `GET` | `/barcode/templates/:id/versions` | List version history for label template |
| `GET` | `/barcode/templates/:id/export` | Export label template JSON package |
| `POST` | `/barcode/templates/import` | Import label template JSON package |

---

## Sample Request & Response Payloads

### 1. Create Print Preset for Station
`POST /api/v1/printing/presets`

```json
{
  "presetCode": "PRESET-MAIN-HQ-SCALE01",
  "name": "Main Branch POS Thermal Scale Preset",
  "branchId": "BRANCH-MAIN",
  "stationId": "station-uuid-...",
  "printerDeviceId": "printer-uuid-...",
  "templateId": "tmpl-uuid-...",
  "commandLanguage": "ZPL",
  "isDefault": true
}
```

**Response (201 Created)**:
```json
{
  "success": true,
  "message": "Print preset created successfully",
  "data": {
    "id": "preset-uuid-...",
    "presetCode": "PRESET-MAIN-HQ-SCALE01",
    "name": "Main Branch POS Thermal Scale Preset",
    "commandLanguage": "ZPL",
    "isDefault": true,
    "template": {
      "templateCode": "LBL-TAIL-50X15",
      "widthMm": 50,
      "heightMm": 15
    }
  }
}
```

### 2. Export Label Template Package
`GET /api/v1/barcode/templates/LBL-TAIL-JEWELRY-50X15/export`

**Response (200 OK)**:
```json
{
  "success": true,
  "data": {
    "schemaVersion": "EPIC03-SPRINT03-V1",
    "exportedAt": "2026-07-29T06:16:11.000Z",
    "template": {
      "templateCode": "LBL-TAIL-JEWELRY-50X15",
      "name": "Custom Jewelry Mouse-Tail Tag (50x15mm)",
      "widthMm": 50,
      "heightMm": 15,
      "dpi": 600,
      "version": "1.1.0",
      "layout": {
        "labelType": "MOUSE_TAIL",
        "elements": [
          { "id": "el-1", "type": "text", "field": "name", "xMm": 2, "yMm": 2 },
          { "id": "el-2", "type": "barcode", "field": "barcode", "xMm": 2, "yMm": 4.5 }
        ]
      }
    }
  }
}
```

### 3. Create Template Version Snapshot
`POST /api/v1/barcode/templates/tmpl-uuid-.../versions`

```json
{
  "changelog": "Adjusted barcode position for 600dpi mouse-tail tag"
}
```

**Response (201 Created)**:
```json
{
  "success": true,
  "message": "Created template version 1.1.0",
  "data": {
    "template": {
      "id": "tmpl-uuid-...",
      "versionNo": 2,
      "version": "1.1.0",
      "changelog": "Adjusted barcode position for 600dpi mouse-tail tag"
    },
    "version": {
      "id": "ver-uuid-...",
      "versionNo": 2,
      "version": "1.1.0"
    }
  }
}
```
