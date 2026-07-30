import { ManufacturingService } from '../services/manufacturing.service';
import { ProductionSchedulingService } from '../services/production_scheduling.service';
import { ProductService } from '../services/product.service';
import { BarcodeLabelService } from '../services/barcode_label.service';
import { productionEventEmitter } from '../services/manufacturing_events.service';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function runProductionSprint2UnitTests() {
  console.log('=============================================================================');
  console.log('EPIC 05 SPRINT 02: PRODUCTION SCHEDULING, CAPACITY & CONTROL — UNIT TEST SUITE');
  console.log('=============================================================================');

  try {
    // -------------------------------------------------------------------------
    // CLEANUP & SETUP
    // -------------------------------------------------------------------------
    console.log('\n[SETUP] Cleaning up database and preparing test environment...');
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

    // Seed work centers via Sprint 01 engine
    await ManufacturingService.listWorkCenters();

    // Create Identity Product Model in EPIC 02 Engine
    const product = await ProductService.createProduct({
      nameAr: 'سوار فضة إيطالي فاخر مرصع بالسبيسترين',
      nameEn: 'Luxury Italian Silver Bracelet',
      category: 'سوار',
      silverPurity: '925'
    });

    // Create Manufacturing Order via Sprint 01 engine
    const mo = await ManufacturingService.createManufacturingOrder({
      productModelId: product.id,
      plannedQuantity: 12,
      priority: 'HIGH',
      supervisorName: 'أحمد محمود — مدير الإنتاج'
    });

    console.log(`  ✓ Setup Complete: MO Code = ${mo.moCode} | Planned Qty = ${mo.plannedQuantity} pcs`);

    // -------------------------------------------------------------------------
    // TEST 1: FINITE CAPACITY SCHEDULING & OPERATION DEPENDENCY ENFORCEMENT
    // -------------------------------------------------------------------------
    console.log('\n[TEST 1] Testing Finite Capacity Production Scheduling & Operation Dependencies...');

    const schedResult = await ProductionSchedulingService.scheduleManufacturingOrder({
      moIdOrCode: mo.id,
      startDate: new Date()
    });

    console.log(`  ✓ Scheduled Entries Created Count: ${schedResult.scheduleEntries.length}`);
    console.log(`  ✓ Step 10 (Casting) Start: ${schedResult.scheduleEntries[0]?.scheduledStartDate?.toISOString()}`);
    console.log(`  ✓ Step 20 (Polishing) Start: ${schedResult.scheduleEntries[1]?.scheduledStartDate?.toISOString()}`);

    const step10End = new Date(schedResult.scheduleEntries[0]?.scheduledEndDate).getTime();
    const step20Start = new Date(schedResult.scheduleEntries[1]?.scheduledStartDate).getTime();

    if (step20Start < step10End) {
      throw new Error('Operation Dependency Enforcement failed: Step 20 started before Step 10 finished');
    }
    console.log('  ✓ Verified: Operation Dependency Enforced (Step 20 starts after Step 10 finishes)');

    // -------------------------------------------------------------------------
    // TEST 2: CAPACITY PLANNING & OEE DATA COLLECTION FOUNDATION
    // -------------------------------------------------------------------------
    console.log('\n[TEST 2] Testing Capacity Planning & OEE Metrics...');

    const capacitySummary = await ProductionSchedulingService.getCapacityPlanningSummary();
    console.log(`  ✓ Total Work Centers Analyzed: ${capacitySummary.length}`);
    console.log(`  ✓ Work Center 1 (${capacitySummary[0]?.code}): Utilization = ${capacitySummary[0]?.utilizationPercent}% | OEE = ${capacitySummary[0]?.oeeScorePercent}%`);

    if (capacitySummary.length === 0 || typeof capacitySummary[0]?.oeeScorePercent !== 'number') {
      throw new Error('Capacity planning & OEE foundation test failed');
    }

    // -------------------------------------------------------------------------
    // TEST 3: LABOR ASSIGNMENT & SHIFT TRACKING
    // -------------------------------------------------------------------------
    console.log('\n[TEST 3] Testing Labor Assignment & Shift Tracking...');

    const labor = await ProductionSchedulingService.assignLabor({
      moId: mo.id,
      operatorId: 'OP-SILVERSMITH-07',
      operatorName: 'الأسطى حسن الفضي',
      craftSkillLevel: 'MASTER_SILVERSMITH',
      shiftType: 'MORNING'
    });

    console.log(`  ✓ Assigned Operator: ${labor.operatorName} (${labor.operatorId}) | Skill: ${labor.craftSkillLevel} | Shift: ${labor.shiftType}`);

    if (labor.craftSkillLevel !== 'MASTER_SILVERSMITH') {
      throw new Error('Labor assignment test failed');
    }

    // -------------------------------------------------------------------------
    // TEST 4: WORK IN PROGRESS (WIP) TRACKING ENGINE & AGING METRICS
    // -------------------------------------------------------------------------
    console.log('\n[TEST 4] Testing Work In Progress (WIP) Tracking Engine & Aging Metrics...');

    // Transition MO to IN_PROGRESS
    await ManufacturingService.transitionMoStatus(mo.id, 'IN_PROGRESS');

    const wipSummary = await ProductionSchedulingService.getWipTrackingSummary();
    console.log(`  ✓ Active MOs in WIP: ${wipSummary.activeMosCount} | Total WIP Units: ${wipSummary.totalWipUnitsCount}`);
    console.log(`  ✓ Sample Stage (CASTING) WIP Units: ${wipSummary.wipByStage['CASTING']?.count} pcs | Aging: ${wipSummary.wipByStage['CASTING']?.avgAgingHours}h`);

    if (wipSummary.totalWipUnitsCount !== 12) {
      throw new Error('WIP tracking summary failed');
    }

    // -------------------------------------------------------------------------
    // TEST 5: PARTIAL COMPLETION SUPPORT (SUB-LOT RELEASE ENGINE)
    // -------------------------------------------------------------------------
    console.log('\n[TEST 5] Testing Partial Completion Support (Sub-Lot Release)...');

    const partialRelease = await ProductionSchedulingService.releasePartialLot(mo.id, 5, 'SUPERVISOR-LEAD');
    console.log(`  ✓ Sub-Lot Units Released: ${partialRelease.partialLotsReleasedCount} pcs`);
    console.log(`  ✓ MO Updated Completed Qty: ${partialRelease.mo.completedQuantity} / ${partialRelease.mo.plannedQuantity}`);
    console.log(`  ✓ MO Status After Partial Release: ${partialRelease.mo.status}`);
    console.log(`  ✓ Produced Piece Serials Generated: ${partialRelease.producedPieces.length}`);
    console.log(`  ✓ Digital Product Passports Created: ${partialRelease.digitalProductPassportsCount}`);

    if (
      partialRelease.mo.completedQuantity !== 5 ||
      partialRelease.mo.status !== 'IN_PROGRESS' ||
      partialRelease.producedPieces.length !== 5
    ) {
      throw new Error('Partial completion sub-lot release failed');
    }

    // -------------------------------------------------------------------------
    // TEST 6: REWORK WORKFLOW ENGINE
    // -------------------------------------------------------------------------
    console.log('\n[TEST 6] Testing Rework Workflow Engine...');

    const rework = await ProductionSchedulingService.triggerRework({
      moIdOrCode: mo.id,
      reworkReason: 'SURFACE_POROSITY',
      reworkStage: 'RE_POLISHING',
      quantityReworked: 2,
      operatorId: 'OP-REPAIR-03'
    });

    console.log(`  ✓ Rework Order Logged: Reason = ${rework.reworkReason} | Stage = ${rework.reworkStage} | Status = ${rework.status}`);

    if (rework.status !== 'IN_REWORK' || rework.quantityReworked !== 2) {
      throw new Error('Rework workflow engine test failed');
    }

    // -------------------------------------------------------------------------
    // TEST 7: PRODUCTION SHOP FLOOR CONTROL DASHBOARD METRICS
    // -------------------------------------------------------------------------
    console.log('\n[TEST 7] Testing Production Shop Floor Control Dashboard Metrics...');

    const dashboardMetrics = await ProductionSchedulingService.getProductionDashboardMetrics();
    console.log(`  ✓ Shop Floor KPIs: Total MOs = ${dashboardMetrics.kpis.totalMos} | Active WIP = ${dashboardMetrics.kpis.totalWipUnits} | Active Rework = ${dashboardMetrics.kpis.activeReworkCount}`);

    if (dashboardMetrics.kpis.totalMos < 1 || dashboardMetrics.recentReworkLogs.length === 0) {
      throw new Error('Production dashboard metrics aggregation failed');
    }

    console.log('\n=============================================================================');
    console.log('ALL EPIC 05 SPRINT 02 SCHEDULING & CONTROL TESTS PASSED 100% SUCCESSFULLY! 🎯');
    console.log('=============================================================================');
  } catch (err: any) {
    console.error('\n❌ EPIC 05 SPRINT 02 UNIT TEST FAILED:', err.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

runProductionSprint2UnitTests();
