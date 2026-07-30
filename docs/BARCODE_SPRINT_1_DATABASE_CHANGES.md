# EPIC 03 Sprint 01 – Database Schema & Migration Changes

**Database**: SQLite (`dev.db`)  
**ORM**: Prisma 5.x  

---

## Added Models

### 1. `PrintableLabelTemplate`
Stores printable label template definitions, dimensions (mm), DPI resolution, default barcode format, and JSON layout coordinates:

```prisma
model PrintableLabelTemplate {
  id                   String   @id @default(uuid())
  templateCode         String   @unique // e.g. "LBL-JEWELRY-TAG-30X15"
  name                 String
  category             String   @default("JEWELRY_TAG") // JEWELRY_TAG | PRODUCT_BOX | PALLET_LABEL | RAW_MATERIAL
  widthMm              Float    @default(30.0)
  heightMm             Float    @default(15.0)
  dpi                  Int      @default(600) // 203 | 300 | 600
  defaultBarcodeFormat String   @default("CODE128") // CODE128 | EAN13 | GS1_128
  layoutJson           String   // JSON layout definition (positions of barcode, sku, serial, weight, purity, etc.)
  isDefault            Boolean  @default(false)
  isActive             Boolean  @default(true)
  createdAt            DateTime @default(now())
  updatedAt            DateTime @updatedAt

  @@index([category])
  @@index([templateCode])
}
```

### 2. `BarcodeGenerationAudit`
Time-series audit trail tracking all generated barcodes, formats, linked identity entities, and GS1 Application Identifier payloads:

```prisma
model BarcodeGenerationAudit {
  id              String   @id @default(uuid())
  barcodeValue    String
  format          String   // CODE128 | EAN13 | GS1_128
  entityType      String?  // PHYSICAL_PIECE | PRODUCT_MASTER | RAW_MATERIAL
  entityId        String?
  sku             String?
  serialNo        String?
  gs1PayloadJson  String?  // JSON AI mapping
  generatedBy     String   @default("SYSTEM")
  createdAt       DateTime @default(now())

  @@index([barcodeValue])
  @@index([format])
  @@index([createdAt])
}
```
