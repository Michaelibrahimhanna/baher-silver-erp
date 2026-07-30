import { Request, Response } from 'express';
import { ProductionSchedulingService } from '../services/production_scheduling.service';

export class ProductionSchedulingController {
  /**
   * POST /api/v1/production/scheduling/schedule
   * Run finite capacity production scheduling & operation dependency enforcement
   */
  static async scheduleMO(req: Request, res: Response) {
    try {
      const result = await ProductionSchedulingService.scheduleManufacturingOrder(req.body);
      return res.json({
        success: true,
        message: `Manufacturing Order ${result.mo.moCode} scheduled successfully`,
        data: result
      });
    } catch (err: any) {
      return res.status(400).json({ success: false, error: err.message });
    }
  }

  /**
   * GET /api/v1/production/scheduling/capacity
   * Get work center capacity planning & OEE metrics
   */
  static async getCapacityPlanning(req: Request, res: Response) {
    try {
      const summary = await ProductionSchedulingService.getCapacityPlanningSummary();
      return res.json({
        success: true,
        data: summary
      });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err.message });
    }
  }

  /**
   * POST /api/v1/production/scheduling/labor
   * Assign artisan/operator labor & shift tracking
   */
  static async assignLabor(req: Request, res: Response) {
    try {
      const assignment = await ProductionSchedulingService.assignLabor(req.body);
      return res.status(201).json({
        success: true,
        message: `Operator ${assignment.operatorName} assigned to MO`,
        data: assignment
      });
    } catch (err: any) {
      return res.status(400).json({ success: false, error: err.message });
    }
  }

  /**
   * GET /api/v1/production/wip/summary
   * Get real-time WIP tracking & aging metrics
   */
  static async getWipSummary(req: Request, res: Response) {
    try {
      const wip = await ProductionSchedulingService.getWipTrackingSummary();
      return res.json({
        success: true,
        data: wip
      });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err.message });
    }
  }

  /**
   * POST /api/v1/production/orders/:id/partial-release
   * Release partial sub-lot batch from active MO
   */
  static async releasePartialLot(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { partialQuantity } = req.body;
      const operatorName = (req as any).user?.username || 'SYSTEM';

      const result = await ProductionSchedulingService.releasePartialLot(id, parseInt(partialQuantity, 10), operatorName);
      return res.json({
        success: true,
        message: `Partial sub-lot of ${result.partialLotsReleasedCount} units released successfully`,
        data: result
      });
    } catch (err: any) {
      return res.status(400).json({ success: false, error: err.message });
    }
  }

  /**
   * POST /api/v1/production/rework
   * Trigger rework workflow for defective/repaired pieces
   */
  static async triggerRework(req: Request, res: Response) {
    try {
      const rework = await ProductionSchedulingService.triggerRework(req.body);
      return res.status(201).json({
        success: true,
        message: `Rework order logged for ${rework.quantityReworked} units (${rework.reworkStage})`,
        data: rework
      });
    } catch (err: any) {
      return res.status(400).json({ success: false, error: err.message });
    }
  }

  /**
   * GET /api/v1/production/dashboard/summary
   * Production Shop Floor Control Dashboard metrics
   */
  static async getDashboardMetrics(req: Request, res: Response) {
    try {
      const metrics = await ProductionSchedulingService.getProductionDashboardMetrics();
      return res.json({
        success: true,
        data: metrics
      });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err.message });
    }
  }
}
