import { QrPassportService } from '../services/qr_passport.service';
import { IdentityPlatformService } from '../services/identity_platform.service';
import { ProductService } from '../services/product.service';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function runQrSprint1UnitTests() {
  console.log('=============================================================================');
  console.log('EPIC 04 SPRINT 01: QR CODE & DIGITAL PRODUCT PASSPORT — UNIT TEST SUITE');
  console.log('=============================================================================');

  try {
    // -------------------------------------------------------------------------
    // CLEANUP & SETUP
    // -------------------------------------------------------------------------
    console.log('\n[SETUP] Cleaning up database and preparing test environment...');
    await prisma.qrCodeAuditLog.deleteMany({});
    await prisma.digitalProductPassportDraft.deleteMany({});

    // Create Identity Product Model & Physical Piece
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
      branchId: 'BRANCH-MAIN'
    });

    console.log(`  ✓ Setup Complete: Piece Serial = ${piece.serialNo} | SKU = ${piece.sku}`);

    // -------------------------------------------------------------------------
    // TEST 1: URL QR STRATEGY GENERATION, VALIDATION & RENDERING
    // -------------------------------------------------------------------------
    console.log('\n[TEST 1] Testing URL QR Code Strategy & Vector SVG Rendering...');

    const urlResult = QrPassportService.generateQrCode('URL', {
      serialNo: piece.serialNo
    }, { errorCorrection: 'M' });

    console.log(`  ✓ Generated URL QR Payload: "${urlResult.payload}" | ECC: ${urlResult.errorCorrection}`);
    console.log(`  ✓ SVG Vector Output Length: ${urlResult.render.svg.length} bytes | Base64 URI: ${urlResult.render.base64DataUri.slice(0, 45)}...`);
    console.log(`  ✓ ASCII Representation: ${urlResult.render.ascii}`);

    const urlValidation = QrPassportService.validateQrCode('URL', urlResult.payload);
    if (!urlValidation.isValid) throw new Error('URL QR validation failed');

    // -------------------------------------------------------------------------
    // TEST 2: GS1 DIGITAL LINK QR STRATEGY & URI PARSING
    // -------------------------------------------------------------------------
    console.log('\n[TEST 2] Testing GS1 Digital Link QR Code Strategy...');

    const gs1Result = QrPassportService.generateQrCode('GS1_DIGITAL_LINK', {
      sku: 'BS-RNG-001',
      serialNo: piece.serialNo,
      weightGrams: 16.80
    }, { errorCorrection: 'H' });

    console.log(`  ✓ Generated GS1 Digital Link Payload: "${gs1Result.payload}"`);
    console.log(`  ✓ Parsed GS1 Digital Link Parameters:`, gs1Result.parsedParams);

    if (!gs1Result.parsedParams || !gs1Result.parsedParams.gtin || !gs1Result.parsedParams.serialNo) {
      throw new Error('GS1 Digital Link URI parameter parsing failed');
    }

    // -------------------------------------------------------------------------
    // TEST 3: JSON PAYLOAD & ENCRYPTED VERIFICATION TOKEN QR STRATEGIES
    // -------------------------------------------------------------------------
    console.log('\n[TEST 3] Testing JSON Payload & Verification Token QR Strategies...');

    // 3A. JSON Payload QR
    const jsonResult = QrPassportService.generateQrCode('JSON_PAYLOAD', {
      serialNo: piece.serialNo,
      sku: piece.sku,
      weightGrams: piece.weightGrams,
      silverPurity: piece.silverPurity,
      verificationToken: piece.verificationToken
    });

    console.log(`  ✓ Generated JSON QR Payload: "${jsonResult.payload}"`);
    if (!jsonResult.parsedParams || jsonResult.parsedParams.sn !== piece.serialNo) {
      throw new Error('JSON QR payload parsing failed');
    }

    // 3B. Verification Token QR
    const tokenResult = QrPassportService.generateQrCode('VERIFICATION_TOKEN', {
      serialNo: piece.serialNo,
      verificationToken: piece.verificationToken
    });

    console.log(`  ✓ Generated Verification Token QR Payload: "${tokenResult.payload}"`);
    const tokenValidation = QrPassportService.validateQrCode('VERIFICATION_TOKEN', tokenResult.payload);
    if (!tokenValidation.isValid || tokenValidation.parsedParams?.serialNo !== piece.serialNo) {
      throw new Error('Verification Token QR validation failed');
    }

    // -------------------------------------------------------------------------
    // TEST 4: PHYSICAL PIECE QR INTEGRATION (EPIC 02 PLATFORM)
    // -------------------------------------------------------------------------
    console.log('\n[TEST 4] Testing Integration with Physical Piece Identity Engine...');

    const pieceQrResult = await QrPassportService.generateQrForPiece(piece.id, 'URL');
    console.log(`  ✓ Physical Piece QR Generated: Serial = ${pieceQrResult.serialNo} | DPP URL = "${pieceQrResult.dppUrl}"`);

    if (pieceQrResult.serialNo !== piece.serialNo || !pieceQrResult.dppUrl.includes(piece.serialNo)) {
      throw new Error('Physical Piece QR integration failed');
    }

    // -------------------------------------------------------------------------
    // TEST 5: DIGITAL PRODUCT PASSPORT (DPP) DRAFT ENGINE
    // -------------------------------------------------------------------------
    console.log('\n[TEST 5] Testing Digital Product Passport (DPP) Draft Engine...');

    const dppDraft = await QrPassportService.createDppDraft(piece.id, {
      productNameAr: product.nameAr,
      silverPurity: '925',
      weightGrams: 16.80,
      craftsmanship: 'Handcrafted Egyptian Italian Silver',
      origin: 'Cairo, Egypt',
      warranty: 'Lifetime Authenticity Guarantee'
    });

    console.log(`  ✓ Created DPP Draft #${dppDraft.dppCode}: Status = ${dppDraft.status} | DPP URL = "${dppDraft.dppUrl}"`);
    console.log(`    └─ Metadata JSON: ${dppDraft.metadataJson.slice(0, 70)}...`);

    const fetchedDpp = await QrPassportService.getDppDraft(piece.serialNo);
    if (!fetchedDpp || fetchedDpp.dppCode !== dppDraft.dppCode) {
      throw new Error('Digital product passport draft query failed');
    }

    // -------------------------------------------------------------------------
    // TEST 6: QR GENERATION AUDIT LOGGING
    // -------------------------------------------------------------------------
    console.log('\n[TEST 6] Verifying QR Code Generation Audit Trail Logs...');

    const audits = await QrPassportService.listQrAudits();
    console.log(`  ✓ Total QR Code Generation Audit Logs Captured: ${audits.length}`);

    if (audits.length === 0) {
      throw new Error('QR generation audit log was not recorded');
    }

    console.log('\n=============================================================================');
    console.log('ALL EPIC 04 SPRINT 01 QR CODE TESTS PASSED 100% SUCCESSFULLY! 🎯');
    console.log('=============================================================================');
  } catch (err: any) {
    console.error('\n❌ EPIC 04 SPRINT 01 UNIT TEST FAILED:', err.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

runQrSprint1UnitTests();
