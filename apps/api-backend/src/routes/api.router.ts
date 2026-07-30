import { Router } from 'express';
import { WarehouseController } from '../controllers/warehouse.controller';
import { StoneController } from '../controllers/stone.controller';
import { RawMaterialController } from '../controllers/raw_material.controller';
import { SilverItemController } from '../controllers/silver_item.controller';
import { ChemicalItemController } from '../controllers/chemical_item.controller';
import { ComponentItemController } from '../controllers/component_item.controller';
import { MovementController } from '../controllers/movement.controller';
import { AuditController } from '../controllers/audit.controller';
import { SearchController } from '../controllers/search.controller';
import { MasterController } from '../controllers/master.controller';
import { PurchasingController } from '../controllers/purchasing.controller';
import { PricingController } from '../controllers/pricing.controller';
import { ProductController } from '../controllers/product.controller';
import { BOMController } from '../controllers/bom.controller';
import { VariantController } from '../controllers/variant.controller';
import { RoutingController } from '../controllers/routing.controller';
import { CostingController } from '../controllers/costing.controller';
import { AuthController } from '../controllers/auth.controller';
import { UserManagementController } from '../controllers/user_management.controller';
import { RBACController } from '../controllers/rbac.controller';
import { IdentityPlatformController } from '../controllers/identity_platform.controller';
import { WeightCaptureController } from '../controllers/weight_capture.controller';
import { HardwareDeviceController } from '../controllers/hardware_device.controller';
import { BarcodeLabelController } from '../controllers/barcode_label.controller';
import { LabelPrintingController } from '../controllers/label_printing.controller';
import { LabelPresetController } from '../controllers/label_preset.controller';
import { QrPassportController } from '../controllers/qr_passport.controller';
import { DppPublicController } from '../controllers/dpp_public.controller';
import { DppJourneyController } from '../controllers/dpp_journey.controller';
import { DppAdminController } from '../controllers/dpp_admin.controller';
import { ManufacturingController } from '../controllers/manufacturing.controller';
import { ProductionSchedulingController } from '../controllers/production_scheduling.controller';
import { QualityManagementController } from '../controllers/quality_management.controller';
import { CustomerPortalController } from '../controllers/customer_portal.controller';
import { CustomerCollaborationController } from '../controllers/customer_collaboration.controller';
import { CustomerGalleryController } from '../controllers/customer_gallery.controller';
import { CustomerDppController } from '../controllers/customer_dpp.controller';
import { CustomerServiceController } from '../controllers/customer_service.controller';
import { CustomerActivityController } from '../controllers/customer_activity.controller';
import { CustomerAnalyticsController } from '../controllers/customer_analytics.controller';
import { EnterpriseReportsController } from '../controllers/enterprise_reports.controller';
import { ApiIntegrationController } from '../controllers/api_integration.controller';
import { SystemHealthController } from '../controllers/system_health.controller';
import { authenticateJWT, requirePermission } from '../middleware/auth';

const router = Router();

// =============================================================================
// EPIC 06 SPRINT 06: ANALYTICS, REPORTS & ENTERPRISE INTEGRATION API ENDPOINTS
// =============================================================================
// Executive Dashboards & Customer Analytics
router.get('/analytics/dashboards/executive', CustomerAnalyticsController.getExecutiveKpis);
router.get('/analytics/customer', CustomerAnalyticsController.getCustomerAnalytics);

// Enterprise Reports & Export Engine
router.get('/reports/manufacturing', EnterpriseReportsController.getManufacturingReport);
router.get('/reports/warranty', EnterpriseReportsController.getWarrantyReport);
router.get('/reports/service', EnterpriseReportsController.getServiceReport);
router.get('/reports/activity', EnterpriseReportsController.getActivityReport);
router.post('/reports/export', EnterpriseReportsController.exportReport);
router.post('/reports/schedules', EnterpriseReportsController.createSchedule);
router.get('/reports/schedules', EnterpriseReportsController.listSchedules);

// API Integration & Multi-Company Support
router.post('/integration/tokens', ApiIntegrationController.generateToken);
router.get('/integration/tokens', ApiIntegrationController.listTokens);
router.delete('/integration/tokens/:id', ApiIntegrationController.revokeToken);
router.get('/integration/branding', ApiIntegrationController.getBranding);
router.put('/integration/branding', ApiIntegrationController.updateBranding);
router.post('/integration/webhooks', ApiIntegrationController.registerWebhook);
router.get('/integration/retention', ApiIntegrationController.getRetentionPolicies);

// System Health Dashboard
router.get('/system/health/summary', SystemHealthController.getHealthSummary);


// =============================================================================
// EPIC 06 SPRINT 05: CUSTOMER SERVICE CENTER & COMMUNICATION HUB API ENDPOINTS
// =============================================================================
router.post('/customer/service/requests', CustomerServiceController.createRequest);
router.get('/customer/service/requests', CustomerServiceController.listRequests);
router.get('/customer/service/requests/:id', CustomerServiceController.getRequestDetails);
router.post('/customer/service/requests/:id/attachments', CustomerServiceController.addAttachment);
router.post('/customer/service/requests/:id/approve-cost', CustomerServiceController.approveCost);
router.post('/customer/service/requests/:id/survey', CustomerServiceController.submitSurvey);

// Internal Service Workflow
router.post('/internal/service/requests/:id/assign', CustomerServiceController.internalAssign);
router.post('/internal/service/requests/:id/status', CustomerServiceController.internalUpdateStatus);

// Customer Activity Center & 360 Timeline
router.get('/customer/activity/logs', CustomerActivityController.getActivityLogs);
router.get('/customer/activity/passports', CustomerActivityController.getPassportAccessHistory);
router.get('/customer/activity/scans', CustomerActivityController.getQrScanHistory);
router.get('/customer/activity/downloads', CustomerActivityController.getFileDownloadHistory);
router.get('/customer/activity/timeline', CustomerActivityController.getCustomerTimeline);


// =============================================================================
// EPIC 06 SPRINT 04: DIGITAL PRODUCT PASSPORT & QR CUSTOMER EXPERIENCE API ENDPOINTS
// =============================================================================
router.get('/customer/dpp/passports/:serialOrDpp', CustomerDppController.getPassportDetails);
router.post('/customer/dpp/qr/verify', CustomerDppController.verifyQr);
router.get('/customer/dpp/warranties', CustomerDppController.getWarrantyInfo);
router.post('/customer/dpp/warranties/claims', CustomerDppController.submitWarrantyClaim);
router.post('/customer/dpp/share', CustomerDppController.createShareLink);
router.get('/customer/dpp/share/:shareToken', CustomerDppController.getSharedPassport);
router.get('/customer/dpp/graph/:pieceSerial', CustomerDppController.getRelationshipGraph);

// =============================================================================
// EPIC 06 SPRINT 03: PRIVATE PRODUCT GALLERY & DESIGN ASSET API ENDPOINTS
// =============================================================================
router.get('/customer/gallery/products', CustomerGalleryController.getProducts);
router.post('/customer/gallery/collections', CustomerGalleryController.createCollection);
router.get('/customer/gallery/collections', CustomerGalleryController.listCollections);
router.post('/customer/gallery/assets', CustomerGalleryController.uploadAsset);
router.post('/customer/gallery/assets/:assetId/versions', CustomerGalleryController.createVersion);
router.post('/customer/gallery/assets/:assetId/rollback', CustomerGalleryController.rollbackVersion);
router.post('/customer/gallery/favorites/toggle', CustomerGalleryController.toggleFavorite);
router.get('/customer/gallery/favorites', CustomerGalleryController.listFavorites);

// =============================================================================
// EPIC 06 SPRINT 02: MANUFACTURING ORDERS & CUSTOMER COLLABORATION API ENDPOINTS
// =============================================================================
router.get('/customer/orders', CustomerCollaborationController.listOrders);
router.get('/customer/orders/:moId/timeline', CustomerCollaborationController.getTimeline);
router.post('/customer/orders/:moId/approval', CustomerCollaborationController.submitApproval);
router.post('/customer/orders/:moId/attachments', CustomerCollaborationController.uploadAttachment);
router.get('/customer/orders/:moId/notes', CustomerCollaborationController.getNotes);
router.post('/customer/orders/:moId/notes', CustomerCollaborationController.addNote);

// =============================================================================
// EPIC 06 SPRINT 01: CUSTOMER PORTAL & PRIVATE PRODUCT PLATFORM API ENDPOINTS
// =============================================================================
router.post('/customer/auth/login', CustomerPortalController.login);
router.post('/customer/auth/logout', CustomerPortalController.logout);
router.post('/customer/auth/password-reset', CustomerPortalController.requestPasswordReset);
router.get('/customer/profile', CustomerPortalController.getProfile);
router.put('/customer/profile', CustomerPortalController.updateProfile);
router.get('/customer/catalog', CustomerPortalController.getPublicCatalog);
router.get('/customer/workspace/summary', CustomerPortalController.getWorkspaceSummary);
router.get('/customer/products/private', CustomerPortalController.getPrivateProducts);

// =============================================================================
// EPIC 05 SPRINT 03: QUALITY MANAGEMENT & MANUFACTURING TRACEABILITY API
// =============================================================================
router.post('/production/quality/inspections', QualityManagementController.recordInspection);
router.post('/production/quality/ncr', QualityManagementController.createNCR);
router.post('/production/quality/ncr/:id/resolve', QualityManagementController.resolveNCR);
router.get('/production/quality/spc/metrics', QualityManagementController.getSpcMetrics);
router.get('/production/quality/genealogy/:serialOrMo', QualityManagementController.getGenealogy);
router.get('/production/quality/work-instructions', QualityManagementController.listWorkInstructions);
router.post('/production/quality/work-instructions', QualityManagementController.createWorkInstruction);
router.get('/production/quality/dashboard/summary', QualityManagementController.getDashboardMetrics);

// =============================================================================
// EPIC 05 SPRINT 02: PRODUCTION SCHEDULING, CAPACITY & SHOP FLOOR CONTROL API
// =============================================================================
router.post('/production/scheduling/schedule', ProductionSchedulingController.scheduleMO);
router.get('/production/scheduling/capacity', ProductionSchedulingController.getCapacityPlanning);
router.post('/production/scheduling/labor', ProductionSchedulingController.assignLabor);
router.get('/production/wip/summary', ProductionSchedulingController.getWipSummary);
router.post('/production/orders/:id/partial-release', ProductionSchedulingController.releasePartialLot);
router.post('/production/rework', ProductionSchedulingController.triggerRework);
router.get('/production/dashboard/summary', ProductionSchedulingController.getDashboardMetrics);

// =============================================================================
// EPIC 05 SPRINT 01: MANUFACTURING & PRODUCTION MANAGEMENT API ENDPOINTS
// =============================================================================
router.post('/production/orders', ManufacturingController.createMO);
router.get('/production/orders', ManufacturingController.listMOs);
router.get('/production/orders/:idOrCode', ManufacturingController.getMO);
router.post('/production/orders/:id/status', ManufacturingController.transitionStatus);
router.post('/production/orders/:id/reserve', ManufacturingController.reserveMaterials);
router.post('/production/orders/:id/operations', ManufacturingController.recordOperation);
router.post('/production/orders/:id/complete', ManufacturingController.completeMO);
router.get('/production/work-centers', ManufacturingController.listWorkCenters);
router.post('/production/work-centers', ManufacturingController.createWorkCenter);

// =============================================================================
// EPIC 04 SPRINT 04: DPP ADMINISTRATION & CONTENT MANAGEMENT API ENDPOINTS
// =============================================================================
router.get('/dpp/admin/passports', DppAdminController.listPassports);
router.get('/dpp/admin/passports/:idOrSerial', DppAdminController.getPassportById);
router.put('/dpp/admin/passports/:idOrSerial', DppAdminController.updatePassportContent);
router.post('/dpp/admin/passports/:idOrSerial/rollback', DppAdminController.rollbackVersion);
router.post('/dpp/admin/passports/:idOrSerial/status', DppAdminController.transitionPublishingStatus);
router.post('/dpp/admin/passports/bulk-status', DppAdminController.bulkTransitionStatus);
router.post('/dpp/admin/passports/:idOrSerial/media', DppAdminController.manageMediaLibrary);
router.get('/dpp/admin/templates', DppAdminController.listCertificateTemplates);
router.post('/dpp/admin/templates', DppAdminController.createCertificateTemplate);
router.get('/dpp/admin/analytics/dashboard', DppAdminController.getAdvancedAnalyticsDashboard);

// =============================================================================
// EPIC 04 SPRINT 03: CUSTOMER PRODUCT JOURNEY & AFTER-SALES SERVICES API
// =============================================================================
router.get('/dpp/journey/:serialNoOrCode', DppJourneyController.getJourneyData);
router.get('/dpp/journey/:serialNoOrCode/care-warranty', DppJourneyController.getCareAndWarranty);
router.get('/dpp/journey/:serialNoOrCode/certificates', DppJourneyController.getCertificates);
router.get('/dpp/journey/:serialNoOrCode/timeline', DppJourneyController.getTimeline);
router.get('/dpp/journey/:serialNoOrCode/pdf', DppJourneyController.downloadPassportPdf);

// =============================================================================
// EPIC 04 SPRINT 02: PUBLIC DIGITAL PRODUCT PASSPORT PORTAL API ENDPOINTS
// =============================================================================
router.post('/dpp/public/publish', DppPublicController.publishPassport);
router.get('/dpp/public/:serialNoOrCode', DppPublicController.getPublicPassport);
router.post('/dpp/public/verify', DppPublicController.verifyAuthenticity);
router.get('/dpp/public/verify/:token', DppPublicController.verifyTokenDirect);
router.get('/dpp/public/:serialNoOrCode/seo', DppPublicController.getSeoMetadata);
router.get('/dpp/public/:serialNo/analytics', DppPublicController.getPublicAnalytics);

// =============================================================================
// EPIC 04 SPRINT 01: QR CODE & DIGITAL PRODUCT PASSPORT API ENDPOINTS
// =============================================================================
router.post('/qr/generate', QrPassportController.generateQrCode);
router.post('/qr/validate', QrPassportController.validateQrCode);
router.post('/qr/render', QrPassportController.renderQrCode);
router.get('/qr/pieces/:idOrSerial', QrPassportController.generateQrForPiece);
router.post('/qr/dpp/draft', QrPassportController.createDppDraft);
router.get('/qr/dpp/draft/:idOrSerial', QrPassportController.getDppDraft);
router.get('/qr/audits', QrPassportController.listQrAudits);

// =============================================================================
// EPIC 03 SPRINT 03: JEWELRY LABEL DESIGNER & PRINTING WORKFLOW API ENDPOINTS
// =============================================================================
// Print Presets by Branch / Printer Station
router.post('/printing/presets', LabelPresetController.createPrintPreset);
router.get('/printing/presets', LabelPresetController.listPrintPresets);
router.get('/printing/presets/resolve', LabelPresetController.resolvePresetForStation);
router.delete('/printing/presets/:id', LabelPresetController.deletePrintPreset);

// Template Versioning & Import / Export
router.post('/barcode/templates/:id/versions', BarcodeLabelController.createTemplateVersion);
router.get('/barcode/templates/:id/versions', BarcodeLabelController.listTemplateVersions);
router.get('/barcode/templates/:id/export', BarcodeLabelController.exportTemplateJson);
router.post('/barcode/templates/import', BarcodeLabelController.importTemplateJson);

// =============================================================================
// EPIC 03 SPRINT 02: LABEL PRINTING ENGINE API ENDPOINTS
// =============================================================================
router.post('/printing/jobs', LabelPrintingController.enqueuePrintJob);
router.post('/printing/jobs/batch', LabelPrintingController.enqueueMultiPrinterBatch);
router.get('/printing/jobs', LabelPrintingController.listPrintQueue);
router.get('/printing/jobs/:id', LabelPrintingController.getJobById);
router.post('/printing/jobs/:id/retry', LabelPrintingController.retryFailedPrintJob);
router.post('/printing/jobs/:id/cancel', LabelPrintingController.cancelPrintJob);
router.get('/printing/printers/select', LabelPrintingController.selectTargetPrinter);

// =============================================================================
// EPIC 03 SPRINT 01: BARCODE & LABEL PLATFORM API ENDPOINTS
// =============================================================================
// Barcode Engine, Validation & Rendering
router.post('/barcode/generate', BarcodeLabelController.generateBarcode);
router.post('/barcode/validate', BarcodeLabelController.validateBarcode);
router.post('/barcode/render', BarcodeLabelController.renderBarcode);

// EPIC 02 Integration (PhysicalPiece & Product Identity)
router.get('/barcode/pieces/:idOrSerial', BarcodeLabelController.generateBarcodeForPiece);
router.get('/barcode/products/:idOrCode', BarcodeLabelController.generateBarcodeForProduct);

// Printable Label Templates
router.post('/barcode/templates', BarcodeLabelController.createLabelTemplate);
router.get('/barcode/templates', BarcodeLabelController.listLabelTemplates);
router.get('/barcode/templates/:id', BarcodeLabelController.getLabelTemplateById);
router.post('/barcode/templates/:id/duplicate', BarcodeLabelController.duplicateLabelTemplate);
router.delete('/barcode/templates/:id', BarcodeLabelController.deleteLabelTemplate);
router.post('/barcode/templates/preview', BarcodeLabelController.renderLabelPreview);
router.get('/barcode/audits', BarcodeLabelController.listGenerationAudits);

// =============================================================================
// EPIC 02: PRODUCT IDENTITY PLATFORM API ENDPOINTS
// =============================================================================
router.post('/identity/product-models', IdentityPlatformController.createProductModel);
router.get('/identity/product-models', IdentityPlatformController.listProductModels);
router.post('/identity/generate-sku', IdentityPlatformController.generateSKU);

router.post('/identity/physical-pieces', IdentityPlatformController.createPhysicalPiece);
router.get('/identity/physical-pieces', IdentityPlatformController.listPhysicalPieces);
router.get('/identity/physical-pieces/:idOrSerial', IdentityPlatformController.getPhysicalPiece);
router.patch('/identity/physical-pieces/:id', IdentityPlatformController.updatePhysicalPiece);
router.post('/identity/physical-pieces/:id/status', IdentityPlatformController.transitionStatus);
router.post('/identity/physical-pieces/:id/reprint', IdentityPlatformController.reprintTag);

// =============================================================================
// EPIC 02 SPRINT 03.1: HARDWARE DEVICE MANAGEMENT PLATFORM API ENDPOINTS
// =============================================================================
// Hardware Devices Registry & CRUD
router.post('/hardware/devices', HardwareDeviceController.registerDevice);
router.get('/hardware/devices', HardwareDeviceController.listDevices);
router.get('/hardware/devices/:id', HardwareDeviceController.getDeviceById);
router.put('/hardware/devices/:id', HardwareDeviceController.updateDevice);
router.delete('/hardware/devices/:id', HardwareDeviceController.deleteDevice);
router.post('/hardware/devices/:id/set-default', HardwareDeviceController.setDefaultDevice);
router.post('/hardware/devices/:id/maintenance', HardwareDeviceController.setMaintenanceMode);
router.post('/hardware/devices/:id/bind-driver', HardwareDeviceController.bindDeviceDriver);

// Branch -> Station -> Device Hierarchy
router.post('/hardware/stations', HardwareDeviceController.createStation);
router.get('/hardware/stations', HardwareDeviceController.listStations);
router.get('/hardware/stations/:id', HardwareDeviceController.getStationById);
router.delete('/hardware/stations/:id', HardwareDeviceController.deleteStation);

// Branch Profiles
router.post('/hardware/profiles', HardwareDeviceController.createProfile);
router.get('/hardware/profiles', HardwareDeviceController.listProfiles);
router.get('/hardware/profiles/:id', HardwareDeviceController.getProfileById);

// Driver Registry & Driver Manifests
router.post('/hardware/drivers', HardwareDeviceController.registerDriverManifest);
router.get('/hardware/drivers', HardwareDeviceController.listDriverManifests);
router.get('/hardware/drivers/:id', HardwareDeviceController.getDriverManifestById);

// Calibration History
router.post('/hardware/devices/:id/calibrations', HardwareDeviceController.recordCalibration);
router.get('/hardware/devices/:id/calibrations', HardwareDeviceController.listCalibrationLogs);

// =============================================================================
// EPIC 02 SPRINT 03.2: DEVICE HEALTH MONITORING, PING, RECONNECT & FIRMWARE
// =============================================================================
router.post('/hardware/health/ping', HardwareDeviceController.pingDevice);
router.post('/hardware/devices/:id/ping', HardwareDeviceController.pingDevice);
router.post('/hardware/health/heartbeat', HardwareDeviceController.systemHeartbeat);
router.get('/hardware/health', HardwareDeviceController.getHealthSummary);
router.post('/hardware/devices/:id/reconnect', HardwareDeviceController.attemptAutoReconnect);
router.post('/hardware/devices/:id/firmware', HardwareDeviceController.updateFirmwareInfo);
router.get('/hardware/audit-logs', HardwareDeviceController.listAuditLogs);

// =============================================================================
// EPIC 02 SPRINT 03.3: HARDWARE SIMULATOR & CONNECTION TEST API ENDPOINTS
// =============================================================================
router.post('/hardware/devices/:id/test-connection', HardwareDeviceController.testConnection);
router.post('/hardware/devices/:id/simulate', HardwareDeviceController.executeSimulation);
router.get('/hardware/simulators/status', HardwareDeviceController.getSimulatorStatus);

// =============================================================================
// EPIC 02: SMART WEIGHT CAPTURE PLATFORM & HAL API ENDPOINTS
// =============================================================================
router.get('/hardware/scales', WeightCaptureController.listScaleDevices);
router.post('/hardware/scales', WeightCaptureController.registerScaleDevice);
router.post('/hardware/scales/poll', WeightCaptureController.pollWeight);
router.post('/hardware/scales/:id/poll', WeightCaptureController.pollWeight);
router.post('/hardware/scales/:id/zero', WeightCaptureController.executeZero);
router.post('/hardware/scales/:id/tare', WeightCaptureController.executeTare);
router.get('/hardware/scales/audit-logs', WeightCaptureController.listAuditLogs);

// 0. ENTERPRISE AUTHENTICATION, HYBRID RBAC + ABAC ENGINE (Phase 23A)
router.post('/auth/login', AuthController.login);
router.post('/auth/refresh', AuthController.refresh);
router.post('/auth/logout', authenticateJWT, AuthController.logout);
router.get('/auth/me', authenticateJWT, AuthController.getMe);
router.get('/auth/sessions', authenticateJWT, AuthController.getSessions);
router.delete('/auth/sessions/:id', authenticateJWT, AuthController.revokeSession);
router.post('/auth/change-password', authenticateJWT, AuthController.changePassword);
router.post('/auth/reset-password', authenticateJWT, requirePermission('users.manage'), AuthController.resetPassword);

// Users Management
router.get('/users', authenticateJWT, requirePermission('users.view'), UserManagementController.listUsers);
router.post('/users', authenticateJWT, requirePermission('users.manage'), UserManagementController.createUser);
router.get('/users/:id', authenticateJWT, requirePermission('users.view'), UserManagementController.getUserById);
router.put('/users/:id', authenticateJWT, requirePermission('users.manage'), UserManagementController.updateUser);
router.delete('/users/:id', authenticateJWT, requirePermission('users.manage'), UserManagementController.softDeleteUser);
router.post('/users/:id/permissions', authenticateJWT, requirePermission('users.manage'), UserManagementController.setPermissionOverride);
router.delete('/users/:id/permissions', authenticateJWT, requirePermission('users.manage'), UserManagementController.removePermissionOverride);

// Roles & Permissions Matrix
router.get('/roles', authenticateJWT, requirePermission('users.manage'), RBACController.listRoles);
router.post('/roles', authenticateJWT, requirePermission('users.manage'), RBACController.createRole);
router.put('/roles/:id/permissions', authenticateJWT, requirePermission('users.manage'), RBACController.updateRolePermissions);
router.get('/permissions', authenticateJWT, requirePermission('users.manage'), RBACController.listPermissionGroups);

// Security Logs
router.get('/security/login-history', authenticateJWT, requirePermission('settings.view'), RBACController.getLoginHistory);
router.get('/security/audit-logs', authenticateJWT, requirePermission('settings.view'), RBACController.getAuthAuditLogs);

// 1. Master Data Center & Phase 15 Relational Enhancements
router.get('/master-data', MasterController.listMasterItems);
router.get('/master-data/sizes', MasterController.getSmartSizes);
router.get('/master-data/hierarchy', MasterController.getHierarchy);
router.post('/master-data', MasterController.createMasterItem);
router.put('/master-data/:id', MasterController.updateMasterItem);
router.patch('/master-data/:id/toggle', MasterController.toggleActive);
router.post('/master-data/import', MasterController.importMasterItems);

// 2. Supplier Profiles (SRM)
router.get('/purchasing/suppliers', PurchasingController.listSuppliers);
router.post('/purchasing/suppliers', PurchasingController.createSupplier);

// 3. Multi-Level Pricing Profiles (Retail, Wholesale, VIP, Export, Factory)
router.get('/prices/item/:itemId', PricingController.getPricesForItem);
router.post('/prices/item', PricingController.setPriceProfile);

// 4. Warehouses & Hierarchical Storage Locations
router.get('/warehouses', WarehouseController.listWarehouses);
router.get('/warehouses/locations', WarehouseController.listLocations);
router.post('/warehouses/locations', WarehouseController.createLocation);

// 5. Stones Store Master Data & Batches
router.get('/inventory/stones', StoneController.listStones);
router.get('/inventory/stones/:id', StoneController.getStoneById);
router.post('/inventory/stones', StoneController.createStone);

// 6. Raw Materials Store
router.get('/inventory/raw-materials', RawMaterialController.listRawMaterials);
router.post('/inventory/raw-materials', RawMaterialController.createRawMaterial);

// 6B. Silver Bullion & Granules Store
router.get('/inventory/silver-items', SilverItemController.listSilverItems);
router.get('/inventory/silver-items/:id', SilverItemController.getSilverItemById);
router.post('/inventory/silver-items', SilverItemController.createSilverItem);

// 6C. Industrial Chemicals Store
router.get('/inventory/chemicals', ChemicalItemController.listChemicalItems);
router.post('/inventory/chemicals', ChemicalItemController.createChemicalItem);

// 6D. Silver Components & Accessories Store
router.get('/inventory/components', ComponentItemController.listComponentItems);
router.post('/inventory/components', ComponentItemController.createComponentItem);

// 7. Immutable Stock Movement Ledger
router.get('/inventory/movements', MovementController.listMovements);
router.post('/inventory/movements', MovementController.recordMovement);

// 8. Inventory Audits & Reconciliations
router.get('/inventory/audits', AuditController.listAudits);
router.post('/inventory/audits', AuditController.performAudit);

// 9. Universal Search (15+ Search Parameters)
router.get('/search/universal', SearchController.universalSearch);

// 10. Product Engineering & BOM Engine (Phase 23)
// Product Master
router.get('/products', ProductController.listProducts);
router.post('/products', ProductController.createProduct);
router.get('/products/:id', ProductController.getProductById);
router.put('/products/:id', ProductController.updateProduct);
router.delete('/products/:id', ProductController.deleteProduct);

// Bill of Materials (BOM)
router.get('/products/:id/bom', BOMController.getBOM);
router.put('/products/:id/bom', BOMController.upsertBOM);
router.post('/products/:id/bom/lines', BOMController.addLine);
router.delete('/products/:id/bom/lines/:lineId', BOMController.removeLine);

// Product Variants
router.get('/products/:id/variants', VariantController.listVariants);
router.post('/products/:id/variants', VariantController.createVariant);
router.put('/products/:id/variants/:vid', VariantController.updateVariant);
router.delete('/products/:id/variants/:vid', VariantController.deleteVariant);

// Routing Templates
router.get('/products/:id/routing', RoutingController.getRouting);
router.put('/products/:id/routing', RoutingController.upsertRouting);

// Product Costing
router.get('/products/:id/cost', CostingController.getCost);
router.post('/products/:id/cost/calculate', CostingController.calculateCost);

export default router;


