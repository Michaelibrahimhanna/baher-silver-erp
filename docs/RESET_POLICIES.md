# Sequence Reset Policies Specification - Baher Silver ERP

This document specifies the automated reset policies governing sequence counters in the Numbering Engine.

---

## 📌 Sequence Reset Policies

1. **`YEARLY` (Automatic Reset on New Calendar Year)**:
   - **Applied To**: Financial, Purchasing, Sales, and Production transactional documents (`PO`, `GRN`, `IV`, `WO`, `SO`, `INV`, `PAY`, `JV`, `AUD`).
   - **Behavior**: On January 1st at 00:00 UTC, the sequence counter resets to `1` (e.g. `PO-2026-000001` ➔ `PO-2027-000001`).

2. **`MONTHLY` (Automatic Reset on New Calendar Month)**:
   - **Applied To**: High-frequency daily workshop dispatches.
   - **Behavior**: Resets sequence counter to `1` on the 1st of every month.

3. **`NEVER` (Continuous Lifetime Increment)**:
   - **Applied To**: Permanent Master Data items (`STN`, `SIL`, `RAW`, `COMP`, `SEMI`, `FG`, `SUP`, `CUS`, `WH`).
   - **Behavior**: Counter increments continuously throughout system lifetime.
