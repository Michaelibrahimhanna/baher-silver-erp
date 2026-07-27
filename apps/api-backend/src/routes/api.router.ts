import { Router } from 'express';
import { WarehouseController } from '../controllers/warehouse.controller';
import { StoneController } from '../controllers/stone.controller';
import { RawMaterialController } from '../controllers/raw_material.controller';
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
import { authenticateJWT, requirePermission } from '../middleware/auth';

const router = Router();

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


