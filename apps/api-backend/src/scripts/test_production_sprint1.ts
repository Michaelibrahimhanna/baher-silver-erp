import { ManufacturingService } from '../services/manufacturing.service';
import { ProductService } from '../services/product.service';
import { BarcodeLabelService } from '../services/barcode_label.service';
import { productionEventEmitter } from '../services/manufacturing_events.service';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function runProductionSprint1UnitTests() {
  console.log('=============================================================================');
  console.log('EPIC 05 SPRINT 01: MANUFACTURING & PRODUCTION MANAGEMENT — UNIT TEST SUITE');
  console.log('=============================================================================');

  try {
    // -------------------------------------------------------------------------
    // CLEANUP & SETUP
    // -------------------------------------------------------------------------
    console.log('\n[SETUP] Cleaning up database and preparing test environment...');
    await prisma.manufacturingOperationLog.deleteMany({});
    await prisma.workCenterQueueJob.deleteMany({});
    await prisma.materialReservation.deleteMany({});
    await prisma.manufacturingOrder.deleteMany({});
    await prisma.digitalProductPassportDraft.deleteMany({});
    await prisma.pieceLifecycleEvent.deleteMany({});
    await prisma.pieceReprintLog.deleteMany({});
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

    // Track emitted domain events
    const capturedEvents: string[] = [];
    productionEventEmitter.on('*', (evt: any) => {
      capturedEvents.push(evt.eventType);
    });

    // Create Identity Product Model in EPIC 02 Engine
    const product = await ProductService.createProduct({
      nameAr: 'خاتم فضة إيطالي مرصع بالعقيق الأحمـر',
      nameEn: 'Italian Silver Ring with Red Agate',
      category: 'خاتم',
      silverPurity: '925'
    });

    console.log(`  ✓ Setup Complete: Product ID = ${product.id} | Product Code = ${product.productCode}`);

    // -------------------------------------------------------------------------
    // TEST 1: WORK CENTER REGISTRY & QUEUE SETUP
    // -------------------------------------------------------------------------
    console.log('\n[TEST 1] Testing Work Center Registry & Setup...');

    const workCenters = await ManufacturingService.listWorkCenters();
    console.log(`  ✓ Total Active Work Centers: ${workCenters.length}`);
    workCenters.forEach(wc => console.log(`    └─ [${wc.code}] ${wc.nameAr} | Capacity: ${wc.capacityHourly} pcs/hr`));

    if (workCenters.length < 4) {
      throw new Error('Work center registry setup failed');
    }

    // -------------------------------------------------------------------------
    // TEST 2: MO CREATION & CENTRAL NUMBER GENERATOR ENGINE
    // -------------------------------------------------------------------------
    console.log('\n[TEST 2] Testing Manufacturing Order Creation & Central Number Generator...');

    const mo = await ManufacturingService.createManufacturingOrder({
      productModelId: product.id,
      plannedQuantity: 10,
      priority: 'HIGH',
      supervisorName: 'أحمد محمود — مدير الإنتاج'
    });

    console.log(`  ✓ Generated MO Code: ${mo.moCode} | Status: ${mo.status}`);
    console.log(`  ✓ Planned Quantity: ${mo.plannedQuantity} pcs | Est. Silver Weight: ${mo.estimatedSilverWeightGrams}g`);

    if (!mo.moCode.startsWith('MO-2026-') || mo.status !== 'PLANNED') {
      throw new Error('Manufacturing order creation or number generation failed');
    }

    // -------------------------------------------------------------------------
    // TEST 3: WORKFLOW STATE MACHINE TRANSITIONS & MATERIAL RESERVATION
    // -------------------------------------------------------------------------
    console.log('\n[TEST 3] Testing Workflow State Machine & Material Reservation...');

    // Transition PLANNED -> CONFIRMED (Triggers material reservation)
    const confirmedMo = await ManufacturingService.transitionMoStatus(mo.id, 'CONFIRMED', 'SUPERVISOR-01');
    console.log(`  ✓ State Transition: ${confirmedMo.status} | Start Date: ${confirmedMo.startDate}`);

    const moDetails = await ManufacturingService.getMoDetails(mo.id);
    console.log(`  ✓ Reserved Material Lines Count: ${moDetails.materialReservations.length}`);
    console.log(`    └─ Line 1: ${moDetails.materialReservations[0]?.itemName} (${moDetails.materialReservations[0]?.requiredQuantity}g)`);

    if (confirmedMo.status !== 'CONFIRMED' || moDetails.materialReservations.length === 0) {
      throw new Error('MO status transition or material reservation failed');
    }

    // Transition CONFIRMED -> IN_PROGRESS (Initializes work center queue jobs)
    const inProgressMo = await ManufacturingService.transitionMoStatus(mo.id, 'IN_PROGRESS', 'SUPERVISOR-01');
    console.log(`  ✓ State Transition: ${inProgressMo.status}`);

    const updatedDetails = await ManufacturingService.getMoDetails(mo.id);
    console.log(`  ✓ Work Center Queue Jobs Initialized: ${updatedDetails.queueJobs.length} steps`);

    if (inProgressMo.status !== 'IN_PROGRESS' || updatedDetails.queueJobs.length === 0) {
      throw new Error('MO queue job initialization failed');
    }

    // -------------------------------------------------------------------------
    // TEST 4: WORK CENTER OPERATION LOGGING & SCRAP REASON CLASSIFICATION
    // -------------------------------------------------------------------------
    console.log('\n[TEST 4] Testing Work Center Operation Logging & Scrap Classification...');

    const opLog1 = await ManufacturingService.recordOperationLog(mo.id, {
      workCenterId: workCenters[0].id,
      sequenceNo: 10,
      stage: 'CASTING',
      quantityPassed: 9,
      quantityScrapped: 1,
      scrapReason: 'CASTING_DEFECT',
      scrapWeightGrams: 16.80,
      estimatedMinutes: 45,
      actualMinutes: 40,
      operatorId: 'OP-102',
      operatorName: 'محمود حلمي — فني الصب',
      notes: 'عيب صب بسيط تم تصنيف المسكوب وإعادة الصهر'
    });

    console.log(`  ✓ Operation Log Recorded: Stage = ${opLog1.stage} | Sequence = ${opLog1.sequenceNo}`);
    console.log(`  ✓ Scrap Reason: ${opLog1.scrapReason} | Scrap Weight: ${opLog1.scrapWeightGrams}g`);

    const moAfterOp = await ManufacturingService.getMoDetails(mo.id);
    console.log(`  ✓ MO Scrapped Quantity: ${moAfterOp.mo.scrappedQuantity} | Silver Loss Weight: ${moAfterOp.mo.silverLossWeightGrams}g`);

    if (moAfterOp.mo.scrappedQuantity !== 1 || opLog1.scrapReason !== 'CASTING_DEFECT') {
      throw new Error('Work center operation logging or scrap classification failed');
    }

    // -------------------------------------------------------------------------
    // TEST 5: COMPLETE MO & INTEGRATION CHAIN (EPIC 02 + EPIC 03 + EPIC 04)
    // -------------------------------------------------------------------------
    console.log('\n[TEST 5] Testing Complete MO & Integration Chain (EPIC 02 + 03 + 04)...');

    const completionResult = await ManufacturingService.completeMoAndGenerateIdentities(mo.id, 'HEAD-PRODUCTION');
    console.log(`  ✓ Completed MO Code: ${completionResult.mo.moCode} | Final Status: ${completionResult.mo.status}`);
    console.log(`  ✓ EPIC 02 Physical Pieces Produced Count: ${completionResult.producedPiecesCount}`);
    console.log(`    └─ Sample Serial: ${completionResult.producedPieces[0]?.serialNo} | Weight: ${completionResult.producedPieces[0]?.weightGrams}g`);
    console.log(`  ✓ EPIC 04 Digital Product Passports Created Count: ${completionResult.digitalProductPassports.length}`);
    console.log(`    └─ Sample DPP Code: ${completionResult.digitalProductPassports[0]?.dppCode}`);
    console.log(`  ✓ EPIC 03 Barcode Print Jobs Enqueued Count: ${completionResult.labelPrintJobsEnqueued}`);

    if (
      completionResult.mo.status !== 'COMPLETED' ||
      completionResult.producedPiecesCount !== 9 ||
      completionResult.digitalProductPassports.length !== 9
    ) {
      throw new Error('Complete MO integration chain (EPIC 02/03/04) failed');
    }

    // -------------------------------------------------------------------------
    // TEST 6: DOMAIN EVENT EMITTER INTEGRATION POINTS
    // -------------------------------------------------------------------------
    console.log('\n[TEST 6] Testing Domain Event Emitter Integration Points...');

    console.log(`  ✓ Captured Production Domain Events Count: ${capturedEvents.length}`);
    console.log(`    └─ Events Sequence: ${capturedEvents.join(' → ')}`);

    if (!capturedEvents.includes('MO_CREATED') || !capturedEvents.includes('MO_COMPLETED')) {
      throw new Error('Domain event emitter tracking failed');
    }

    console.log('\n=============================================================================');
    console.log('ALL EPIC 05 SPRINT 01 MANUFACTURING TESTS PASSED 100% SUCCESSFULLY! 🎯');
    console.log('=============================================================================');
  } catch (err: any) {
    console.error('\n❌ EPIC 05 SPRINT 01 UNIT TEST FAILED:', err.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

runProductionSprint1UnitTests();
