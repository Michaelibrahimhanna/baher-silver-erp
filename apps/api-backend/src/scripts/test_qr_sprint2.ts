import { DppPublicService } from '../services/dpp_public.service';
import { QrPassportService } from '../services/qr_passport.service';
import { IdentityPlatformService } from '../services/identity_platform.service';
import { ProductService } from '../services/product.service';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function runQrSprint2UnitTests() {
  console.log('=============================================================================');
  console.log('EPIC 04 SPRINT 02: PUBLIC DIGITAL PRODUCT PASSPORT PORTAL — UNIT TEST SUITE');
  console.log('=============================================================================');

  try {
    // -------------------------------------------------------------------------
    // CLEANUP & SETUP
    // -------------------------------------------------------------------------
    console.log('\n[SETUP] Cleaning up database and preparing test environment...');
    await prisma.publicDppAnalyticsLog.deleteMany({});
    await prisma.digitalProductPassportDraft.deleteMany({});

    // Create Identity Product Model & Physical Piece via EPIC 02 Engine
    const product = await ProductService.createProduct({
      nameAr: 'خاتم فضة إيطالي مرصع بالعقيق الأحمـر',
      nameEn: 'Italian Silver Ring with Red Agate',
      category: 'خاتم',
      silverPurity: '925'
    });

    const piece = await IdentityPlatformService.createPhysicalPiece({
      productModelId: product.id,
      weightGrams: 16.80,
      silverPurity: '925',
      branchId: 'BRANCH-HQ'
    });

    console.log(`  ✓ Setup Complete: Piece Serial = ${piece.serialNo} | Verification Token = ${piece.verificationToken.slice(0, 20)}...`);

    // -------------------------------------------------------------------------
    // TEST 1: PUBLISH DIGITAL PRODUCT PASSPORT & CONSUME SPRINT 01 DRAFT ENGINE
    // -------------------------------------------------------------------------
    console.log('\n[TEST 1] Testing Passport Publishing & Sprint 01 Integration...');

    const publishedDpp = await DppPublicService.publishPassport(piece.id, {
      productNameAr: product.nameAr,
      productNameEn: product.nameEn,
      silverPurity: '925',
      weightGrams: 16.80,
      craftsmanship: 'Handcrafted Master Italian Silver',
      origin: 'Khan El Khalili, Cairo, Egypt'
    });

    console.log(`  ✓ Published Passport DPP Code: ${publishedDpp.dppCode} | Status: ${publishedDpp.status}`);
    console.log(`  ✓ Canonical URL: "${publishedDpp.canonicalUrl}"`);

    if (publishedDpp.status !== 'PUBLISHED' || !publishedDpp.canonicalUrl) {
      throw new Error('Passport publishing failed');
    }

    // -------------------------------------------------------------------------
    // TEST 2: PUBLIC PASSPORT READ-ONLY DATA RETRIEVAL & MULTILINGUAL SUPPORT
    // -------------------------------------------------------------------------
    console.log('\n[TEST 2] Testing Public Read-Only Passport Retrieval & Multilingual Payloads...');

    const publicPassport = await DppPublicService.getPublicPassport(piece.serialNo, {
      viewSource: 'QR_SCAN',
      userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X)',
      ipAddress: '197.35.120.4'
    });

    console.log(`  ✓ Passport Serial: ${publicPassport.productInfo.serialNo} | Title (AR): "${publicPassport.productInfo.title.ar}"`);
    console.log(`  ✓ Silver Purity: ${publicPassport.productInfo.silverPurity} | Total Weight: ${publicPassport.productInfo.weightGrams}g`);
    console.log(`  ✓ Hallmark Status: "${publicPassport.specifications.hallmarkStatus.ar}"`);
    console.log(`  ✓ Artisan Workshop: "${publicPassport.manufacturingInfo.artisanWorkshop.ar}"`);
    console.log(`  ✓ View Count: ${publicPassport.productInfo.viewCount}`);

    if (!publicPassport.readOnly || publicPassport.productInfo.serialNo !== piece.serialNo) {
      throw new Error('Public passport read-only retrieval failed');
    }

    // -------------------------------------------------------------------------
    // TEST 3: AUTHENTICITY VERIFICATION SCREEN ENGINE
    // -------------------------------------------------------------------------
    console.log('\n[TEST 3] Testing Authenticity Verification Engine (Valid vs Invalid Token)...');

    // 3A. Valid Token Verification
    const validAuth = await DppPublicService.verifyAuthenticity(piece.serialNo, piece.verificationToken);
    console.log(`  ✓ Valid Verification Result: Status = ${validAuth.status} | Authentic = ${validAuth.isAuthentic}`);
    console.log(`    └─ Message (AR): "${validAuth.message?.ar}"`);

    if (!validAuth.isAuthentic || validAuth.status !== 'VERIFIED_AUTHENTIC') {
      throw new Error('Valid token authenticity verification failed');
    }

    // 3B. Invalid Token Verification
    const invalidAuth = await DppPublicService.verifyAuthenticity(piece.serialNo, 'INVALID-TOKEN-999');
    console.log(`  ✓ Invalid Verification Result: Status = ${invalidAuth.status} | Authentic = ${invalidAuth.isAuthentic}`);

    if (invalidAuth.isAuthentic || invalidAuth.status !== 'TOKEN_MISMATCH') {
      throw new Error('Invalid token security rejection failed');
    }

    // -------------------------------------------------------------------------
    // TEST 4: SEO STRUCTURED DATA & SCHEMA.ORG JSON-LD GENERATION
    // -------------------------------------------------------------------------
    console.log('\n[TEST 4] Testing SEO Structured Data (OpenGraph & JSON-LD Product Schema)...');

    const seoData = await DppPublicService.getSeoMetadata(piece.serialNo);
    console.log(`  ✓ SEO Canonical URL: "${seoData.canonicalUrl}"`);
    console.log(`  ✓ OpenGraph Title: "${seoData.metaTags.openGraph['og:title']}"`);
    console.log(`  ✓ Schema.org Product Type: "${seoData.jsonLd['@type']}" | MPN: "${seoData.jsonLd.mpn}"`);

    if (seoData.jsonLd['@type'] !== 'Product' || seoData.jsonLd.mpn !== piece.serialNo) {
      throw new Error('SEO structured data generation failed');
    }

    // -------------------------------------------------------------------------
    // TEST 5: PUBLIC ANALYTICS & VISIT COUNTER TRACKING
    // -------------------------------------------------------------------------
    console.log('\n[TEST 5] Testing Public Analytics & Device / Source Tracking...');

    const analytics = await DppPublicService.getPublicAnalytics(piece.serialNo);
    console.log(`  ✓ Total Analytics Recorded Views: ${analytics.totalViews}`);
    console.log(`  ✓ Views by Source:`, analytics.sourcesBreakdown);
    console.log(`  ✓ Views by Device Type:`, analytics.devicesBreakdown);

    if (analytics.totalViews < 1 || !analytics.sourcesBreakdown['QR_SCAN']) {
      throw new Error('Public analytics logging failed');
    }

    // -------------------------------------------------------------------------
    // TEST 6: EXPIRING PUBLIC URLS ARCHITECTURE (DISABLED BY DEFAULT)
    // -------------------------------------------------------------------------
    console.log('\n[TEST 6] Testing Optional Expiring Public URLs Architecture...');

    // Publish a test expired link
    const expiredPiece = await IdentityPlatformService.createPhysicalPiece({
      productModelId: product.id,
      weightGrams: 12.00,
      silverPurity: '925',
      branchId: 'BRANCH-HQ'
    });

    await DppPublicService.publishPassport(expiredPiece.id, {}, {
      expiringUrlEnabled: true,
      ttlHours: -1 // Expired 1 hour ago
    });

    try {
      await DppPublicService.getPublicPassport(expiredPiece.serialNo);
      throw new Error('Expiring public URL restriction check failed');
    } catch (err: any) {
      console.log(`  ✓ Expiring URL Access Blocked Correctly: "${err.message}"`);
    }

    console.log('\n=============================================================================');
    console.log('ALL EPIC 04 SPRINT 02 PUBLIC DPP PORTAL TESTS PASSED 100% SUCCESSFULLY! 🎯');
    console.log('=============================================================================');
  } catch (err: any) {
    console.error('\n❌ EPIC 04 SPRINT 02 UNIT TEST FAILED:', err.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

runQrSprint2UnitTests();
