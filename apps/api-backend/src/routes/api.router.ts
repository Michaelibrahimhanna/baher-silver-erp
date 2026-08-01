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
import { SecurityController } from '../controllers/security.controller';

const router = Router();

// =============================================================================
// PHASE 23A.2 & 23A.2+ ENTERPRISE AUTHENTICATION & SECURITY PLATFORM (/v1 API)
// =============================================================================
// Auth Core & Impersonation
router.post('/v1/auth/login', AuthController.login);
router.post('/auth/login', AuthController.login);

router.post('/v1/auth/refresh', AuthController.refresh);
router.post('/auth/refresh', AuthController.refresh);

router.post('/v1/auth/logout', authenticateJWT, AuthController.logout);
router.post('/auth/logout', authenticateJWT, AuthController.logout);

router.get('/v1/auth/me', authenticateJWT, AuthController.getMe);
router.get('/auth/me', authenticateJWT, AuthController.getMe);

router.post('/v1/auth/impersonate', authenticateJWT, requirePermission('users.manage'), AuthController.impersonate);
router.post('/auth/impersonate', authenticateJWT, requirePermission('users.manage'), AuthController.impersonate);

router.post('/v1/auth/impersonate/revert', authenticateJWT, AuthController.revertImpersonation);
router.post('/auth/impersonate/revert', authenticateJWT, AuthController.revertImpersonation);

router.post('/v1/auth/change-password', authenticateJWT, AuthController.changePassword);
router.post('/auth/change-password', authenticateJWT, AuthController.changePassword);

router.post('/v1/auth/reset-password', authenticateJWT, requirePermission('users.manage'), AuthController.resetPassword);
router.post('/auth/reset-password', authenticateJWT, requirePermission('users.manage'), AuthController.resetPassword);

// Users Management
router.get('/v1/users', authenticateJWT, requirePermission('users.view'), UserManagementController.listUsers);
router.get('/users', authenticateJWT, requirePermission('users.view'), UserManagementController.listUsers);

router.post('/v1/users', authenticateJWT, requirePermission('users.manage'), UserManagementController.createUser);
router.post('/users', authenticateJWT, requirePermission('users.manage'), UserManagementController.createUser);

router.get('/v1/users/:id', authenticateJWT, requirePermission('users.view'), UserManagementController.getUserById);
router.get('/users/:id', authenticateJWT, requirePermission('users.view'), UserManagementController.getUserById);

router.put('/v1/users/:id', authenticateJWT, requirePermission('users.manage'), UserManagementController.updateUser);
router.put('/users/:id', authenticateJWT, requirePermission('users.manage'), UserManagementController.updateUser);

router.delete('/v1/users/:id', authenticateJWT, requirePermission('users.manage'), UserManagementController.softDeleteUser);
router.delete('/users/:id', authenticateJWT, requirePermission('users.manage'), UserManagementController.softDeleteUser);

router.post('/v1/users/:id/permissions', authenticateJWT, requirePermission('users.manage'), UserManagementController.setPermissionOverride);
router.post('/users/:id/permissions', authenticateJWT, requirePermission('users.manage'), UserManagementController.setPermissionOverride);

router.delete('/v1/users/:id/permissions', authenticateJWT, requirePermission('users.manage'), UserManagementController.removePermissionOverride);
router.delete('/users/:id/permissions', authenticateJWT, requirePermission('users.manage'), UserManagementController.removePermissionOverride);

// Roles & Permissions Matrix
router.get('/v1/roles', authenticateJWT, requirePermission('users.manage'), RBACController.listRoles);
router.get('/roles', authenticateJWT, requirePermission('users.manage'), RBACController.listRoles);

router.post('/v1/roles', authenticateJWT, requirePermission('users.manage'), RBACController.createRole);
router.post('/roles', authenticateJWT, requirePermission('users.manage'), RBACController.createRole);

router.put('/v1/roles/:id/permissions', authenticateJWT, requirePermission('users.manage'), RBACController.updateRolePermissions);
router.put('/roles/:id/permissions', authenticateJWT, requirePermission('users.manage'), RBACController.updateRolePermissions);

router.get('/v1/permissions', authenticateJWT, requirePermission('users.manage'), RBACController.listPermissionGroups);
router.get('/permissions', authenticateJWT, requirePermission('users.manage'), RBACController.listPermissionGroups);

// Permission Simulator & Permission Diff Engine
router.get('/v1/rbac/simulator/:userId', authenticateJWT, requirePermission('users.view'), RBACController.simulatePermissions);
router.get('/rbac/simulator/:userId', authenticateJWT, requirePermission('users.view'), RBACController.simulatePermissions);

router.post('/v1/rbac/permissions/diff', authenticateJWT, requirePermission('users.manage'), RBACController.getPermissionDiff);
router.post('/rbac/permissions/diff', authenticateJWT, requirePermission('users.manage'), RBACController.getPermissionDiff);

// Security Dashboard, Policy & Health Diagnostics
router.get('/v1/security/dashboard/kpis', authenticateJWT, requirePermission('settings.view'), SecurityController.getDashboardKpis);
router.get('/security/dashboard/kpis', authenticateJWT, requirePermission('settings.view'), SecurityController.getDashboardKpis);

router.get('/v1/security/health-check', SecurityController.getHealthCheck);
router.get('/security/health-check', SecurityController.getHealthCheck);

router.get('/v1/security/password-policy', SecurityController.getPasswordPolicy);
router.get('/security/password-policy', SecurityController.getPasswordPolicy);

router.put('/v1/security/password-policy', authenticateJWT, requirePermission('settings.manage'), SecurityController.updatePasswordPolicy);
router.put('/security/password-policy', authenticateJWT, requirePermission('settings.manage'), SecurityController.updatePasswordPolicy);

// Session Monitor & Active Device Management
router.get('/v1/security/sessions/active', authenticateJWT, requirePermission('settings.view'), SecurityController.getActiveSessions);
router.get('/security/sessions/active', authenticateJWT, requirePermission('settings.view'), SecurityController.getActiveSessions);

router.delete('/v1/security/sessions/:sessionId', authenticateJWT, requirePermission('users.manage'), SecurityController.terminateSession);
router.delete('/security/sessions/:sessionId', authenticateJWT, requirePermission('users.manage'), SecurityController.terminateSession);

router.post('/v1/security/sessions/terminate-all-user/:userId', authenticateJWT, requirePermission('users.manage'), SecurityController.terminateAllUserSessions);
router.post('/security/sessions/terminate-all-user/:userId', authenticateJWT, requirePermission('users.manage'), SecurityController.terminateAllUserSessions);

// User Security Timeline & Cryptographic Hash-Chain Verification
router.get('/v1/security/users/:userId/timeline', authenticateJWT, requirePermission('settings.view'), SecurityController.getUserTimeline);
router.get('/security/users/:userId/timeline', authenticateJWT, requirePermission('settings.view'), SecurityController.getUserTimeline);

router.get('/v1/security/audit-chain/verify', authenticateJWT, requirePermission('settings.view'), SecurityController.verifyAuditChain);
router.get('/security/audit-chain/verify', authenticateJWT, requirePermission('settings.view'), SecurityController.verifyAuditChain);

// Four-Eyes Approval Workflow
router.post('/v1/security/approvals', authenticateJWT, requirePermission('users.manage'), SecurityController.createApprovalRequest);
router.get('/v1/security/approvals', authenticateJWT, requirePermission('users.manage'), SecurityController.listApprovalRequests);
router.post('/v1/security/approvals/:id/process', authenticateJWT, requirePermission('users.manage'), SecurityController.processApprovalRequest);

// Break Glass Emergency Account Protocol
router.post('/v1/security/break-glass/activate', authenticateJWT, requirePermission('users.manage'), SecurityController.activateBreakGlass);
router.post('/v1/security/break-glass/deactivate', authenticateJWT, requirePermission('users.manage'), SecurityController.deactivateBreakGlass);

// 2FA Disaster Recovery Codes
router.post('/v1/security/2fa/recovery-codes', authenticateJWT, SecurityController.generate2FARecoveryCodes);
router.post('/v1/security/2fa/verify-recovery-code', authenticateJWT, SecurityController.verify2FARecoveryCode);

// Security Logs
router.get('/v1/security/login-history', authenticateJWT, requirePermission('settings.view'), RBACController.getLoginHistory);
router.get('/security/login-history', authenticateJWT, requirePermission('settings.view'), RBACController.getLoginHistory);

router.get('/v1/security/audit-logs', authenticateJWT, requirePermission('settings.view'), RBACController.getAuthAuditLogs);
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

// Phase 24: Enterprise Manufacturing Engine Endpoints
import { ManufacturingController } from '../controllers/manufacturing.controller';

router.get('/production/work-centers', ManufacturingController.getWorkCenters);
router.post('/production/boms', ManufacturingController.upsertBOM);
router.post('/production/orders', ManufacturingController.createMO);
router.patch('/production/orders/:id/state', ManufacturingController.updateMOState);
router.get('/production/orders/:moId/reservations', ManufacturingController.getReservations);
router.post('/production/orders/:moId/consumption', ManufacturingController.recordConsumption);
router.post('/production/returns', ManufacturingController.recordReturn);
router.post('/production/scrap', ManufacturingController.recordScrap);
router.post('/production/finished-goods/receive', ManufacturingController.receiveFinishedGoods);
router.get('/production/orders/:moId/cost-rollup', ManufacturingController.getCostRollup);
router.get('/production/dashboard/kpis', ManufacturingController.getDashboardKPIs);
router.get('/production/events', ManufacturingController.getEventLogs);
router.get('/production/orders/:moId/genealogy', ManufacturingController.getGenealogy);
router.get('/production/orders/:moId/passport', ManufacturingController.getPassport);
router.get('/production/work-centers/:id/calendar', ManufacturingController.getCalendar);
router.get('/production/scheduler/recommendations', ManufacturingController.getScheduleRecommendation);

export default router;


