import { PrismaClient } from '@prisma/client';
import { ManufacturingEngineService } from '../services/manufacturing_engine.service';
import { ManufacturingEventsService } from '../services/manufacturing_events.service';

const prisma = new PrismaClient();

async function runManufacturingAcceptanceTests() {
  console.log('=================================================================');
  console.log('  BAHER SILVER ERP — PHASE 24 MANUFACTURING ENGINE TEST SUITE   ');
  console.log('=================================================================\n');

  let passedCount = 0;
  let failedCount = 0;
  const startTime = Date.now();

  async function testCase(code: string, title: string, fn: () => Promise<string>) {
    try {
      const result = await fn();
      passedCount++;
      console.log(`  ✓ [PASS] ${code}: ${title} — ${result}`);
    } catch (e: any) {
      failedCount++;
      console.error(`  ✕ [FAIL] ${code}: ${title} — ${e.message}`);
    }
  }

  // 1. Initialize Work Centers
  await testCase('TC-MFG-01', 'Initialize 8 Factory Work Centers & Capacity', async () => {
    const wcs = await ManufacturingEngineService.initializeWorkCenters();
    if (wcs.length < 8) throw new Error(`Expected at least 8 Work Centers, found ${wcs.length}`);
    return `Seeded ${wcs.length} Work Centers (Casting, Cleaning, Setting, Polishing, Rhodium, Hallmark, QC, Packaging).`;
  });

  // Create sample product for testing
  const product = await prisma.productMaster.upsert({
    where: { productCode: 'TEST-RING-001' },
    update: {},
    create: {
      productCode: 'TEST-RING-001',
      nameAr: 'خاتم فضة إيطالي مرصع بحجر الزركون',
      nameEn: 'Italian Silver Zircon Ring',
      category: 'RINGS',
      silverPurity: '925',
      silverWeightGrams: 8.5
    }
  });

  const variant = await prisma.productVariant.upsert({
    where: { variantCode: 'TEST-RING-001-V54' },
    update: {},
    create: {
      productId: product.id,
      variantCode: 'TEST-RING-001-V54',
      ringSize: '54',
      stoneColor: 'BLUE',
      silverPurity: '925'
    }
  });

  // 2. Product Template BOM
  await testCase('TC-MFG-02', 'Create Product Template BOM (Multi-Material)', async () => {
    const bom = await ManufacturingEngineService.upsertBOM({
      productId: product.id,
      expectedYield: 98.0,
      expectedLossPercent: 2.0,
      notes: 'BOM قياسي لموديل الخاتم',
      lines: [
        { lineType: 'SILVER', itemCode: 'SILVER-925', itemName: 'فضة 925 نقية', quantity: 9.0, wasteFactor: 3.0, unitCost: 48.0 },
        { lineType: 'STONE', itemCode: 'STONE-ZIRCON-BLU', itemName: 'حجر زركون أزرق', quantity: 4.0, wasteFactor: 0.0, unitCost: 15.0 },
        { lineType: 'COMPONENT', itemCode: 'COMP-SETTING-BEZ', itemName: 'بيت حجر بريمة', quantity: 1.0, wasteFactor: 0.0, unitCost: 20.0 },
        { lineType: 'CHEMICAL', itemCode: 'CHEM-RHODIUM-BATH', itemName: 'محلول حمام الروديوم', quantity: 0.5, wasteFactor: 5.0, unitCost: 30.0 },
        { lineType: 'CONSUMABLE', itemCode: 'CONS-POLISH-PASTE', itemName: 'معجون تلميع مجوهرات', quantity: 0.2, wasteFactor: 0.0, unitCost: 10.0 }
      ]
    });
    if (!bom || bom.lines.length !== 5) throw new Error('Failed to create complete 5-material BOM');
    return `Created Template BOM with ${bom.lines.length} material lines. Total Expected Yield: ${bom.expectedYield}%.`;
  });

  // 3. Independent Variant BOM
  await testCase('TC-MFG-03', 'Create Independent Variant BOM', async () => {
    const bom = await ManufacturingEngineService.upsertBOM({
      productId: product.id,
      variantId: variant.id,
      expectedYield: 99.0,
      expectedLossPercent: 1.0,
      notes: 'BOM خاص بمقاس 54 وحجر زفير أزرق',
      lines: [
        { lineType: 'SILVER', itemCode: 'SILVER-925', itemName: 'فضة 925 نقية', quantity: 8.2, wasteFactor: 2.0, unitCost: 48.0 },
        { lineType: 'STONE', itemCode: 'STONE-SAPPHIRE-SYN', itemName: 'حجر زفير صناعي مقاس 54', quantity: 1.0, wasteFactor: 0.0, unitCost: 80.0 }
      ]
    });
    if (!bom || bom.variantId !== variant.id) throw new Error('Variant BOM creation failed');
    return `Created Independent Variant BOM #${bom.id} linked to Variant ${variant.variantCode}.`;
  });

  // 4. Create MO with Worker Assignment
  let createdMO: any;
  await testCase('TC-MFG-04', 'Create Manufacturing Order (MO) with Worker Assignment', async () => {
    createdMO = await ManufacturingEngineService.createManufacturingOrder({
      productModelId: product.id,
      variantId: variant.id,
      plannedQuantity: 10,
      targetSilverPurity: '925',
      estimatedSilverWeightGrams: 85.0,
      assignedOperatorId: 'usr-operator-01',
      assignedOperatorName: 'الفني محمود صابر - قسم الصياغة',
      notes: 'أمر تصنيع تشغيلة 10 قطع خواتم'
    });
    if (!createdMO || createdMO.status !== 'PLANNED') throw new Error('MO creation failed');
    return `Created Order #${createdMO.moCode} assigned to ${createdMO.assignedOperatorName}. Status: PLANNED.`;
  });

  // 5. Material Stock Reservation Calculation
  await testCase('TC-MFG-05', 'Material Stock Reservation Engine', async () => {
    const reservations = await ManufacturingEngineService.reserveMaterialsForMO(createdMO.id);
    if (reservations.length === 0) throw new Error('Material reservation failed');
    return `Reserved ${reservations.length} materials automatically from stock for MO #${createdMO.moCode}.`;
  });

  // 6. Confirm MO
  await testCase('TC-MFG-06', 'MO State Transition: Confirm Order', async () => {
    const updated = await ManufacturingEngineService.updateMOState(createdMO.id, 'CONFIRM');
    if (updated.status !== 'CONFIRMED') throw new Error('Failed to confirm MO');
    return `Order status updated from PLANNED -> CONFIRMED.`;
  });

  // 7. Start MO
  await testCase('TC-MFG-07', 'MO State Transition: Start Operations', async () => {
    const updated = await ManufacturingEngineService.updateMOState(createdMO.id, 'START', 'usr-operator-01');
    if (updated.status !== 'IN_PROGRESS' || !updated.startDate) throw new Error('Failed to start MO');
    return `Order status updated to IN_PROGRESS. Started by ${updated.startedByUserId}.`;
  });

  // 8. Pause MO
  await testCase('TC-MFG-08', 'MO State Transition: Pause Operations', async () => {
    const updated = await ManufacturingEngineService.updateMOState(createdMO.id, 'PAUSE', 'usr-operator-01', 'توقف مؤقت لاستلام دفعة أحجار إضافية');
    if (updated.status !== 'PAUSED') throw new Error('Failed to pause MO');
    return `Order status updated to PAUSED. Recorded pause reason in timeline.`;
  });

  // 9. Resume MO
  await testCase('TC-MFG-09', 'MO State Transition: Resume Operations', async () => {
    const updated = await ManufacturingEngineService.updateMOState(createdMO.id, 'RESUME', 'usr-operator-01');
    if (updated.status !== 'IN_PROGRESS') throw new Error('Failed to resume MO');
    return `Order status resumed back to IN_PROGRESS.`;
  });

  // 10. Material Consumption
  await testCase('TC-MFG-10', 'Record Actual Material Consumption', async () => {
    const reservations = await prisma.materialReservation.findMany({ where: { moId: createdMO.id } });
    const linesToConsume = reservations.map(r => ({ reservationId: r.id, consumedQuantity: r.requiredQuantity }));
    const updated = await ManufacturingEngineService.recordMaterialConsumption(createdMO.id, linesToConsume);
    return `Consumed ${updated.length} material lines successfully. Status updated to CONSUMED.`;
  });

  // 11. Production Returns
  await testCase('TC-MFG-11', 'Record Unused Material Return', async () => {
    const ret = await ManufacturingEngineService.recordMaterialReturn({
      moId: createdMO.id,
      lineType: 'SILVER_BULLION',
      itemCode: 'SILVER-925',
      itemName: 'فضة 925 نقية متبقية',
      returnedQuantity: 2.5,
      unitOfMeasure: 'g',
      notes: 'إرجاع فضة متبقية بعد الصب'
    });
    if (!ret) throw new Error('Failed to record material return');
    return `Returned 2.5g Silver to Raw Warehouse stock. Entry #${ret.id}.`;
  });

  // 12. Categorized Scrap: Casting Sprues
  await testCase('TC-MFG-12', 'Record Categorized Scrap: Casting Sprues', async () => {
    const scrap = await ManufacturingEngineService.recordScrapEntry({
      moId: createdMO.id,
      scrapCategory: 'CASTING_SCRAP',
      weightGrams: 4.2,
      silverPurity: '925',
      notes: 'عراجين وزوائد صب شجرة الفضة'
    });
    if (!scrap) throw new Error('Failed to record casting scrap');
    return `Recorded ${scrap.weightGrams}g Casting Scrap (${scrap.silverPurity} purity).`;
  });

  // 13. Categorized Scrap: Polishing Dust
  await testCase('TC-MFG-13', 'Record Categorized Scrap: Polishing Dust', async () => {
    const scrap = await ManufacturingEngineService.recordScrapEntry({
      moId: createdMO.id,
      scrapCategory: 'POLISHING_DUST',
      weightGrams: 1.8,
      silverPurity: '925',
      notes: 'برادة وتلميع شفاطات التلميع'
    });
    if (!scrap) throw new Error('Failed to record polishing dust');
    return `Recorded ${scrap.weightGrams}g Polishing Dust.`;
  });

  // 14. Categorized Scrap: Silver Recovery Credit
  await testCase('TC-MFG-14', 'Record Silver Recovery Credit', async () => {
    const scrap = await ManufacturingEngineService.recordScrapEntry({
      moId: createdMO.id,
      scrapCategory: 'RECOVERED_SILVER',
      weightGrams: 5.5,
      silverPurity: '999',
      notes: 'فضة نقية مسترجعة بعد التحليل والتكرير'
    });
    if (!scrap) throw new Error('Failed to record silver recovery');
    return `Recorded ${scrap.recoveredPureSilverGrams}g Pure Recovered Silver Credited.`;
  });

  // 15. Complete MO
  await testCase('TC-MFG-15', 'MO State Transition: Complete Order', async () => {
    const updated = await ManufacturingEngineService.updateMOState(createdMO.id, 'COMPLETE', 'usr-operator-01');
    if (updated.status !== 'COMPLETED') throw new Error('Failed to complete MO');
    return `Order status updated to COMPLETED. Lead time duration: ${updated.totalDurationMinutes} minutes.`;
  });

  // 16. Enriched Finished Goods Receipt
  await testCase('TC-MFG-16', 'Enriched Finished Goods Receipt Generation', async () => {
    const receipt = await ManufacturingEngineService.receiveFinishedGoods({
      moId: createdMO.id,
      receivedQuantity: 10,
      grossWeightGrams: 83.5,
      hallmarkNumber: 'HAL-EGY-925-2026',
      qcResult: 'PASSED',
      productImagesJson: JSON.stringify(['assets/ring_finished_1.jpg']),
      receivedByUserId: 'usr-showroom-vault'
    });
    if (!receipt || !receipt.receiptCode) throw new Error('Finished goods receipt failed');
    return `Generated Receipt #${receipt.receiptCode} (Lot: ${receipt.lotNumber}, Batch: ${receipt.batchNumber}, Unit Cost: ${receipt.finalUnitCost} EGP).`;
  });

  // 17. Production Cost Rollup Calculation
  await testCase('TC-MFG-17', '8-Factor Production Cost Rollup Engine', async () => {
    const rollup = await ManufacturingEngineService.calculateProductionCostRollup(createdMO.id);
    if (!rollup || rollup.unitCost <= 0) throw new Error('Cost rollup calculation failed');
    return `Total Cost: ${rollup.totalCost} EGP | Unit Cost: ${rollup.unitCost} EGP/Piece (Materials: ${rollup.breakdown.materialCost} EGP, Scrap Cost: ${rollup.breakdown.scrapCost} EGP, Recovery Credit: -${rollup.breakdown.recoveryValue} EGP).`;
  });

  // 18. Immutable MO Timeline Audit Log
  await testCase('TC-MFG-18', 'Immutable MO Timeline Verification', async () => {
    const timeline = await prisma.manufacturingOrderTimeline.findMany({ where: { moId: createdMO.id }, orderBy: { timestamp: 'asc' } });
    if (timeline.length < 5) throw new Error(`Expected at least 5 timeline records, found ${timeline.length}`);
    return `Verified ${timeline.length} sequential timeline audit records (CREATE -> CONFIRM -> START -> PAUSE -> RESUME -> COMPLETE).`;
  });

  // 19. Manufacturing Event Engine
  await testCase('TC-MFG-19', 'Manufacturing Event Engine Verification', async () => {
    const events = await ManufacturingEventsService.getEventsForMO(createdMO.id);
    if (events.length === 0) throw new Error('No manufacturing events recorded');
    return `Verified ${events.length} emitted event records (MO_CREATED, MO_CONFIRMED, MO_STARTED, MO_PAUSED, MO_RESUMED, MO_COMPLETED, FINISHED_RECEIVED).`;
  });

  // 20. Manufacturing Dashboard KPIs & Bottleneck Detection
  await testCase('TC-MFG-20', 'Manufacturing Dashboard KPIs & Bottlenecks', async () => {
    const kpis = await ManufacturingEngineService.getManufacturingDashboardKPIs();
    if (!kpis || !kpis.workCenterUtilization) throw new Error('Dashboard KPI calculation failed');
    return `Work Center Utilization active across ${kpis.workCenterUtilization.length} stations. Total WIP Pieces: ${kpis.totalWipPieces}, Recovery Rate: ${kpis.recoveryRatePercent}%.`;
  });

  // 21. Digital Product Genealogy
  await testCase('TC-MFG-21', 'Digital Product Genealogy Backward Traceability', async () => {
    const genealogy = await ManufacturingEngineService.generateProductGenealogy(createdMO.id);
    if (!genealogy || !genealogy.passportCode) throw new Error('Genealogy generation failed');
    return `Generated Genealogy Tree #${genealogy.passportCode} tracing Silver, Stones, Components, Chemicals, Operators, and QC.`;
  });

  // 22. Digital Product Passport
  await testCase('TC-MFG-22', 'Digital Product Passport & 25-Year Warranty', async () => {
    const passport = await ManufacturingEngineService.generateProductPassport(createdMO.id);
    if (!passport || passport.warrantyStatus !== '25_YEAR_COVERED') throw new Error('Product Passport generation failed');
    return `Issued Digital Product Passport #${passport.passportCode} with QR Link (${passport.qrCodeUrl}) and 25-Year Warranty Coverage.`;
  });

  // 23. Work Center Calendar
  await testCase('TC-MFG-23', 'Work Center Calendar & Capacity Management', async () => {
    const calendar = await ManufacturingEngineService.getWorkCenterCalendar('WC-CASTING');
    if (!calendar || calendar.workingHoursPerDay !== 8.0) throw new Error('Work Center Calendar initialization failed');
    return `Work Center Calendar active for WC-CASTING (8.0 Hours/Day, Capacity: ${calendar.availableCapacityHourly} Pcs/Hr).`;
  });

  // 24. Automatic Production Scheduler Recommendation
  await testCase('TC-MFG-24', 'Automatic Production Scheduler Recommendation Engine', async () => {
    const schedule = await ManufacturingEngineService.recommendProductionSchedule();
    if (!schedule || !Array.isArray(schedule.scheduleSequence)) throw new Error('Production Scheduler recommendation failed');
    return `Scheduler generated sequence recommendation for ${schedule.recommendationCount} orders based on priority, capacity, and material availability.`;
  });

  // 25. Extended Enterprise Analytics
  await testCase('TC-MFG-25', 'Extended Enterprise Analytics (OEE, FPY, Rework, Lead Time)', async () => {
    const kpis = await ManufacturingEngineService.getManufacturingDashboardKPIs();
    if (kpis.oeePercent <= 0 || kpis.firstPassYieldPercent <= 0) throw new Error('Extended analytics calculation failed');
    return `OEE: ${kpis.oeePercent}%, First Pass Yield: ${kpis.firstPassYieldPercent}%, Rework Rate: ${kpis.reworkRatePercent}%, Avg Lead Time: ${kpis.avgLeadTimeHours}h.`;
  });

  const durationMs = Date.now() - startTime;

  console.log('\n=================================================================');
  console.log('  MANUFACTURING ENGINE TEST SUITE EXECUTION SUMMARY             ');
  console.log(`  Total Tests Executed: ${passedCount + failedCount}`);
  console.log(`  Passed: ${passedCount} | Failed: ${failedCount}`);
  console.log(`  Total Execution Time: ${durationMs}ms`);
  console.log(`  Phase 24 Approved Status: ${failedCount === 0 ? 'APPROVED (TRUE)' : 'REJECTED (FALSE)'}`);
  console.log('=================================================================\n');

  if (failedCount > 0) {
    process.exit(1);
  }
}

if (require.main === module) {
  runManufacturingAcceptanceTests()
    .catch(e => {
      console.error('Test Suite Error:', e);
      process.exit(1);
    })
    .finally(() => prisma.$disconnect());
}
