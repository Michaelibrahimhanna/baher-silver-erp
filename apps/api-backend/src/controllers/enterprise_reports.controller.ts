import { Request, Response } from 'express';
import { EnterpriseReportsService } from '../services/enterprise_reports.service';

export class EnterpriseReportsController {
  /**
   * GET /api/v1/reports/manufacturing
   */
  static async getManufacturingReport(req: Request, res: Response) {
    try {
      const report = await EnterpriseReportsService.getManufacturingReport({
        companyId: req.query.companyId as string,
        customerId: req.query.customerId as string,
        limit: req.query.limit ? parseInt(req.query.limit as string) : 100
      });
      return res.json({ success: true, data: report });
    } catch (err: any) {
      return res.status(400).json({ success: false, error: err.message });
    }
  }

  /**
   * GET /api/v1/reports/warranty
   */
  static async getWarrantyReport(req: Request, res: Response) {
    try {
      const report = await EnterpriseReportsService.getWarrantyReport({
        companyId: req.query.companyId as string,
        customerId: req.query.customerId as string,
        limit: req.query.limit ? parseInt(req.query.limit as string) : 100
      });
      return res.json({ success: true, data: report });
    } catch (err: any) {
      return res.status(400).json({ success: false, error: err.message });
    }
  }

  /**
   * GET /api/v1/reports/service
   */
  static async getServiceReport(req: Request, res: Response) {
    try {
      const report = await EnterpriseReportsService.getServiceReport({
        companyId: req.query.companyId as string,
        customerId: req.query.customerId as string,
        limit: req.query.limit ? parseInt(req.query.limit as string) : 100
      });
      return res.json({ success: true, data: report });
    } catch (err: any) {
      return res.status(400).json({ success: false, error: err.message });
    }
  }

  /**
   * GET /api/v1/reports/activity
   */
  static async getActivityReport(req: Request, res: Response) {
    try {
      const report = await EnterpriseReportsService.getCustomerActivityReport({
        companyId: req.query.companyId as string,
        customerId: req.query.customerId as string,
        limit: req.query.limit ? parseInt(req.query.limit as string) : 100
      });
      return res.json({ success: true, data: report });
    } catch (err: any) {
      return res.status(400).json({ success: false, error: err.message });
    }
  }

  /**
   * POST /api/v1/reports/export
   * Export Report to PDF / CSV / JSON
   */
  static async exportReport(req: Request, res: Response) {
    try {
      const result = await EnterpriseReportsService.exportReport(req.body);
      return res.status(201).json({
        success: true,
        message: `Report exported in ${result.format} format successfully.`,
        data: result
      });
    } catch (err: any) {
      return res.status(400).json({ success: false, error: err.message });
    }
  }

  /**
   * POST /api/v1/reports/schedules
   */
  static async createSchedule(req: Request, res: Response) {
    try {
      const schedule = await EnterpriseReportsService.createScheduledReport(req.body);
      return res.status(201).json({
        success: true,
        message: 'Scheduled report configured successfully.',
        data: schedule
      });
    } catch (err: any) {
      return res.status(400).json({ success: false, error: err.message });
    }
  }

  /**
   * GET /api/v1/reports/schedules
   */
  static async listSchedules(req: Request, res: Response) {
    try {
      const schedules = await EnterpriseReportsService.listScheduledReports(
        req.query.companyId as string,
        req.query.customerId as string
      );
      return res.json({ success: true, data: schedules });
    } catch (err: any) {
      return res.status(400).json({ success: false, error: err.message });
    }
  }
}
