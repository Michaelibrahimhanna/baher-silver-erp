# EPIC 04 Sprint 04 – Database Changes Document

**System**: Baher Silver ERP Enterprise System  
**Module**: EPIC 04 – QR & Digital Product Passport  
**Sprint**: Sprint 04 – DPP Administration & Content Management  

---

## Database Migration Overview

Sprint 04 enhances `DigitalProductPassportDraft` with publishing workflow timestamps/users (`reviewedBy`, `archivedBy`, `scheduledPublishAt`, `versionSeq`) and creates `DppContentVersionHistory`, `DppCertificateTemplate`, and `DppPublishingAuditLog` database models.

---

## Extended Database Models

### 1. `DigitalProductPassportDraft` (Updated Model)

```prisma
model DigitalProductPassportDraft {
  id                    String    @id @default(uuid())
  dppCode               String    @unique
  pieceId               String    @unique
  serialNo              String    @unique
  sku                   String
  dppUrl                String
  canonicalUrl          String?
  qrPayload             String
  status                String    @default("DRAFT") // DRAFT | REVIEW | PUBLISHED | ARCHIVED
  metadataJson          String
  mediaGalleryJson      String?
  specsJson             String?
  manufacturingJson     String?
  careInstructionsJson  String?
  warrantyDetailsJson   String?
  digitalCertificatesJson String?
  documentsJson         String?
  supportInfoJson       String?
  relatedProductsJson   String?
  publishedAt           DateTime?
  reviewedAt            DateTime?
  reviewedBy            String?
  archivedAt            DateTime?
  archivedBy            String?
  scheduledPublishAt    DateTime?
  templateVersionId     String?
  versionSeq            Int       @default(1)
  viewCount             Int       @default(0)
  expiringUrlEnabled    Boolean   @default(false)
  expiresAt             DateTime?
  securityToken         String?
  createdAt             DateTime  @default(now())
  updatedAt             DateTime  @updatedAt

  @@index([dppCode])
  @@index([serialNo])
  @@index([status])
}
```

---

### 2. `DppContentVersionHistory` (New Model)

Stores version snapshots for rollback and audit diff inspection:

```prisma
model DppContentVersionHistory {
  id            String   @id @default(uuid())
  dppCode       String
  serialNo      String
  versionSeq    Int
  snapshotJson  String   // Complete JSON snapshot of metadata, media, specs, care, warranty
  changeSummary String?
  createdBy     String   @default("ADMIN")
  createdAt     DateTime @default(now())

  @@index([serialNo])
  @@index([dppCode])
}
```

---

### 3. `DppCertificateTemplate` (New Model)

Stores certificate templates with live preview layout configurations:

```prisma
model DppCertificateTemplate {
  id               String   @id @default(uuid())
  templateName     String
  versionNo        String   @default("v1.0")
  issuerAuthority  String
  layoutConfigJson String   // CSS/HTML layout structure for live preview
  isDefault        Boolean  @default(false)
  createdAt        DateTime @default(now())
  updatedAt        DateTime @updatedAt
}
```

---

### 4. `DppPublishingAuditLog` (New Model)

Stores status transition audit logs:

```prisma
model DppPublishingAuditLog {
  id          String   @id @default(uuid())
  dppCode     String
  serialNo    String
  fromStatus  String
  toStatus    String
  performedBy String   @default("ADMIN")
  reason      String?
  diffJson    String?  // State change diff
  timestamp   DateTime @default(now())

  @@index([serialNo])
  @@index([dppCode])
  @@index([timestamp])
}
```

---

## Migration Steps Executed

1. Updated `apps/api-backend/prisma/schema.prisma`.
2. Executed `npx prisma db push` to synchronize SQLite `dev.db`.
3. Executed `npx prisma generate` to re-generate TypeScript `@prisma/client` types.
