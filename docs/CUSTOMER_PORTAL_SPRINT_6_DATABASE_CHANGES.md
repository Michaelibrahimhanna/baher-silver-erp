# EPIC 06 Sprint 06 – Database Changes Document

**System**: Baher Silver ERP Enterprise System  
**Module**: EPIC 06 – Customer Portal & Private Product Platform  
**Sprint**: Sprint 06 – Analytics, Reports & Enterprise Integration  

---

## Database Migration Overview

Sprint 06 creates 7 new database models in `apps/api-backend/prisma/schema.prisma` for API token authentication, API access audit logs, multi-company white-label branding, enterprise report export logs, scheduled report configs, webhook subscriptions, and data retention policies: `CustomerApiToken`, `ApiAccessAuditLog`, `CustomerCompanyBranding`, `EnterpriseReportExportLog`, `ScheduledReportConfig`, `CustomerWebhookSubscription`, and `DataRetentionPolicy`.

---

## Database Models Defined

### 1. `CustomerApiToken`

```prisma
model CustomerApiToken {
  id              String    @id @default(uuid())
  tokenKey        String    @unique // e.g. "bs_live_tok_12345"
  tokenHash       String    @unique // Cryptographic SHA256 hash
  customerId      String?
  companyId       String    @default("default-company")
  name            String    // Token display name
  scopesJson      String    // JSON Array e.g. ["read:dpp", "read:orders", "write:service"]
  rateLimitPerMin Int       @default(100)
  status          String    @default("ACTIVE") // ACTIVE | REVOKED | EXPIRED
  expiresAt       DateTime?
  lastUsedAt      DateTime?
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt

  @@index([tokenKey])
  @@index([customerId])
  @@index([status])
  @@index([companyId])
}
```

---

### 2. `ApiAccessAuditLog`

```prisma
model ApiAccessAuditLog {
  id             String   @id @default(uuid())
  tokenId        String?
  customerId     String?
  companyId      String   @default("default-company")
  endpoint       String
  httpMethod     String
  statusCode     Int
  responseTimeMs Float
  ipAddress      String?
  userAgent      String?
  errorMessage   String?
  createdAt      DateTime @default(now())

  @@index([tokenId])
  @@index([customerId])
  @@index([createdAt])
  @@index([endpoint])
}
```

---

### 3. `CustomerCompanyBranding`

```prisma
model CustomerCompanyBranding {
  id             String   @id @default(uuid())
  companyId      String   @unique
  companyNameAr  String
  companyNameEn  String
  logoUrl        String?
  faviconUrl     String?
  primaryColor   String   @default("#C3B097")
  secondaryColor String   @default("#06B6D4")
  customDomain   String?
  customCss      String?
  supportEmail   String?
  supportPhone   String?
  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt
}
```

---

### 4. `EnterpriseReportExportLog`

```prisma
model EnterpriseReportExportLog {
  id               String   @id @default(uuid())
  companyId        String   @default("default-company")
  customerId       String?
  reportType       String   // MANUFACTURING | WARRANTY | SERVICE | ACTIVITY | ANALYTICS
  exportFormat     String   // PDF | EXCEL_CSV | JSON
  filterParamsJson String?
  fileUrl          String?
  fileSizeBytes    Int      @default(0)
  generatedBy      String   @default("SYSTEM")
  createdAt        DateTime @default(now())

  @@index([companyId])
  @@index([reportType])
  @@index([createdAt])
}
```

---

### 5. `ScheduledReportConfig`

```prisma
model ScheduledReportConfig {
  id               String    @id @default(uuid())
  companyId        String    @default("default-company")
  customerId       String?
  reportName       String
  reportType       String    // MANUFACTURING | WARRANTY | SERVICE | ACTIVITY | ANALYTICS
  cronExpression   String    @default("0 8 * * 1") // Weekly Monday 8AM
  exportFormat     String    @default("PDF") // PDF | EXCEL_CSV | JSON
  destinationEmail String
  isActive         Boolean   @default(true)
  lastRunAt        DateTime?
  nextRunAt        DateTime?
  createdAt        DateTime  @default(now())
  updatedAt        DateTime  @updatedAt

  @@index([companyId])
  @@index([reportType])
}
```

---

### 6. `CustomerWebhookSubscription`

```prisma
model CustomerWebhookSubscription {
  id                   String    @id @default(uuid())
  companyId            String    @default("default-company")
  customerId           String?
  name                 String
  targetUrl            String
  secretToken          String
  subscribedEventsJson String    // JSON Array e.g. ["dpp.published", "service.resolved", "warranty.claimed"]
  isActive             Boolean   @default(true)
  lastTriggeredAt      DateTime?
  failureCount         Int       @default(0)
  createdAt            DateTime  @default(now())
  updatedAt            DateTime  @updatedAt

  @@index([companyId])
  @@index([customerId])
}
```

---

### 7. `DataRetentionPolicy`

```prisma
model DataRetentionPolicy {
  id                String    @id @default(uuid())
  companyId         String    @default("default-company")
  entityType        String    @unique // API_LOGS | AUDIT_LOGS | QR_SCANS | ATTACHMENTS
  retentionDays     Int       @default(90)
  autoPurgeEnabled  Boolean   @default(true)
  lastPurgedAt      DateTime?
  purgedRecordCount Int       @default(0)
  createdAt         DateTime  @default(now())
  updatedAt         DateTime  @updatedAt

  @@index([companyId])
}
```

---

## Migration Steps Executed

1. Updated `apps/api-backend/prisma/schema.prisma`.
2. Executed `npx prisma db push` to synchronize SQLite `dev.db`.
3. Executed `npx prisma generate` to re-generate TypeScript `@prisma/client` types.
