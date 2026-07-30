import { Request, Response } from 'express';
import { SystemHealthService } from '../services/system_health.service';

export class SystemHealthController {
  /**
   * GET /api/v1/system/health/summary
   * Get Real-Time System Health Summary & Device Status
   */
  static async getHealthSummary(req: Request, res: Response) {
    try {
      const summary = await SystemHealthService.getSystemHealthSummary();
      return res.json({
        success: true,
        data: summary
      });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err.message });
    }
  }
}
