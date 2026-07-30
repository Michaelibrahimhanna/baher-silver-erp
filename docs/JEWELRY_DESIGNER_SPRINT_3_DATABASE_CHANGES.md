# EPIC 03 Sprint 03 – Database Schema & Migration Changes

**Database**: SQLite (`dev.db`)  
**ORM**: Prisma 5.x  

---

## Updated & Added Models

### 1. Updated `PrintableLabelTemplate`
Added versioning fields:

```prisma
model PrintableLabelTemplate {
  id                   String   @id @default(uuid())
  templateCode         String   @unique
  name                 String
  category             String   @default("JEWELRY_TAG")
  widthMm              Float    @default(30.0)
  heightMm             Float    @default(15.0)
  dpi                  Int      @default(600)
  defaultBarcodeFormat String   @default("CODE128")
  layoutJson           String
  versionNo            Int      @default(1)
  version              String   @default("1.0.0")
  changelog            String?
  isDefault            Boolean  @default(false)
  isActive             Boolean  @default(true)
  createdAt            DateTime @default(now())
  updatedAt            DateTime @updatedAt

  versions             LabelTemplateVersion[]
  presets              PrintPreset[]
}
```

### 2. `LabelTemplateVersion`
Stores historical version snapshots of label template layouts:

```prisma
model LabelTemplateVersion {
  id          String   @id @default(uuid())
  templateId  String
  versionNo   Int
  version     String
  layoutJson  String
  changelog   String?
  createdBy   String   @default("SYSTEM")
  createdAt   DateTime @default(now())

  template    PrintableLabelTemplate @relation(fields: [templateId], references: [id], onDelete: Cascade)

  @@index([templateId])
  @@index([versionNo])
}
```

### 3. `PrintPreset`
Binds branches, stations, printers, and label templates into reusable print presets:

```prisma
model PrintPreset {
  id               String   @id @default(uuid())
  presetCode       String   @unique
  name             String
  branchId         String?
  stationId        String?
  printerDeviceId  String?
  templateId       String
  commandLanguage  String   @default("ZPL")
  isDefault        Boolean  @default(false)
  createdAt        DateTime @default(now())
  updatedAt        DateTime @updatedAt

  template         PrintableLabelTemplate @relation(fields: [templateId], references: [id], onDelete: Cascade)

  @@index([branchId])
  @@index([stationId])
  @@index([presetCode])
}
```
