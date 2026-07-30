# EPIC 04 Sprint 01 – QR Code & Digital Product Passport REST API Documentation

**Base Path**: `/api/v1/qr`  
**Authentication**: Bearer JWT (Optional/Enabled per environment)  
**Format**: `application/json`  

---

## Endpoints Summary

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/qr/generate` | Generate QR payload, validation result, SVG rendering, Base64 URI & ASCII matrix |
| `POST` | `/qr/validate` | Validate QR code syntax, URL formatting, and GS1 Digital Link URIs |
| `POST` | `/qr/render` | Render SVG, Base64 URI, and ASCII representation for QR payload |
| `GET` | `/qr/pieces/:idOrSerial` | Generate QR code integrated with EPIC 02 PhysicalPiece identity |
| `POST` | `/qr/dpp/draft` | Create or update Digital Product Passport draft |
| `GET` | `/qr/dpp/draft/:idOrSerial` | Get Digital Product Passport draft details |
| `GET` | `/qr/audits` | Query QR code generation audit logs |

---

## Sample Request & Response Payloads

### 1. Generate GS1 Digital Link QR Code
`POST /api/v1/qr/generate`

```json
{
  "format": "GS1_DIGITAL_LINK",
  "data": {
    "sku": "BS-RNG-001",
    "serialNo": "SN-2026-000941",
    "weightGrams": 16.80
  },
  "options": {
    "errorCorrection": "H"
  }
}
```

**Response (201 Created)**:
```json
{
  "success": true,
  "message": "QR code generated successfully (GS1_DIGITAL_LINK)",
  "data": {
    "format": "GS1_DIGITAL_LINK",
    "payload": "https://id.bahersilver.com/01/00000000000001/21/SN-2026-000941?3102=001680",
    "errorCorrection": "H",
    "isValid": true,
    "parsedParams": {
      "gtin": "00000000000001",
      "serialNo": "SN-2026-000941"
    },
    "render": {
      "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" ...>",
      "base64DataUri": "data:image/svg+xml;base64,PHN2ZyB4bWxucz0...",
      "ascii": "[GS1-DIGITAL-LINK: ...]"
    }
  }
}
```

### 2. Create Digital Product Passport Draft
`POST /api/v1/qr/dpp/draft`

```json
{
  "pieceIdOrSerial": "SN-2026-000941",
  "metadata": {
    "productNameAr": "خاتم فضة إيطالي مرصع بالعقيق",
    "silverPurity": "925",
    "weightGrams": 16.80,
    "origin": "Cairo, Egypt",
    "warranty": "Lifetime Authenticity Guarantee"
  }
}
```

**Response (201 Created)**:
```json
{
  "success": true,
  "message": "Digital Product Passport draft created successfully",
  "data": {
    "id": "dpp-uuid-...",
    "dppCode": "DPP-2026-000941",
    "pieceId": "piece-uuid-...",
    "serialNo": "SN-2026-000941",
    "dppUrl": "https://passport.bahersilver.com/v/SN-2026-000941",
    "status": "DRAFT",
    "metadataJson": "{\"productNameAr\":\"خاتم فضة إيطالي مرصع بالعقيق\",...}"
  }
}
```
