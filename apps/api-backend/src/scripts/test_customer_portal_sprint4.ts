import { CustomerDppService } from '../services/customer_dpp.service';
import { CustomerPortalService } from '../services/customer_portal.service';
import { ManufacturingService } from '../services/manufacturing.service';
import { ProductService } from '../services/product.service';
import { BarcodeLabelService } from '../services/barcode_label.service';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function runCustomerPortalSprint4UnitTests() {
  console.log('=============================================================================');
  console.log('EPIC 06 SPRINT 04: DPP & QR CUSTOMER EXPERIENCE — UNIT TEST SUITE');
  console.log('=============================================================================');

  try {
    // -------------------------------------------------------------------------
    // CLEANUP & SETUP
    // -------------------------------------------------------------------------
    console.log('\n[SETUP] Cleaning up database and preparing test environment...');
    await prisma.customerScanAuditHistory.deleteMany({});
    await prisma.customerPassportShareLink.deleteMany({});
    await prisma.customerWarrantyClaim.deleteMany({});
    await prisma.customerWarrantyRecord.deleteMany({});
    await prisma.digitalProductPassportDraft.deleteMany({});
    await prisma.physicalPiece.deleteMany({});

    const cust = await CustomerPortalService.registerOrLoginCustomer('vip_dpp_brand@bahersilver.com', 'Pass925!');

    // Seed label template for EPIC 03 integration
    try {
      await BarcodeLabelService.createLabelTemplate({
        name: 'قالب بطاقة المجوهرات 925',
        templateCode: 'tpl-jewelry-tag-925',
        category: 'JEWELRY_TAG',
        widthMm: 50.0,
        heightMm: 20.0,
        layoutJson: JSON.stringify({ elements: [{ type: 'BARCODE' }] })
      });
    } catch (e) {}

    const product = await ProductService.createProduct({
      nameAr: 'خاتم الفضة الإيطالي المرصع بالياقوت الأحمر',
      nameEn: 'Italian Ruby Silver Ring',
      category: 'خاتم',
      silverPurity: '925'
    });

    const mo = await ManufacturingService.createManufacturingOrder({
      productModelId: product.id,
      plannedQuantity: 5,
      priority: 'HIGH',
      supervisorName: 'سامح لطفي'
    });

    // Complete MO to generate produced pieces in EPIC 02, Labels in EPIC 03 & DPP in EPIC 04
    const completion = await ManufacturingService.completeMoAndGenerateIdentities(mo.id, 'OPERATOR-01');
    const pieceSerial = completion.producedPieces[0]?.serialNo;
    const dppCode = completion.digitalProductPassports[0]?.dppCode;

    const pieceObj = await prisma.physicalPiece.findFirst({ where: { serialNo: pieceSerial } });
    const verificationToken = pieceObj?.verificationToken || '';

    console.log(`  ✓ Setup Complete: Customer ID = ${cust.user.id} | Piece Serial = ${pieceSerial} | DPP Code = ${dppCode}`);

    // -------------------------------------------------------------------------
    // TEST 1: CUSTOMER DIGITAL PRODUCT PASSPORT VIEWER & PDF SNAPSHOT
    // -------------------------------------------------------------------------
    console.log('\n[TEST 1] Testing Customer Digital Product Passport Viewer & PDF Snapshot...');

    const passportDetails = await CustomerDppService.getCustomerPassportDetails(cust.user.id, dppCode);
    console.log(`  ✓ Passport Details Resolved: SKU = ${passportDetails.passport.sku} | Purity = ${passportDetails.passport.silverPurity}`);
    console.log(`  ✓ Certificate Verification ID: ${passportDetails.passport.certificateVerificationId}`);
    console.log(`  ✓ PDF Snapshot URL: ${passportDetails.passport.pdfSnapshotUrl}`);
    console.log(`  ✓ XRF Tested Purity: ${passportDetails.passport.xrfTestedPurity}‰`);

    if (!passportDetails.passport.certificateVerificationId || !passportDetails.passport.pdfSnapshotUrl) {
      throw new Error('Customer DPP Passport viewer details failed');
    }

    // -------------------------------------------------------------------------
    // TEST 2: QR EXPERIENCE & ANTI-COUNTERFEIT VERIFICATION
    // -------------------------------------------------------------------------
    console.log('\n[TEST 2] Testing QR Experience & Anti-Counterfeit Verification...');

    // Authentic verification
    const authVerify = await CustomerDppService.verifyQrAuthenticity({
      dppCode,
      verificationToken,
      scannedBy: 'مستخدم آيفون',
      scanDeviceType: 'MOBILE_IOS'
    });

    console.log(`  ✓ Authentic Verification: Result = ${authVerify.verificationResult} | Message = "${authVerify.message}"`);
    console.log(`  ✓ Total Scans Analytics Count: ${authVerify.totalScansCount}`);

    // Counterfeit verification test
    const fakeVerify = await CustomerDppService.verifyQrAuthenticity({
      dppCode,
      verificationToken: 'FAKE-INVALID-TOKEN-999',
      scannedBy: 'مستكشف مجهول'
    });

    console.log(`  ✓ Counterfeit Alert Triggered: Result = ${fakeVerify.verificationResult} | Message = "${fakeVerify.message}"`);

    if (!authVerify.isAuthentic || fakeVerify.isAuthentic) {
      throw new Error('QR experience & anti-counterfeit verification failed');
    }

    // -------------------------------------------------------------------------
    // TEST 3: WARRANTY CENTER & CLAIMS MANAGEMENT
    // -------------------------------------------------------------------------
    console.log('\n[TEST 3] Testing Warranty Center & Claims Management...');

    const warrantyInfo = await CustomerDppService.getWarrantyStatusAndClaims(cust.user.id, pieceSerial);
    console.log(`  ✓ Warranty Record: Status = ${warrantyInfo.warranty.warrantyStatus} | Coverage = ${warrantyInfo.warranty.coverageType}`);
    console.log(`  ✓ Certificate Verification ID: ${warrantyInfo.warranty.certificateVerificationId}`);

    // Submit Warranty Claim
    const claim = await CustomerDppService.submitWarrantyClaim(cust.user.id, {
      pieceSerial,
      issueType: 'SURFACE_TARNISH',
      issueDescription: 'تغير خفيف في تلميع الفضة بسبب الاستخدام'
    });

    console.log(`  ✓ Warranty Claim Submitted: Code = ${claim.claimCode} | Status = ${claim.status}`);

    if (warrantyInfo.warranty.warrantyStatus !== 'ACTIVE' || !claim.claimCode.startsWith('CLM-')) {
      throw new Error('Warranty center & claims management failed');
    }

    // -------------------------------------------------------------------------
    // TEST 4: CUSTOMER SHARING & EXPIRING READ-ONLY LINKS
    // -------------------------------------------------------------------------
    console.log('\n[TEST 4] Testing Customer Sharing & Expiring Read-Only Links...');

    const share = await CustomerDppService.createSecureShareLink(cust.user.id, dppCode, 7);
    console.log(`  ✓ Secure Share Link Created: Token = ${share.shareToken.substring(0, 24)}...`);
    console.log(`  ✓ Expiration Date: ${share.expiresAt.toISOString()}`);

    const sharedPassport = await CustomerDppService.resolveSharedPassport(share.shareToken);
    console.log(`  ✓ Shared Passport Resolved: View Count = ${sharedPassport.shareDetails.viewCount}`);

    if (sharedPassport.shareDetails.viewCount !== 1 || !sharedPassport.passport) {
      throw new Error('Customer sharing & expiring links failed');
    }

    // -------------------------------------------------------------------------
    // TEST 5: ASSET RELATIONSHIP GRAPH VIEWER (360°)
    // -------------------------------------------------------------------------
    console.log('\n[TEST 5] Testing Asset Relationship Graph Viewer (Product ↔ CAD ↔ DPP ↔ Piece ↔ QR)...');

    const graph = await CustomerDppService.getAssetRelationshipGraph(cust.user.id, pieceSerial);
    console.log(`  ✓ Relationship Graph Resolved: Nodes Count = ${graph.graphNodes.length} | Edges Count = ${graph.graphEdges.length}`);
    console.log(`    ├─ Node 1: [${graph.graphNodes[0]?.type}] ${graph.graphNodes[0]?.label}`);
    console.log(`    └─ Node 5: [${graph.graphNodes[4]?.type}] ${graph.graphNodes[4]?.label}`);

    if (graph.graphNodes.length < 5 || graph.graphEdges.length < 4) {
      throw new Error('Asset relationship graph viewer failed');
    }

    console.log('\n=============================================================================');
    console.log('ALL EPIC 06 SPRINT 04 DPP & QR CUSTOMER TESTS PASSED 100% SUCCESSFULLY! 🎯');
    console.log('=============================================================================');
  } catch (err: any) {
    console.error('\n❌ EPIC 06 SPRINT 04 UNIT TEST FAILED:', err.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

runCustomerPortalSprint4UnitTests();
