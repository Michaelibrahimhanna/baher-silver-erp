# EPIC 03 Sprint 01 – Barcode & Label Platform REST API Documentation

**Base Path**: `/api/v1/barcode`  
**Authentication**: Bearer JWT (Optional/Enabled per environment)  
**Format**: `application/json`  

---

## Endpoints Summary

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/barcode/generate` | Generate barcode payload, SVG rendering, Base64 URI & ASCII matrix |
| `POST` | `/barcode/validate` | Validate barcode format, length, and Modulo 10 / 103 check digits |
| `POST` | `/barcode/render` | Render SVG, Base64 URI, and ASCII representation for a code |
| `GET` | `/barcode/pieces/:idOrSerial` | Generate barcode integrated with EPIC 02 PhysicalPiece identity |
| `GET` | `/barcode/products/:idOrCode` | Generate barcode for Product Master model |
| `POST` | `/barcode/templates` | Create printable label template |
| `GET` | `/barcode/templates` | List printable label templates |
| `GET` | `/barcode/templates/:id` | Get printable label template details |
| `DELETE` | `/barcode/templates/:id` | Delete printable label template |
| `POST` | `/barcode/templates/preview` | Render label preview merging physical piece data into template layout |
| `GET` | `/barcode/audits` | Query barcode generation audit logs |

---

## Sample Request & Response Payloads

### 1. Generate GS1-128 Barcode
`POST /api/v1/barcode/generate`

```json
{
  "format": "GS1_128",
  "data": {
    "sku": "BS-RNG-001",
    "serialNo": "SN-2026-000142",
    "weightGrams": 14.85,
    "productionDate": "2026-07-29"
  }
}
```

**Response (201 Created)**:
```json
{
  "success": true,
  "message": "Barcode generated successfully (GS1_128)",
  "data": {
    "format": "GS1_128",
    "code": "(01)00000000000001(21)SN-2026-000142(3102)001485(11)260729",
    "isValid": true,
    "parsedAIs": {
      "01": "00000000000001",
      "21": "SN-2026-000142",
      "3102": "001485",
      "11": "260729"
    },
    "render": {
      "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" ...>",
      "base64DataUri": "data:image/svg+xml;base64,PHN2ZyB4bWxucz0...",
      "ascii": "|| |||| | | |||| | ||| [GS1-128: ...]"
    }
  }
}
```

### 2. Generate Barcode for Physical Piece (EPIC 02 Integration)
`GET /api/v1/barcode/pieces/SN-2026-000002?format=GS1_128`

**Response (200 OK)**:
```json
{
  "success": true,
  "message": "Barcode generated for physical piece",
  "data": {
    "pieceId": "piece-uuid-...",
    "serialNo": "SN-2026-000002",
    "sku": "PRD-2026-000002",
    "productNameAr": "خاتم فضة إيطالي مرصع بالأحجار",
    "weightGrams": 18.5,
    "silverPurity": "925",
    "barcode": {
      "format": "GS1_128",
      "code": "(01)00002026000002(21)SN-2026-000002(3102)001850",
      "isValid": true
    }
  }
}
```

### 3. Render Label Preview
`POST /api/v1/barcode/templates/preview`

```json
{
  "templateId": "lbl-tmpl-uuid-...",
  "pieceIdOrSerial": "SN-2026-000002"
}
```

**Response (200 OK)**:
```json
{
  "success": true,
  "message": "Label preview rendered successfully",
  "data": {
    "template": {
      "id": "lbl-tmpl-uuid-...",
      "templateCode": "LBL-JEWELRY-TAG-30X15",
      "name": "Standard Jewelry Butterfly Tag",
      "widthMm": 30,
      "heightMm": 15,
      "dpi": 600
    },
    "piece": {
      "serialNo": "SN-2026-000002",
      "sku": "PRD-2026-000002",
      "productNameAr": "خاتم فضة إيطالي مرصع بالأحجار",
      "weightGrams": 18.5,
      "silverPurity": "925"
    },
    "barcode": {
      "format": "CODE128",
      "code": "PRD-2026-000002",
      "render": {
        "svg": "<svg ...>"
      }
    }
  }
}
```
