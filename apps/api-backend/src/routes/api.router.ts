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

const router = Router();

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

export default router;
