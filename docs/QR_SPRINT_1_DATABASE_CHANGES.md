# EPIC 04 Sprint 01 – Database Schema & Migration Changes

**Database**: SQLite (`dev.db`)  
**ORM**: Prisma 5.x  

---

## Added Models

### 1. `QrCodeAuditLog`
Time-series audit trail recording all generated QR codes, format types, error correction levels, linked identity records, and verification tokens:

```prisma
model QrCodeAuditLog {
  id                String   @id @default(uuid())
  qrPayload         String
  qrType            String   // URL | GS1_DIGITAL_LINK | JSON_PAYLOAD | VERIFICATION_TOKEN
  errorCorrection   String   @default("M") // L | M | Q | H
  entityType        String?  // PHYSICAL_PIECE | PRODUCT_MASTER | RAW_MATERIAL
  entityId          String?
  serialNo          String?
  verificationToken String?
  generatedBy       String   @default("SYSTEM")
  createdAt         DateTime @default(now())

  @@index([qrPayload])
  @@index([qrType])
  @@index([createdAt])
}
```

### 2. `DigitalProductPassportDraft`
Stores Digital Product Passport draft definitions, unique `dppCode`, serial number, SKU, DPP URL, QR payload, draft status, and metadata JSON:

```prisma
model DigitalProductPassportDraft {
  id           String   @id @default(uuid())
  dppCode      String   @unique // e.g. "DPP-2026-000941"
  pieceId      String   @unique
  serialNo     String   @unique
  sku          String
  dppUrl       String   // e.g. "https://passport.bahersilver.com/v/SN-2026-000941"
  qrPayload    String
  status       String   @default("DRAFT") // DRAFT | PUBLISHED | ARCHIVED
  metadataJson String   // Material composition, purity 925, craftsmanship notes, origin
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt

  @@index([dppCode])
  @@index([serialNo])
}
```
