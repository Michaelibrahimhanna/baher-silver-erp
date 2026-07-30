# EPIC 06 Sprint 05 – API Documentation Document

**System**: Baher Silver ERP Enterprise System  
**Module**: EPIC 06 – Customer Portal & Private Product Platform  
**Sprint**: Sprint 05 – Customer Service Center & Communication Hub  

---

## REST Endpoints Overview

Sprint 05 exposes REST API endpoints under `/api/v1/customer/service/*`, `/api/v1/customer/activity/*`, and `/api/v1/internal/service/*`.

---

## 1. Customer Service Center Endpoints

### `POST /api/v1/customer/service/requests`
Submit a new Service, Repair, Maintenance, or Product Inspection Request.

**Request Body**:
```json
{
  "customerId": "CUST-UUID",
  "requestType": "REPAIR",
  "title": "طلب إعادة طلاء روديوم وإعادة تثبيت حجر زركون",
  "description": "القطعة بحاجة إلى إعادة طلاء وتثبيت الفص الجانبي.",
  "pieceSerial": "SN-2026-000941",
  "dppCode": "DPP-2026-000941",
  "priority": "HIGH",
  "scheduledDate": "2026-08-05T10:00:00.000Z"
}
```

**Response (201 Created)**:
```json
{
  "success": true,
  "message": "Service request SRV-2026-000001 created successfully.",
  "data": {
    "id": "SRV-UUID",
    "requestNo": "SRV-2026-000001",
    "customerId": "CUST-UUID",
    "requestType": "REPAIR",
    "priority": "HIGH",
    "status": "SUBMITTED",
    "responseDeadline": "2026-07-31T10:30:00.000Z",
    "resolutionDeadline": "2026-08-02T22:30:00.000Z",
    "slaStatus": "ON_TIME",
    "warrantyCoveragePct": 0
  }
}
```

---

### `GET /api/v1/customer/service/requests`
List Customer Service Requests with multi-tenant isolation.

**Query Parameters**:
- `customerId` (Required)
- `requestType` (Optional: `SERVICE` | `REPAIR` | `MAINTENANCE` | `INSPECTION`)
- `status` (Optional: `SUBMITTED` | `UNDER_REVIEW` | `ASSIGNED` | `IN_PROGRESS` | `RESOLVED` | `CLOSED`)
- `priority` (Optional: `LOW` | `MEDIUM` | `HIGH` | `CRITICAL`)

---

### `GET /api/v1/customer/service/requests/:id`
Get detailed view of a Service Request including linked assets (Piece, DPP, MO, Warranty), multi-format attachments, and timeline notes.

---

### `POST /api/v1/customer/service/requests/:id/attachments`
Upload Service Attachment (Images, Videos, PDFs, CAD documents).

**Request Body**:
```json
{
  "customerId": "CUST-UUID",
  "fileName": "damage_inspection.jpg",
  "fileUrl": "storage/service/damage_inspection.jpg",
  "fileType": "IMAGE",
  "fileSizeBytes": 1024500,
  "uploadedBy": "CUSTOMER",
  "description": "صورة الفص المفقود قبل الإصلاح"
}
```

---

### `POST /api/v1/customer/service/requests/:id/approve-cost`
Approve estimated service cost for non-warranty or partially covered repairs.

---

### `POST /api/v1/customer/service/requests/:id/survey`
Submit 1 to 5 star customer satisfaction survey upon request resolution.

---

## 2. Internal Factory Service Workflow Endpoints

### `POST /api/v1/internal/service/requests/:id/assign`
Assign an internal technician or factory supervisor to a service request.

---

### `POST /api/v1/internal/service/requests/:id/status`
Update service request status, record root cause, set technician verification checklist, attach repair/inspection technical JSON metadata, and post official factory responses.

---

## 3. Customer Activity Center Endpoints

### `GET /api/v1/customer/activity/logs`
Get complete customer activity audit history.

### `GET /api/v1/customer/activity/passports`
Get passport access history and shared link view counts.

### `GET /api/v1/customer/activity/scans`
Get QR code scan history and anti-counterfeit verification log.

### `GET /api/v1/customer/activity/downloads`
Get file download history for CAD 3D models, certificates, and passport PDFs.

---

## 4. 360° Unified Customer Timeline Endpoint

### `GET /api/v1/customer/activity/timeline`
Get unified 360° timeline consolidating Orders, Services, Warranty, Repairs, Certificates, and Passport events.

**Query Parameters**:
- `customerId` (Required)
- `category` (Optional: `ORDERS` | `SERVICES` | `WARRANTY` | `REPAIRS` | `CERTIFICATES` | `PASSPORTS`)
- `pieceSerial` (Optional: Filter by physical piece serial)
- `limit` (Optional: default 100)
