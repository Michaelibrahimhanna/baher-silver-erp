# EPIC 06 Sprint 03 – Database Changes Document

**System**: Baher Silver ERP Enterprise System  
**Module**: EPIC 06 – Customer Portal & Private Product Platform  
**Sprint**: Sprint 03 – Private Product Gallery & Design Asset Management  

---

## Database Migration Overview

Sprint 03 creates five database models in `apps/api-backend/prisma/schema.prisma` for private customer product collections, design assets, version history, favorites, and download audit logs: `CustomerProductCollection`, `CustomerDesignAsset`, `CustomerDesignVersionHistory`, `CustomerProductFavorite`, and `CustomerAssetDownloadLog`.

---

## Database Models Defined

### 1. `CustomerProductCollection`

```prisma
model CustomerProductCollection {
  id             String   @id @default(uuid())
  customerId     String
  collectionName String
  description    String?
  folderIcon     String?  @default("folder")
  createdAt      DateTime @default(now())

  @@index([customerId])
}
```

---

### 2. `CustomerDesignAsset`

```prisma
model CustomerDesignAsset {
  id               String    @id @default(uuid())
  customerId       String
  productId        String?
  assetName        String
  fileUrl          String
  previewUrl       String?
  model3dUrl       String?
  fileType         String    // CAD_STL | CAD_3DM | CAD_DXF | PDF | IMAGE | PRODUCTION_DOC
  version          String    @default("V1")
  isActiveVersion  Boolean   @default(true)
  lifecycleStatus  String    @default("DRAFT") // DRAFT | UNDER_REVIEW | APPROVED | ARCHIVED | DEPRECATED
  integritySha256  String?
  fileSizeBytes    Int       @default(0)
  designerName     String?
  tagsJson         String?
  dependenciesJson String?
  reviewDueDate    DateTime?
  isDeleted        Boolean   @default(false)
  deletedAt        DateTime?
  createdAt        DateTime  @default(now())
  updatedAt        DateTime  @updatedAt

  @@index([customerId])
  @@index([productId])
  @@index([lifecycleStatus])
  @@index([isDeleted])
}
```

---

### 3. `CustomerDesignVersionHistory`

```prisma
model CustomerDesignVersionHistory {
  id                  String   @id @default(uuid())
  assetId             String
  versionNumber       String
  fileUrl             String
  integritySha256     String?
  changeNotes         String?
  rollbackFromVersion String?
  createdAt           DateTime @default(now())

  @@index([assetId])
}
```

---

### 4. `CustomerProductFavorite`

```prisma
model CustomerProductFavorite {
  id            String   @id @default(uuid())
  customerId    String
  productId     String?
  designAssetId String?
  createdAt     DateTime @default(now())

  @@index([customerId])
}
```

---

### 5. `CustomerAssetDownloadLog`

```prisma
model CustomerAssetDownloadLog {
  id           String   @id @default(uuid())
  customerId   String
  assetId      String
  downloadedBy String
  ipAddress    String?
  timestamp    DateTime @default(now())

  @@index([customerId])
  @@index([assetId])
}
```

---

## Migration Steps Executed

1. Updated `apps/api-backend/prisma/schema.prisma`.
2. Executed `npx prisma db push` to synchronize SQLite `dev.db`.
3. Executed `npx prisma generate` to re-generate TypeScript `@prisma/client` types.
