# EPIC 06 Sprint 01 – Database Changes Document

**System**: Baher Silver ERP Enterprise System  
**Module**: EPIC 06 – Customer Portal & Private Product Platform  
**Sprint**: Sprint 01 – Authentication System, Customer Accounts, Public Catalog & Private Workspace  

---

## Database Migration Overview

Sprint 01 creates six database models in `apps/api-backend/prisma/schema.prisma` for multi-tenant customer authentication, organization branding, sessions, permissions, product visibility, and customer activity logs: `CustomerOrganization`, `CustomerPortalUser`, `CustomerSession`, `CustomerPermission`, `CustomerProductVisibility`, and `CustomerActivityLog`.

---

## Database Models Defined

### 1. `CustomerOrganization`

```prisma
model CustomerOrganization {
  id                 String   @id @default(uuid())
  orgCode            String   @unique // e.g. ORG-2026-000001
  companyName        String
  taxRegistrationNo String?
  logoUrl            String?
  themePrimaryColor  String   @default("#C3B097")
  createdAt          DateTime @default(now())
  updatedAt          DateTime @updatedAt
}
```

---

### 2. `CustomerPortalUser`

```prisma
model CustomerPortalUser {
  id                String    @id @default(uuid())
  orgId             String?
  email             String    @unique
  passwordHash      String
  customerName      String
  companyName       String
  phoneNumber       String?
  logoUrl           String?
  preferredLanguage String    @default("AR") // AR | EN
  status            String    @default("ACTIVE") // PENDING | ACTIVE | LOCKED | SUSPENDED | ARCHIVED
  loginAttempts     Int       @default(0)
  lockoutUntil      DateTime?
  lastLoginAt       DateTime?
  lastLoginIp       String?
  acceptedTermsAt   DateTime?
  termsVersion      String?   @default("v1.0")
  resetToken        String?
  createdAt         DateTime  @default(now())
  updatedAt         DateTime  @updatedAt

  @@index([email])
  @@index([status])
  @@index([orgId])
}
```

---

### 3. `CustomerSession`

```prisma
model CustomerSession {
  id                String   @id @default(uuid())
  customerId        String
  sessionToken      String   @unique
  isRememberMe      Boolean  @default(false)
  deviceFingerprint String?
  ipAddress         String?
  userAgent         String?
  expiresAt         DateTime
  isRevoked         Boolean  @default(false)
  createdAt         DateTime @default(now())

  @@index([customerId])
  @@index([sessionToken])
}
```

---

### 4. `CustomerPermission`

```prisma
model CustomerPermission {
  id            String   @id @default(uuid())
  customerId    String
  permissionKey String   // view_products | view_mos | view_passports | download_pdf
  isGranted     Boolean  @default(true)

  @@index([customerId])
}
```

---

### 5. `CustomerProductVisibility`

```prisma
model CustomerProductVisibility {
  id              String   @id @default(uuid())
  productId       String
  customerId      String?
  orgId           String?
  visibilityScope String   @default("PUBLIC") // PUBLIC | PRIVATE | SHARED
  createdAt       DateTime @default(now())

  @@index([productId])
  @@index([customerId])
  @@index([visibilityScope])
}
```

---

### 6. `CustomerActivityLog`

```prisma
model CustomerActivityLog {
  id         String   @id @default(uuid())
  customerId String
  actionType String   // LOGIN | LOGOUT | PROFILE_UPDATE | VIEW_MO | VIEW_PRODUCT | PASSWORD_RESET
  details    String?
  ipAddress  String?
  userAgent  String?
  timestamp  DateTime @default(now())

  @@index([customerId])
  @@index([timestamp])
}
```

---

## Migration Steps Executed

1. Updated `apps/api-backend/prisma/schema.prisma`.
2. Executed `npx prisma db push` to synchronize SQLite `dev.db`.
3. Executed `npx prisma generate` to re-generate TypeScript `@prisma/client` types.
