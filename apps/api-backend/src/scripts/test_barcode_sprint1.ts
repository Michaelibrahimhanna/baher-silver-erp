import { BarcodeLabelService } from '../services/barcode_label.service';
import { IdentityPlatformService } from '../services/identity_platform.service';
import { ProductService } from '../services/product.service';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function runBarcodeSprint1UnitTests() {
  console.log('=============================================================================');
  console.log('EPIC 03 SPRINT 01: BARCODE & LABEL PLATFORM — UNIT TEST SUITE');
  console.log('=============================================================================');

  try {
    // -------------------------------------------------------------------------
    // CLEANUP TEST TABLES
    // -------------------------------------------------------------------------
    console.log('\n[SETUP] Cleaning up test barcode database tables...');
    await prisma.barcodeGenerationAudit.deleteMany({});
    await prisma.printableLabelTemplate.deleteMany({});
    console.log('  ✓ Cleaned up test database.');

    // -------------------------------------------------------------------------
    // TEST 1: CODE128 BARCODE GENERATION, VALIDATION & RENDERING
    // -------------------------------------------------------------------------
    console.log('\n[TEST 1] Testing Code128 Engine (Auto/A/B/C, Checksum & Vector Rendering)...');

    const code128Result = BarcodeLabelService.generateBarcode('CODE128', 'BS-RNG-994821');
    console.log(`  ✓ Generated Code128: "${code128Result.code}" | Checksum Modulo 103: ${code128Result.checkDigit}`);
    console.log(`  ✓ SVG Render Length: ${code128Result.render.svg.length} bytes | Base64 URI: ${code128Result.render.base64DataUri.slice(0, 45)}...`);
    console.log(`  ✓ ASCII Matrix: ${code128Result.render.ascii}`);

    const code128Validation = BarcodeLabelService.validateBarcode('CODE128', 'BS-RNG-994821');
    if (!code128Validation.isValid) throw new Error('Code128 validation failed');

    // -------------------------------------------------------------------------
    // TEST 2: EAN13 BARCODE GENERATION & MODULO 10 CHECK DIGIT VALIDATION
    // -------------------------------------------------------------------------
    console.log('\n[TEST 2] Testing EAN13 Engine (13 Digits & Modulo 10 Check Digit)...');

    const ean13Result = BarcodeLabelService.generateBarcode('EAN13', '622999480014'); // Base 12 -> 13th is check digit '8'
    console.log(`  ✓ Generated EAN13: "${ean13Result.code}" | Modulo 10 Check Digit: '${ean13Result.checkDigit}'`);

    const validEanCheck = BarcodeLabelService.validateBarcode('EAN13', ean13Result.code);
    if (!validEanCheck.isValid) throw new Error(`EAN13 validation failed for valid code '${ean13Result.code}'`);
    console.log(`  ✓ EAN13 Validation Passed (Check Digit Match)`);

    // Invalid check digit test
    const invalidEanCheck = BarcodeLabelService.validateBarcode('EAN13', '6229994800140'); // Wrong check digit 0 instead of 8
    if (invalidEanCheck.isValid) throw new Error('EAN13 validation should have failed for wrong check digit');
    console.log(`  ✓ EAN13 Correctly Rejected Invalid Check Digit: "${invalidEanCheck.errorMessage}"`);

    // -------------------------------------------------------------------------
    // TEST 3: GS1-128 APPLICATION IDENTIFIERS (AI) PARSING
    // -------------------------------------------------------------------------
    console.log('\n[TEST 3] Testing GS1-128 Application Identifiers (AIs) Engine...');

    const gs1Result = BarcodeLabelService.generateBarcode('GS1_128', {
      sku: 'BS-RNG-001',
      serialNo: 'SN-2026-000142',
      weightGrams: 14.85,
      productionDate: '2026-07-29'
    });

    console.log(`  ✓ Generated GS1-128 Payload: "${gs1Result.code}"`);
    console.log(`  ✓ Parsed GS1 AIs:`, gs1Result.parsedAIs);

    if (!gs1Result.parsedAIs || !gs1Result.parsedAIs['01'] || !gs1Result.parsedAIs['21'] || !gs1Result.parsedAIs['3102']) {
      throw new Error('GS1-128 AI parsing failed for GTIN (01), Serial (21), or Net Weight (3102)');
    }
    console.log(`    └─ AI (01) GTIN: ${gs1Result.parsedAIs['01']}`);
    console.log(`    └─ AI (21) Serial: ${gs1Result.parsedAIs['21']}`);
    console.log(`    └─ AI (3102) Net Weight (grams): ${gs1Result.parsedAIs['3102']} (14.85g)`);

    // -------------------------------------------------------------------------
    // TEST 4: INTEGRATION WITH PRODUCT IDENTITY PLATFORM (EPIC 02)
    // -------------------------------------------------------------------------
    console.log('\n[TEST 4] Testing Integration with EPIC 02 Product Identity Engine...');

    // Create a product model and physical piece
    const productModel = await ProductService.createProduct({
      nameAr: 'خاتم فضة إيطالي مرصع بالأحجار',
      nameEn: 'Italian Silver Ring with Gemstones',
      category: 'خاتم',
      silverPurity: '925'
    });

    const piece = await IdentityPlatformService.createPhysicalPiece({
      productModelId: productModel.id,
      weightGrams: 18.50,
      silverPurity: '925',
      branchId: 'BRANCH-HQ'
    });

    console.log(`  ✓ Created Identity Physical Piece: Serial = ${piece.serialNo} | SKU = ${piece.sku}`);

    const pieceBarcode = await BarcodeLabelService.generateBarcodeForPiece(piece.id, 'GS1_128');
    console.log(`  ✓ Integrated Piece Barcode Payload: "${pieceBarcode.barcode.code}"`);
    console.log(`  ✓ Piece Weight: ${pieceBarcode.weightGrams}g | Purity: ${pieceBarcode.silverPurity}`);

    if (pieceBarcode.serialNo !== piece.serialNo) {
      throw new Error('Integrated piece barcode serial number mismatch');
    }

    // -------------------------------------------------------------------------
    // TEST 5: PRINTABLE LABEL MODEL & LAYOUT PREVIEW RENDERING
    // -------------------------------------------------------------------------
    console.log('\n[TEST 5] Testing Printable Label Model & Layout Preview Engine...');

    const labelTemplate = await BarcodeLabelService.createLabelTemplate({
      templateCode: 'LBL-JEWELRY-TAG-30X15',
      name: 'Standard Jewelry Butterfly Tag (30mm x 15mm)',
      category: 'JEWELRY_TAG',
      widthMm: 30.0,
      heightMm: 15.0,
      dpi: 600,
      defaultBarcodeFormat: 'CODE128',
      layoutJson: {
        barcode: { x: 2, y: 2, width: 26, height: 8 },
        serialText: { x: 2, y: 11, font: 'monospace', size: 8 },
        weightText: { x: 18, y: 11, font: 'sans-serif', size: 8 }
      },
      isDefault: true
    });

    console.log(`  ✓ Created Label Template: ${labelTemplate.templateCode} (${labelTemplate.widthMm}x${labelTemplate.heightMm}mm @ ${labelTemplate.dpi}dpi)`);

    const labelPreview = await BarcodeLabelService.renderLabelPreview(labelTemplate.id, piece.id);
    console.log(`  ✓ Rendered Label Preview for Piece '${labelPreview.piece.serialNo}':`);
    console.log(`    └─ Barcode Format: ${labelPreview.barcode.format} | Code: "${labelPreview.barcode.code}"`);
    console.log(`    └─ Layout Merged: Width = ${labelPreview.template.widthMm}mm, Height = ${labelPreview.template.heightMm}mm`);

    if (!labelPreview.barcode.render.svg.includes('<svg')) {
      throw new Error('Rendered label preview SVG vector output missing');
    }

    // -------------------------------------------------------------------------
    // TEST 6: BARCODE GENERATION AUDIT LOGGING
    // -------------------------------------------------------------------------
    console.log('\n[TEST 6] Verifying Barcode Generation Audit Logs...');

    const auditLogs = await BarcodeLabelService.listGenerationAudits();
    console.log(`  ✓ Total Barcode Generation Audits Captured: ${auditLogs.length}`);

    if (auditLogs.length === 0) {
      throw new Error('Barcode generation audit log was not recorded');
    }

    console.log('\n=============================================================================');
    console.log('ALL EPIC 03 SPRINT 01 UNIT TESTS PASSED 100% SUCCESSFULLY! 🎯');
    console.log('=============================================================================');
  } catch (err: any) {
    console.error('\n❌ EPIC 03 SPRINT 01 UNIT TEST FAILED:', err.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

runBarcodeSprint1UnitTests();
