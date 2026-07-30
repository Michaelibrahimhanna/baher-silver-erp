# EPIC 05 Sprint 02 – Database Changes Document

**System**: Baher Silver ERP Enterprise System  
**Module**: EPIC 05 – Manufacturing & Production Management  
**Sprint**: Sprint 02 – Production Scheduling, Capacity Planning & Shop Floor Control  

---

## Database Migration Overview

Sprint 02 creates five database models in `apps/api-backend/prisma/schema.prisma` for production scheduling, capacity planning, labor assignments, rework tracking, shift calendars, and machine downtime: `ProductionScheduleEntry`, `LaborAssignment`, `ReworkOrderLog`, `ShiftCalendar`, and `WorkCenterDowntime`.

---

## Database Models Defined

### 1. `ProductionScheduleEntry`

```prisma
model ProductionScheduleEntry {
  id                 String   @id @default(uuid())
  moId               String
  workCenterId       String
  sequenceNo         Int      @default(10) // 10, 20, 30...
  scheduledStartDate DateTime
  scheduledEndDate   DateTime
  allocatedHours     Float
  status             String   @default("SCHEDULED") // SCHEDULED | IN_PROGRESS | COMPLETED | DELAYED
  createdAt          DateTime @default(now())

  @@index([moId])
  @@index([workCenterId])
}
```

---

### 2. `LaborAssignment`

```prisma
model LaborAssignment {
  id              String   @id @default(uuid())
  moId            String
  workCenterId    String?
  operatorId      String
  operatorName    String
  craftSkillLevel String   @default("ARTISAN") // APPRENTICE | MASTER_SILVERSMITH | ARTISAN | QC_SPECIALIST
  shiftType       String   @default("MORNING") // MORNING | EVENING | NIGHT
  assignedAt      DateTime @default(now())

  @@index([moId])
  @@index([operatorId])
}
```

---

### 3. `ReworkOrderLog`

```prisma
model ReworkOrderLog {
  id               String   @id @default(uuid())
  moId             String
  workCenterId     String?
  reworkReason     String   // DEFECTIVE_CASTING | SURFACE_POROSITY | LOOSE_STONE | RHODIUM_DISCOLORATION
  reworkStage      String   // RE_CASTING | RE_POLISHING | RE_SETTING | RE_PLATING
  quantityReworked Int
  operatorId       String?
  status           String   @default("IN_REWORK") // IN_REWORK | REWORK_COMPLETED | SCRAPPED
  createdAt        DateTime @default(now())

  @@index([moId])
}
```

---

### 4. `ShiftCalendar`

```prisma
model ShiftCalendar {
  id           String   @id @default(uuid())
  shiftName    String   // MORNING_SHIFT | EVENING_SHIFT | NIGHT_SHIFT
  startTime    String   // "08:00"
  endTime      String   // "16:00"
  breakMinutes Int      @default(60)
  isWorkingDay Boolean  @default(true)
  createdAt    DateTime @default(now())
}
```

---

### 5. `WorkCenterDowntime`

```prisma
model WorkCenterDowntime {
  id              String    @id @default(uuid())
  workCenterId    String
  downtimeReason  String    // MAINTENANCE | LASER_CALIBRATION | POWER_OUTAGE | TOOLING_REPLACEMENT
  startedAt       DateTime  @default(now())
  endedAt         DateTime?
  durationMinutes Int       @default(0)
  notes           String?

  @@index([workCenterId])
}
```

---

## Migration Steps Executed

1. Updated `apps/api-backend/prisma/schema.prisma`.
2. Executed `npx prisma db push` to synchronize SQLite `dev.db`.
3. Executed `npx prisma generate` to re-generate TypeScript `@prisma/client` types.
