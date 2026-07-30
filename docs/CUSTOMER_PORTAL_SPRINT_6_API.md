# EPIC 06 Sprint 06 – API Documentation Document

**System**: Baher Silver ERP Enterprise System  
**Module**: EPIC 06 – Customer Portal & Private Product Platform  
**Sprint**: Sprint 06 – Analytics, Reports & Enterprise Integration  

---

## REST Endpoints Overview

Sprint 06 exposes REST API endpoints under `/api/v1/analytics/*`, `/api/v1/reports/*`, `/api/v1/integration/*`, and `/api/v1/system/*`.

---

## 1. Analytics & Executive Dashboards Endpoints

### `GET /api/v1/analytics/dashboards/executive`
Retrieve Executive KPIs across Customer, Manufacturing, Service, and Warranty domains with targets, trend indicators (`UP` | `DOWN` | `STABLE`), variance percentages, and target met statuses.

---

### `GET /api/v1/analytics/customer`
Retrieve Customer Portal Analytics including usage statistics, QR scan geographic breakdown, passport access metrics, service request type breakdown, root cause distribution, and CSAT / NPS satisfaction trends.

---

## 2. Enterprise Reports & Export Engine Endpoints

### `GET /api/v1/reports/manufacturing`
Get Manufacturing Order execution, silver weight consumption, purity yield, and lead time report data.

---

### `GET /api/v1/reports/warranty`
Get Active Warranties, claim resolutions, rhodium plating histories, and lifetime purity guarantee metrics.

---

### `GET /api/v1/reports/service`
Get Service Center request logs, technician resolution speeds, SLA compliance %, and CSAT scores.

---

### `GET /api/v1/reports/activity`
Get Customer activity audit logs, QR scan logs, and file download history.

---

### `POST /api/v1/reports/export`
Generate & Export Enterprise Report into `PDF`, `EXCEL_CSV`, or `JSON` formats.

---

### `POST /api/v1/reports/schedules`
Configure Scheduled Report delivery (`cronExpression`, `destinationEmail`, `exportFormat`).

---

## 3. Public API Integration & Multi-Company Support Endpoints

### `POST /api/v1/integration/tokens`
Generate Public API Token with scope permissions (`read:dpp`, `read:orders`, `write:service`, `read:analytics`) and rate limiting (default 100 req/min).

---

### `GET /api/v1/integration/tokens`
List active API tokens for a company or customer.

---

### `DELETE /api/v1/integration/tokens/:id`
Revoke an API Token.

---

### `GET /api/v1/integration/branding`
Get Multi-Company White-Label Branding configuration (`logoUrl`, `primaryColor`, `customDomain`, support details).

---

### `PUT /api/v1/integration/branding`
Update Multi-Company White-Label Branding configuration.

---

### `POST /api/v1/integration/webhooks`
Register Webhook Subscription for events like `dpp.published`, `service.resolved`, `warranty.claimed`.

---

### `GET /api/v1/integration/retention`
Retrieve Data Retention Policies (`API_LOGS`, `AUDIT_LOGS`, `QR_SCANS`, `ATTACHMENTS`).

---

## 4. System Health & Hardware Monitoring Endpoint

### `GET /api/v1/system/health/summary`
Retrieve Real-Time System Health Summary including storage usage (database record counts & attachment file sizes), API usage & latency metrics, background print queue and scheduled report cron statuses, and hardware device monitoring metadata (RSSI signal strength, battery level %, IP subnet, temperature, uptime seconds).
