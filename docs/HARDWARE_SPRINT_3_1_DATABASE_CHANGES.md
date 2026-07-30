# EPIC 02 Sprint 03.1 – Database Schema & Migration Changes

**Database**: SQLite (`dev.db`)  
**ORM**: Prisma 5.x  

---

## Added Data Models

### 1. `HardwareDeviceStation`
```prisma
model HardwareDeviceStation {
  id          String   @id @default(uuid())
  stationCode String   @unique
  name        String
  branchId    String   @default("BRANCH-HQ")
  description String?
  isActive    Boolean  @default(true)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  devices     HardwareDeviceRegistry[]
}
```

### 2. `HardwareDeviceProfile`
```prisma
model HardwareDeviceProfile {
  id               String   @id @default(uuid())
  profileCode      String   @unique
  name             String
  branchId         String   @default("BRANCH-HQ")
  description      String?
  isDefaultProfile Boolean  @default(false)
  isActive         Boolean  @default(true)
  createdAt        DateTime @default(now())
  updatedAt        DateTime @updatedAt

  devices          HardwareDeviceRegistry[]
}
```

### 3. `HardwareDriverManifest`
```prisma
model HardwareDriverManifest {
  id                 String   @id @default(uuid())
  driverCode         String   @unique
  name               String
  category           String   // DIGITAL_SCALE | BARCODE_PRINTER | BARCODE_SCANNER | CASH_DRAWER | CUSTOMER_DISPLAY
  version            String   @default("1.0.0")
  vendorIds          String   // JSON Array
  productIds         String   // JSON Array
  supportedProtocols String   // JSON Array
  supportedCommands  String   // JSON Array
  capabilities       String   // JSON Array
  osCompatibility    String   @default("[\"WINDOWS\", \"LINUX\"]")
  isInstalled        Boolean  @default(true)
  configSchema       String?
  createdAt          DateTime @default(now())
  updatedAt          DateTime @updatedAt

  devices            HardwareDeviceRegistry[]
}
```

### 4. `HardwareDeviceRegistry`
```prisma
model HardwareDeviceRegistry {
  id                 String   @id @default(uuid())
  deviceCode         String   @unique
  name               String
  category           String
  brand              String
  model              String
  serialNumber       String
  branchId           String   @default("BRANCH-HQ")
  stationId          String?
  profileId          String?
  driverId           String?
  connectionType     String   @default("RS232")
  status             String   @default("OFFLINE")
  statusReason       String?
  isDefault          Boolean  @default(false)
  isActive           Boolean  @default(true)
  
  portName           String?  @default("COM1")
  baudRate           Int?     @default(9600)
  dataBits           Int?     @default(8)
  stopBits           Int?     @default(1)
  parity             String?  @default("NONE")
  ipAddress          String?
  networkPort        Int?
  vendorId           String?
  productId          String?
  extraConfig        String?

  createdAt          DateTime @default(now())
  updatedAt          DateTime @updatedAt

  station            HardwareDeviceStation?  @relation(fields: [stationId], references: [id], onDelete: SetNull)
  profile            HardwareDeviceProfile?  @relation(fields: [profileId], references: [id], onDelete: SetNull)
  driver             HardwareDriverManifest? @relation(fields: [driverId], references: [id], onDelete: SetNull)
  calibrationLogs    DeviceCalibrationLog[]

  @@index([branchId])
  @@index([stationId])
  @@index([category])
  @@index([status])
}
```

### 5. `DeviceCalibrationLog`
```prisma
model DeviceCalibrationLog {
  id                    String   @id @default(uuid())
  deviceId              String
  calibratedBy          String
  calibrationDate       DateTime @default(now())
  referenceWeightGrams Float
  measuredWeightGrams   Float
  offsetErrorGrams      Float
  status                String   @default("PASS")
  certificateNo         String?
  nextCalibrationDueDate DateTime?
  notes                 String?
  createdAt             DateTime @default(now())

  device                HardwareDeviceRegistry @relation(fields: [deviceId], references: [id], onDelete: Cascade)
}
```
