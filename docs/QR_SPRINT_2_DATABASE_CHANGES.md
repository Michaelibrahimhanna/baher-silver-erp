# EPIC 04 Sprint 02 – Database Changes Document

**System**: Baher Silver ERP Enterprise System  
**Module**: EPIC 04 – QR & Digital Product Passport  
**Sprint**: Sprint 02 – Public Digital Product Passport Portal  

---

## Database Migration Overview

Sprint 02 enhances `schema.prisma` to support public digital product passports, canonical URLs, expiring URLs, and visitor analytics tracking.

---

## Extended Database Models

### 1. `DigitalProductPassportDraft` (Updated Model)

Added canonical URL, media gallery, technical specifications, manufacturing details, published timestamp, view counter, expiring URL flag, and security token fields:

```prisma
model DigitalProductPassportDraft {
  id                 String    @id @default(uuid())
  dppCode            String    @unique // e.g. "DPP-2026-000941"
  pieceId            String    @unique
  serialNo           String    @unique
  sku                String
  dppUrl             String    // e.g. "https://passport.bahersilver.com/v/SN-2026-000941"
  canonicalUrl       String?   // Canonical public URL e.g. "https://passport.bahersilver.com/v/SN-2026-000941"
  qrPayload          String
  status             String    @default("DRAFT") // DRAFT | PUBLISHED | ARCHIVED
  metadataJson       String    // Material composition, purity 925, craftsmanship notes, origin
  mediaGalleryJson   String?   // Images and video preview links
  specsJson          String?   // Product technical specifications
  manufacturingJson  String?   // Artisan workshop, batch ID, origin, inspection details
  publishedAt        DateTime?
  viewCount          Int       @default(0)
  expiringUrlEnabled Boolean   @default(false)
  expiresAt          DateTime?
  securityToken      String?
  createdAt          DateTime  @default(now())
  updatedAt          DateTime  @updatedAt

  @@index([dppCode])
  @@index([serialNo])
  @@index([status])
}
```

---

### 2. `PublicDppAnalyticsLog` (New Model)

Stores public visitor analytics logs including access source, device classification, user agent, country code, IP address, and timestamp:

```prisma
model PublicDppAnalyticsLog {
  id          String   @id @default(uuid())
  dppCode     String
  serialNo    String
  viewSource  String   @default("DIRECT") // DIRECT | QR_SCAN | SOCIAL | EMBED
  deviceType  String   @default("DESKTOP") // MOBILE | TABLET | DESKTOP | BOT
  userAgent   String?
  countryCode String   @default("EG")
  ipAddress   String?
  visitedAt   DateTime @default(now())

  @@index([serialNo])
  @@index([dppCode])
  @@index([visitedAt])
}
```

---

## Migration Steps Executed

1. Updated `apps/api-backend/prisma/schema.prisma`.
2. Executed `npx prisma db push` to synchronize SQLite `dev.db`.
3. Executed `npx prisma generate` to re-generate TypeScript `@prisma/client` types.
