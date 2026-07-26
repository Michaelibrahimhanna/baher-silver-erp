# Sequence Rules & Numbering Format Specification - Baher Silver ERP

This document specifies the exact sequence rules, padding lengths, and formatting tokens enforced by the Numbering Engine.

---

## 📌 Token Formula

$$\text{Code} = [\text{PREFIX}] - (\text{COMPANY}) - (\text{BRANCH}) - [\text{YEAR}] - [\text{PADDED\_SEQUENCE}]$$

### Example Token Combinations:
- **With Year & Padding 6**: `PO-2026-000001`
- **Without Year & Padding 6**: `STN-000001`
- **Company Branch Tagged**: `BS-HQ-IV-2026-000001`

---

## 🔒 Uniqueness & Concurrency Protection

1. **Database Constraint**: `NumberingSequence.entityType` enforces `@unique`.
2. **Atomic Incrementing**: Database transaction locks sequence increment operations to prevent race conditions during peak casting dispatches.
