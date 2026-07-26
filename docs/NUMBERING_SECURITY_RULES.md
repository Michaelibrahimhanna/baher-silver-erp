# Numbering Security & Manual Override Rules - Baher Silver ERP

This document outlines the security rules, role restrictions, and audit policies governing code generation and manual overrides.

---

## 🔒 Security Rules

1. **Automated Generation Default**: Code fields in all user creation forms are populated automatically via `generateNextNumber(entityType)`.
2. **Manual Override Restriction**: Manual code override is restricted strictly to users with `SYSTEM_ADMIN` or `FACTORY_MANAGER` roles.
3. **Mandatory Audit Logging**: Whenever a sequence is manually overridden or reset, `logAuditEvent('MANUAL_NUMBER_OVERRIDE', entityType, overrideValue)` logs the event in `audit_logs`.
4. **Duplicate Prevention**: Overridden codes undergo database unique constraint validation before save.
