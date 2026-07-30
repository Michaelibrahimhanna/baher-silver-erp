# EPIC 02 Sprint 03.2 – Database Schema & Migration Changes

**Database**: SQLite (`dev.db`)  
**ORM**: Prisma 5.x  

---

## Schema Schema Modifications

### 1. Extended `HardwareDeviceRegistry` Model
Added fields for health, firmware tracking, auto-reconnect backoff parameters, and relations to time-series health logs and audit logs:

```prisma
model HardwareDeviceRegistry {
  // ... (Sprint 03.1 Fields) ...

  // Sprint 03.2 Extensions
  healthScore        Float    @default(100.0)
  lastPingAt         DateTime?
  lastErrorAt        DateTime?
  lastErrorMessage   String?

  firmwareVersion                String?  @default("v1.0.0")
  firmwareBuildDate              String?
  hardwareRevision               String?  @default("Rev A")
  manufacturer                   String?
  updateAvailable                Boolean  @default(false)
  latestAvailableFirmwareVersion String?
  firmwareStatus                 String   @default("UP_TO_DATE") // UP_TO_DATE | UPDATE_REQUIRED | UPDATING

  autoReconnectEnabled   Boolean  @default(true)
  maxReconnectAttempts   Int      @default(5)
  reconnectIntervalMs    Int      @default(3000)
  backoffStrategy        String   @default("EXPONENTIAL") // FIXED | EXPONENTIAL
  reconnectAttemptsCount Int      @default(0)

  healthLogs         HardwareDeviceHealthLog[]
  auditLogs          HardwareDeviceAuditLog[]
}
```

### 2. Added `HardwareDeviceHealthLog` Model
```prisma
model HardwareDeviceHealthLog {
  id             String   @id @default(uuid())
  deviceId       String
  status         String   // ONLINE | OFFLINE | DEGRADED | CONNECTING | ERROR | MAINTENANCE
  responseTimeMs Float    @default(0.0)
  pingType       String   @default("HEARTBEAT") // HEARTBEAT | MANUAL_PING | RECONNECT_TRY
  errorMessage   String?
  healthScore    Float    @default(100.0)
  timestamp      DateTime @default(now())

  device         HardwareDeviceRegistry @relation(fields: [deviceId], references: [id], onDelete: Cascade)

  @@index([deviceId])
  @@index([timestamp])
}
```

### 3. Added `HardwareDeviceAuditLog` Model
```prisma
model HardwareDeviceAuditLog {
  id          String   @id @default(uuid())
  deviceId    String?
  deviceCode  String?
  action      String   // REGISTER | UPDATE_CONFIG | STATUS_CHANGE | HEALTH_PING | RECONNECT_ATTEMPT | DRIVER_BIND | MAINTENANCE | FIRMWARE_UPDATE | CALIBRATE | SET_DEFAULT | DELETE
  performedBy String   @default("SYSTEM")
  details     String?
  metadata    String?  // JSON string
  createdAt   DateTime @default(now())

  device      HardwareDeviceRegistry? @relation(fields: [deviceId], references: [id], onDelete: SetNull)

  @@index([deviceId])
  @@index([action])
  @@index([createdAt])
}
```
