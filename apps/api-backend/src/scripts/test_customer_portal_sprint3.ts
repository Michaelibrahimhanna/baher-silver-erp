import { CustomerGalleryService } from '../services/customer_gallery.service';
import { CustomerPortalService } from '../services/customer_portal.service';
import { ProductService } from '../services/product.service';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function runCustomerPortalSprint3UnitTests() {
  console.log('=============================================================================');
  console.log('EPIC 06 SPRINT 03: PRIVATE GALLERY & DESIGN ASSETS — UNIT TEST SUITE');
  console.log('=============================================================================');

  try {
    // -------------------------------------------------------------------------
    // CLEANUP & SETUP
    // -------------------------------------------------------------------------
    console.log('\n[SETUP] Cleaning up database and preparing test environment...');
    await prisma.customerAssetDownloadLog.deleteMany({});
    await prisma.customerProductFavorite.deleteMany({});
    await prisma.customerDesignVersionHistory.deleteMany({});
    await prisma.customerDesignAsset.deleteMany({});
    await prisma.customerProductCollection.deleteMany({});

    const cust = await CustomerPortalService.registerOrLoginCustomer('vip_gallery_brand@bahersilver.com', 'Pass925!');

    const product = await ProductService.createProduct({
      nameAr: 'قلادة فضة فاخرة مرصعة بأحجار الزمرد',
      nameEn: 'Luxury Emerald Silver Necklace',
      category: 'قلادة',
      silverPurity: '925'
    });

    console.log(`  ✓ Setup Complete: Customer ID = ${cust.user.id} | Product Code = ${product.productCode}`);

    // -------------------------------------------------------------------------
    // TEST 1: PRIVATE PRODUCT GALLERY & MULTI-TENANT SEARCH ENGINE
    // -------------------------------------------------------------------------
    console.log('\n[TEST 1] Testing Private Product Gallery & Search Engine...');

    const galleryProducts = await CustomerGalleryService.getPrivateGalleryProducts(cust.user.id, { search: 'قلادة' });
    console.log(`  ✓ Gallery Products Returned Count: ${galleryProducts.length}`);
    console.log(`    └─ Product 1: "${galleryProducts[0]?.nameAr}" | Purity: ${galleryProducts[0]?.silverPurity}`);

    if (galleryProducts.length === 0) {
      throw new Error('Private product gallery search engine failed');
    }

    // -------------------------------------------------------------------------
    // TEST 2: CUSTOMER COLLECTIONS & CUSTOM FOLDERS
    // -------------------------------------------------------------------------
    console.log('\n[TEST 2] Testing Customer Collections & Custom Folders...');

    const collection = await CustomerGalleryService.createCollection(cust.user.id, {
      collectionName: 'تشكيلة صيف 2026 الملكية',
      description: 'مجموعة القلادات الفضية الحصرية لعلامتنا التجارية',
      folderIcon: 'crown'
    });

    console.log(`  ✓ Collection Created: ID = ${collection.id} | Name = "${collection.collectionName}"`);

    const collections = await CustomerGalleryService.listCollections(cust.user.id);
    console.log(`  ✓ Customer Collections Count: ${collections.length}`);

    if (collections.length === 0 || collections[0]?.collectionName !== 'تشكيلة صيف 2026 الملكية') {
      throw new Error('Customer collections or custom folders failed');
    }

    // -------------------------------------------------------------------------
    // TEST 3: DESIGN ASSET LIBRARY, INTEGRITY HASH & 3D/AR VIEWER
    // -------------------------------------------------------------------------
    console.log('\n[TEST 3] Testing Design Asset Library, Integrity Hash & 3D/AR Viewer...');

    const uploadRes = await CustomerGalleryService.uploadDesignAsset(cust.user.id, {
      productId: product.id,
      assetName: 'luxury_necklace_v1.stl',
      fileUrl: 'storage/cad/luxury_necklace_v1.stl',
      previewUrl: 'storage/cad/luxury_necklace_v1_preview.png',
      model3dUrl: 'storage/cad/3d/luxury_necklace_v1.gltf',
      fileType: 'CAD_STL',
      fileSizeBytes: 5242880, // 5 MB
      designerName: 'مصمم 3D الإيطالي',
      tags: ['EMERALD', 'SILVER925', 'ROYAL'],
      dependencies: { renderingPdf: 'storage/docs/rendering_spec.pdf', dppCode: 'DPP-2026-000088' }
    });

    const asset = uploadRes.asset;
    console.log(`  ✓ Asset Uploaded: Name = ${asset.assetName} | Status = ${asset.lifecycleStatus} | Version = ${asset.version}`);
    console.log(`  ✓ SHA-256 Integrity Hash: ${asset.integritySha256?.substring(0, 32)}...`);
    console.log(`  ✓ 3D Model URL for Viewer: ${asset.model3dUrl}`);
    console.log(`  ✓ Current Customer Storage Usage: ${(uploadRes.currentStorageBytes / (1024 * 1024)).toFixed(2)} MB`);

    if (asset.fileType !== 'CAD_STL' || !asset.integritySha256 || !asset.model3dUrl) {
      throw new Error('Design asset library, integrity hash, or 3D viewer failed');
    }

    // -------------------------------------------------------------------------
    // TEST 4: DESIGN VERSION MANAGEMENT (V1 -> V2) & VERSION ROLLBACK
    // -------------------------------------------------------------------------
    console.log('\n[TEST 4] Testing Design Version Management & Version Rollback...');

    // Upgrade to Version V2
    const versionV2 = await CustomerGalleryService.createDesignVersion(cust.user.id, asset.id, {
      fileUrl: 'storage/cad/luxury_necklace_v2.stl',
      changeNotes: 'تم ترقية زوايا تركيب أحجار الزمرد إلى 45 درجة'
    });

    console.log(`  ✓ Upgraded Asset Version: ${versionV2.updatedAsset.version} | New URL: ${versionV2.updatedAsset.fileUrl}`);

    // Rollback to Version V1
    const rollbackAsset = await CustomerGalleryService.rollbackDesignVersion(cust.user.id, asset.id, 'V1');
    console.log(`  ✓ Rolled Back Asset Version: ${rollbackAsset.version} | Restored URL: ${rollbackAsset.fileUrl}`);

    if (rollbackAsset.version !== 'V1') {
      throw new Error('Design version control or version rollback failed');
    }

    // -------------------------------------------------------------------------
    // TEST 5: FAVORITES & BOOKMARKS
    // -------------------------------------------------------------------------
    console.log('\n[TEST 5] Testing Favorites & Bookmarks...');

    const favToggle = await CustomerGalleryService.toggleFavorite(cust.user.id, { productId: product.id });
    console.log(`  ✓ Favorite Toggled: ${favToggle.message} (isFavorite: ${favToggle.isFavorite})`);

    const favorites = await CustomerGalleryService.listFavorites(cust.user.id);
    console.log(`  ✓ Customer Favorites List Count: ${favorites.length}`);

    if (favorites.length === 0) {
      throw new Error('Favorites & bookmarks failed');
    }

    // -------------------------------------------------------------------------
    // TEST 6: ASSET DOWNLOAD LOG & SOFT DELETE (RECYCLE BIN)
    // -------------------------------------------------------------------------
    console.log('\n[TEST 6] Testing Asset Download Log & Soft Delete (Recycle Bin)...');

    const downloadLog = await CustomerGalleryService.logAssetDownload(cust.user.id, asset.id, cust.user.customerName);
    console.log(`  ✓ Download Logged: ID = ${downloadLog.id} | Downloaded By: "${downloadLog.downloadedBy}"`);

    const softDeleted = await CustomerGalleryService.softDeleteAsset(cust.user.id, asset.id);
    console.log(`  ✓ Soft Deleted Asset: isDeleted = ${softDeleted.isDeleted} | Deleted At: ${softDeleted.deletedAt?.toISOString()}`);

    if (!softDeleted.isDeleted || !downloadLog.id) {
      throw new Error('Asset download log or soft delete failed');
    }

    console.log('\n=============================================================================');
    console.log('ALL EPIC 06 SPRINT 03 PRIVATE GALLERY TESTS PASSED 100% SUCCESSFULLY! 🎯');
    console.log('=============================================================================');
  } catch (err: any) {
    console.error('\n❌ EPIC 06 SPRINT 03 UNIT TEST FAILED:', err.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

runCustomerPortalSprint3UnitTests();
