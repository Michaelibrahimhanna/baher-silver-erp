import { HardwareDeviceService } from '../services/hardware_device.service';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function runSprint32UnitTests() {
  console.log('=============================================================================');
  console.log('EPIC 02 SPRINT 03.2: HEALTH MONITORING, PING, RECONNECT & FIRMWARE — TESTS');
  console.log('=============================================================================');

  try {
    // -------------------------------------------------------------------------
    // SETUP: CLEAN UP & REGISTER DEVICES
    // -------------------------------------------------------------------------
    console.log('\n[SETUP] Preparing test environment & sample hardware devices...');
    await prisma.hardwareDeviceAuditLog.deleteMany({});
    await prisma.hardwareDeviceHealthLog.deleteMany({});
    await prisma.deviceCalibrationLog.deleteMany({});
    await prisma.hardwareDeviceRegistry.deleteMany({});
    await prisma.hardwareDeviceStation.deleteMany({});

    const posStation = await HardwareDeviceService.createStation({
      stationCode: 'STATION-POS-HEALTH',
      name: 'Showroom Health Test Station',
      branchId: 'BRANCH-HQ'
    });

    const scale = await HardwareDeviceService.registerDevice({
      deviceCode: 'DEV-SCALE-H1',
      name: 'Precision Scale 01',
      category: 'DIGITAL_SCALE',
      brand: 'Mettler Toledo',
      model: 'XS205',
      serialNumber: 'SN-SCALE-8800',
      branchId: 'BRANCH-HQ',
      stationId: posStation.id,
      autoReconnectEnabled: true,
      maxReconnectAttempts: 3,
      reconnectIntervalMs: 1000,
      backoffStrategy: 'EXPONENTIAL'
    });

    const printer = await HardwareDeviceService.registerDevice({
      deviceCode: 'DEV-PRN-H1',
      name: 'Zebra Tag Printer 01',
      category: 'BARCODE_PRINTER',
      brand: 'Zebra',
      model: 'ZT411',
      serialNumber: 'SN-PRN-9911',
      branchId: 'BRANCH-HQ',
      stationId: posStation.id,
      autoReconnectEnabled: true
    });

    console.log(`  ✓ Created test devices: ${scale.deviceCode}, ${printer.deviceCode}`);

    // -------------------------------------------------------------------------
    // TEST 1: DEVICE PING & HEALTH LOG RECORDING
    // -------------------------------------------------------------------------
    console.log('\n[TEST 1] Testing Single Device Ping & Latency Recording...');

    const pingResult = await HardwareDeviceService.pingDevice(scale.id, 'MANUAL_PING');
    console.log(`  ✓ Ping Response: Status = ${pingResult.status} | Latency = ${pingResult.responseTimeMs}ms | Health = ${pingResult.healthScore}%`);
    
    if (pingResult.status !== 'ONLINE' && pingResult.status !== 'DEGRADED') {
      throw new Error(`Device ping failed, got status '${pingResult.status}'`);
    }

    const healthLogs = await prisma.hardwareDeviceHealthLog.findMany({
      where: { deviceId: scale.id }
    });
    if (healthLogs.length === 0) throw new Error('Health log was not recorded in database');
    console.log(`  ✓ Health Log Verified in Database (PingType: ${healthLogs[0].pingType})`);

    // -------------------------------------------------------------------------
    // TEST 2: SYSTEM-WIDE HEARTBEAT & HEALTH SUMMARY AGGREGATION
    // -------------------------------------------------------------------------
    console.log('\n[TEST 2] Testing System-wide Heartbeat & Health Summary Aggregation...');

    const healthSummary = await HardwareDeviceService.systemHeartbeat('BRANCH-HQ');
    console.log(`  ✓ Overall Health Score: ${healthSummary.overallHealthScore}%`);
    console.log(`  ✓ Total Devices Monitored: ${healthSummary.totalDevices} | Online: ${healthSummary.onlineCount} | Offline: ${healthSummary.offlineCount}`);

    if (healthSummary.totalDevices !== 2) {
      throw new Error(`Expected 2 monitored devices in health summary, found ${healthSummary.totalDevices}`);
    }

    // -------------------------------------------------------------------------
    // TEST 3: AUTO RECONNECT ENGINE WITH EXPONENTIAL BACKOFF
    // -------------------------------------------------------------------------
    console.log('\n[TEST 3] Testing Auto Reconnect Engine with Exponential Backoff Strategy...');

    // Set scale status to OFFLINE to test reconnect
    await HardwareDeviceService.updateDevice(scale.id, { status: 'OFFLINE' });
    console.log('  ✓ Set Scale status to OFFLINE');

    // Attempt reconnect (attempt 1)
    const reconnectAttempt1 = await HardwareDeviceService.attemptAutoReconnect(scale.id, true);
    console.log(`  ✓ Reconnect Attempt #1: ${reconnectAttempt1.message} (Backoff Delay: ${reconnectAttempt1.backoffDelayMs}ms)`);
    if (!reconnectAttempt1.success || reconnectAttempt1.device.status !== 'ONLINE') {
      throw new Error('Auto reconnect attempt #1 failed');
    }

    // Test max attempts failure scenario
    await HardwareDeviceService.updateDevice(scale.id, { status: 'OFFLINE' });
    await prisma.hardwareDeviceRegistry.update({
      where: { id: scale.id },
      data: { reconnectAttemptsCount: 3 }
    });
    const reconnectFailAttempt = await HardwareDeviceService.attemptAutoReconnect(scale.id, false); // force failure scenario (attempts > max)
    console.log(`  ✓ Reconnect Max Attempts Exceeded Result: Status = ${reconnectFailAttempt.device.status} | Error = "${reconnectFailAttempt.message}"`);
    if (reconnectFailAttempt.device.status !== 'ERROR') {
      throw new Error('Device status should transition to ERROR when max reconnect attempts fail');
    }

    // Restore Scale to ONLINE
    await HardwareDeviceService.attemptAutoReconnect(scale.id, true);

    // -------------------------------------------------------------------------
    // TEST 4: FIRMWARE VERSION TRACKING & UPDATE MANAGEMENT
    // -------------------------------------------------------------------------
    console.log('\n[TEST 4] Testing Firmware Version Tracking & Update Alerts...');

    const initialFirmware = await HardwareDeviceService.updateFirmwareInfo(scale.id, {
      firmwareVersion: 'v1.0.0',
      firmwareBuildDate: '2025-06-15',
      hardwareRevision: 'Rev B',
      manufacturer: 'Mettler Toledo Inc.',
      latestAvailableFirmwareVersion: 'v2.1.0'
    });

    console.log(`  ✓ Installed Firmware: ${initialFirmware.firmwareVersion}`);
    console.log(`  ✓ Latest Available: ${initialFirmware.latestAvailableFirmwareVersion}`);
    console.log(`  ✓ Update Available Alert: ${initialFirmware.updateAvailable} | Status: ${initialFirmware.firmwareStatus}`);

    if (!initialFirmware.updateAvailable || initialFirmware.firmwareStatus !== 'UPDATE_REQUIRED') {
      throw new Error('Firmware update available alert failed to trigger');
    }

    // Apply firmware upgrade
    const upgradedFirmware = await HardwareDeviceService.updateFirmwareInfo(scale.id, {
      firmwareVersion: 'v2.1.0',
      firmwareBuildDate: '2026-07-01',
      latestAvailableFirmwareVersion: 'v2.1.0',
      firmwareStatus: 'UP_TO_DATE'
    });

    console.log(`  ✓ Firmware Upgraded: ${upgradedFirmware.firmwareVersion} | Status: ${upgradedFirmware.firmwareStatus}`);
    if (upgradedFirmware.updateAvailable !== false || upgradedFirmware.firmwareStatus !== 'UP_TO_DATE') {
      throw new Error('Firmware upgrade status transition failed');
    }

    // -------------------------------------------------------------------------
    // TEST 5: HARDWARE AUDIT LOG RECORDING & QUERYING
    // -------------------------------------------------------------------------
    console.log('\n[TEST 5] Testing Centralized Hardware Audit Log Engine...');

    const auditLogs = await HardwareDeviceService.listAuditLogs({ deviceId: scale.id });
    console.log(`  ✓ Total Audit Logs Captured for Device '${scale.deviceCode}': ${auditLogs.length}`);

    const actionsCaptured = auditLogs.map(l => l.action);
    console.log(`  ✓ Captured Actions: ${Array.from(new Set(actionsCaptured)).join(', ')}`);

    if (auditLogs.length === 0) {
      throw new Error('No audit logs found for device');
    }

    console.log('\n=============================================================================');
    console.log('ALL SPRINT 03.2 UNIT TESTS PASSED 100% SUCCESSFULLY! 🎯');
    console.log('=============================================================================');
  } catch (err: any) {
    console.error('\n❌ SPRINT 03.2 UNIT TEST FAILED:', err.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

runSprint32UnitTests();
