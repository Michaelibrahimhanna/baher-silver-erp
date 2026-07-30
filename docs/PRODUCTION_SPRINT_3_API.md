# EPIC 05 Sprint 03 – REST API Documentation

**System**: Baher Silver ERP Enterprise System  
**Module**: EPIC 05 – Manufacturing & Production Management  
**Sprint**: Sprint 03 – Quality Management & Manufacturing Traceability  

---

## Endpoint Summary

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/v1/production/quality/inspections` | Record quality inspection & electronic signature sign-off |
| `POST` | `/api/v1/production/quality/ncr` | Create Non-Conformance Report (NCR) & auto-trigger CAPA if critical |
| `POST` | `/api/v1/production/quality/ncr/:id/resolve` | Resolve NCR with disposition action & root cause analysis |
| `GET` | `/api/v1/production/quality/spc/metrics` | Get Statistical Process Control (SPC) metrics (FPY %, Cpk, Defect Pareto) |
| `GET` | `/api/v1/production/quality/genealogy/:serialOrMo` | Get 360° End-to-End Digital Genealogy Tree Traceability |
| `GET` | `/api/v1/production/quality/work-instructions` | List Digital Work Instructions by stage |
| `POST` | `/api/v1/production/quality/work-instructions` | Create Digital Work Instruction |
| `GET` | `/api/v1/production/quality/dashboard/summary` | Get Quality Dashboard metrics & active escalation alerts |

---

## API Specifications & Examples

### 1. Record Quality Inspection & E-Signature
`POST /api/v1/production/quality/inspections`

#### Request Body
```json
{
  "moId": "MO-2026-000001",
  "pieceSerial": "SN-2026-000065",
  "inspectionType": "SILVER_PURITY_XRF",
  "testedSilverPurity": 925.6,
  "inspectorId": "QA-INSPECTOR-01",
  "inspectorName": "أحمد زكي — أخصائي XRF",
  "status": "PASSED",
  "checkpointResults": { "purityVerified": true, "surfaceFinishOk": true }
}
```

#### Response (201 Created)
```json
{
  "success": true,
  "message": "Quality inspection recorded: PASSED",
  "data": {
    "id": "uuid-insp-01",
    "moId": "uuid-mo-01",
    "pieceSerial": "SN-2026-000065",
    "inspectionType": "SILVER_PURITY_XRF",
    "testedSilverPurity": 925.6,
    "status": "PASSED",
    "eSignatureHash": "b4f7140c8a581827d9e343c851a453d5...",
    "signedBy": "أحمد زكي — أخصائي XRF",
    "createdAt": "2026-07-30T05:04:07.000Z"
  }
}
```

---

### 2. Get 360° Digital Genealogy Tree Traceability
`GET /api/v1/production/quality/genealogy/SN-2026-000065`

#### Response (200 OK)
```json
{
  "success": true,
  "data": {
    "moSummary": {
      "moId": "uuid-mo-01",
      "moCode": "MO-2026-000001",
      "productNameAr": "قلادة فضة إيطالي ملكية مرصعة بالزمرد",
      "plannedQuantity": 8,
      "completedQuantity": 8,
      "status": "COMPLETED"
    },
    "rawMaterialGenealogy": [
      { "lineType": "SILVER_BULLION", "itemCode": "SILVER-925-GRANULES", "itemName": "حبيبات فضة إيطالي عيار 925" }
    ],
    "workCenterOperationsHistory": [
      { "sequenceNo": 10, "stage": "CASTING", "operatorName": "فني الصباغة" }
    ],
    "producedPiecesGenealogy": [
      {
        "serialNo": "SN-2026-000065",
        "sku": "PRD-2026-000023-01",
        "weightGrams": 15.5,
        "silverPurity": "925",
        "dppCode": "DPP-2026-000065",
        "dppUrl": "https://passport.bahersilver.com/v/SN-2026-000065"
      }
    ],
    "qualityTraceability": {
      "inspections": [ { "type": "SILVER_PURITY_XRF", "purity": 925.6, "status": "PASSED" } ],
      "ncrs": [ { "ncrCode": "NCR-2026-000001", "defect": "PURITY_DEVIATION", "status": "RESOLVED" } ]
    }
  }
}
```
