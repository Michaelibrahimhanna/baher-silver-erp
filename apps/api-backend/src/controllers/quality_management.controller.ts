import { Request, Response } from 'express';
import { QualityManagementService } from '../services/quality_management.service';

export class QualityManagementController {
  /**
   * POST /api/v1/production/quality/inspections
   * Record quality inspection & electronic signature sign-off
   */
  static async recordInspection(req: Request, res: Response) {
    try {
      const inspection = await QualityManagementService.recordQualityInspection(req.body);
      return res.status(201).json({
        success: true,
        message: `Quality inspection recorded: ${inspection.status}`,
        data: inspection
      });
    } catch (err: any) {
      return res.status(400).json({ success: false, error: err.message });
    }
  }

  /**
   * POST /api/v1/production/quality/ncr
   * Create Non-Conformance Report (NCR) & trigger CAPA if major
   */
  static async createNCR(req: Request, res: Response) {
    try {
      const ncr = await QualityManagementService.createNCR(req.body);
      return res.status(201).json({
        success: true,
        message: `NCR ${ncr.ncrCode} logged successfully`,
        data: ncr
      });
    } catch (err: any) {
      return res.status(400).json({ success: false, error: err.message });
    }
  }

  /**
   * POST /api/v1/production/quality/ncr/:id/resolve
   * Resolve NCR with disposition action & corrective actions
   */
  static async resolveNCR(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const resolved = await QualityManagementService.resolveNCR(id, req.body);
      return res.json({
        success: true,
        message: `NCR ${resolved.ncrCode} resolved`,
        data: resolved
      });
    } catch (err: any) {
      return res.status(400).json({ success: false, error: err.message });
    }
  }

  /**
   * GET /api/v1/production/quality/spc/metrics
   * Get Statistical Process Control (SPC) & FPY metrics
   */
  static async getSpcMetrics(req: Request, res: Response) {
    try {
      const spc = await QualityManagementService.getSpcMetrics();
      return res.json({
        success: true,
        data: spc
      });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err.message });
    }
  }

  /**
   * GET /api/v1/production/quality/genealogy/:serialOrMo
   * Get 360° End-to-End Digital Genealogy Tree Traceability
   */
  static async getGenealogy(req: Request, res: Response) {
    try {
      const { serialOrMo } = req.params;
      const genealogy = await QualityManagementService.getEndToEndGenealogy(serialOrMo);
      return res.json({
        success: true,
        data: genealogy
      });
    } catch (err: any) {
      return res.status(404).json({ success: false, error: err.message });
    }
  }

  /**
   * GET /api/v1/production/quality/work-instructions
   * List Digital Work Instructions
   */
  static async listWorkInstructions(req: Request, res: Response) {
    try {
      const { stage } = req.query;
      const list = await QualityManagementService.listWorkInstructions(stage as string);
      return res.json({
        success: true,
        data: list
      });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err.message });
    }
  }

  /**
   * POST /api/v1/production/quality/work-instructions
   * Create Digital Work Instruction
   */
  static async createWorkInstruction(req: Request, res: Response) {
    try {
      const wi = await QualityManagementService.createWorkInstruction(req.body);
      return res.status(201).json({
        success: true,
        message: 'Digital work instruction created',
        data: wi
      });
    } catch (err: any) {
      return res.status(400).json({ success: false, error: err.message });
    }
  }

  /**
   * GET /api/v1/production/quality/dashboard/summary
   * Get Quality Dashboard metrics & active escalation alerts
   */
  static async getDashboardMetrics(req: Request, res: Response) {
    try {
      const dashboard = await QualityManagementService.getQualityDashboardMetrics();
      return res.json({
        success: true,
        data: dashboard
      });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err.message });
    }
  }
}
