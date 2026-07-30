# EPIC 03 Sprint 02 – Database Schema & Migration Changes

**Database**: SQLite (`dev.db`)  
**ORM**: Prisma 5.x  

---

## Added Models

### 1. `PrintJobQueue`
Manages asynchronous print job queues, target hardware printer bindings, generated command streams (ZPL, EPL, PDF), job statuses, and retry counters:

```prisma
model PrintJobQueue {
  id                 String   @id @default(uuid())
  jobNo              String   @unique // e.g. "JOB-2026-000412"
  printerDeviceId    String?
  printerDeviceCode  String?
  templateId         String?
  pieceId            String?
  serialNo           String?
  sku                String?
  commandLanguage    String   @default("ZPL") // ZPL | EPL | PDF_VECTOR | SVG
  rawCommandStream   String   // Generated ZPL/EPL/PDF command stream
  copies             Int      @default(1)
  status             String   @default("QUEUED") // QUEUED | PROCESSING | PRINTED | FAILED | CANCELLED | RETRYING
  retryCount         Int      @default(0)
  maxRetries         Int      @default(3)
  errorMessage       String?
  requestedBy        String   @default("SYSTEM")
  queuedAt           DateTime @default(now())
  printedAt          DateTime?
  updatedAt          DateTime @updatedAt

  auditLogs          PrintJobAuditLog[]

  @@index([status])
  @@index([printerDeviceId])
  @@index([queuedAt])
}
```

### 2. `PrintJobAuditLog`
Time-series audit trail recording all lifecycle actions for a print job (`ENQUEUE`, `DISPATCH`, `PRINT_SUCCESS`, `PRINT_FAILURE`, `RETRY_ATTEMPT`, `CANCEL`):

```prisma
model PrintJobAuditLog {
  id          String   @id @default(uuid())
  printJobId  String
  action      String
  status      String
  details     String?
  timestamp   DateTime @default(now())

  printJob    PrintJobQueue @relation(fields: [printJobId], references: [id], onDelete: Cascade)

  @@index([printJobId])
  @@index([timestamp])
}
```
