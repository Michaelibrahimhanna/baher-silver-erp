# Enterprise Security Operations Manual — Baher Silver ERP v4.0

## 1. System Overview & Architecture

The Baher Silver ERP Authentication & Security Subsystem implements a hybrid **RBAC (Role-Based Access Control) + ABAC (Attribute-Based Access Control)** security matrix with Row-Level Security (RLS) data isolation across branches and warehouses.

### Core Security Standards:
- **Authentication**: JWT access tokens (15m TTL) + SHA-256 rotated refresh tokens (7-day standard, 30-day extended for Remember Me).
- **API Versioning**: All security & auth REST API endpoints served under `/api/v1/` with backward compatibility.
- **HTTP Security Headers**: Enforces Content-Security-Policy (CSP), Strict-Transport-Security (HSTS), X-Frame-Options (DENY), X-Content-Type-Options (nosniff), and Referrer-Policy.
- **Configurable Password Policy**: Stored in `SecurityPolicyConfig`, enforcing length, uppercase, lowercase, numbers, special characters, max age, and history retention (last 5 passwords).
- **User Impersonation**: Super Admin temporary login as target user with mandatory audit logging and instant revert.
- **Session Control**: Active session monitor with force-termination and mandatory documented reasons.
- **Cryptographic Audit Trail**: Hash-chained SHA-256 append-only log with automated `AuditChainVerificationService` integrity checks.
- **Break Glass Protocol**: Emergency account disabled by default, requiring justification and forcing immediate password rotation.
- **2FA Recovery Codes**: 10 one-time disaster recovery codes.
- **Environment Seeding**: Modular seed scripts (`seed_dev.ts`, `seed_demo.ts`, `seed_production.ts`).

---

## 2. Password Policy Engine & History Rules

System password policy parameters are managed via `SecurityPolicyConfig` and verified dynamically during password changes, resets, and user creation:

```json
{
  "minLength": 8,
  "requireUppercase": true,
  "requireLowercase": true,
  "requireNumbers": true,
  "requireSpecialChars": true,
  "maxAgeDays": 90,
  "preventReuseCount": 5,
  "lockoutThreshold": 5,
  "lockoutDurationMinutes": 15,
  "securityHealthMinimumScore": 95,
  "featureSaasMultiTenant": false
}
```

### Operational Command:
To update policy parameters via API:
```http
PUT /api/v1/security/password-policy
Authorization: Bearer <SUPER_ADMIN_TOKEN>
Content-Type: application/json

{
  "minLength": 10,
  "preventReuseCount": 5
}
```

---

## 3. Session Monitoring & Mandatory Termination Protocol

Admins inspect active user sessions via `GET /api/v1/security/sessions/active`.

### Force Termination API (Mandatory Reason Required):
```http
DELETE /api/v1/security/sessions/:sessionId
Authorization: Bearer <SUPER_ADMIN_TOKEN>
Content-Type: application/json

{
  "reason": "Administrative security revocation due to unusual IP access"
}
```

---

## 4. User Impersonation Operational Workflow

Super Admins can temporarily assume any active user's identity without knowing their password:

```http
POST /api/v1/auth/impersonate
Authorization: Bearer <SUPER_ADMIN_TOKEN>
Content-Type: application/json

{
  "targetUserId": "<TARGET_USER_UUID>"
}
```

### Security Audit Logging:
Every impersonation generates a high-priority `AuthAuditLog` event recording:
- Impersonator User ID & Username
- Target User ID & Username
- Timestamp, IP Address, and User Agent

### Reverting Impersonation:
```http
POST /api/v1/auth/impersonate/revert
Authorization: Bearer <IMPERSONATION_TOKEN>
```

---

## 5. Permission Simulator & Diff Engine

The Permission Simulator evaluates effective permissions and provides human-readable Arabic & English explanations for every `ALLOW` and `DENY` decision:

```http
GET /api/v1/rbac/simulator/:userId
```

### Response Example:
```json
{
  "user": { "username": "cashier1", "roles": ["CASHIER"] },
  "effectiveFinalPermissions": [
    {
      "code": "inventory.delete",
      "isAllowed": false,
      "reasonAr": "محظورة بسبب استثناء مباشر صريح بالرفض (Direct DENY User Override)",
      "reasonEn": "Denied explicitly by direct user DENY override"
    }
  ]
}
```

---

## 6. Cryptographic Audit Chain & Integrity Verification

Every `AuthAuditLog` record is cryptographically linked to the previous entry:
$$\text{CurrentHash} = \text{SHA256}(\text{PreviousHash} \parallel \text{UserId} \parallel \text{Action} \parallel \text{Entity} \parallel \text{Status} \parallel \text{Details} \parallel \text{Timestamp})$$

### Running Complete Chain Verification:
Invoke `AuditChainVerificationService.runCompleteVerification()` or via API:
```http
GET /api/v1/security/audit-chain/verify
```

---

## 7. Break Glass Emergency Protocol

In disaster scenarios where identity providers or primary credentials fail:
1. Super Admin executes `POST /api/v1/security/break-glass/activate` with documented justification (>= 10 characters).
2. System unlocks `break_glass_admin` and outputs a temporary emergency password.
3. System emits a `CRITICAL_SECURITY_EVENT` audit log.
4. On first emergency login, Break Glass user is forced to rotate password immediately (`mustChangePassword: true`).
5. After emergency recovery, execute `POST /api/v1/security/break-glass/deactivate`.

---

## 8. Database Seeding Procedures

Database seeding scripts are segmented by environment:

- **Development Environment**:
  ```bash
  npm run seed:dev
  ```
- **Demo & Showcase Environment**:
  ```bash
  npm run seed:demo
  ```
- **Enterprise Production Baseline**:
  ```bash
  npm run seed:production
  ```

---

## 9. Release & Versioning Policy (`v0.2.0-beta`)

1. All 25 Authentication Acceptance Test cases must show `PASS` status.
2. Security Hardening Score must be `>= 95%`.
3. After verification, commit changes and tag release:
   ```bash
   git tag -a v0.2.0-beta -m "Phase 23A.2+ Enterprise Authentication Hardening & Operational Security Release"
   ```
4. Authentication subsystem is **FROZEN** after release. No further auth changes permitted during Phase 24.
