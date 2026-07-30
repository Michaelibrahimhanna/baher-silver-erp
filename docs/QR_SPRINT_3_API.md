# EPIC 04 Sprint 03 – REST API Documentation

**System**: Baher Silver ERP Enterprise System  
**Module**: EPIC 04 – QR & Digital Product Passport  
**Sprint**: Sprint 03 – Customer Product Journey & After-Sales Services  

---

## Endpoint Summary

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/dpp/journey/:serialNoOrCode` | Get full customer product journey & after-sales data | Public (No Auth) |
| `GET` | `/api/v1/dpp/journey/:serialNoOrCode/care-warranty` | Get care tips & read-only warranty details | Public (No Auth) |
| `GET` | `/api/v1/dpp/journey/:serialNoOrCode/certificates` | Get digital certificates, trust badges & versioning | Public (No Auth) |
| `GET` | `/api/v1/dpp/journey/:serialNoOrCode/timeline` | Get product lifecycle timeline milestones | Public (No Auth) |
| `GET` | `/api/v1/dpp/journey/:serialNoOrCode/pdf` | Download or view Digital Passport PDF Certificate (`?format=html` or `json`) | Public (No Auth) |

---

## API Specifications & Examples

### 1. Get Full Customer Journey
`GET /api/v1/dpp/journey/SN-2026-000011`

#### Response (200 OK)
```json
{
  "success": true,
  "data": {
    "readOnly": true,
    "serialNo": "SN-2026-000011",
    "dppCode": "DPP-2026-000011",
    "productTitle": {
      "ar": "خاتم فضة إيطالي مرصع بالعقيق الأحمـر",
      "en": "Italian Silver Ring with Red Agate"
    },
    "careInstructions": {
      "title": { "ar": "تعليمات العناية بالفضة والأحجار الكريمة", "en": "Product Care & Preservation Instructions" },
      "tips": [
        {
          "id": "cleaning",
          "icon": "✨",
          "title": { "ar": "التنظيف الدوري الناعم", "en": "Gentle Periodic Cleaning" }
        }
      ]
    },
    "warrantyInfo": {
      "isReadOnly": true,
      "badgeText": { "ar": "ضمان الفضة النقية 925 مدى الحياة", "en": "Lifetime 925 Silver Purity Guarantee" }
    },
    "digitalCertificates": {
      "certificateId": "CERT-2026-2026000011",
      "versionNo": "v1.0",
      "checksum": "SHA256:f1e261ec0d12ca2b",
      "trustBadges": [
        { "key": "hallmark", "icon": "🏛️", "labelAr": "مختوم بدمغة الفضة المصرية 925" },
        { "key": "iso", "icon": "🏅", "labelAr": "معتمد ISO 9001:2015 للجودة" }
      ]
    },
    "productTimeline": [
      {
        "eventType": "MANUFACTURING_CASTING",
        "title": { "ar": "سبك وصياغة الفضة 925", "en": "925 Silver Casting & Handcrafting" },
        "location": "Khan El Khalili Master Workshop"
      }
    ],
    "supportChannels": [
      {
        "channelType": "WHATSAPP",
        "title": { "ar": "خدمة العملاء عبر واتساب", "en": "WhatsApp Customer Care" },
        "value": "+20 100 000 0000",
        "actionUrl": "https://wa.me/201000000000"
      }
    ]
  }
}
```

---

### 2. Download Passport PDF Certificate
`GET /api/v1/dpp/journey/SN-2026-000011/pdf?format=html`

#### Response Header
`Content-Type: text/html; charset=utf-8`

#### Response Body
Rendered printable HTML passport certificate with Baher Silver logo, product specifications, 925 silver guarantee seal, and SHA-256 checksum.
