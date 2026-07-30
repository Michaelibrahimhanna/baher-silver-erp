import { LabelPrintingService } from '../services/label_printing.service';
import { HardwareDeviceService } from '../services/hardware_device.service';
import { IdentityPlatformService } from '../services/identity_platform.service';
import { ProductService } from '../services/product.service';
import { BarcodeLabelService } from '../services/barcode_label.service';
import { ZPLGenerator, EPLGenerator, PDFVectorGenerator } from '../services/printing/label_command_generator.service';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function runPrintingSprint2UnitTests() {
  console.log('=============================================================================');
  console.log('EPIC 03 SPRINT 02: LABEL PRINTING ENGINE — UNIT TEST SUITE');
  console.log('=============================================================================');

  try {
    // -------------------------------------------------------------------------
    // CLEANUP & SETUP PRINTERS AND IDENTITY DATA
    // -------------------------------------------------------------------------
    console.log('\n[SETUP] Cleaning up database and preparing test printers & physical piece...');
    await prisma.printJobAuditLog.deleteMany({});
    await prisma.printJobQueue.deleteMany({});
    await prisma.hardwareDeviceAuditLog.deleteMany({});
    await prisma.hardwareDeviceRegistry.deleteMany({});
    await prisma.hardwareDeviceStation.deleteMany({});

    // Create Station
    const posStation = await HardwareDeviceService.createStation({
      stationCode: 'STATION-PRN-01',
      name: 'Main POS Print Station',
      branchId: 'BRANCH-HQ'
    });

    // Create Primary Zebra ZPL Printer
    const zplPrinter = await HardwareDeviceService.registerDevice({
      deviceCode: 'DEV-PRN-ZPL01',
      name: 'Zebra Industrial ZT411 (ZPL 600dpi)',
      category: 'BARCODE_PRINTER',
      brand: 'Zebra',
      model: 'ZT411',
      serialNumber: 'SN-ZPL-101',
      branchId: 'BRANCH-HQ',
      stationId: posStation.id,
      connectionType: 'USB_SERIAL',
      status: 'ONLINE',
      isDefault: true
    });

    // Create Secondary Desktop EPL Printer
    const eplPrinter = await HardwareDeviceService.registerDevice({
      deviceCode: 'DEV-PRN-EPL02',
      name: 'Zebra Desktop GC420t (EPL 203dpi)',
      category: 'BARCODE_PRINTER',
      brand: 'Zebra',
      model: 'GC420t',
      serialNumber: 'SN-EPL-202',
      branchId: 'BRANCH-HQ',
      stationId: posStation.id,
      connectionType: 'RS232',
      status: 'ONLINE',
      isDefault: false
    });

    // Create Product & Physical Piece (EPIC 02 Integration)
    const product = await ProductService.createProduct({
      nameAr: 'إسوارة فضة 925 مرصعة بالأحجار',
      nameEn: 'Silver Bracelet 925 with Gemstones',
      category: 'إسوارة',
      silverPurity: '925'
    });

    const piece = await IdentityPlatformService.createPhysicalPiece({
      productModelId: product.id,
      weightGrams: 24.50,
      silverPurity: '925',
      branchId: 'BRANCH-HQ'
    });

    console.log(`  ✓ Registered Printers: ${zplPrinter.deviceCode} (ZPL), ${eplPrinter.deviceCode} (EPL)`);
    console.log(`  ✓ Created Identity Physical Piece: Serial = ${piece.serialNo} | SKU = ${piece.sku}`);

    // -------------------------------------------------------------------------
    // TEST 1: ZPL, EPL & PDF COMMAND GENERATORS (CONSUMING SPRINT 01 BARCODE)
    // -------------------------------------------------------------------------
    console.log('\n[TEST 1] Testing Command Generators (ZPL, EPL, PDF Vector)...');

    const barcodeData = await BarcodeLabelService.generateBarcodeForPiece(piece.id, 'CODE128');

    // 1A. ZPL Generator
    const zplStream = ZPLGenerator.generate({
      barcodeValue: barcodeData.barcode.code,
      barcodeFormat: barcodeData.barcode.format,
      serialNo: piece.serialNo,
      sku: piece.sku,
      titleAr: barcodeData.productNameAr,
      weightGrams: barcodeData.weightGrams,
      silverPurity: barcodeData.silverPurity,
      widthMm: 30,
      heightMm: 15,
      dpi: 600,
      copies: 2
    });

    console.log(`  ✓ ZPL Command Stream Generated (${zplStream.length} bytes):`);
    console.log(`    └─ ${zplStream.split('\n').slice(0, 4).join(' ')} ... ^PQ2 ^XZ`);

    if (!zplStream.includes('^XA') || !zplStream.includes('^XZ') || !zplStream.includes(barcodeData.barcode.code)) {
      throw new Error('ZPL Command Stream generation failed or missing barcode payload');
    }

    // 1B. EPL Generator
    const eplStream = EPLGenerator.generate({
      barcodeValue: barcodeData.barcode.code,
      barcodeFormat: barcodeData.barcode.format,
      serialNo: piece.serialNo,
      widthMm: 30,
      heightMm: 15,
      dpi: 203,
      copies: 1
    });

    console.log(`  ✓ EPL Command Stream Generated (${eplStream.length} bytes):`);
    console.log(`    └─ ${eplStream.split('\n').join(' | ')}`);

    if (!eplStream.includes('N') || !eplStream.includes('P1') || !eplStream.includes(barcodeData.barcode.code)) {
      throw new Error('EPL Command Stream generation failed');
    }

    // 1C. PDF Vector Generator
    const pdfStream = PDFVectorGenerator.generate({
      barcodeValue: barcodeData.barcode.code,
      barcodeFormat: barcodeData.barcode.format,
      svgRender: barcodeData.barcode.render.svg,
      serialNo: piece.serialNo,
      titleAr: barcodeData.productNameAr,
      widthMm: 30,
      heightMm: 15
    });

    console.log(`  ✓ PDF Vector SVG Document Generated (${pdfStream.length} bytes)`);
    if (!pdfStream.includes('<svg') || !pdfStream.includes('<?xml')) {
      throw new Error('PDF Vector Document generation failed');
    }

    // -------------------------------------------------------------------------
    // TEST 2: PRINTER SELECTION SERVICE & HARDWARE REGISTRY INTEGRATION
    // -------------------------------------------------------------------------
    console.log('\n[TEST 2] Testing Printer Selection Service & Hardware Status Integration...');

    const selectedPrinter = await LabelPrintingService.selectTargetPrinter('BRANCH-HQ', posStation.id);
    console.log(`  ✓ Auto-selected Target Printer: ${selectedPrinter.name} (${selectedPrinter.deviceCode}) | Status: ${selectedPrinter.status}`);

    if (selectedPrinter.id !== zplPrinter.id) {
      throw new Error('Printer Selection Service failed to resolve default ZPL printer');
    }

    // -------------------------------------------------------------------------
    // TEST 3: PRINT QUEUE ENGINE (ENQUEUE & SUCCESS DISPATCH)
    // -------------------------------------------------------------------------
    console.log('\n[TEST 3] Testing Print Queue Engine (Enqueue & Success Dispatch)...');

    const jobResult = await LabelPrintingService.enqueuePrintJob({
      pieceIdOrSerial: piece.id,
      printerDeviceId: zplPrinter.id,
      commandLanguage: 'ZPL',
      copies: 2,
      requestedBy: 'فني طابعات الفضة'
    });

    console.log(`  ✓ Enqueued & Dispatched Job #${jobResult.job?.jobNo}: Status = ${jobResult.job?.status} | PrintedAt = ${jobResult.job?.printedAt}`);
    
    if (!jobResult.success || jobResult.job?.status !== 'PRINTED') {
      throw new Error('Print Queue Engine job dispatch failed');
    }

    // -------------------------------------------------------------------------
    // TEST 4: MULTI-PRINTER SIMULTANEOUS BATCH DISPATCH
    // -------------------------------------------------------------------------
    console.log('\n[TEST 4] Testing Multi-Printer Simultaneous Batch Dispatch...');

    const batchResult = await LabelPrintingService.enqueueMultiPrinterBatch(
      [piece.id],
      [zplPrinter.id, eplPrinter.id],
      'ZPL',
      'مدير الإنتاج'
    );

    console.log(`  ✓ Multi-Printer Batch Enqueued: Batch Size = ${batchResult.batchSize}`);
    batchResult.jobs.forEach((j, idx) => {
      console.log(`    └─ Job #${idx + 1} (${j.job?.printerDeviceCode}): Status = ${j.job?.status}`);
    });

    if (batchResult.batchSize !== 2 || !batchResult.jobs.every(j => j.success)) {
      throw new Error('Multi-printer simultaneous batch dispatch failed');
    }

    // -------------------------------------------------------------------------
    // TEST 5: PRINT RETRY ENGINE & ERROR RECOVERY
    // -------------------------------------------------------------------------
    console.log('\n[TEST 5] Testing Print Retry Engine & Failure Recovery...');

    // 5A. Enqueue job with simulated paper sensor failure (PAPER_OUT)
    const failedJobResult = await LabelPrintingService.enqueuePrintJob({
      pieceIdOrSerial: piece.id,
      printerDeviceId: zplPrinter.id,
      commandLanguage: 'ZPL',
      forceFail: true, // Simulate paper out failure
      requestedBy: 'فني الورشة'
    });

    console.log(`  ✓ Simulated Failed Print Job #${failedJobResult.job?.jobNo}: Status = ${failedJobResult.job?.status} | Error = "${failedJobResult.job?.errorMessage}"`);
    if (failedJobResult.job?.status !== 'FAILED') {
      throw new Error('Simulated failure job state should be FAILED');
    }

    // 5B. Execute Retry Engine
    const retriedJobResult = await LabelPrintingService.retryFailedPrintJob(failedJobResult.job.id, 'مشرف الصيانة');
    console.log(`  ✓ Retried Print Job #${retriedJobResult.job?.jobNo}: Status = ${retriedJobResult.job?.status} | Retry Count = ${retriedJobResult.job?.retryCount}`);

    if (!retriedJobResult.success || retriedJobResult.job?.status !== 'PRINTED' || retriedJobResult.job?.retryCount !== 1) {
      throw new Error('Print Retry Engine failure recovery failed');
    }

    // -------------------------------------------------------------------------
    // TEST 6: PRINT JOB AUDIT LOGGING & QUEUE QUERYING
    // -------------------------------------------------------------------------
    console.log('\n[TEST 6] Verifying Print Job Audit Log History & Queue Queries...');

    const jobHistory = await LabelPrintingService.getJobById(failedJobResult.job.id);
    console.log(`  ✓ Job Audit Trail Count for #${jobHistory.jobNo}: ${jobHistory.auditLogs.length}`);
    jobHistory.auditLogs.forEach(l => {
      console.log(`    └─ [${l.action}] Status: ${l.status} | Details: ${l.details}`);
    });

    if (jobHistory.auditLogs.length < 3) {
      throw new Error('Expected at least 3 audit log events for enqueued, failed, and retried job');
    }

    console.log('\n=============================================================================');
    console.log('ALL EPIC 03 SPRINT 02 LABEL PRINTING TESTS PASSED 100% SUCCESSFULLY! 🎯');
    console.log('=============================================================================');
  } catch (err: any) {
    console.error('\n❌ EPIC 03 SPRINT 02 UNIT TEST FAILED:', err.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

runPrintingSprint2UnitTests();
