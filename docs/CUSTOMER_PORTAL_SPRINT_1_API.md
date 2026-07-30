# EPIC 06 Sprint 01 – REST API Documentation

**System**: Baher Silver ERP Enterprise System  
**Module**: EPIC 06 – Customer Portal & Private Product Platform  
**Sprint**: Sprint 01 – Authentication System, Customer Accounts, Public Catalog & Private Workspace  

---

## Endpoint Summary

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/v1/customer/auth/login` | Customer Login, Rate Limiting & Session Token Issuance |
| `POST` | `/api/v1/customer/auth/logout` | Customer Logout & Session Token Revocation |
| `POST` | `/api/v1/customer/auth/password-reset` | Request Password Reset Token |
| `GET` | `/api/v1/customer/profile` | Get Customer Profile & Organization Branding |
| `PUT` | `/api/v1/customer/profile` | Update Profile, Language (AR/EN), & Terms Acceptance |
| `GET` | `/api/v1/customer/catalog` | Public Product Catalog (Visible to everyone) |
| `GET` | `/api/v1/customer/workspace/summary` | Private Customer Workspace Dashboard (Multi-tenant Isolation) |
| `GET` | `/api/v1/customer/products/private` | Private Customer Products (Multi-tenant Isolation) |

---

## API Specifications & Examples

### 1. Customer Login
`POST /api/v1/customer/auth/login`

#### Request Body
```json
{
  "email": "customer@bahersilver.com",
  "password": "password123",
  "isRememberMe": true,
  "deviceFingerprint": "DEV-FINGERPRINT-MOBILE-01"
}
```

#### Response (200 OK)
```json
{
  "success": true,
  "message": "Customer authentication successful",
  "data": {
    "user": {
      "id": "uuid-customer-01",
      "email": "customer@bahersilver.com",
      "customerName": "العميل الممتاز للتصنيع",
      "companyName": "شركة المجوهرات الذهبية والفضية",
      "preferredLanguage": "AR",
      "status": "ACTIVE",
      "lastLoginAt": "2026-07-30T05:17:51.000Z"
    },
    "session": {
      "token": "CUST-SES-b9c198a47b4a54762677928...",
      "expiresAt": "2026-08-29T05:17:51.000Z"
    }
  }
}
```

---

### 2. Multi-Tenant Private Workspace Summary
`GET /api/v1/customer/workspace/summary?customerId=uuid-customer-01`

#### Response (200 OK)
```json
{
  "success": true,
  "data": {
    "kpis": {
      "totalActiveMos": 1,
      "totalPrivateProducts": 1,
      "totalProducedPieces": 9,
      "totalDigitalPassports": 9
    },
    "recentMos": [
      {
        "id": "uuid-mo-01",
        "moCode": "MO-2026-000001",
        "plannedQuantity": 10,
        "completedQuantity": 9,
        "status": "COMPLETED"
      }
    ],
    "recentProducts": [
      {
        "id": "uuid-prod-private",
        "productCode": "PRD-2026-000021",
        "nameAr": "سوار فضة خاص وحصري للعميل",
        "visibilityScope": "PRIVATE"
      }
    ]
  }
}
```
