# Enterprise Configuration Architecture Guide - Baher Silver ERP

This document synthesizes the Centralized Numbering Engine and System Configuration Engine implemented in Phase 19.

---

## 🏛️ Configuration Engine Architecture

1. **Centralized Service (`generateNextNumber`)**:
   - Single point of generation for all 18 business entity codes.
   - Padded sequences, year tokens, reset policy evaluation, and preview support.

2. **Database System Configurations (`SystemConfig`)**:
   - Zero hardcoded system constants.
   - Dynamic configuration key-value storage (`COMPANY_NAME`, `CURRENCY_SYMBOL`, `BARCODE_PREFIX`, `QR_PREFIX`, `TAX_PERCENTAGE`, `DATE_FORMAT`, `DEFAULT_LANGUAGE`, `SILVER_PURITY_DEFAULT`).

3. **Security & Governance**:
   - Manual override restricted to `SYSTEM_ADMIN` / `FACTORY_MANAGER`.
   - Immutable audit logging for manual sequence edits.
