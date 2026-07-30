import { PrismaClient } from '@prisma/client';
import { BarcodeLabelService } from './barcode_label.service';
import {
  ZPLGenerator,
  EPLGenerator,
  PDFVectorGenerator,
  LabelCommandPayload
} from './printing/label_command_generator.service';

const prisma = new PrismaClient();

export interface EnqueuePrintJobDTO {
  pieceIdOrSerial?: string;
  templateIdOrCode?: string;
  printerDeviceId?: string;
  commandLanguage?: 'ZPL' | 'EPL' | 'PDF_VECTOR' | 'SVG';
  copies?: number;
  branchId?: string;
  stationId?: string;
  requestedBy?: string;
  forceFail?: boolean; // For testing retry engine
}

export class LabelPrintingService {
  // =============================================================================
  // 1. PRINTER SELECTION & STATUS INTEGRATION
  // =============================================================================

  static async selectTargetPrinter(branchId?: string, stationId?: string, preferredDeviceId?: string) {
    if (preferredDeviceId) {
      const printer = await prisma.hardwareDeviceRegistry.findFirst({
        where: {
          OR: [{ id: preferredDeviceId }, { deviceCode: preferredDeviceId }]
        },
        include: { station: true, driver: true }
      });
      if (printer) return printer;
    }

    // Query active printers in station/branch
    const printers = await prisma.hardwareDeviceRegistry.findMany({
      where: {
        category: 'BARCODE_PRINTER',
        isActive: true,
        ...(stationId ? { stationId } : {}),
        ...(branchId ? { branchId } : {})
      },
      include: { station: true, driver: true },
      orderBy: [{ isDefault: 'desc' }, { createdAt: 'desc' }]
    });

    if (printers.length === 0) {
      // Fallback to any printer in database
      const fallbackPrinter = await prisma.hardwareDeviceRegistry.findFirst({
        where: { category: 'BARCODE_PRINTER', isActive: true },
        include: { station: true, driver: true }
      });
      if (!fallbackPrinter) {
        throw new Error('No registered barcode printer found in system.');
      }
      return fallbackPrinter;
    }

    // Return default or first available printer
    const onlinePrinter = printers.find(p => p.status === 'ONLINE' || p.status === 'DEGRADED');
    return onlinePrinter || printers[0];
  }

  // =============================================================================
  // 2. PRINT QUEUE ENGINE & COMMAND DISPATCH
  // =============================================================================

  static async enqueuePrintJob(data: EnqueuePrintJobDTO) {
    const operatorName = data.requestedBy || 'SYSTEM';

    // 1. Resolve Piece & Barcode Output from Sprint 01 Engine
    let pieceBarcodeData: any = null;
    if (data.pieceIdOrSerial) {
      pieceBarcodeData = await BarcodeLabelService.generateBarcodeForPiece(
        data.pieceIdOrSerial,
        'CODE128',
        operatorName
      );
    }

    // 2. Resolve Template & Dimensions from Sprint 01 Engine
    let template: any = null;
    if (data.templateIdOrCode) {
      template = await BarcodeLabelService.getLabelTemplateById(data.templateIdOrCode);
    } else {
      const templates = await BarcodeLabelService.listLabelTemplates('JEWELRY_TAG');
      template = templates[0] || null;
    }

    // 3. Select Target Printer
    const printer = await this.selectTargetPrinter(data.branchId, data.stationId, data.printerDeviceId);

    // 4. Determine Command Language & Generate Command Stream
    const commandLang = data.commandLanguage || (printer.driver?.supportedCommands?.includes('EPL') ? 'EPL' : 'ZPL');
    const copies = data.copies || 1;

    const payload: LabelCommandPayload = {
      barcodeValue: pieceBarcodeData?.barcode?.code || 'SN-2026-000001',
      barcodeFormat: pieceBarcodeData?.barcode?.format || 'CODE128',
      svgRender: pieceBarcodeData?.barcode?.render?.svg,
      serialNo: pieceBarcodeData?.serialNo,
      sku: pieceBarcodeData?.sku,
      titleAr: pieceBarcodeData?.productNameAr,
      weightGrams: pieceBarcodeData?.weightGrams,
      silverPurity: pieceBarcodeData?.silverPurity,
      widthMm: template?.widthMm || 30,
      heightMm: template?.heightMm || 15,
      dpi: template?.dpi || 600,
      copies
    };

    let rawCommandStream = '';
    if (commandLang === 'ZPL') {
      rawCommandStream = ZPLGenerator.generate(payload);
    } else if (commandLang === 'EPL') {
      rawCommandStream = EPLGenerator.generate(payload);
    } else {
      rawCommandStream = PDFVectorGenerator.generate(payload);
    }

    // 5. Generate Unique Job Number
    const count = await prisma.printJobQueue.count();
    const jobNo = `JOB-${new Date().getFullYear()}-${String(count + 1).padStart(6, '0')}`;

    // 6. Create Print Job Record in QUEUED state
    const job = await prisma.printJobQueue.create({
      data: {
        jobNo,
        printerDeviceId: printer.id,
        printerDeviceCode: printer.deviceCode,
        templateId: template?.id,
        pieceId: pieceBarcodeData?.pieceId,
        serialNo: pieceBarcodeData?.serialNo,
        sku: pieceBarcodeData?.sku,
        commandLanguage: commandLang,
        rawCommandStream,
        copies,
        status: 'QUEUED',
        requestedBy: operatorName
      }
    });

    await prisma.printJobAuditLog.create({
      data: {
        printJobId: job.id,
        action: 'ENQUEUE',
        status: 'QUEUED',
        details: `Job queued for printer '${printer.name}' (${commandLang})`
      }
    });

    // 7. Process Job Dispatch
    return await this.dispatchJob(job.id, Boolean(data.forceFail));
  }

  static async dispatchJob(jobId: string, forceFail: boolean = false) {
    const job = await prisma.printJobQueue.findUnique({
      where: { id: jobId },
      include: { auditLogs: true }
    });
    if (!job) throw new Error(`Print job '${jobId}' not found`);

    const printer = await prisma.hardwareDeviceRegistry.findUnique({
      where: { id: job.printerDeviceId || '' }
    });

    // Evaluate Printer Readiness & Status
    const isPrinterReady = printer 
      ? (printer.status === 'ONLINE' || printer.status === 'DEGRADED')
      : true;

    if (forceFail || !isPrinterReady) {
      const errorMsg = forceFail 
        ? 'Simulated paper sensor error: PAPER_OUT' 
        : `Printer '${printer?.name || 'Unknown'}' is ${printer?.status || 'OFFLINE'}`;

      const failedJob = await prisma.printJobQueue.update({
        where: { id: job.id },
        data: {
          status: 'FAILED',
          errorMessage: errorMsg
        }
      });

      await prisma.printJobAuditLog.create({
        data: {
          printJobId: job.id,
          action: 'PRINT_FAILURE',
          status: 'FAILED',
          details: errorMsg
        }
      });

      return {
        success: false,
        message: `Print job failed: ${errorMsg}`,
        job: failedJob
      };
    }

    // Success dispatch
    const printedJob = await prisma.printJobQueue.update({
      where: { id: job.id },
      data: {
        status: 'PRINTED',
        printedAt: new Date(),
        errorMessage: null
      }
    });

    await prisma.printJobAuditLog.create({
      data: {
        printJobId: job.id,
        action: 'PRINT_SUCCESS',
        status: 'PRINTED',
        details: `Successfully printed ${job.copies} copy(ies) on printer '${printer?.name}'`
      }
    });

    return {
      success: true,
      message: `Print job executed successfully on '${printer?.name}'`,
      job: printedJob
    };
  }

  // =============================================================================
  // 3. PRINT RETRY ENGINE
  // =============================================================================

  static async retryFailedPrintJob(jobIdOrNo: string, operatorName: string = 'SYSTEM') {
    const job = await prisma.printJobQueue.findFirst({
      where: {
        OR: [{ id: jobIdOrNo }, { jobNo: jobIdOrNo }]
      }
    });

    if (!job) throw new Error(`Print job not found for '${jobIdOrNo}'`);

    if (job.status === 'PRINTED') {
      throw new Error(`Job '${job.jobNo}' has already been printed successfully.`);
    }

    if (job.retryCount >= job.maxRetries) {
      throw new Error(`Job '${job.jobNo}' has exceeded maximum retry attempts (${job.retryCount}/${job.maxRetries}).`);
    }

    const nextRetryCount = job.retryCount + 1;

    // Update status to RETRYING
    await prisma.printJobQueue.update({
      where: { id: job.id },
      data: {
        status: 'RETRYING',
        retryCount: nextRetryCount
      }
    });

    await prisma.printJobAuditLog.create({
      data: {
        printJobId: job.id,
        action: 'RETRY_ATTEMPT',
        status: 'RETRYING',
        details: `Retry attempt ${nextRetryCount}/${job.maxRetries} by operator '${operatorName}'`
      }
    });

    // Re-dispatch job
    return await this.dispatchJob(job.id, false);
  }

  // =============================================================================
  // 4. MULTI-PRINTER SIMULTANEOUS DISPATCH
  // =============================================================================

  static async enqueueMultiPrinterBatch(
    pieceIds: string[],
    printerDeviceIds?: string[],
    commandLanguage: 'ZPL' | 'EPL' | 'PDF_VECTOR' = 'ZPL',
    operatorName: string = 'SYSTEM'
  ) {
    const jobs = [];
    for (const pieceId of pieceIds) {
      if (printerDeviceIds && printerDeviceIds.length > 0) {
        for (const printerId of printerDeviceIds) {
          const jobRes = await this.enqueuePrintJob({
            pieceIdOrSerial: pieceId,
            printerDeviceId: printerId,
            commandLanguage,
            requestedBy: operatorName
          });
          jobs.push(jobRes);
        }
      } else {
        const jobRes = await this.enqueuePrintJob({
          pieceIdOrSerial: pieceId,
          commandLanguage,
          requestedBy: operatorName
        });
        jobs.push(jobRes);
      }
    }
    return {
      batchSize: jobs.length,
      jobs
    };
  }

  // =============================================================================
  // 5. PRINT JOB HISTORY & AUDIT QUERY
  // =============================================================================

  static async getJobById(jobIdOrNo: string) {
    const job = await prisma.printJobQueue.findFirst({
      where: {
        OR: [{ id: jobIdOrNo }, { jobNo: jobIdOrNo }]
      },
      include: {
        auditLogs: {
          orderBy: { timestamp: 'desc' }
        }
      }
    });
    if (!job) throw new Error(`Print job not found for '${jobIdOrNo}'`);
    return job;
  }

  static async listPrintQueue(filters?: {
    status?: string;
    printerDeviceId?: string;
    startDate?: string;
    endDate?: string;
  }) {
    const where: any = {};
    if (filters?.status) where.status = filters.status;
    if (filters?.printerDeviceId) where.printerDeviceId = filters.printerDeviceId;

    if (filters?.startDate || filters?.endDate) {
      where.queuedAt = {};
      if (filters.startDate) where.queuedAt.gte = new Date(filters.startDate);
      if (filters.endDate) where.queuedAt.lte = new Date(filters.endDate);
    }

    return await prisma.printJobQueue.findMany({
      where,
      include: {
        auditLogs: {
          orderBy: { timestamp: 'desc' },
          take: 5
        }
      },
      orderBy: { queuedAt: 'desc' }
    });
  }

  static async cancelPrintJob(jobIdOrNo: string, operatorName: string = 'SYSTEM') {
    const job = await this.getJobById(jobIdOrNo);
    if (job.status === 'PRINTED') {
      throw new Error(`Cannot cancel job '${job.jobNo}' which is already printed.`);
    }

    const cancelledJob = await prisma.printJobQueue.update({
      where: { id: job.id },
      data: { status: 'CANCELLED' }
    });

    await prisma.printJobAuditLog.create({
      data: {
        printJobId: job.id,
        action: 'CANCEL',
        status: 'CANCELLED',
        details: `Job cancelled by operator '${operatorName}'`
      }
    });

    return cancelledJob;
  }
}
