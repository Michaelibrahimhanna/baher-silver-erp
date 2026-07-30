# EPIC 06 Sprint 04 – Database Changes Document

**System**: Baher Silver ERP Enterprise System  
**Module**: EPIC 06 – Customer Portal & Private Product Platform  
**Sprint**: Sprint 04 – Digital Product Passport & QR Customer Experience  

---

## Database Migration Overview

Sprint 04 creates four database models in `apps/api-backend/prisma/schema.prisma` for warranties, warranty claims, secure expiring share links, and QR scan audit analytics: `CustomerWarrantyRecord`, `CustomerWarrantyClaim`, `CustomerPassportShareLink`, and `CustomerScanAuditHistory`.

---

## Database Models Defined

### 1. `CustomerWarrantyRecord`

```prisma
model CustomerWarrantyRecord {
  id                          String    @id @default(uuid())
  customerId                  String
  pieceSerial                 String
  dppCode                     String
  certificateVerificationId  String?   @unique // e.g. CERT-VER-2026-000001
  warrantyStatus              String    @default("ACTIVE") // ACTIVE | EXPIRED | CLAIMED | VOID
  coverageType                String    @default("LIFETIME_PURITY") // LIFETIME_PURITY | CRAFTSMANSHIP | STONE_SETTING | RHODIUM_REPLATING
  warrantyStartDate           DateTime  @default(now())
  warrantyEndDate             DateTime?
  repairEventsJson            String?
  createdAt                   DateTime  @default(now())

  @@index([customerId])
  @@index([pieceSerial])
  @@index([dppCode])
}
```

---

### 2. `CustomerWarrantyClaim`

```prisma
model CustomerWarrantyClaim {
  id               String   @id @default(uuid())
  warrantyId       String
  customerId       String
  claimCode        String   @unique // e.g. CLM-2026-000001
  issueType        String   // SURFACE_TARNISH | STONE_LOOSENESS | PURITY_QUERY | OTHER
  issueDescription String
  status           String   @default("SUBMITTED") // SUBMITTED | UNDER_REVIEW | APPROVED | REJECTED
  resolutionNotes  String?
  createdAt        DateTime @default(now())

  @@index([warrantyId])
  @@index([customerId])
}
```

---

### 3. `CustomerPassportShareLink`

```prisma
model CustomerPassportShareLink {
  id                          String    @id @default(uuid())
  customerId                  String
  dppCode                     String
  shareToken                  String    @unique
  expiresAt                   DateTime
  isRevoked                   Boolean   @default(false)
  pdfSnapshotUrl              String?
  snapshotHash                String?
  isPublicVerificationEnabled Boolean   @default(true)
  viewCount                   Int       @default(0)
  createdAt                   DateTime  @default(now())

  @@index([customerId])
  @@index([shareToken])
}
```

---

### 4. `CustomerScanAuditHistory`

```prisma
model CustomerScanAuditHistory {
  id                 String   @id @default(uuid())
  customerId         String?
  dppCode            String
  pieceSerial        String?
  verificationResult String   @default("AUTHENTIC") // AUTHENTIC | COUNTERFEIT_ALERT | INVALID_TOKEN
  scannedBy          String
  scanDeviceType     String?  @default("MOBILE")
  scanGeoLocation    String?
  ipAddress          String?
  scannedAt          DateTime @default(now())

  @@index([dppCode])
  @@index([verificationResult])
}
```

---

## Migration Steps Executed

1. Updated `apps/api-backend/prisma/schema.prisma`.
2. Executed `npx prisma db push` to synchronize SQLite `dev.db`.
3. Executed `npx prisma generate` to re-generate TypeScript `@prisma/client` types.
