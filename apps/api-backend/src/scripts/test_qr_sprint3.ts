import { DppJourneyService } from '../services/dpp_journey.service';
import { DppPublicService } from '../services/dpp_public.service';
import { IdentityPlatformService } from '../services/identity_platform.service';
import { ProductService } from '../services/product.service';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function runQrSprint3UnitTests() {
  console.log('=============================================================================');
  console.log('EPIC 04 SPRINT 03: CUSTOMER PRODUCT JOURNEY & AFTER-SALES — UNIT TEST SUITE');
  console.log('=============================================================================');

  try {
    // -------------------------------------------------------------------------
    // CLEANUP & SETUP
    // -------------------------------------------------------------------------
    console.log('\n[SETUP] Cleaning up database and preparing test environment...');
    await prisma.supportChannel.deleteMany({});
    await prisma.certificateVersion.deleteMany({});
    await prisma.publicDppAnalyticsLog.deleteMany({});
    await prisma.digitalProductPassportDraft.deleteMany({});

    // Seed test support channels
    await prisma.supportChannel.create({
      data: {
        channelType: 'WHATSAPP',
        titleAr: 'خدمة العملاء عبر واتساب',
        titleEn: 'WhatsApp Customer Care',
        value: '+20 100 000 0000',
        actionUrl: 'https://wa.me/201000000000',
        sortOrder: 1
      }
    });

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

    // Record lifecycle events in EPIC 02 Engine
    await prisma.pieceLifecycleEvent.create({
      data: {
        physicalPieceId: piece.id,
        actionType: 'MANUFACTURING_CASTING',
        newStatus: 'ACTIVE',
        notes: 'تمت صياغة الخاتم يدوياً بورشة خان الخليلي'
      }
    });

    await DppPublicService.publishPassport(piece.id, {
      productNameAr: product.nameAr,
      productNameEn: product.nameEn,
      silverPurity: '925',
      weightGrams: 16.80
    });

    console.log(`  ✓ Setup Complete: Piece Serial = ${piece.serialNo} | Passport Published`);

    // -------------------------------------------------------------------------
    // TEST 1: CUSTOMER JOURNEY & AFTER-SALES DATA AGGREGATION
    // -------------------------------------------------------------------------
    console.log('\n[TEST 1] Testing Customer Journey & After-Sales Data Aggregation...');

    const journey = await DppJourneyService.getJourneyData(piece.serialNo);
    console.log(`  ✓ Journey Product Title (AR): "${journey.productTitle.ar}"`);
    console.log(`  ✓ Care Tips Loaded: ${journey.careInstructions.tips.length} tips`);
    console.log(`  ✓ Support Channels Loaded: ${journey.supportChannels.length} active channels`);

    if (!journey.readOnly || journey.serialNo !== piece.serialNo) {
      throw new Error('Customer journey data aggregation failed');
    }

    // -------------------------------------------------------------------------
    // TEST 2: PRODUCT CARE INSTRUCTIONS & READ-ONLY WARRANTY DETAILS
    // -------------------------------------------------------------------------
    console.log('\n[TEST 2] Testing Product Care Instructions & Read-Only Warranty Terms...');

    const careWarranty = await DppJourneyService.getCareAndWarranty(piece.serialNo);
    console.log(`  ✓ Warranty Title: "${careWarranty.warrantyInfo.title.ar}"`);
    console.log(`  ✓ Lifetime Purity Guarantee: "${careWarranty.warrantyInfo.badgeText.ar}"`);

    if (!careWarranty.warrantyInfo.isReadOnly || careWarranty.warrantyInfo.coverageTerms.length < 2) {
      throw new Error('Read-only warranty terms check failed');
    }

    // -------------------------------------------------------------------------
    // TEST 3: DIGITAL CERTIFICATES & PDF VERSIONING / CHECKSUM
    // -------------------------------------------------------------------------
    console.log('\n[TEST 3] Testing Digital Certificates, Trust Badges & PDF Versioning...');

    const certs = await DppJourneyService.getCertificates(piece.serialNo);
    console.log(`  ✓ Certificate ID: ${certs.digitalCertificates.certificateId} | Version: ${certs.digitalCertificates.versionNo}`);
    console.log(`  ✓ SHA-256 Checksum: ${certs.digitalCertificates.checksum}`);
    console.log(`  ✓ Trust Badges Count: ${certs.digitalCertificates.trustBadges.length}`);

    if (certs.digitalCertificates.versionNo !== 'v1.0' || !certs.digitalCertificates.checksum.startsWith('SHA256:')) {
      throw new Error('Digital certificate checksum generation failed');
    }

    // -------------------------------------------------------------------------
    // TEST 4: PRODUCT LIFECYCLE TIMELINE ENGINE (MANUFACTURING → SALE)
    // -------------------------------------------------------------------------
    console.log('\n[TEST 4] Testing Product Lifecycle Timeline Engine...');

    const timeline = await DppJourneyService.getTimeline(piece.serialNo);
    console.log(`  ✓ Total Timeline Milestones Captured: ${timeline.productTimeline.length}`);
    console.log(`  ✓ Initial Milestone Event: ${timeline.productTimeline[0].eventType} | Location: ${timeline.productTimeline[0].location}`);

    if (timeline.productTimeline.length === 0) {
      throw new Error('Product lifecycle timeline building failed');
    }

    // -------------------------------------------------------------------------
    // TEST 5: PASSPORT PDF CERTIFICATE GENERATION
    // -------------------------------------------------------------------------
    console.log('\n[TEST 5] Testing Passport PDF Certificate Document Generation...');

    const pdfData = await DppJourneyService.generatePassportPdfData(piece.serialNo);
    console.log(`  ✓ Download Filename: "${pdfData.downloadFilename}"`);
    console.log(`  ✓ Generated Printable HTML Length: ${pdfData.pdfHtml.length} bytes`);

    if (!pdfData.pdfHtml.includes('BAHER SILVER') || !pdfData.pdfHtml.includes(piece.serialNo)) {
      throw new Error('Passport PDF certificate generation failed');
    }

    console.log('\n=============================================================================');
    console.log('ALL EPIC 04 SPRINT 03 JOURNEY TESTS PASSED 100% SUCCESSFULLY! 🎯');
    console.log('=============================================================================');
  } catch (err: any) {
    console.error('\n❌ EPIC 04 SPRINT 03 UNIT TEST FAILED:', err.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

runQrSprint3UnitTests();
