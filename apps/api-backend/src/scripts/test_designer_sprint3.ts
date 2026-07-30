import { BarcodeLabelService } from '../services/barcode_label.service';
import { LabelPrintingService } from '../services/label_printing.service';
import { LabelPresetService } from '../services/label_preset.service';
import { IdentityPlatformService } from '../services/identity_platform.service';
import { ProductService } from '../services/product.service';
import { HardwareDeviceService } from '../services/hardware_device.service';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function runDesignerSprint3UnitTests() {
  console.log('=============================================================================');
  console.log('EPIC 03 SPRINT 03: JEWELRY LABEL DESIGNER & PRINTING WORKFLOW — UNIT TESTS');
  console.log('=============================================================================');

  try {
    // -------------------------------------------------------------------------
    // CLEANUP & SETUP
    // -------------------------------------------------------------------------
    console.log('\n[SETUP] Cleaning up database and preparing test environment...');
    await prisma.printPreset.deleteMany({});
    await prisma.labelTemplateVersion.deleteMany({});
    await prisma.printJobAuditLog.deleteMany({});
    await prisma.printJobQueue.deleteMany({});
    await prisma.printableLabelTemplate.deleteMany({});
    await prisma.hardwareDeviceAuditLog.deleteMany({});
    await prisma.hardwareDeviceRegistry.deleteMany({});
    await prisma.hardwareDeviceStation.deleteMany({});

    // Register Station & Printer
    const station = await HardwareDeviceService.createStation({
      stationCode: 'STATION-DSG-01',
      name: 'Designer Test Station',
      branchId: 'BRANCH-MAIN'
    });

    const printer = await HardwareDeviceService.registerDevice({
      deviceCode: 'DEV-PRN-DSG01',
      name: 'Zebra Industrial ZT411 Designer Printer',
      category: 'BARCODE_PRINTER',
      brand: 'Zebra',
      model: 'ZT411',
      serialNumber: 'SN-DSG-001',
      branchId: 'BRANCH-MAIN',
      stationId: station.id,
      status: 'ONLINE',
      isDefault: true
    });

    // Create Identity Product Model & Physical Piece
    const product = await ProductService.createProduct({
      nameAr: 'قلادة فضة إيطالي مرصعة بالأحجار',
      nameEn: 'Italian Silver Necklace with Gemstones',
      category: 'قلادة',
      silverPurity: '925'
    });

    const piece = await IdentityPlatformService.createPhysicalPiece({
      productModelId: product.id,
      weightGrams: 32.40,
      silverPurity: '925',
      branchId: 'BRANCH-MAIN'
    });

    console.log(`  ✓ Setup Complete: Station ${station.stationCode}, Printer ${printer.deviceCode}, Piece ${piece.serialNo}`);

    // -------------------------------------------------------------------------
    // TEST 1: VISUAL LABEL DESIGNER LAYOUT TEMPLATE STORAGE & DYNAMIC FIELDS
    // -------------------------------------------------------------------------
    console.log('\n[TEST 1] Testing Jewelry Label Designer Layout Template Engine...');

    const designerTemplate = await BarcodeLabelService.createLabelTemplate({
      templateCode: 'LBL-TAIL-JEWELRY-50X15',
      name: 'Custom Jewelry Mouse-Tail Tag (50x15mm)',
      category: 'JEWELRY_TAG',
      widthMm: 50.0,
      heightMm: 15.0,
      dpi: 600,
      defaultBarcodeFormat: 'CODE128',
      layoutJson: {
        labelType: 'MOUSE_TAIL',
        margins: { top: 1, bottom: 1, left: 1, right: 1 },
        elements: [
          { id: 'el-1', type: 'text', field: 'name', text: 'قلادة فضة إيطالي', xMm: 2, yMm: 2, fontSizePt: 9 },
          { id: 'el-2', type: 'barcode', field: 'barcode', xMm: 2, yMm: 4.5, widthMm: 32, heightMm: 5.5 },
          { id: 'el-3', type: 'text', field: 'serial', xMm: 2, yMm: 11, fontSizePt: 7 },
          { id: 'el-4', type: 'text', field: 'weight', xMm: 2, yMm: 13, fontSizePt: 7 }
        ]
      },
      isDefault: true
    });

    console.log(`  ✓ Created Designer Template #${designerTemplate.templateCode} (Version: ${designerTemplate.version})`);
    if (designerTemplate.versionNo !== 1 || designerTemplate.version !== '1.0.0') {
      throw new Error('Initial template version expected 1.0.0');
    }

    // -------------------------------------------------------------------------
    // TEST 2: TEMPLATE VERSIONING & SNAPSHOT HISTORY
    // -------------------------------------------------------------------------
    console.log('\n[TEST 2] Testing Template Versioning & History Tracking...');

    const versionResult = await BarcodeLabelService.createTemplateVersion(
      designerTemplate.id,
      'Adjusted barcode vertical alignment to y=5.0mm'
    );

    console.log(`  ✓ Created Template Version: ${versionResult.version.version} (VersionNo: ${versionResult.version.versionNo})`);
    console.log(`    └─ Changelog: "${versionResult.version.changelog}"`);

    const versionsList = await BarcodeLabelService.listTemplateVersions(designerTemplate.id);
    console.log(`  ✓ Total Version Snapshots in History: ${versionsList.length}`);

    if (versionsList.length !== 1 || versionsList[0].versionNo !== 2) {
      throw new Error('Template version snapshot recording failed');
    }

    // -------------------------------------------------------------------------
    // TEST 3: IMPORT & EXPORT LABEL TEMPLATES
    // -------------------------------------------------------------------------
    console.log('\n[TEST 3] Testing Template Package Export & Import...');

    const exportedPkg = await BarcodeLabelService.exportTemplateJson(designerTemplate.id);
    console.log(`  ✓ Exported Template Package (Schema: ${exportedPkg.schemaVersion}):`);
    console.log(`    └─ Code: ${exportedPkg.template.templateCode} | Elements Count: ${exportedPkg.template.layout.elements.length}`);

    const importedTemplate = await BarcodeLabelService.importTemplateJson(exportedPkg);
    console.log(`  ✓ Imported Template Package: Code = ${importedTemplate.templateCode} | Name = "${importedTemplate.name}"`);

    if (!importedTemplate.templateCode.includes('-IMP-')) {
      throw new Error('Imported template code suffix verification failed');
    }

    // -------------------------------------------------------------------------
    // TEST 4: PRINT PRESETS BY BRANCH & PRINTER STATION
    // -------------------------------------------------------------------------
    console.log('\n[TEST 4] Testing Print Presets by Branch & Printer Station...');

    const preset = await LabelPresetService.createPrintPreset({
      presetCode: 'PRESET-MAIN-HQ-SCALE01',
      name: 'Main Branch POS Thermal Scale Preset',
      branchId: 'BRANCH-MAIN',
      stationId: station.id,
      printerDeviceId: printer.id,
      templateId: designerTemplate.id,
      commandLanguage: 'ZPL',
      isDefault: true
    });

    console.log(`  ✓ Created Print Preset #${preset.presetCode}: Printer = ${printer.deviceCode} | Template = ${preset.template.templateCode}`);

    const resolvedPreset = await LabelPresetService.resolvePresetForStation('BRANCH-MAIN', station.id);
    console.log(`  ✓ Resolved Active Station Preset: ${resolvedPreset?.name} (Language: ${resolvedPreset?.commandLanguage})`);

    if (!resolvedPreset || resolvedPreset.id !== preset.id) {
      throw new Error('Print Preset resolution for station failed');
    }

    // -------------------------------------------------------------------------
    // TEST 5: BATCH LABEL PRINTING WORKFLOW (REUSING SPRINT 01 & SPRINT 02 ENGINES)
    // -------------------------------------------------------------------------
    console.log('\n[TEST 5] Testing Batch Label Printing Workflow...');

    const batchPrintRes = await LabelPrintingService.enqueueMultiPrinterBatch(
      [piece.id],
      [printer.id],
      'ZPL',
      'مشرف الطباعة'
    );

    console.log(`  ✓ Executed Batch Print Workflow: Total Jobs = ${batchPrintRes.batchSize}`);
    console.log(`    └─ Job Status: ${batchPrintRes.jobs[0].job?.status} | PrintedAt = ${batchPrintRes.jobs[0].job?.printedAt}`);

    if (batchPrintRes.batchSize !== 1 || !batchPrintRes.jobs[0].success) {
      throw new Error('Batch label printing workflow execution failed');
    }

    console.log('\n=============================================================================');
    console.log('ALL EPIC 03 SPRINT 03 DESIGNER & WORKFLOW TESTS PASSED 100% SUCCESSFULLY! 🎯');
    console.log('=============================================================================');
  } catch (err: any) {
    console.error('\n❌ EPIC 03 SPRINT 03 UNIT TEST FAILED:', err.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

runDesignerSprint3UnitTests();
