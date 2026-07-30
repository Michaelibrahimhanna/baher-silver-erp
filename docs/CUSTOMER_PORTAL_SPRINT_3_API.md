# EPIC 06 Sprint 03 – REST API Documentation

**System**: Baher Silver ERP Enterprise System  
**Module**: EPIC 06 – Customer Portal & Private Product Platform  
**Sprint**: Sprint 03 – Private Product Gallery & Design Asset Management  

---

## Endpoint Summary

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/v1/customer/gallery/products` | Search Private Gallery Products by code, category, or tags |
| `POST` | `/api/v1/customer/gallery/collections` | Create Collection / Custom Folder |
| `GET` | `/api/v1/customer/gallery/collections` | List Customer Collections & Custom Folders |
| `POST` | `/api/v1/customer/gallery/assets` | Upload Design Asset (STL, 3DM, DXF) & 3D Viewer URL |
| `POST` | `/api/v1/customer/gallery/assets/:assetId/versions` | Create New Design Version (V1 -> V2 -> V3) |
| `POST` | `/api/v1/customer/gallery/assets/:assetId/rollback` | Rollback Design Asset Version |
| `POST` | `/api/v1/customer/gallery/favorites/toggle` | Toggle Product / Asset Favorite Bookmark |
| `GET` | `/api/v1/customer/gallery/favorites` | List Customer Favorites |

---

## API Specifications & Examples

### 1. Upload Design Asset (3D CAD STL/3DM/DXF) & 3D Model URL
`POST /api/v1/customer/gallery/assets`

#### Request Body
```json
{
  "customerId": "uuid-customer-01",
  "productId": "uuid-prod-necklace",
  "assetName": "luxury_necklace_v1.stl",
  "fileUrl": "storage/cad/luxury_necklace_v1.stl",
  "previewUrl": "storage/cad/luxury_necklace_v1_preview.png",
  "model3dUrl": "storage/cad/3d/luxury_necklace_v1.gltf",
  "fileType": "CAD_STL",
  "fileSizeBytes": 5242880,
  "designerName": "مصمم 3D الإيطالي",
  "tags": ["EMERALD", "SILVER925", "ROYAL"]
}
```

#### Response (201 Created)
```json
{
  "success": true,
  "message": "Design asset uploaded successfully",
  "data": {
    "asset": {
      "id": "uuid-asset-01",
      "assetName": "luxury_necklace_v1.stl",
      "version": "V1",
      "lifecycleStatus": "APPROVED",
      "integritySha256": "8e09a00e5ce3496982e513d3a3e897c6...",
      "model3dUrl": "storage/cad/3d/luxury_necklace_v1.gltf",
      "fileSizeBytes": 5242880,
      "createdAt": "2026-07-30T05:35:41.000Z"
    },
    "currentStorageBytes": 5242880
  }
}
```

---

### 2. Rollback Design Asset Version
`POST /api/v1/customer/gallery/assets/uuid-asset-01/rollback`

#### Request Body
```json
{
  "customerId": "uuid-customer-01",
  "targetVersion": "V1"
}
```

#### Response (200 OK)
```json
{
  "success": true,
  "message": "Design asset rolled back to version V1",
  "data": {
    "id": "uuid-asset-01",
    "version": "V1",
    "fileUrl": "storage/cad/luxury_necklace_v1.stl",
    "updatedAt": "2026-07-30T05:35:41.000Z"
  }
}
```
