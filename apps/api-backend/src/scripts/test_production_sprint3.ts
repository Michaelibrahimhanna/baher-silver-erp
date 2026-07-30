import { QualityManagementService } from '../services/quality_management.service';
import { ManufacturingService } from '../services/manufacturing.service';
import { ProductService } from '../services/product.service';
import { BarcodeLabelService } from '../services/barcode_label.service';
import { productionEventEmitter } from '../services/manufacturing_events.service';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function runProductionSprint3UnitTests() {
  console.log('=============================================================================');
  console.log('EPIC 05 SPRINT 03: QUALITY MANAGEMENT & TRACEABILITY — UNIT TEST SUITE');
  console.log('=============================================================================');

  try {
    // -------------------------------------------------------------------------
    // CLEANUP & SETUP
    // -------------------------------------------------------------------------
    console.log('\n[SETUP] Cleaning up database and preparing test environment...');
    await prisma.qualityAlertEscalation.deleteMany({});
    await prisma.capaRecord.deleteMany({});
    await prisma.measurementDevice.deleteMany({});
    await prisma.digitalWorkInstruction.deleteMany({});
    await prisma.nonConformanceReport.deleteMany({});
    await prisma.qualityInspection.deleteMany({});
    await prisma.reworkOrderLog.deleteMany({});
    await prisma.laborAssignment.deleteMany({});
    await prisma.productionScheduleEntry.deleteMany({});
    await prisma.manufacturingOperationLog.deleteMany({});
    await prisma.workCenterQueueJob.deleteMany({});
    await prisma.materialReservation.deleteMany({});
    await prisma.manufacturingOrder.deleteMany({});
    await prisma.digitalProductPassportDraft.deleteMany({});
    await prisma.physicalPiece.deleteMany({});
    await prisma.printableLabelTemplate.deleteMany({});

    // Seed label template for EPIC 03 integration
    await BarcodeLabelService.createLabelTemplate({
      name: 'قالب بطاقة المجوهرات 925',
      templateCode: 'tpl-jewelry-tag-925',
      category: 'JEWELRY_TAG',
      widthMm: 50.0,
      heightMm: 20.0,
      layoutJson: JSON.stringify({ elements: [{ type: 'BARCODE' }] })
    });

    // Create Product & MO via Sprint 01 Engine
    const product = await ProductService.createProduct({
      nameAr: 'قلادة فضة إيطالي ملكية مرصعة بالزمرد',
      nameEn: 'Royal Italian Silver Necklace',
      category: 'قلادة',
      silverPurity: '925'
    });

    const mo = await ManufacturingService.createManufacturingOrder({
      productModelId: product.id,
      plannedQuantity: 8,
      priority: 'HIGH',
      supervisorName: 'سامح لطفي — مدير الجودة'
    });

    // Complete MO to generate produced pieces in EPIC 02, Labels in EPIC 03 & DPP in EPIC 04
    const completion = await ManufacturingService.completeMoAndGenerateIdentities(mo.id, 'QA-INSPECTOR-01');
    const pieceSerial = completion.producedPieces[0]?.serialNo;

    console.log(`  ✓ Setup Complete: MO Code = ${mo.moCode} | Piece Serial = ${pieceSerial}`);

    // -------------------------------------------------------------------------
    // TEST 1: QUALITY INSPECTION ENGINE & ELECTRONIC SIGNATURE
    // -------------------------------------------------------------------------
    console.log('\n[TEST 1] Testing Quality Inspection Engine & Electronic Signature Sign-Off...');

    const inspectionPassed = await QualityManagementService.recordQualityInspection({
      moId: mo.id,
      pieceSerial,
      inspectionType: 'SILVER_PURITY_XRF',
      testedSilverPurity: 925.6,
      sampleSize: 1,
      aqlLevel: 'AQL_1_5',
      inspectorId: 'QA-INSPECTOR-01',
      inspectorName: 'أحمد زكي — أخصائي XRF',
      status: 'PASSED',
      checkpointResults: { purityVerified: true, surfaceFinishOk: true }
    });

    console.log(`  ✓ Inspection Recorded: Status = ${inspectionPassed.status} | Tested Purity = ${inspectionPassed.testedSilverPurity}‰`);
    console.log(`  ✓ E-Signature Hash Generated: ${inspectionPassed.eSignatureHash?.substring(0, 32)}...`);

    if (inspectionPassed.status !== 'PASSED' || !inspectionPassed.eSignatureHash) {
      throw new Error('Quality inspection engine or e-signature sign-off failed');
    }

    // -------------------------------------------------------------------------
    // TEST 2: OUT-OF-SPEC PURITY FAILURE & QUALITY ESCALATION ALERTS
    // -------------------------------------------------------------------------
    console.log('\n[TEST 2] Testing Out-of-Spec Purity Failure & Quality Escalation Alerts...');

    const inspectionFailed = await QualityManagementService.recordQualityInspection({
      moId: mo.id,
      pieceSerial,
      inspectionType: 'SILVER_PURITY_XRF',
      testedSilverPurity: 918.5, // Below 925.0 threshold
      inspectorId: 'QA-INSPECTOR-02',
      inspectorName: 'مريم علي — فاحص جودة',
      status: 'PASSED', // Should be auto-overridden to FAILED
      checkpointResults: { purityVerified: false }
    });

    console.log(`  ✓ Auto-Overridden Status: ${inspectionFailed.status} (Purity ${inspectionFailed.testedSilverPurity}‰ < 925.0‰)`);

    const alerts = await prisma.qualityAlertEscalation.findMany({ where: { moId: mo.id } });
    console.log(`  ✓ Quality Escalation Alerts Triggered Count: ${alerts.length}`);
    console.log(`    └─ Alert 1: [${alerts[0]?.alertCode}] ${alerts[0]?.message}`);

    if (inspectionFailed.status !== 'FAILED' || alerts.length === 0) {
      throw new Error('Out-of-spec silver purity failure or quality escalation alert failed');
    }

    // -------------------------------------------------------------------------
    // TEST 3: NON-CONFORMANCE (NCR) MANAGEMENT & CAPA PREPARATION
    // -------------------------------------------------------------------------
    console.log('\n[TEST 3] Testing Non-Conformance (NCR) & CAPA Auto-Trigger...');

    const ncr = await QualityManagementService.createNCR({
      moId: mo.id,
      pieceSerial,
      defectCategory: 'PURITY_DEVIATION',
      severity: 'CRITICAL',
      dispositionAction: 'REWORK',
      rootCauseDescription: 'حيود خفيف في سبيكة الفضة أثناء الصب',
      correctiveAction: 'إعادة الصهر والربط مع حبيبات فضة نقية 999',
      attachments: ['assets/xrf_report.pdf'],
      reportedBy: 'مريم علي'
    });

    console.log(`  ✓ NCR Created: Code = ${ncr.ncrCode} | Severity = ${ncr.severity} | Status = ${ncr.status}`);

    const capas = await prisma.capaRecord.findMany({ where: { ncrId: ncr.id } });
    console.log(`  ✓ Auto-Triggered CAPA Records Count: ${capas.length}`);
    console.log(`    └─ CAPA Code: ${capas[0]?.capaCode} | Assigned To: ${capas[0]?.assignedTo}`);

    if (!ncr.ncrCode.startsWith('NCR-') || capas.length === 0) {
      throw new Error('NCR creation or CAPA auto-trigger failed');
    }

    // Resolve NCR
    const resolvedNcr = await QualityManagementService.resolveNCR(ncr.id, {
      dispositionAction: 'REWORK',
      rootCauseDescription: 'تم التحقق من سبب عيب الصب وترقية درجة حرارة المسبك',
      correctiveAction: 'تمت الصياغة بنجاح',
      resolvedBy: 'مدير الجودة'
    });

    console.log(`  ✓ Resolved NCR Status: ${resolvedNcr.status} | Resolved By: ${resolvedNcr.resolvedBy}`);

    // -------------------------------------------------------------------------
    // TEST 4: STATISTICAL PROCESS CONTROL (SPC) METRICS & QUALITY TRENDS
    // -------------------------------------------------------------------------
    console.log('\n[TEST 4] Testing Statistical Process Control (SPC) & Quality Trends...');

    const spc = await QualityManagementService.getSpcMetrics();
    console.log(`  ✓ First Pass Yield (FPY %): ${spc.kpis.firstPassYieldPercent}% | Defect Rate: ${spc.kpis.defectRatePercent}%`);
    console.log(`  ✓ Average XRF Silver Purity: ${spc.kpis.avgXrfPurity}‰ | Cpk Index: ${spc.kpis.processCapabilityCpk}`);

    if (typeof spc.kpis.firstPassYieldPercent !== 'number' || !spc.defectPareto['PURITY_DEVIATION']) {
      throw new Error('SPC metrics calculation failed');
    }

    // -------------------------------------------------------------------------
    // TEST 5: END-TO-END DIGITAL GENEALOGY TREE TRACEABILITY (360°)
    // -------------------------------------------------------------------------
    console.log('\n[TEST 5] Testing End-to-End Digital Genealogy Tree Traceability (360°)...');

    const genealogy = await QualityManagementService.getEndToEndGenealogy(pieceSerial);
    console.log(`  ✓ Genealogy Resolution for Piece Serial '${pieceSerial}':`);
    console.log(`    ├─ MO Code: ${genealogy.moSummary.moCode} (${genealogy.moSummary.productNameAr})`);
    console.log(`    ├─ Raw Material: ${genealogy.rawMaterialGenealogy[0]?.itemName}`);
    console.log(`    ├─ Produced Piece Serial: ${genealogy.producedPiecesGenealogy[0]?.serialNo} | Weight: ${genealogy.producedPiecesGenealogy[0]?.weightGrams}g`);
    console.log(`    ├─ DPP Passport Code: ${genealogy.producedPiecesGenealogy[0]?.dppCode}`);
    console.log(`    └─ Quality Inspections Count: ${genealogy.qualityTraceability.inspections.length} | NCRs Count: ${genealogy.qualityTraceability.ncrs.length}`);

    if (!genealogy.producedPiecesGenealogy[0]?.dppCode || genealogy.qualityTraceability.inspections.length === 0) {
      throw new Error('End-to-end digital genealogy resolution failed');
    }

    // -------------------------------------------------------------------------
    // TEST 6: DIGITAL WORK INSTRUCTIONS
    // -------------------------------------------------------------------------
    console.log('\n[TEST 6] Testing Digital Work Instructions...');

    const instructions = await QualityManagementService.listWorkInstructions('CASTING');
    console.log(`  ✓ Digital Work Instructions Returned Count: ${instructions.length}`);
    console.log(`    └─ Instruction 1 Title (AR): "${instructions[0]?.titleAr}"`);

    if (instructions.length === 0) {
      throw new Error('Digital work instructions test failed');
    }

    // -------------------------------------------------------------------------
    // TEST 7: QUALITY DASHBOARD & MEASUREMENT DEVICES
    // -------------------------------------------------------------------------
    console.log('\n[TEST 7] Testing Quality Dashboard Metrics & Measurement Device Registry...');

    const qualityDashboard = await QualityManagementService.getQualityDashboardMetrics();
    console.log(`  ✓ Measurement Devices Registered: ${qualityDashboard.devices.length}`);
    console.log(`    └─ Device 1: [${qualityDashboard.devices[0]?.deviceCode}] ${qualityDashboard.devices[0]?.deviceName}`);

    if (qualityDashboard.devices.length === 0) {
      throw new Error('Quality dashboard metrics test failed');
    }

    console.log('\n=============================================================================');
    console.log('ALL EPIC 05 SPRINT 03 QUALITY & TRACEABILITY TESTS PASSED 100% SUCCESSFULLY! 🎯');
    console.log('=============================================================================');
  } catch (err: any) {
    console.error('\n❌ EPIC 05 SPRINT 03 UNIT TEST FAILED:', err.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

runProductionSprint3UnitTests();
