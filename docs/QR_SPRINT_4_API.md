# EPIC 04 Sprint 04 – REST API Documentation

**System**: Baher Silver ERP Enterprise System  
**Module**: EPIC 04 – QR & Digital Product Passport  
**Sprint**: Sprint 04 – DPP Administration & Content Management  

---

## Endpoint Summary

| Method | Endpoint | Description | Auth Permission |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/dpp/admin/passports` | List passports with status filters & search | `dpp.view` |
| `GET` | `/api/v1/dpp/admin/passports/:idOrSerial` | Get full editable passport with version history | `dpp.view` |
| `PUT` | `/api/v1/dpp/admin/passports/:idOrSerial` | Update passport content & create version snapshot | `dpp.edit` |
| `POST` | `/api/v1/dpp/admin/passports/:idOrSerial/rollback` | Rollback passport content to prior version sequence | `dpp.edit` |
| `POST` | `/api/v1/dpp/admin/passports/:idOrSerial/status` | Transition publishing status (`DRAFT` → `REVIEW` → `PUBLISHED` → `ARCHIVED`) | `dpp.publish` |
| `POST` | `/api/v1/dpp/admin/passports/bulk-status` | Bulk publish or archive operations | `dpp.publish` |
| `POST` | `/api/v1/dpp/admin/passports/:idOrSerial/media` | Manage media assets & trigger WebP optimization | `dpp.edit` |
| `GET` | `/api/v1/dpp/admin/templates` | List certificate templates | `dpp.view` |
| `POST` | `/api/v1/dpp/admin/templates` | Create new certificate template | `dpp.manage_templates` |
| `GET` | `/api/v1/dpp/admin/analytics/dashboard` | Get advanced analytics dashboard widgets | `dpp.view` |

---

## API Specifications & Examples

### 1. List Passports
`GET /api/v1/dpp/admin/passports?status=PUBLISHED&search=SN-2026`

#### Response (200 OK)
```json
{
  "success": true,
  "data": {
    "total": 1,
    "limit": 50,
    "offset": 0,
    "passports": [
      {
        "id": "uuid-...",
        "dppCode": "DPP-2026-000017",
        "serialNo": "SN-2026-000017",
        "sku": "BS-RNG-00192",
        "status": "PUBLISHED",
        "versionSeq": 2,
        "viewCount": 142,
        "publishedAt": "2026-07-30T04:40:48.000Z"
      }
    ]
  }
}
```

---

### 2. Transition Publishing Status
`POST /api/v1/dpp/admin/passports/SN-2026-000017/status`

#### Request Body
```json
{
  "targetStatus": "PUBLISHED",
  "reason": "Quality review passed and approved for public release"
}
```

#### Response (200 OK)
```json
{
  "success": true,
  "message": "Passport status transitioned to PUBLISHED",
  "data": {
    "id": "uuid-...",
    "dppCode": "DPP-2026-000017",
    "serialNo": "SN-2026-000017",
    "status": "PUBLISHED",
    "publishedAt": "2026-07-30T04:40:48.000Z",
    "canonicalUrl": "https://passport.bahersilver.com/v/SN-2026-000017"
  }
}
```

---

### 3. Bulk Status Operation
`POST /api/v1/dpp/admin/passports/bulk-status`

#### Request Body
```json
{
  "serialNos": ["SN-2026-000017", "SN-2026-000018"],
  "targetStatus": "ARCHIVED",
  "reason": "Bulk end of season archive"
}
```

#### Response (200 OK)
```json
{
  "success": true,
  "message": "Bulk publishing status operation completed",
  "data": [
    { "serialNo": "SN-2026-000017", "success": true, "status": "ARCHIVED" },
    { "serialNo": "SN-2026-000018", "success": true, "status": "ARCHIVED" }
  ]
}
```
