# EPIC 05 Sprint 03 – Database Changes Document

**System**: Baher Silver ERP Enterprise System  
**Module**: EPIC 05 – Manufacturing & Production Management  
**Sprint**: Sprint 03 – Quality Management & Manufacturing Traceability  

---

## Database Migration Overview

Sprint 03 creates six database models in `apps/api-backend/prisma/schema.prisma` for quality management, electronic signatures, NCR, CAPA, digital work instructions, measurement device registry, and escalation alerts: `QualityInspection`, `NonConformanceReport`, `MeasurementDevice`, `CapaRecord`, `DigitalWorkInstruction`, and `QualityAlertEscalation`.

---

## Database Models Defined

### 1. `QualityInspection`

```prisma
model QualityInspection {
  id                     String    @id @default(uuid())
  moId                   String
  pieceSerial            String?
  workCenterId           String?
  deviceId               String?
  inspectionType         String    // IN_PROCESS | FINAL_QC | SILVER_PURITY_XRF | DENSITY_TEST
  testedSilverPurity     Float?    // e.g. 925.4
  sampleSize             Int       @default(1)
  aqlLevel               String    @default("AQL_1_5")
  inspectorId            String
  inspectorName          String
  status                 String    // PASSED | FAILED | ACCEPT_WITH_CONCESSION
  checkpointResultsJson String
  eSignatureHash         String?
  signedBy               String?
  signedAt               DateTime?
  createdAt              DateTime  @default(now())

  @@index([moId])
  @@index([pieceSerial])
  @@index([status])
}
```

---

### 2. `NonConformanceReport`

```prisma
model NonConformanceReport {
  id                   String    @id @default(uuid())
  ncrCode              String    @unique // e.g. NCR-2026-000001
  moId                 String
  pieceSerial          String?
  complaintReferenceId String?
  defectCategory       String    // POROSITY | PURITY_DEVIATION | DIMENSIONAL | STONE_LOOSENESS | FINISH_SCRATCH
  severity             String    @default("MEDIUM") // MINOR | MEDIUM | MAJOR | CRITICAL
  dispositionAction    String    @default("REWORK") // REWORK | SCRAP | ACCEPT_WITH_CONCESSION | RETURN_TO_VENDOR
  rootCauseDescription String?
  correctiveAction     String?
  attachmentsJson      String?
  status               String    @default("OPEN") // OPEN | UNDER_INVESTIGATION | RESOLVED | CLOSED
  reportedBy           String
  resolvedBy           String?
  createdAt            DateTime  @default(now())
  resolvedAt           DateTime?

  @@index([ncrCode])
  @@index([moId])
  @@index([status])
}
```

---

### 3. `MeasurementDevice`

```prisma
model MeasurementDevice {
  id                  String   @id @default(uuid())
  deviceCode          String   @unique // e.g. DEV-XRF-01, DEV-LASER-CALIPER-02
  deviceName          String
  deviceType          String   // XRF_SPECTROMETER | LASER_CALIPER | DENSITY_BALANCE | MICROMETER
  calibrationDueDate DateTime
  status              String   @default("CALIBRATED") // CALIBRATED | PENDING_CALIBRATION | OUT_OF_SERVICE
  createdAt           DateTime @default(now())
}
```

---

### 4. `CapaRecord`

```prisma
model CapaRecord {
  id                   String    @id @default(uuid())
  capaCode             String    @unique // e.g. CAPA-2026-000001
  ncrId                String?
  actionType           String    @default("CORRECTIVE") // CORRECTIVE | PREVENTIVE
  description          String
  assignedTo           String
  targetCompletionDate DateTime?
  status               String    @default("OPEN") // OPEN | IN_PROGRESS | VERIFIED | CLOSED
  createdAt            DateTime  @default(now())
  closedAt             DateTime?

  @@index([capaCode])
}
```

---

### 5. `DigitalWorkInstruction`

```prisma
model DigitalWorkInstruction {
  id                  String   @id @default(uuid())
  stage               String   // CASTING | POLISHING | SETTING | RHODIUM | QC
  titleAr             String
  titleEn             String
  stepSequence        Int      @default(10)
  instructionTextAr   String
  instructionTextEn   String
  diagramUrl          String?
  safetyNotes         String?
  createdAt           DateTime @default(now())

  @@index([stage])
}
```

---

### 6. `QualityAlertEscalation`

```prisma
model QualityAlertEscalation {
  id          String   @id @default(uuid())
  alertCode   String   @unique
  alertType   String   // RECURRING_DEFECT | PURITY_OUT_OF_SPEC | HIGH_SCRAP_RATE | NCR_OVERDUE
  severity    String   @default("HIGH") // MEDIUM | HIGH | URGENT
  moId        String?
  message     String
  status      String   @default("ACTIVE") // ACTIVE | ACKNOWLEDGED | RESOLVED
  triggeredAt DateTime @default(now())

  @@index([status])
}
```

---

## Migration Steps Executed

1. Updated `apps/api-backend/prisma/schema.prisma`.
2. Executed `npx prisma db push` to synchronize SQLite `dev.db`.
3. Executed `npx prisma generate` to re-generate TypeScript `@prisma/client` types.
