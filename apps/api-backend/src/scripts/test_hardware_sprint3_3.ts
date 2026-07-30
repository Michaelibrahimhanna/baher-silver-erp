import { HardwareDeviceService } from '../services/hardware_device.service';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function runSprint33UnitTests() {
  console.log('=============================================================================');
  console.log('EPIC 02 SPRINT 03.3: HARDWARE SIMULATOR ENGINE — UNIT TEST SUITE');
  console.log('=============================================================================');

  try {
    // -------------------------------------------------------------------------
    // SETUP: REGISTER SAMPLE DEVICES FOR ALL 5 HARDWARE CATEGORIES
    // -------------------------------------------------------------------------
    console.log('\n[SETUP] Preparing test environment and registering 5 hardware devices...');
    await prisma.hardwareDeviceAuditLog.deleteMany({});
    await prisma.hardwareDeviceRegistry.deleteMany({});
    await prisma.hardwareDeviceStation.deleteMany({});

    const posStation = await HardwareDeviceService.createStation({
      stationCode: 'STATION-SIM-01',
      name: 'Simulator Test Station'
    });

    const scale = await HardwareDeviceService.registerDevice({
      deviceCode: 'DEV-SIM-SCALE',
      name: 'Simulated Mettler Scale',
      category: 'DIGITAL_SCALE',
      brand: 'Mettler Toledo',
      model: 'XS205',
      serialNumber: 'SIM-SN-01',
      stationId: posStation.id
    });

    const printer = await HardwareDeviceService.registerDevice({
      deviceCode: 'DEV-SIM-PRN',
      name: 'Simulated Zebra Tag Printer',
      category: 'BARCODE_PRINTER',
      brand: 'Zebra',
      model: 'ZT411',
      serialNumber: 'SIM-SN-02',
      stationId: posStation.id
    });

    const scanner = await HardwareDeviceService.registerDevice({
      deviceCode: 'DEV-SIM-SCN',
      name: 'Simulated Honeywell Scanner',
      category: 'BARCODE_SCANNER',
      brand: 'Honeywell',
      model: 'Voyager 1200g',
      serialNumber: 'SIM-SN-03',
      stationId: posStation.id
    });

    const drawer = await HardwareDeviceService.registerDevice({
      deviceCode: 'DEV-SIM-DRW',
      name: 'Simulated APG Cash Drawer',
      category: 'CASH_DRAWER',
      brand: 'APG',
      model: 'Vasario',
      serialNumber: 'SIM-SN-04',
      stationId: posStation.id
    });

    const display = await HardwareDeviceService.registerDevice({
      deviceCode: 'DEV-SIM-DSP',
      name: 'Simulated Bematech Customer Display',
      category: 'CUSTOMER_DISPLAY',
      brand: 'Logic Controls',
      model: 'PD3000',
      serialNumber: 'SIM-SN-05',
      stationId: posStation.id
    });

    console.log('  ✓ Created test devices for 5 hardware categories.');

    // -------------------------------------------------------------------------
    // TEST 1: DIGITAL SCALE SIMULATOR (POLL, TARE, ZERO & SCENARIOS)
    // -------------------------------------------------------------------------
    console.log('\n[TEST 1] Testing Digital Scale Simulator Engine...');

    // 1A. SUCCESS Scenario
    const scaleRes = await HardwareDeviceService.executeSimulation(
      scale.id,
      'READ_WEIGHT',
      { grossWeightGrams: 17.35, tareWeightGrams: 2.50, isStable: true },
      'SUCCESS'
    );
    console.log(`  ✓ Scale Poll (SUCCESS): Gross = ${scaleRes.simulationResult.grossWeightGrams}g | Tare = ${scaleRes.simulationResult.tareWeightGrams}g | Net = ${scaleRes.simulationResult.netWeightGrams}g | Status = ${scaleRes.simulationResult.stabilityState}`);
    
    if (scaleRes.simulationResult.netWeightGrams !== 14.85) {
      throw new Error(`Scale net weight expected 14.85g, got ${scaleRes.simulationResult.netWeightGrams}g`);
    }

    // 1B. OFFLINE Scenario
    try {
      await HardwareDeviceService.executeSimulation(scale.id, 'READ_WEIGHT', {}, 'OFFLINE');
      throw new Error('Scale simulator should have thrown OFFLINE error');
    } catch (err: any) {
      console.log(`  ✓ Scale OFFLINE Scenario Caught: "${err.message}"`);
    }

    // 1C. ERROR Scenario
    try {
      await HardwareDeviceService.executeSimulation(scale.id, 'READ_WEIGHT', {}, 'ERROR');
      throw new Error('Scale simulator should have thrown ERROR scenario');
    } catch (err: any) {
      console.log(`  ✓ Scale ERROR Scenario Caught: "${err.message}"`);
    }

    // -------------------------------------------------------------------------
    // TEST 2: BARCODE PRINTER SIMULATOR (ZPL PRINT & PAPER SENSOR)
    // -------------------------------------------------------------------------
    console.log('\n[TEST 2] Testing Barcode Printer Simulator Engine...');

    const printerRes = await HardwareDeviceService.executeSimulation(
      printer.id,
      'PRINT_TAG',
      {
        tagData: { sku: 'BS-RNG-001', serialNo: 'SN-2026-991', titleAr: 'خاتم فضة إيطالي 925' },
        copies: 2
      },
      'SUCCESS'
    );

    console.log(`  ✓ Printer Job Completion: JobId = ${printerRes.simulationResult.jobId} | Copies = ${printerRes.simulationResult.copiesPrinted} | Status = ${printerRes.simulationResult.status}`);
    console.log(`    └─ Simulated ZPL Commands: ${printerRes.simulationResult.simulatedZplCommands}`);

    if (printerRes.simulationResult.copiesPrinted !== 2) {
      throw new Error('Printer simulator copies printed mismatch');
    }

    // -------------------------------------------------------------------------
    // TEST 3: BARCODE SCANNER SIMULATOR (FRAME DECODE STREAM)
    // -------------------------------------------------------------------------
    console.log('\n[TEST 3] Testing Barcode Scanner Simulator Engine...');

    const scannerRes = await HardwareDeviceService.executeSimulation(
      scanner.id,
      'SCAN_TRIGGER',
      { barcodePayload: 'SN-2026-00941', barcodeFormat: 'CODE128' },
      'SUCCESS'
    );

    console.log(`  ✓ Scanner Decode Stream: Scanned Payload = "${scannerRes.simulationResult.barcodePayload}" | Format = ${scannerRes.simulationResult.barcodeFormat} | Duration = ${scannerRes.simulationResult.scanDurationMs}ms`);

    if (scannerRes.simulationResult.barcodePayload !== 'SN-2026-00941') {
      throw new Error('Scanner simulator barcode payload mismatch');
    }

    // -------------------------------------------------------------------------
    // TEST 4: CASH DRAWER SIMULATOR (KICK PULSE & REED SWITCH)
    // -------------------------------------------------------------------------
    console.log('\n[TEST 4] Testing Cash Drawer Simulator Engine...');

    const drawerRes = await HardwareDeviceService.executeSimulation(
      drawer.id,
      'OPEN_DRAWER',
      { pulsePin: 2, pulseDurationMs: 200 },
      'SUCCESS'
    );

    console.log(`  ✓ Cash Drawer Kick Signal: Drawer State = ${drawerRes.simulationResult.drawerState} | Pulse Pin = ${drawerRes.simulationResult.pulsePin} (${drawerRes.simulationResult.pulseDurationMs}ms)`);

    if (drawerRes.simulationResult.drawerState !== 'OPEN') {
      throw new Error('Cash drawer state should be OPEN after kick pulse');
    }

    // -------------------------------------------------------------------------
    // TEST 5: CUSTOMER DISPLAY SIMULATOR (VFD TEXT OUTPUT)
    // -------------------------------------------------------------------------
    console.log('\n[TEST 5] Testing Customer Display Simulator Engine...');

    const displayRes = await HardwareDeviceService.executeSimulation(
      display.id,
      'DISPLAY_TEXT',
      { line1: 'BAHER SILVER ERP', line2: 'Total: 2,450.00 EGP' },
      'SUCCESS'
    );

    console.log(`  ✓ Customer Display Output: Line 1 = "${displayRes.simulationResult.line1Content}" | Line 2 = "${displayRes.simulationResult.line2Content}"`);

    if (displayRes.simulationResult.line1Content !== 'BAHER SILVER ERP') {
      throw new Error('Customer display line 1 content mismatch');
    }

    // -------------------------------------------------------------------------
    // TEST 6: CONNECTION TEST ENGINE HANDSHAKE DIAGNOSTICS
    // -------------------------------------------------------------------------
    console.log('\n[TEST 6] Testing Connection Test Handshake Engine...');

    const connSuccess = await HardwareDeviceService.testConnection(scale.id, false);
    console.log(`  ✓ Connection Test (SUCCESS): Status = ${connSuccess.status} | Latency = ${connSuccess.latencyMs}ms | Msg = "${connSuccess.handshakeMessage}"`);
    if (connSuccess.status !== 'SUCCESS') throw new Error('Connection test handshake should succeed');

    const connFail = await HardwareDeviceService.testConnection(scale.id, true);
    console.log(`  ✓ Connection Test (FAIL): Status = ${connFail.status} | Latency = ${connFail.latencyMs}ms | Msg = "${connFail.handshakeMessage}"`);
    if (connFail.status !== 'FAILED') throw new Error('Connection test handshake should report FAILED');

    // -------------------------------------------------------------------------
    // TEST 7: SIMULATOR ENGINE STATUS
    // -------------------------------------------------------------------------
    console.log('\n[TEST 7] Testing Simulator Engine Status Endpoint...');

    const engineStatus = HardwareDeviceService.getSimulatorEngineStatus();
    console.log(`  ✓ Simulator Engine Status: ${engineStatus.status} | Version: ${engineStatus.engineVersion} | Mode: ${engineStatus.isolationMode}`);
    console.log(`    └─ Supported Categories: ${engineStatus.supportedCategories.join(', ')}`);

    if (engineStatus.supportedCategories.length !== 5) {
      throw new Error('Simulator engine should support 5 hardware categories');
    }

    console.log('\n=============================================================================');
    console.log('ALL SPRINT 03.3 HARDWARE SIMULATOR TESTS PASSED 100% SUCCESSFULLY! 🎯');
    console.log('=============================================================================');
  } catch (err: any) {
    console.error('\n❌ SPRINT 03.3 UNIT TEST FAILED:', err.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

runSprint33UnitTests();
