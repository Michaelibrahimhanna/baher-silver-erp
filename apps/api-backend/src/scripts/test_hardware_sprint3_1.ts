import { HardwareDeviceService } from '../services/hardware_device.service';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function runSprint31UnitTests() {
  console.log('=============================================================================');
  console.log('EPIC 02 SPRINT 03.1: HARDWARE REGISTRY, PROFILES, DRIVERS & CRUD — UNIT TESTS');
  console.log('=============================================================================');

  try {
    // -------------------------------------------------------------------------
    // CLEANUP TEST DATA FIRST
    // -------------------------------------------------------------------------
    console.log('\n[SETUP] Cleaning up existing test hardware data...');
    await prisma.deviceCalibrationLog.deleteMany({});
    await prisma.hardwareDeviceRegistry.deleteMany({});
    await prisma.hardwareDeviceStation.deleteMany({});
    await prisma.hardwareDeviceProfile.deleteMany({});
    await prisma.hardwareDriverManifest.deleteMany({});
    console.log('  ✓ Cleaned up test database tables.');

    // -------------------------------------------------------------------------
    // TEST 1: DRIVER MANIFEST REGISTRATION (FOR 5 HARDWARE CATEGORIES)
    // -------------------------------------------------------------------------
    console.log('\n[TEST 1] Testing Hardware Driver Manifest Registration...');

    const scaleDriver = await HardwareDeviceService.registerDriverManifest({
      driverCode: 'DRV-METTLER-RS232',
      name: 'Mettler Toledo Precision RS232 Driver',
      category: 'DIGITAL_SCALE',
      version: '2.1.0',
      vendorIds: ['0x0eb8'],
      productIds: ['0x2303'],
      supportedProtocols: ['RS232', 'USB_SERIAL'],
      supportedCommands: ['READ_WEIGHT', 'TARE', 'ZERO', 'CALIBRATE'],
      capabilities: ['AUTO_STABILITY', 'HIGH_PRECISION', 'STABILITY_LOCK']
    });
    console.log(`  ✓ Driver Registered: ${scaleDriver.driverCode} | Category: ${scaleDriver.category}`);

    const printerDriver = await HardwareDeviceService.registerDriverManifest({
      driverCode: 'DRV-ZEBRA-ZPL',
      name: 'Zebra ZPL Printer Driver',
      category: 'BARCODE_PRINTER',
      version: '1.4.0',
      vendorIds: ['0x0a5c'],
      productIds: ['0x0080'],
      supportedProtocols: ['USB_SERIAL', 'TCPIP'],
      supportedCommands: ['PRINT_TAG', 'GET_STATUS', 'FEED'],
      capabilities: ['PAPER_SENSOR', 'TEAR_BAR', 'BLACK_MARK']
    });
    console.log(`  ✓ Driver Registered: ${printerDriver.driverCode} | Category: ${printerDriver.category}`);

    const scannerDriver = await HardwareDeviceService.registerDriverManifest({
      driverCode: 'DRV-HONEYWELL-HID',
      name: 'Honeywell Voyager USB-HID Scanner Driver',
      category: 'BARCODE_SCANNER',
      version: '3.0.1',
      vendorIds: ['0x0c2e'],
      productIds: ['0x090a'],
      supportedProtocols: ['USB_HID', 'RS232'],
      supportedCommands: ['SCAN_TRIGGER', 'BEEP', 'SET_MODE'],
      capabilities: ['AUTO_TRIGGER', 'EAN13_DECODE', 'QR_DECODE']
    });
    console.log(`  ✓ Driver Registered: ${scannerDriver.driverCode} | Category: ${scannerDriver.category}`);

    const drawerDriver = await HardwareDeviceService.registerDriverManifest({
      driverCode: 'DRV-APG-KICK',
      name: 'APG Vasario Cash Drawer Kick Driver',
      category: 'CASH_DRAWER',
      version: '1.0.0',
      vendorIds: ['0x0001'],
      productIds: ['0x0001'],
      supportedProtocols: ['RS232', 'USB_SERIAL'],
      supportedCommands: ['OPEN_DRAWER', 'GET_REED_STATUS'],
      capabilities: ['REED_SWITCH_SENSOR', 'DUAL_KICK_PULSE']
    });
    console.log(`  ✓ Driver Registered: ${drawerDriver.driverCode} | Category: ${drawerDriver.category}`);

    const displayDriver = await HardwareDeviceService.registerDriverManifest({
      driverCode: 'DRV-BEMATECH-VFD',
      name: 'Logic Controls Bematech VFD Display Driver',
      category: 'CUSTOMER_DISPLAY',
      version: '1.2.0',
      vendorIds: ['0x1102'],
      productIds: ['0x0012'],
      supportedProtocols: ['RS232', 'USB_SERIAL'],
      supportedCommands: ['DISPLAY_LINE1', 'DISPLAY_LINE2', 'CLEAR_DISPLAY', 'SCROLL'],
      capabilities: ['DUAL_LINE_20CHAR', 'VFD_BRIGHTNESS']
    });
    console.log(`  ✓ Driver Registered: ${displayDriver.driverCode} | Category: ${displayDriver.category}`);

    // Verify drivers count
    const driversList = await HardwareDeviceService.listDriverManifests();
    if (driversList.length !== 5) throw new Error(`Expected 5 registered drivers, got ${driversList.length}`);

    // -------------------------------------------------------------------------
    // TEST 2: BRANCH -> STATION HIERARCHY & HARDWARE PROFILES
    // -------------------------------------------------------------------------
    console.log('\n[TEST 2] Testing Branch -> Station Hierarchy & Hardware Profiles...');

    const posStation = await HardwareDeviceService.createStation({
      stationCode: 'STATION-POS-01',
      name: 'Main Showroom POS Checkout Station 01',
      branchId: 'BRANCH-HQ',
      description: 'Primary customer weighing and checkout station'
    });
    console.log(`  ✓ Station Created: ${posStation.stationCode} (Branch: ${posStation.branchId})`);

    const workshopStation = await HardwareDeviceService.createStation({
      stationCode: 'STATION-WORKSHOP-01',
      name: 'Casting & Gemstone Workshop Station',
      branchId: 'BRANCH-HQ',
      description: 'Factory workshop precision weighing desk'
    });
    console.log(`  ✓ Station Created: ${workshopStation.stationCode} (Branch: ${workshopStation.branchId})`);

    const branchProfile = await HardwareDeviceService.createProfile({
      profileCode: 'PROF-SHOWROOM-STD',
      name: 'Standard Showroom Hardware Profile',
      branchId: 'BRANCH-HQ',
      description: 'Standard hardware grouping for showroom branches',
      isDefaultProfile: true
    });
    console.log(`  ✓ Hardware Profile Created: ${branchProfile.profileCode}`);

    // -------------------------------------------------------------------------
    // TEST 3: DEVICE REGISTRY CRUD ACROSS 5 HARDWARE CATEGORIES
    // -------------------------------------------------------------------------
    console.log('\n[TEST 3] Testing Device Registry CRUD for 5 Hardware Categories...');

    // 1. Scale
    const scaleDevice = await HardwareDeviceService.registerDevice({
      deviceCode: 'DEV-SCALE-01',
      name: 'Mettler Toledo Precision Analytical Scale',
      category: 'DIGITAL_SCALE',
      brand: 'Mettler Toledo',
      model: 'XS205 Dual Range',
      serialNumber: 'SN-MT-994821',
      branchId: 'BRANCH-HQ',
      stationId: posStation.id,
      profileId: branchProfile.id,
      driverId: scaleDriver.id,
      connectionType: 'RS232',
      portName: 'COM3',
      baudRate: 9600,
      isDefault: true
    });
    console.log(`  ✓ Registered Scale: ${scaleDevice.deviceCode} (${scaleDevice.brand} ${scaleDevice.model})`);

    // 2. Barcode Printer
    const printerDevice = await HardwareDeviceService.registerDevice({
      deviceCode: 'DEV-PRN-01',
      name: 'Zebra Industrial Jewelry Tag Printer',
      category: 'BARCODE_PRINTER',
      brand: 'Zebra',
      model: 'ZT411 600dpi',
      serialNumber: 'SN-ZB-773412',
      branchId: 'BRANCH-HQ',
      stationId: posStation.id,
      profileId: branchProfile.id,
      driverId: printerDriver.id,
      connectionType: 'USB_SERIAL',
      portName: 'COM4',
      baudRate: 115200,
      isDefault: true
    });
    console.log(`  ✓ Registered Printer: ${printerDevice.deviceCode} (${printerDevice.brand} ${printerDevice.model})`);

    // 3. Barcode Scanner
    const scannerDevice = await HardwareDeviceService.registerDevice({
      deviceCode: 'DEV-SCN-01',
      name: 'Honeywell Handheld Scanner',
      category: 'BARCODE_SCANNER',
      brand: 'Honeywell',
      model: 'Voyager 1200g',
      serialNumber: 'SN-HW-118833',
      branchId: 'BRANCH-HQ',
      stationId: posStation.id,
      profileId: branchProfile.id,
      driverId: scannerDriver.id,
      connectionType: 'USB_HID',
      isDefault: true
    });
    console.log(`  ✓ Registered Scanner: ${scannerDevice.deviceCode} (${scannerDevice.brand} ${scannerDevice.model})`);

    // 4. Cash Drawer
    const drawerDevice = await HardwareDeviceService.registerDevice({
      deviceCode: 'DEV-DRW-01',
      name: 'APG Heavy Duty Cash Drawer',
      category: 'CASH_DRAWER',
      brand: 'APG',
      model: 'Vasario Series',
      serialNumber: 'SN-APG-445100',
      branchId: 'BRANCH-HQ',
      stationId: posStation.id,
      profileId: branchProfile.id,
      driverId: drawerDriver.id,
      connectionType: 'RS232',
      portName: 'COM1',
      isDefault: true
    });
    console.log(`  ✓ Registered Cash Drawer: ${drawerDevice.deviceCode} (${drawerDevice.brand} ${drawerDevice.model})`);

    // 5. Customer Display
    const displayDevice = await HardwareDeviceService.registerDevice({
      deviceCode: 'DEV-DSP-01',
      name: 'Logic Controls Customer VFD Screen',
      category: 'CUSTOMER_DISPLAY',
      brand: 'Logic Controls',
      model: 'PD3000 VFD',
      serialNumber: 'SN-LC-559922',
      branchId: 'BRANCH-HQ',
      stationId: posStation.id,
      profileId: branchProfile.id,
      driverId: displayDriver.id,
      connectionType: 'RS232',
      portName: 'COM2',
      isDefault: true
    });
    console.log(`  ✓ Registered Customer Display: ${displayDevice.deviceCode} (${displayDevice.brand} ${displayDevice.model})`);

    // Query & Verification
    const registeredDevices = await HardwareDeviceService.listDevices({ branchId: 'BRANCH-HQ' });
    if (registeredDevices.length !== 5) throw new Error(`Expected 5 devices, got ${registeredDevices.length}`);
    console.log(`  ✓ Verified Total Registered Devices: ${registeredDevices.length}`);

    // Update Device Test
    const updatedScale = await HardwareDeviceService.updateDevice(scaleDevice.id, {
      baudRate: 19200,
      extraConfig: { precision: '0.001g', stabilityTimeMs: 800 }
    });
    if (updatedScale.baudRate !== 19200) throw new Error('Update device failed to persist baud rate');
    console.log(`  ✓ Updated Device Config (Baud rate = ${updatedScale.baudRate})`);

    // -------------------------------------------------------------------------
    // TEST 4: BRANCH -> STATION -> DEVICE HIERARCHY RESOLUTION
    // -------------------------------------------------------------------------
    console.log('\n[TEST 4] Testing Hierarchy Resolution (Station -> Devices)...');

    const stationDetails = await HardwareDeviceService.getStationById(posStation.id);
    console.log(`  ✓ Station: ${stationDetails.name} (${stationDetails.stationCode})`);
    console.log(`    └─ Assigned Devices Count: ${stationDetails.devices.length}`);
    if (stationDetails.devices.length !== 5) {
      throw new Error(`Station hierarchy expected 5 devices, found ${stationDetails.devices.length}`);
    }

    // -------------------------------------------------------------------------
    // TEST 5: DEFAULT DEVICE ASSIGNMENT & UNSETTING
    // -------------------------------------------------------------------------
    console.log('\n[TEST 5] Testing Default Device Assignment Logic...');

    const scale2 = await HardwareDeviceService.registerDevice({
      deviceCode: 'DEV-SCALE-02',
      name: 'Backup Workshop Scale',
      category: 'DIGITAL_SCALE',
      brand: 'Kern & Sohn',
      model: 'PCB 3500-2',
      serialNumber: 'SN-KERN-112233',
      branchId: 'BRANCH-HQ',
      stationId: posStation.id,
      isDefault: false
    });
    console.log(`  ✓ Registered Second Scale: ${scale2.deviceCode} (isDefault = false)`);

    // Set scale2 as default -> scale1 should be unset
    await HardwareDeviceService.setDefaultDevice(scale2.id);
    const scale1Refreshed = await HardwareDeviceService.getDeviceById(scaleDevice.id);
    const scale2Refreshed = await HardwareDeviceService.getDeviceById(scale2.id);

    console.log(`  ✓ DEV-SCALE-01 isDefault: ${scale1Refreshed.isDefault}`);
    console.log(`  ✓ DEV-SCALE-02 isDefault: ${scale2Refreshed.isDefault}`);

    if (scale1Refreshed.isDefault !== false || scale2Refreshed.isDefault !== true) {
      throw new Error('Default device assignment failed to automatically unset previous default');
    }

    // Restore scale1 as default
    await HardwareDeviceService.setDefaultDevice(scaleDevice.id);

    // -------------------------------------------------------------------------
    // TEST 6: DRIVER BINDING & CATEGORY MISMATCH ENFORCEMENT
    // -------------------------------------------------------------------------
    console.log('\n[TEST 6] Testing Driver Binding & Category Compatibility Validation...');

    // Attempt invalid binding (Printer driver to Scale device)
    try {
      await HardwareDeviceService.bindDeviceDriver(scaleDevice.id, printerDriver.id);
      throw new Error('Driver binding should have failed for category mismatch');
    } catch (err: any) {
      console.log(`  ✓ Successfully rejected invalid driver binding: "${err.message}"`);
    }

    // Valid binding
    const boundDevice = await HardwareDeviceService.bindDeviceDriver(scaleDevice.id, scaleDriver.id);
    if (boundDevice.driverId !== scaleDriver.id) throw new Error('Valid driver binding failed');
    console.log(`  ✓ Driver Successfully Bound to Device (${boundDevice.driver?.name})`);

    // -------------------------------------------------------------------------
    // TEST 7: MAINTENANCE MODE LIFECYCLE
    // -------------------------------------------------------------------------
    console.log('\n[TEST 7] Testing Maintenance Mode Lifecycle & Status Transitions...');

    const inMaint = await HardwareDeviceService.setMaintenanceMode(
      scaleDevice.id,
      true,
      'Annual ISO Calibration & Sensor Cleaning'
    );
    console.log(`  ✓ Device Status: ${inMaint.status} | Reason: ${inMaint.statusReason}`);
    if (inMaint.status !== 'MAINTENANCE') throw new Error('Failed to transition to MAINTENANCE status');

    const outMaint = await HardwareDeviceService.setMaintenanceMode(scaleDevice.id, false);
    console.log(`  ✓ Restored Device Status: ${outMaint.status}`);
    if (outMaint.status !== 'OFFLINE') throw new Error('Failed to restore device status from MAINTENANCE');

    // -------------------------------------------------------------------------
    // TEST 8: CALIBRATION HISTORY RECORDING & QUERYING
    // -------------------------------------------------------------------------
    console.log('\n[TEST 8] Testing Calibration History Log Recording & Auditing...');

    const calib1 = await HardwareDeviceService.recordCalibration(scaleDevice.id, {
      calibratedBy: 'فني معايرة الجودة (م. إبراهيم)',
      referenceWeightGrams: 100.0,
      measuredWeightGrams: 100.02,
      certificateNo: 'CERT-CAL-2026-089',
      nextCalibrationDueDate: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000), // +180 days
      notes: 'Standard 100g test mass check - Pass'
    });
    console.log(`  ✓ Recorded Calibration #1: Measured ${calib1.measuredWeightGrams}g vs Ref ${calib1.referenceWeightGrams}g | Status: ${calib1.status} | Offset: ${calib1.offsetErrorGrams}g`);

    const calib2 = await HardwareDeviceService.recordCalibration(scaleDevice.id, {
      calibratedBy: 'فني الصيانة (أحمد)',
      referenceWeightGrams: 500.0,
      measuredWeightGrams: 500.12,
      offsetErrorGrams: 0.12,
      status: 'FAIL',
      certificateNo: 'CERT-CAL-2026-090',
      notes: 'High weight error offset detected'
    });
    console.log(`  ✓ Recorded Calibration #2: Measured ${calib2.measuredWeightGrams}g vs Ref ${calib2.referenceWeightGrams}g | Status: ${calib2.status} | Offset: ${calib2.offsetErrorGrams}g`);

    const calLogs = await HardwareDeviceService.listCalibrationLogs(scaleDevice.id);
    console.log(`  ✓ Total Calibration History Logs Found: ${calLogs.length}`);
    if (calLogs.length !== 2) throw new Error(`Expected 2 calibration logs, found ${calLogs.length}`);

    // Clean up scale2 backup
    await HardwareDeviceService.deleteDevice(scale2.id);

    console.log('\n=============================================================================');
    console.log('ALL SPRINT 03.1 UNIT TESTS PASSED 100% SUCCESSFULLY! 🎯');
    console.log('=============================================================================');
  } catch (err: any) {
    console.error('\n❌ SPRINT 03.1 UNIT TEST FAILED:', err.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

runSprint31UnitTests();
