# Immutable Audit Logging System Specification - Baher Silver ERP

This document specifies the architecture, data schema, and immutability rules of the enterprise Audit Logging Engine in the Baher Silver ERP system.

---

## 🔒 Immutability Rule

> **IMMUTABLE DATA POLICY**: No record in the `audit_logs` table can EVER be modified, updated, or deleted.
> The database schema enforces append-only permissions for the audit trail. Any attempt to execute `DELETE` or `UPDATE` on `audit_logs` is rejected at the database level.

---

## 📝 Recorded Audit Log Attributes

Every data modification, inventory movement, financial posting, approval status change, or security event automatically records the following metadata:

1. **`User`** (`userId` & `userName`): The authenticated employee executing the action.
2. **`Date & Time`** (`createdAt`): Timestamp precise to milliseconds (UTC & Local EG time).
3. **`Action`** (`action`): Action classification (e.g. `CREATE`, `UPDATE_STATUS`, `ISSUE_STOCK`, `POST_JOURNAL`, `ARCHIVE`).
4. **`Entity Type & ID`** (`entityType` & `entityId`): Target domain entity (e.g. `Stone`, `SilverItem`, `JournalEntry`, `Warehouse`).
5. **`Old Value`** (`oldValue`): Complete JSON payload snapshot of the entity BEFORE the change.
6. **`New Value`** (`newValue`): Complete JSON payload snapshot of the entity AFTER the change.
7. **`IP Address`** (`ipAddress`): Client IP address originating the request.
8. **`Device & Terminal`** (`device`): User-Agent browser string and hardware terminal identifier.

---

## 📊 Database Schema (`AuditLog`)

```prisma
model AuditLog {
  id         String   @id @default(uuid())
  userId     String
  userName   String
  action     String
  entityType String
  entityId   String
  oldValue   String?
  newValue   String?
  ipAddress  String?  @default("127.0.0.1")
  device     String?  @default("Enterprise Terminal")
  createdAt  DateTime @default(now())

  @@map("audit_logs")
}
```
