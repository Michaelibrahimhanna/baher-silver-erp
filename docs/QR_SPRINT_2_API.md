# EPIC 04 Sprint 02 – REST API Documentation

**System**: Baher Silver ERP Enterprise System  
**Module**: EPIC 04 – QR & Digital Product Passport  
**Sprint**: Sprint 02 – Public Digital Product Passport Portal  

---

## Endpoint Summary

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/v1/dpp/public/publish` | Publish a DPP passport and configure expiring URL settings | Public/Admin |
| `GET` | `/api/v1/dpp/public/:serialNoOrCode` | Get full read-only public product passport payload | Public (No Auth) |
| `POST` | `/api/v1/dpp/public/verify` | Verify product authenticity against cryptographic token | Public (No Auth) |
| `GET` | `/api/v1/dpp/public/verify/:token` | Direct token verification GET endpoint | Public (No Auth) |
| `GET` | `/api/v1/dpp/public/:serialNoOrCode/seo` | Get SEO metadata & Schema.org JSON-LD Product schema | Public (No Auth) |
| `GET` | `/api/v1/dpp/public/:serialNo/analytics` | Get public visit analytics breakdown | Internal / Admin |

---

## API Specifications & Examples

### 1. Publish Passport
`POST /api/v1/dpp/public/publish`

#### Request Body
```json
{
  "pieceIdOrSerial": "SN-2026-000008",
  "metadata": {
    "productNameAr": "خاتم فضة إيطالي مرصع بالعقيق الأحمر",
    "silverPurity": "925",
    "weightGrams": 16.80
  },
  "options": {
    "expiringUrlEnabled": false
  }
}
```

#### Response (201 Created)
```json
{
  "success": true,
  "message": "Digital Product Passport published successfully",
  "data": {
    "id": "uuid-...",
    "dppCode": "DPP-2026-000008",
    "serialNo": "SN-2026-000008",
    "status": "PUBLISHED",
    "canonicalUrl": "https://passport.bahersilver.com/v/SN-2026-000008",
    "publishedAt": "2026-07-30T04:27:00.000Z"
  }
}
```

---

### 2. Get Public Product Passport (Read-Only)
`GET /api/v1/dpp/public/SN-2026-000008`

#### Response (200 OK)
```json
{
  "success": true,
  "data": {
    "readOnly": true,
    "canonicalUrl": "https://passport.bahersilver.com/v/SN-2026-000008",
    "dppCode": "DPP-2026-000008",
    "productInfo": {
      "serialNo": "SN-2026-000008",
      "sku": "BS-RNG-00192",
      "silverPurity": "925",
      "weightGrams": 16.8,
      "viewCount": 142
    },
    "specifications": {
      "metalType": { "ar": "فضة إسترليني نقية (Silver 925)", "en": "925 Sterling Silver" },
      "hallmarkStatus": { "ar": "مختومة رسمياً بالدمغة المصرية والإيطالية (925)", "en": "Officially Hallmarked Egyptian & Italian (925)" }
    },
    "manufacturingInfo": {
      "artisanWorkshop": { "ar": "ورشة باهر سيلفر للفضة الشرقية والإيطالية", "en": "Baher Silver Master Workshop" },
      "originCountry": { "ar": "مصر — القاهرة (خان الخليلي)", "en": "Cairo, Egypt (Khan El Khalili)" }
    },
    "authenticity": {
      "verificationToken": "32c34b4e7e947bf...",
      "isAuthentic": true
    }
  }
}
```

---

### 3. Verify Authenticity
`POST /api/v1/dpp/public/verify`

#### Request Body
```json
{
  "serialNo": "SN-2026-000008",
  "verificationToken": "32c34b4e7e947bf9650c"
}
```

#### Response (200 OK)
```json
{
  "success": true,
  "data": {
    "isAuthentic": true,
    "status": "VERIFIED_AUTHENTIC",
    "message": {
      "ar": "تم التحقق بنجاح! القطعة الفضية أصلية ومعتمدة 100% من مسبك باهر سيلفر.",
      "en": "Successfully Verified! 100% Genuine Certified Silver Piece by Baher Silver."
    },
    "serialNo": "SN-2026-000008",
    "sku": "BS-RNG-00192",
    "silverPurity": "925",
    "weightGrams": 16.8
  }
}
```
