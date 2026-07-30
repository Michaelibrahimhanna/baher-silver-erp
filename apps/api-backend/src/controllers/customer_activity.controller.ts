import { Request, Response } from 'express';
import { CustomerActivityService } from '../services/customer_activity.service';

export class CustomerActivityController {
  /**
   * GET /api/v1/customer/activity/logs
   * Get Full Customer Activity History
   */
  static async getActivityLogs(req: Request, res: Response) {
    try {
      const customerId = (req as any).customerId || (req.query.customerId as string);
      if (!customerId) return res.status(400).json({ success: false, error: 'customerId required.' });

      const activityType = req.query.activityType as string;
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 50;

      const logs = await CustomerActivityService.getActivityHistory(customerId, activityType, limit);
      return res.json({
        success: true,
        data: logs
      });
    } catch (err: any) {
      return res.status(400).json({ success: false, error: err.message });
    }
  }

  /**
   * GET /api/v1/customer/activity/passports
   * Get Passport Access History & Share Link Views
   */
  static async getPassportAccessHistory(req: Request, res: Response) {
    try {
      const customerId = (req as any).customerId || (req.query.customerId as string);
      if (!customerId) return res.status(400).json({ success: false, error: 'customerId required.' });

      const history = await CustomerActivityService.getPassportAccessHistory(customerId);
      return res.json({
        success: true,
        data: history
      });
    } catch (err: any) {
      return res.status(400).json({ success: false, error: err.message });
    }
  }

  /**
   * GET /api/v1/customer/activity/scans
   * Get QR Scan History & Anti-Counterfeit Verification Log
   */
  static async getQrScanHistory(req: Request, res: Response) {
    try {
      const customerId = (req as any).customerId || (req.query.customerId as string);
      if (!customerId) return res.status(400).json({ success: false, error: 'customerId required.' });

      const history = await CustomerActivityService.getQrScanHistory(customerId);
      return res.json({
        success: true,
        data: history
      });
    } catch (err: any) {
      return res.status(400).json({ success: false, error: err.message });
    }
  }

  /**
   * GET /api/v1/customer/activity/downloads
   * Get File Download History (CADs, Certificates, Passport PDFs)
   */
  static async getFileDownloadHistory(req: Request, res: Response) {
    try {
      const customerId = (req as any).customerId || (req.query.customerId as string);
      if (!customerId) return res.status(400).json({ success: false, error: 'customerId required.' });

      const history = await CustomerActivityService.getFileDownloadHistory(customerId);
      return res.json({
        success: true,
        data: history
      });
    } catch (err: any) {
      return res.status(400).json({ success: false, error: err.message });
    }
  }

  /**
   * GET /api/v1/customer/activity/timeline
   * Get Unified 360° Customer Timeline
   */
  static async getCustomerTimeline(req: Request, res: Response) {
    try {
      const customerId = (req as any).customerId || (req.query.customerId as string);
      if (!customerId) return res.status(400).json({ success: false, error: 'customerId required.' });

      const timeline = await CustomerActivityService.get360CustomerTimeline(customerId, {
        category: req.query.category as any,
        pieceSerial: req.query.pieceSerial as string,
        limit: req.query.limit ? parseInt(req.query.limit as string) : 100
      });

      return res.json({
        success: true,
        data: timeline
      });
    } catch (err: any) {
      return res.status(400).json({ success: false, error: err.message });
    }
  }
}
