# EPIC 06 Sprint 02 – REST API Documentation

**System**: Baher Silver ERP Enterprise System  
**Module**: EPIC 06 – Customer Portal & Private Product Platform  
**Sprint**: Sprint 02 – Manufacturing Orders & Customer Collaboration  

---

## Endpoint Summary

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/v1/customer/orders` | List Customer Manufacturing Orders with Status Filters |
| `GET` | `/api/v1/customer/orders/:moId/timeline` | Get Live Order Timeline, Progress %, & Updated ETA |
| `POST` | `/api/v1/customer/orders/:moId/approval` | Submit Customer Design Approval / Rejection / Revision (V1, V2, V3...) |
| `POST` | `/api/v1/customer/orders/:moId/attachments` | Upload Order Attachments (Images, PDF, CAD STL/3DM/DXF) |
| `GET` | `/api/v1/customer/orders/:moId/notes` | Get Order Notes (Internal vs Customer Notes Isolation) |
| `POST` | `/api/v1/customer/orders/:moId/notes` | Add Customer or Factory Order Note |

---

## API Specifications & Examples

### 1. Get Live Order Production Timeline & Progress Engine
`GET /api/v1/customer/orders/MO-2026-000001/timeline?customerId=uuid-customer-01`

#### Response (200 OK)
```json
{
  "success": true,
  "data": {
    "orderSummary": {
      "moId": "uuid-mo-01",
      "moCode": "MO-2026-000001",
      "productNameAr": "خاتم كلاسيكي مرصع بالعقيق الأحادي",
      "plannedQuantity": 12,
      "completedQuantity": 0,
      "status": "PLANNED",
      "progressPercentage": 0,
      "currentStage": "قيد الصياغة",
      "plannedDeliveryDate": "2026-08-06T05:21:44.000Z",
      "updatedEta": "2026-08-06T05:21:44.000Z",
      "isOverdue": false,
      "delayDays": 0
    },
    "milestones": [
      { "stage": "MO_CREATED", "titleAr": "تم إنشاء أمر التصنيع", "completed": true },
      { "stage": "CONFIRMED", "titleAr": "تأكيد الحجز وتوفر المواد", "completed": false },
      { "stage": "CASTING", "titleAr": "مرحلة صب وصهر الفضة 925", "completed": false }
    ],
    "latestApproval": null,
    "attachments": [],
    "customerNotes": []
  }
}
```

---

### 2. Submit Design Approval Action (Version V2)
`POST /api/v1/customer/orders/MO-2026-000001/approval`

#### Request Body
```json
{
  "customerId": "uuid-customer-01",
  "approvalStage": "CAD_DESIGN",
  "designVersion": "V2",
  "previousVersionId": "uuid-approval-v1",
  "changeSummary": "تم تعديل حواف الحجر بنجاح",
  "status": "APPROVED",
  "feedbackNotes": "التصميم ممتاز ومعتمد للتصنيع",
  "actionBy": "العميل الممتاز للتصنيع"
}
```

#### Response (201 Created)
```json
{
  "success": true,
  "message": "Design approval status updated: APPROVED",
  "data": {
    "id": "uuid-approval-v2",
    "moId": "uuid-mo-01",
    "customerId": "uuid-customer-01",
    "designVersion": "V2",
    "status": "APPROVED",
    "approvalDeadline": "2026-08-02T05:21:44.000Z",
    "actionAt": "2026-07-30T05:21:44.000Z"
  }
}
```
