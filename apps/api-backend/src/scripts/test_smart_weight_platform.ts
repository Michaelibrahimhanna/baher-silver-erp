import { ScaleDriverFactory } from '../services/hal/scale_driver.interface';
import { WeightCaptureService } from '../services/weight_capture.service';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function runSmartWeightPlatformTests() {
  console.log('=============================================================================');
  console.log('EPIC 02 SPRINT 02: SMART WEIGHT CAPTURE PLATFORM & HAL — UNIT TEST SUITE');
  console.log('=============================================================================');

  try {
    // Test 1: HAL Driver Instantiation for 4 Protocols
    console.log('\n[TEST 1] Testing Hardware Abstraction Layer (HAL) Drivers...');
    const protocols = ['RS232', 'USB_SERIAL', 'USB_HID', 'WEBSERIAL'];
    for (const proto of protocols) {
      const driver = ScaleDriverFactory.getDriver(proto);
      console.log(`  ✓ Driver Instantiated: ${driver.protocol}`);
      const parsed = driver.parseFrame('ST,GS,+0014.85g');
      if (parsed.grossWeightGrams !== 14.85) throw new Error(`HAL Frame parsing failed for ${proto}`);
      console.log(`    └─ Parsed Frame (${proto}): Gross = ${parsed.grossWeightGrams}g | Stable = ${parsed.isStable}`);
    }

    // Test 2: Weight Stability Detection Engine
    console.log('\n[TEST 2] Testing Weight Stability Detection Engine (UNSTABLE ➔ STABLE)...');
    const testDeviceId = 'DEV-TEST-SCALE-01';

    // Simulate unstable weight readings (jitter)
    const reading1 = WeightCaptureService.calculateStabilityState(testDeviceId, 10.50, 800, 0.005);
    console.log(`  ✓ Reading #1 (10.50g): State = ${reading1.state} | IsLocked = ${reading1.isLocked}`);

    const reading2 = WeightCaptureService.calculateStabilityState(testDeviceId, 10.58, 800, 0.005);
    console.log(`  ✓ Reading #2 (10.58g - high jitter): State = ${reading2.state} | Jitter = ${reading2.jitter}g`);
    if (reading2.state !== 'UNSTABLE') throw new Error('Stability state should be UNSTABLE under high jitter');

    // Wait for previous jitter reading window to clear
    await new Promise((r) => setTimeout(r, 900));

    // Simulate stabilizing weight readings (constant 14.85g)
    WeightCaptureService.calculateStabilityState(testDeviceId, 14.85, 800, 0.005);
    await new Promise((r) => setTimeout(r, 700));
    const stableReading = WeightCaptureService.calculateStabilityState(testDeviceId, 14.85, 800, 0.005);
    console.log(`  ✓ Reading #4 (14.85g - constant): State = ${stableReading.state} | IsLocked = ${stableReading.isLocked}`);
    if (stableReading.state !== 'STABLE') throw new Error('Stability state should be STABLE after duration');

    // Test 3: Gross Weight, Tare Weight, and Net Weight Operations
    console.log('\n[TEST 3] Testing Gross / Tare / Net Weight Calculation & Operations...');
    const device = await WeightCaptureService.getOrCreateDefaultDevice();
    
    await WeightCaptureService.executeTare(device.id, 2.50); // Set 2.50g container tare
    console.log('  ✓ Applied Tare Weight: 2.50g');

    const weightResult = await WeightCaptureService.processWeightReading({
      deviceId: device.id,
      grossWeightGrams: 17.35,
      operatorName: 'فني الورشة (سامح)',
      stationId: 'STATION-CASTING-01'
    });

    console.log(`  ✓ Gross Weight: ${weightResult.grossWeightGrams}g`);
    console.log(`  ✓ Tare Weight:  ${weightResult.tareWeightGrams}g`);
    console.log(`  ✓ Net Weight:   ${weightResult.netWeightGrams}g (Expected: 14.85g)`);

    if (weightResult.netWeightGrams !== 14.85) throw new Error('Net weight calculation failed');

    // Test 4: Cryptographic Weight Fingerprint (HMAC-SHA256)
    console.log('\n[TEST 4] Testing Cryptographic Weight Fingerprint Generation...');
    console.log(`  ✓ Fingerprint Hash: ${weightResult.fingerprintHash}`);
    if (!weightResult.fingerprintHash || weightResult.fingerprintHash.length !== 64) {
      throw new Error('HMAC-SHA256 Fingerprint Hash generation failed');
    }

    // Test 5: Tolerance Alerts Validation
    console.log('\n[TEST 5] Testing Configurable Tolerance Alerts...');
    const overCapacityResult = await WeightCaptureService.processWeightReading({
      deviceId: device.id,
      grossWeightGrams: 6000.0, // Exceeds 5000g max capacity
      operatorName: 'مدير المخزن'
    });

    console.log(`  ✓ Over-capacity alerts triggered: ${overCapacityResult.alerts.join(' | ')}`);
    if (!overCapacityResult.alerts.some((a) => a.includes('OVER_CAPACITY_ALERT'))) {
      throw new Error('Over-capacity tolerance alert failed to trigger');
    }

    // Test 6: Audit Log Recording
    console.log('\n[TEST 6] Verifying Weight Audit Log Recording in Database...');
    const logs = await WeightCaptureService.listAuditLogs(device.id);
    console.log(`  ✓ Total Audit Logs Captured for Device: ${logs.length}`);
    const latestLog = logs[0];
    console.log(`  ✓ Latest Log ID: ${latestLog.id} | Net: ${latestLog.netWeightGrams}g | Fingerprint: ${latestLog.fingerprint.slice(0, 50)}...`);

    if (!latestLog) throw new Error('Weight Audit Log not found in database');

    // Reset Tare State
    await WeightCaptureService.executeZero(device.id);
    console.log('\n=============================================================================');
    console.log('ALL 6 SMART WEIGHT CAPTURE & HAL TESTS PASSED 100% SUCCESSFULLY! 🎯');
    console.log('=============================================================================');
  } catch (err: any) {
    console.error('\n❌ UNIT TEST FAILED:', err.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

runSmartWeightPlatformTests();
