# EPIC 04 Sprint 03 – Database Changes Document

**System**: Baher Silver ERP Enterprise System  
**Module**: EPIC 04 – QR & Digital Product Passport  
**Sprint**: Sprint 03 – Customer Product Journey & After-Sales Services  

---

## Database Migration Overview

Sprint 03 enhances `DigitalProductPassportDraft` with journey fields and creates `SupportChannel` and `CertificateVersion` database models.

---

## Extended Database Models

### 1. `DigitalProductPassportDraft` (Updated Model)

Added care instructions, warranty details, digital certificates, PDF documents, support info, and related products JSON fields:

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
  status                String    @default("DRAFT")
  metadataJson          String
  mediaGalleryJson      String?
  specsJson             String?
  manufacturingJson     String?
  careInstructionsJson  String?   // Care & cleaning guidance
  warrantyDetailsJson   String?   // Read-only lifetime guarantee & terms
  digitalCertificatesJson String? // ISO certificates & hallmark badges
  documentsJson         String?   // Downloadable PDF document links
  supportInfoJson       String?   // Customer support channels
  relatedProductsJson   String?   // Related silver item recommendations
  publishedAt           DateTime?
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

### 2. `SupportChannel` (New Model)

Stores database-driven customer support contacts:

```prisma
model SupportChannel {
  id          String   @id @default(uuid())
  channelType String   // WHATSAPP | PHONE | EMAIL | SHOWROOM | WORKING_HOURS
  titleAr     String
  titleEn     String
  value       String
  icon        String?
  actionUrl   String?
  sortOrder   Int      @default(0)
  isActive    Boolean  @default(true)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

---

### 3. `CertificateVersion` (New Model)

Stores digital certificate versioning, checksums, and PDF metadata:

```prisma
model CertificateVersion {
  id            String   @id @default(uuid())
  dppCode       String
  serialNo      String
  versionNo     String   @default("v1.0")
  checksum      String   // SHA-256 or HMAC checksum of certificate
  pdfUrl        String?
  issuedAt      DateTime @default(now())
  issuedBy      String   @default("Baher Silver Quality Assurance Authority")

  @@index([serialNo])
  @@index([dppCode])
}
```

---

## Migration Steps Executed

1. Updated `apps/api-backend/prisma/schema.prisma`.
2. Executed `npx prisma db push` to synchronize SQLite `dev.db`.
3. Executed `npx prisma generate` to re-generate TypeScript `@prisma/client` types.
