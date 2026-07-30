import { DppAdminService } from '../services/dpp_admin.service';
import { DppPublicService } from '../services/dpp_public.service';
import { QrPassportService } from '../services/qr_passport.service';
import { IdentityPlatformService } from '../services/identity_platform.service';
import { ProductService } from '../services/product.service';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function runQrSprint4UnitTests() {
  console.log('=============================================================================');
  console.log('EPIC 04 SPRINT 04: DPP ADMINISTRATION & CONTENT MANAGEMENT — UNIT TEST SUITE');
  console.log('=============================================================================');

  try {
    // -------------------------------------------------------------------------
    // CLEANUP & SETUP
    // -------------------------------------------------------------------------
    console.log('\n[SETUP] Cleaning up database and preparing test environment...');
    await prisma.dppContentVersionHistory.deleteMany({});
    await prisma.dppCertificateTemplate.deleteMany({});
    await prisma.dppPublishingAuditLog.deleteMany({});
    await prisma.publicDppAnalyticsLog.deleteMany({});
    await prisma.digitalProductPassportDraft.deleteMany({});

    // Create Identity Product Model & Physical Pieces via EPIC 02 Engine
    const product = await ProductService.createProduct({
      nameAr: 'خاتم فضة إيطالي مرصع بالعقيق الأحمـر',
      nameEn: 'Italian Silver Ring with Red Agate',
      category: 'خاتم',
      silverPurity: '925'
    });

    const piece1 = await IdentityPlatformService.createPhysicalPiece({
      productModelId: product.id,
      weightGrams: 16.80,
      silverPurity: '925',
      branchId: 'BRANCH-HQ'
    });

    const piece2 = await IdentityPlatformService.createPhysicalPiece({
      productModelId: product.id,
      weightGrams: 14.50,
      silverPurity: '925',
      branchId: 'BRANCH-HQ'
    });

    // Publish initial draft for piece1 and create draft for piece2
    await DppPublicService.publishPassport(piece1.id, {
      productNameAr: product.nameAr,
      productNameEn: product.nameEn,
      silverPurity: '925'
    });

    await QrPassportService.createDppDraft(piece2.id, {
      productNameAr: product.nameAr,
      productNameEn: product.nameEn,
      silverPurity: '925'
    });

    console.log(`  ✓ Setup Complete: Piece1 Serial = ${piece1.serialNo} | Piece2 Serial = ${piece2.serialNo}`);

    // -------------------------------------------------------------------------
    // TEST 1: PASSPORTS LISTING, SEARCH & STATUS FILTERING
    // -------------------------------------------------------------------------
    console.log('\n[TEST 1] Testing Passport Admin Listing, Search & Status Filters...');

    const listResult = await DppAdminService.listPassports({ status: 'ALL' });
    console.log(`  ✓ Total Passports Returned: ${listResult.total}`);

    const searchResult = await DppAdminService.listPassports({ search: piece1.serialNo });
    console.log(`  ✓ Search by Serial Result Count: ${searchResult.total} | Matched Serial: ${searchResult.passports[0]?.serialNo}`);

    if (listResult.total < 1 || searchResult.passports[0]?.serialNo !== piece1.serialNo) {
      throw new Error('Admin passport listing & search failed');
    }

    // -------------------------------------------------------------------------
    // TEST 2: PASSPORT CONTENT EDITING & VERSION HISTORY SNAPSHOTS
    // -------------------------------------------------------------------------
    console.log('\n[TEST 2] Testing Passport Content Updates & Version Snapshots...');

    const updateRes = await DppAdminService.updatePassportContent(piece1.serialNo, {
      metadataJson: {
        productNameAr: 'خاتم فضة إيطالي ملكي مصقول فاخر',
        productNameEn: 'Luxury Royal Italian Silver Ring',
        silverPurity: '925'
      },
      changeSummary: 'Updated title to Luxury Royal Edition'
    }, 'OPERATOR-EXPERT');

    console.log(`  ✓ Updated Passport Version Sequence: v${updateRes.versionSeq}`);
    if (updateRes.versionSeq !== 2) {
      throw new Error('Passport version sequence incrementing failed');
    }

    // -------------------------------------------------------------------------
    // TEST 3: VERSION ROLLBACK ENGINE
    // -------------------------------------------------------------------------
    console.log('\n[TEST 3] Testing Version Rollback Engine...');

    const rolledBack = await DppAdminService.rollbackVersion(piece1.serialNo, 1, 'ADMIN-AUDITOR');
    console.log(`  ✓ Rollback Result Version Sequence: v${rolledBack.versionSeq}`);

    const rolledBackMeta = JSON.parse(rolledBack.metadataJson);
    console.log(`  ✓ Restored Title (AR): "${rolledBackMeta.productNameAr}"`);

    if (rolledBackMeta.productNameAr !== product.nameAr) {
      throw new Error('Version rollback failed to restore previous metadata');
    }

    // -------------------------------------------------------------------------
    // TEST 4: MULTI-STAGE PUBLISHING WORKFLOW (DRAFT -> REVIEW -> PUBLISHED -> ARCHIVED)
    // -------------------------------------------------------------------------
    console.log('\n[TEST 4] Testing Publishing Workflow State Machine & Audit Logs...');

    // Transition to REVIEW
    const reviewRes = await DppAdminService.transitionPublishingStatus(piece1.serialNo, 'REVIEW', 'LEAD-REVIEWER', {
      reason: 'Submitted for quality review'
    });
    console.log(`  ✓ State Transition: ${reviewRes.status} | Reviewed By: ${reviewRes.reviewedBy}`);

    // Transition to PUBLISHED
    const pubRes = await DppAdminService.transitionPublishingStatus(piece1.serialNo, 'PUBLISHED', 'HEAD-PUBLISHER', {
      reason: 'Approved for public release'
    });
    console.log(`  ✓ State Transition: ${pubRes.status} | Published At: ${pubRes.publishedAt}`);

    if (pubRes.status !== 'PUBLISHED') {
      throw new Error('Publishing workflow state machine failed');
    }

    // -------------------------------------------------------------------------
    // TEST 5: BULK STATUS OPERATIONS (BULK PUBLISH / ARCHIVE)
    // -------------------------------------------------------------------------
    console.log('\n[TEST 5] Testing Bulk Publishing & Archiving Operations...');

    const bulkRes = await DppAdminService.bulkTransitionStatus([piece1.serialNo, piece2.serialNo], 'ARCHIVED', 'ADMIN-DIRECTOR', 'Bulk end of season archive');
    console.log(`  ✓ Bulk Operation Executed for ${bulkRes.length} items`);
    console.log(`  ✓ Item 1 Status: ${bulkRes[0].status} | Item 2 Status: ${bulkRes[1].status}`);

    if (bulkRes.some(r => !r.success)) {
      throw new Error('Bulk status operation failed');
    }

    // -------------------------------------------------------------------------
    // TEST 6: MEDIA LIBRARY & AUTOMATIC WEBP OPTIMIZATION
    // -------------------------------------------------------------------------
    console.log('\n[TEST 6] Testing Media Library & Automatic WebP Asset Optimization...');

    const mediaRes = await DppAdminService.manageMediaLibrary(piece1.serialNo, {
      primaryImage: 'assets/ring_highres.png',
      galleryImages: ['assets/ring_highres.png', 'assets/ring_side.png'],
      videoUrl: 'https://passport.bahersilver.com/assets/craftsmanship.mp4'
    });

    const parsedMedia = JSON.parse(mediaRes.mediaGalleryJson || '{}');
    console.log(`  ✓ Primary Image: "${parsedMedia.primaryImage}"`);
    console.log(`  ✓ Optimized WebP Assets Count: ${parsedMedia.optimizedAssets.length}`);
    console.log(`  ✓ Sample WebP Asset Format: "${parsedMedia.optimizedAssets[0]?.format}" | Thumb: "${parsedMedia.optimizedAssets[0]?.thumbUrl}"`);

    if (!parsedMedia.optimizedAssets || parsedMedia.optimizedAssets[0]?.format !== 'WebP') {
      throw new Error('Automatic WebP asset optimization failed');
    }

    // -------------------------------------------------------------------------
    // TEST 7: CERTIFICATE TEMPLATE MANAGER & LIVE PREVIEW
    // -------------------------------------------------------------------------
    console.log('\n[TEST 7] Testing Certificate Template Manager & Live Preview Layouts...');

    const template = await DppAdminService.createCertificateTemplate({
      templateName: 'قالب شهادة الدمغة الملكية 925',
      versionNo: 'v2.0',
      issuerAuthority: 'مصلحة الدمغة والموازين المصرية — باهر سيلفر',
      isDefault: true
    });

    console.log(`  ✓ Certificate Template Created: ID = ${template.id} | Name = "${template.templateName}" | Version = ${template.versionNo}`);

    const templatesList = await DppAdminService.listCertificateTemplates();
    if (templatesList.length === 0) {
      throw new Error('Certificate template management failed');
    }

    // -------------------------------------------------------------------------
    // TEST 8: ADVANCED ANALYTICS DASHBOARD AGGREGATION
    // -------------------------------------------------------------------------
    console.log('\n[TEST 8] Testing Advanced Analytics Dashboard Aggregation Widgets...');

    const analyticsDashboard = await DppAdminService.getAdvancedAnalyticsDashboard();
    console.log(`  ✓ KPIs Summary: Total Passports = ${analyticsDashboard.kpis.totalPassports} | Archived = ${analyticsDashboard.kpis.archivedCount}`);
    console.log(`  ✓ Recent Audit Logs Count: ${analyticsDashboard.recentAudits.length}`);

    if (analyticsDashboard.kpis.totalPassports < 1 || analyticsDashboard.recentAudits.length === 0) {
      throw new Error('Advanced analytics dashboard aggregation failed');
    }

    console.log('\n=============================================================================');
    console.log('ALL EPIC 04 SPRINT 04 ADMIN & CONTENT TESTS PASSED 100% SUCCESSFULLY! 🎯');
    console.log('=============================================================================');
  } catch (err: any) {
    console.error('\n❌ EPIC 04 SPRINT 04 UNIT TEST FAILED:', err.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

runQrSprint4UnitTests();
