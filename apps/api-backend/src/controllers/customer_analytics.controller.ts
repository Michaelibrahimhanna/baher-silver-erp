import { Request, Response } from 'express';
import { CustomerAnalyticsService } from '../services/customer_analytics.service';

export class CustomerAnalyticsController {
  /**
   * GET /api/v1/analytics/dashboards/executive
   * Get Executive KPIs (Customer, Manufacturing, Service, Warranty)
   */
  static async getExecutiveKpis(req: Request, res: Response) {
    try {
      const companyId = (req.query.companyId as string) || 'default-company';
      const customerId = (req as any).customerId || (req.query.customerId as string);

      const kpis = await CustomerAnalyticsService.getExecutiveKpis(companyId, customerId);
      return res.json({
        success: true,
        data: kpis
      });
    } catch (err: any) {
      return res.status(400).json({ success: false, error: err.message });
    }
  }

  /**
   * GET /api/v1/analytics/customer
   * Get Customer Portal Usage & Satisfaction Trends
   */
  static async getCustomerAnalytics(req: Request, res: Response) {
    try {
      const customerId = (req as any).customerId || (req.query.customerId as string);
      const analytics = await CustomerAnalyticsService.getCustomerPortalAnalytics(customerId);

      return res.json({
        success: true,
        data: analytics
      });
    } catch (err: any) {
      return res.status(400).json({ success: false, error: err.message });
    }
  }
}
