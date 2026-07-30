import { Request, Response } from 'express';
import { LabelPrintingService } from '../services/label_printing.service';

export class LabelPrintingController {
  // =============================================================================
  // PRINT QUEUE & JOB DISPATCH
  // =============================================================================

  static async enqueuePrintJob(req: Request, res: Response) {
    try {
      const result = await LabelPrintingService.enqueuePrintJob(req.body);
      return res.status(201).json({
        success: result.success,
        message: result.message,
        data: result
      });
    } catch (err: any) {
      return res.status(400).json({ success: false, error: err.message });
    }
  }

  static async enqueueMultiPrinterBatch(req: Request, res: Response) {
    try {
      const { pieceIds, printerDeviceIds, commandLanguage } = req.body;
      const result = await LabelPrintingService.enqueueMultiPrinterBatch(
        pieceIds,
        printerDeviceIds,
        commandLanguage
      );
      return res.status(201).json({
        success: true,
        message: `Enqueued batch of ${result.batchSize} print jobs`,
        data: result
      });
    } catch (err: any) {
      return res.status(400).json({ success: false, error: err.message });
    }
  }

  static async listPrintQueue(req: Request, res: Response) {
    try {
      const { status, printerDeviceId, startDate, endDate } = req.query;
      const queue = await LabelPrintingService.listPrintQueue({
        status: status as string,
        printerDeviceId: printerDeviceId as string,
        startDate: startDate as string,
        endDate: endDate as string
      });
      return res.json({
        success: true,
        count: queue.length,
        data: queue
      });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err.message });
    }
  }

  static async getJobById(req: Request, res: Response) {
    try {
      const job = await LabelPrintingService.getJobById(req.params.id);
      return res.json({ success: true, data: job });
    } catch (err: any) {
      return res.status(404).json({ success: false, error: err.message });
    }
  }

  static async retryFailedPrintJob(req: Request, res: Response) {
    try {
      const result = await LabelPrintingService.retryFailedPrintJob(req.params.id);
      return res.json({
        success: result.success,
        message: result.message,
        data: result
      });
    } catch (err: any) {
      return res.status(400).json({ success: false, error: err.message });
    }
  }

  static async cancelPrintJob(req: Request, res: Response) {
    try {
      const job = await LabelPrintingService.cancelPrintJob(req.params.id);
      return res.json({
        success: true,
        message: `Print job '${job.jobNo}' cancelled successfully`,
        data: job
      });
    } catch (err: any) {
      return res.status(400).json({ success: false, error: err.message });
    }
  }

  // =============================================================================
  // PRINTER SELECTION & STATUS INTEGRATION
  // =============================================================================

  static async selectTargetPrinter(req: Request, res: Response) {
    try {
      const { branchId, stationId, preferredDeviceId } = req.query;
      const printer = await LabelPrintingService.selectTargetPrinter(
        branchId as string,
        stationId as string,
        preferredDeviceId as string
      );
      return res.json({
        success: true,
        data: printer
      });
    } catch (err: any) {
      return res.status(400).json({ success: false, error: err.message });
    }
  }
}
