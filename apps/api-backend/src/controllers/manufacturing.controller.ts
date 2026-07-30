import { Request, Response } from 'express';
import { ManufacturingService } from '../services/manufacturing.service';

export class ManufacturingController {
  /**
   * POST /api/v1/production/orders
   * Create new Manufacturing Order (MO)
   */
  static async createMO(req: Request, res: Response) {
    try {
      const mo = await ManufacturingService.createManufacturingOrder(req.body);
      return res.status(201).json({
        success: true,
        message: `Manufacturing Order ${mo.moCode} created successfully`,
        data: mo
      });
    } catch (err: any) {
      return res.status(400).json({ success: false, error: err.message });
    }
  }

  /**
   * GET /api/v1/production/orders
   * List Manufacturing Orders
   */
  static async listMOs(req: Request, res: Response) {
    try {
      const { status } = req.query;
      const mos = await ManufacturingService.listManufacturingOrders({ status: status as string });
      return res.json({
        success: true,
        count: mos.length,
        data: mos
      });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err.message });
    }
  }

  /**
   * GET /api/v1/production/orders/:idOrCode
   * Get MO details with reservations and operation logs
   */
  static async getMO(req: Request, res: Response) {
    try {
      const { idOrCode } = req.params;
      const details = await ManufacturingService.getMoDetails(idOrCode);
      return res.json({
        success: true,
        data: details
      });
    } catch (err: any) {
      return res.status(404).json({ success: false, error: err.message });
    }
  }

  /**
   * POST /api/v1/production/orders/:id/status
   * Transition MO workflow status (PLANNED -> CONFIRMED -> IN_PROGRESS -> COMPLETED)
   */
  static async transitionStatus(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { targetStatus } = req.body;
      const operatorName = (req as any).user?.username || 'SYSTEM';

      const updated = await ManufacturingService.transitionMoStatus(id, targetStatus, operatorName);
      return res.json({
        success: true,
        message: `MO status transitioned to ${targetStatus}`,
        data: updated
      });
    } catch (err: any) {
      return res.status(400).json({ success: false, error: err.message });
    }
  }

  /**
   * POST /api/v1/production/orders/:id/reserve
   * Trigger material reservation from BOM lines
   */
  static async reserveMaterials(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const reservations = await ManufacturingService.reserveMaterialsForMo(id);
      return res.json({
        success: true,
        message: `${reservations.length} material lines reserved for MO`,
        data: reservations
      });
    } catch (err: any) {
      return res.status(400).json({ success: false, error: err.message });
    }
  }

  /**
   * POST /api/v1/production/orders/:id/operations
   * Record work center operation log & scrap reason classification
   */
  static async recordOperation(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const opLog = await ManufacturingService.recordOperationLog(id, req.body);
      return res.status(201).json({
        success: true,
        message: `Operation log recorded for stage ${opLog.stage}`,
        data: opLog
      });
    } catch (err: any) {
      return res.status(400).json({ success: false, error: err.message });
    }
  }

  /**
   * POST /api/v1/production/orders/:id/complete
   * Complete MO and auto-generate Piece Identities (EPIC 02), Barcode Tags (EPIC 03) & Passports (EPIC 04)
   */
  static async completeMO(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const operatorName = (req as any).user?.username || 'SYSTEM';

      const result = await ManufacturingService.completeMoAndGenerateIdentities(id, operatorName);
      return res.json({
        success: true,
        message: `MO completed! Produced ${result.producedPiecesCount} physical pieces and generated DPP drafts.`,
        data: result
      });
    } catch (err: any) {
      return res.status(400).json({ success: false, error: err.message });
    }
  }

  /**
   * GET /api/v1/production/work-centers
   * List work centers
   */
  static async listWorkCenters(req: Request, res: Response) {
    try {
      const list = await ManufacturingService.listWorkCenters();
      return res.json({
        success: true,
        data: list
      });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err.message });
    }
  }

  /**
   * POST /api/v1/production/work-centers
   * Create work center
   */
  static async createWorkCenter(req: Request, res: Response) {
    try {
      const wc = await ManufacturingService.createWorkCenter(req.body);
      return res.status(201).json({
        success: true,
        message: `Work Center ${wc.code} created successfully`,
        data: wc
      });
    } catch (err: any) {
      return res.status(400).json({ success: false, error: err.message });
    }
  }
}
