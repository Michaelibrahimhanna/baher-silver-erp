# EPIC 06 Sprint 04 – REST API Documentation

**System**: Baher Silver ERP Enterprise System  
**Module**: EPIC 06 – Customer Portal & Private Product Platform  
**Sprint**: Sprint 04 – Digital Product Passport & QR Customer Experience  

---

## Endpoint Summary

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/v1/customer/dpp/passports/:serialOrDpp` | Get Customer Digital Product Passport Viewer Payload & PDF Snapshot |
| `POST` | `/api/v1/customer/dpp/qr/verify` | QR Experience & Anti-Counterfeit Verification |
| `GET` | `/api/v1/customer/dpp/warranties` | Get Warranty Center Status & Submitted Claims |
| `POST` | `/api/v1/customer/dpp/warranties/claims` | Submit Customer Warranty Claim |
| `POST` | `/api/v1/customer/dpp/share` | Create Secure Expiring Share Link |
| `GET` | `/api/v1/customer/dpp/share/:shareToken` | Read-Only Shared Passport View |
| `GET` | `/api/v1/customer/dpp/graph/:pieceSerial` | Get 360° Asset Relationship Graph Viewer |

---

## API Specifications & Examples

### 1. QR Experience & Anti-Counterfeit Verification
`POST /api/v1/customer/dpp/qr/verify`

#### Request Body
```json
{
  "dppCode": "DPP-2026-000086",
  "verificationToken": "VERIF-TOK-ABC123XYZ",
  "scannedBy": "مستخدم آيفون",
  "scanDeviceType": "MOBILE_IOS"
}
```

#### Response (200 OK)
```json
{
  "success": true,
  "data": {
    "isAuthentic": true,
    "verificationResult": "AUTHENTIC",
    "message": "قطعة فضة باهر سيلفر أصلية وموثقة 100% 🛡️",
    "dppCode": "DPP-2026-000086",
    "serialNo": "SN-2026-000086",
    "totalScansCount": 1
  }
}
```

---

### 2. Get 360° Asset Relationship Graph Viewer
`GET /api/v1/customer/dpp/graph/SN-2026-000086?customerId=uuid-customer-01`

#### Response (200 OK)
```json
{
  "success": true,
  "data": {
    "graphNodes": [
      { "id": "NODE-PRODUCT", "type": "PRODUCT_MASTER", "label": "خاتم الفضة الإيطالي المرصع بالياقوت الأحمر" },
      { "id": "NODE-CAD", "type": "DESIGN_ASSET", "label": "ملف التصميم 3D" },
      { "id": "NODE-PIECE", "type": "PHYSICAL_PIECE", "label": "SN-2026-000086" },
      { "id": "NODE-LABEL", "type": "BARCODE_TAG", "label": "قالب بطاقة المجوهرات 925" },
      { "id": "NODE-PASSPORT", "type": "DPP_PASSPORT", "label": "DPP-2026-000086" }
    ],
    "graphEdges": [
      { "source": "NODE-PRODUCT", "target": "NODE-CAD", "relation": "HAS_DESIGN_3D" },
      { "source": "NODE-PRODUCT", "target": "NODE-PIECE", "relation": "PRODUCED_UNIT" },
      { "source": "NODE-PIECE", "target": "NODE-LABEL", "relation": "TAGGED_WITH" },
      { "source": "NODE-PIECE", "target": "NODE-PASSPORT", "relation": "DIGITAL_TWIN" }
    ]
  }
}
```
