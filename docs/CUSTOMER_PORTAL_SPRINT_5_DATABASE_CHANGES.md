# EPIC 06 Sprint 05 – Database Changes Document

**System**: Baher Silver ERP Enterprise System  
**Module**: EPIC 06 – Customer Portal & Private Product Platform  
**Sprint**: Sprint 05 – Customer Service Center & Communication Hub  

---

## Database Migration Overview

Sprint 05 creates 3 new database models and enriches 1 existing model in `apps/api-backend/prisma/schema.prisma` for service center requests, service attachments, service timeline notes, and customer activity logs: `CustomerServiceRequest`, `CustomerServiceAttachment`, `CustomerServiceTimelineNote`, and `CustomerActivityLog`.

---

## Database Models Defined

### 1. `CustomerServiceRequest`

```prisma
model CustomerServiceRequest {
  id                        String    @id @default(uuid())
  requestNo                 String    @unique // e.g. SRV-2026-000001
  customerId                String
  requestType               String    // SERVICE | REPAIR | MAINTENANCE | INSPECTION
  pieceSerial               String?
  dppCode                   String?
  moId                      String?   // Linked Manufacturing Order
  warrantyId                String?   // Linked Customer Warranty
  title                     String
  description               String
  priority                  String    @default("MEDIUM") // LOW | MEDIUM | HIGH | CRITICAL
  status                    String    @default("SUBMITTED") // SUBMITTED | UNDER_REVIEW | ASSIGNED | IN_PROGRESS | FACTORY_RESPONDED | RESOLVED | REJECTED | CLOSED

  // SLA Tracking
  responseDeadline          DateTime?
  resolutionDeadline        DateTime?
  slaStatus                 String    @default("ON_TIME") // ON_TIME | NEAR_BREACH | BREACHED | MET

  // Assignment & Service Workflow
  assignedTo                String?   // Internal technician / supervisor ID or name
  assignedToName            String?
  resolutionSummary         String?
  resolutionDate            DateTime?

  // Root Cause Classification
  rootCause                 String?   // MANUFACTURING | CUSTOMER_DAMAGE | STONE | PLATING | WEAR | OTHER

  // Cost Foundation & Approval
  estimatedCost             Float     @default(0.0)
  warrantyCoveragePct       Float     @default(100.0)
  customerApprovalRequired  Boolean   @default(false)
  isCustomerApprovedCost    Boolean   @default(false)

  // Internal Technician Verification Checklist
  technicianChecklistJson   String?   // JSON array of verification steps e.g. [{ "item": "XRF Purity Test", "done": true }]

  // Service & Repair Details
  repairDetailsJson         String?   // JSON metadata for rhodium plating, stone setting, polishing steps
  inspectionResultsJson     String?   // JSON XRF purity test, density check, hallmark verification results
  scheduledDate             DateTime?

  // Customer Satisfaction Survey
  satisfactionRating        Int?      // 1 to 5 stars
  satisfactionFeedback      String?
  resolutionSatisfied       Boolean?

  // Future-Ready Hooks (Inactive until future sprints)
  liveChatSessionId         String?
  pushNotificationSent      Boolean   @default(false)
  mobileAppDeviceId         String?
  crmTicketId               String?

  createdAt                 DateTime  @default(now())
  updatedAt                 DateTime  @updatedAt

  @@index([customerId])
  @@index([requestNo])
  @@index([status])
  @@index([requestType])
  @@index([pieceSerial])
  @@index([slaStatus])
}
```

---

### 2. `CustomerServiceAttachment`

```prisma
model CustomerServiceAttachment {
  id               String   @id @default(uuid())
  serviceRequestId String
  customerId       String
  fileName         String
  fileUrl          String
  fileType         String   // IMAGE | VIDEO | PDF | CAD | OTHER
  fileSizeBytes    Int      @default(0)
  uploadedBy       String   // CUSTOMER | FACTORY
  uploadedByName   String?
  description      String?
  createdAt        DateTime @default(now())

  @@index([serviceRequestId])
  @@index([customerId])
  @@index([fileType])
}
```

---

### 3. `CustomerServiceTimelineNote`

```prisma
model CustomerServiceTimelineNote {
  id                     String   @id @default(uuid())
  serviceRequestId       String
  authorId               String?
  authorName             String
  visibility             String   @default("CUSTOMER_VISIBLE") // CUSTOMER_VISIBLE | INTERNAL_FACTORY_ONLY
  noteText               String
  previousStatus         String?
  newStatus              String?
  factoryResponseSummary String?
  createdAt              DateTime @default(now())

  @@index([serviceRequestId])
  @@index([visibility])
}
```

---

### 4. `CustomerActivityLog` (Enriched)

```prisma
model CustomerActivityLog {
  id           String   @id @default(uuid())
  customerId   String
  actionType   String?  // LOGIN | LOGOUT | PROFILE_UPDATE | VIEW_MO | VIEW_PRODUCT | PASSWORD_RESET
  activityType String?  // PASSPORT_ACCESS | QR_SCAN | FILE_DOWNLOAD | SERVICE_REQUEST | WARRANTY_CLAIM | ORDER_APPROVAL
  entityType   String?  // PASSPORT | QR | FILE | SERVICE | WARRANTY | ORDER
  entityId     String?
  details      String?
  description  String?
  ipAddress    String?
  userAgent    String?
  metadataJson String?
  timestamp    DateTime @default(now())
  createdAt    DateTime @default(now())

  @@index([customerId])
  @@index([timestamp])
  @@index([activityType])
}
```

---

## Migration Steps Executed

1. Updated `apps/api-backend/prisma/schema.prisma`.
2. Executed `npx prisma db push` to synchronize SQLite `dev.db`.
3. Executed `npx prisma generate` to re-generate TypeScript `@prisma/client` types.
