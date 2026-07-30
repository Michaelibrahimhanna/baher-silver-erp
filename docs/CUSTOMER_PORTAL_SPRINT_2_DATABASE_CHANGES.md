# EPIC 06 Sprint 02 – Database Changes Document

**System**: Baher Silver ERP Enterprise System  
**Module**: EPIC 06 – Customer Portal & Private Product Platform  
**Sprint**: Sprint 02 – Manufacturing Orders & Customer Collaboration  

---

## Database Migration Overview

Sprint 02 creates three database models in `apps/api-backend/prisma/schema.prisma` for customer design approvals, CAD attachments (STL/3DM/DXF), and customer-visible vs internal notes: `CustomerOrderApproval`, `CustomerOrderAttachment`, and `CustomerOrderNote`.

---

## Database Models Defined

### 1. `CustomerOrderApproval`

```prisma
model CustomerOrderApproval {
  id                String    @id @default(uuid())
  moId              String
  customerId        String
  approvalStage     String    @default("CAD_DESIGN") // CAD_DESIGN | WAX_PROTOTYPE | FINAL_QC
  designVersion     String    @default("V1") // V1, V2, V3...
  previousVersionId String?
  changeSummary     String?
  status            String    @default("PENDING") // PENDING | APPROVED | REJECTED | REVISION_REQUESTED
  approvalDeadline  DateTime?
  feedbackNotes     String?
  cadFileUrl        String?
  previewUrl        String?
  actionBy          String?
  actionAt          DateTime?
  createdAt         DateTime  @default(now())

  @@index([moId])
  @@index([customerId])
  @@index([status])
}
```

---

### 2. `CustomerOrderAttachment`

```prisma
model CustomerOrderAttachment {
  id           String   @id @default(uuid())
  moId         String
  customerId   String
  fileName     String
  fileUrl      String
  previewUrl   String?
  thumbnailUrl String?
  fileType     String   // IMAGE | PDF | CAD_STL | CAD_3DM | CAD_DXF | PRODUCTION_DOC
  fileSizeBytes Int     @default(0)
  uploadedBy   String
  createdAt    DateTime @default(now())

  @@index([moId])
  @@index([customerId])
}
```

---

### 3. `CustomerOrderNote`

```prisma
model CustomerOrderNote {
  id                String    @id @default(uuid())
  moId              String
  customerId        String?
  noteType          String    @default("CUSTOMER_VISIBLE") // CUSTOMER_VISIBLE | INTERNAL_FACTORY_ONLY
  noteText          String
  authorName        String
  isImmutable       Boolean   @default(true)
  readByCustomerAt  DateTime?
  readByFactoryAt   DateTime?
  createdAt         DateTime  @default(now())

  @@index([moId])
  @@index([noteType])
}
```

---

## Migration Steps Executed

1. Updated `apps/api-backend/prisma/schema.prisma`.
2. Executed `npx prisma db push` to synchronize SQLite `dev.db`.
3. Executed `npx prisma generate` to re-generate TypeScript `@prisma/client` types.
