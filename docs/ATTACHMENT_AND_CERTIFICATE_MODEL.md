# Attachment and Certificate Model Specification - Baher Silver ERP

This document details the data structures for managing product images, technical data sheets, gemstone authenticity certificates, and silver assay hallmarking documents.

---

## 📄 Certificate Model (`Certificate`)

- **`certificateNo`**: Unique certificate code (e.g. `CERT-GIA-99210`).
- **`issuer`**: Issuing authority (e.g. `مصلحة دمغ المصوغات والموازين المصرية`, `GIA`, `HRD`).
- **`certificateType`**: `GEM_AUTHENTICITY`, `SILVER_ASSAY_STAMP`, `ISO_9001_QUALITY`.
- **`verificationCode`**: Official online verification code.
- **`documentUrl`**: High-resolution scanned PDF/JPEG document.

---

## 📎 Attachment Model (`Attachment`)

Stores technical specification sheets, safety data sheets (SDS) for workshop chemicals, supplier invoices, and multi-angle high-resolution gemstone photographs.
