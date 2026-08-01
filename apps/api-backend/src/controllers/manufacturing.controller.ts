import { Request, Response } from 'express';
import { ManufacturingEngineService } from '../services/manufacturing_engine.service';
import { ManufacturingEventsService } from '../services/manufacturing_events.service';

export class ManufacturingController {
  // Work Centers
  static async getWorkCenters(req: Request, res: Response) {
    try {
      const workCenters = await ManufacturingEngineService.initializeWorkCenters();
      res.json({ success: true, data: workCenters });
    } catch (e: any) {
      res.status(500).json({ success: false, error: e.message });
    }
  }

  // BOM Management
  static async upsertBOM(req: Request, res: Response) {
    try {
      const bom = await ManufacturingEngineService.upsertBOM(req.body);
      res.json({ success: true, data: bom });
    } catch (e: any) {
      res.status(400).json({ success: false, error: e.message });
    }
  }

  // Manufacturing Orders (MO)
  static async createMO(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.id || 'SYSTEM';
      const mo = await ManufacturingEngineService.createManufacturingOrder({ ...req.body, actorId: userId });
      res.json({ success: true, data: mo });
    } catch (e: any) {
      res.status(400).json({ success: false, error: e.message });
    }
  }

  static async updateMOState(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.id || 'SYSTEM';
      const { id } = req.params;
      const { action, notes } = req.body;
      const updated = await ManufacturingEngineService.updateMOState(id, action, userId, notes);
      res.json({ success: true, data: updated });
    } catch (e: any) {
      res.status(400).json({ success: false, error: e.message });
    }
  }

  // Material Reservations & Consumption
  static async getReservations(req: Request, res: Response) {
    try {
      const { moId } = req.params;
      const reservations = await ManufacturingEngineService.reserveMaterialsForMO(moId);
      res.json({ success: true, data: reservations });
    } catch (e: any) {
      res.status(500).json({ success: false, error: e.message });
    }
  }

  static async recordConsumption(req: Request, res: Response) {
    try {
      const { moId } = req.params;
      const { consumedLines } = req.body;
      const updated = await ManufacturingEngineService.recordMaterialConsumption(moId, consumedLines);
      res.json({ success: true, data: updated });
    } catch (e: any) {
      res.status(400).json({ success: false, error: e.message });
    }
  }

  // Production Returns
  static async recordReturn(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.id;
      const record = await ManufacturingEngineService.recordMaterialReturn({ ...req.body, returnedByUserId: userId });
      res.json({ success: true, data: record });
    } catch (e: any) {
      res.status(400).json({ success: false, error: e.message });
    }
  }

  // Scrap Management
  static async recordScrap(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.id;
      const scrap = await ManufacturingEngineService.recordScrapEntry({ ...req.body, recordedByUserId: userId });
      res.json({ success: true, data: scrap });
    } catch (e: any) {
      res.status(400).json({ success: false, error: e.message });
    }
  }

  // Finished Goods Receipt
  static async receiveFinishedGoods(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.id;
      const receipt = await ManufacturingEngineService.receiveFinishedGoods({ ...req.body, receivedByUserId: userId });
      res.json({ success: true, data: receipt });
    } catch (e: any) {
      res.status(400).json({ success: false, error: e.message });
    }
  }

  // Production Cost Rollup
  static async getCostRollup(req: Request, res: Response) {
    try {
      const { moId } = req.params;
      const rollup = await ManufacturingEngineService.calculateProductionCostRollup(moId);
      res.json({ success: true, data: rollup });
    } catch (e: any) {
      res.status(500).json({ success: false, error: e.message });
    }
  }

  // Manufacturing Dashboard KPIs
  static async getDashboardKPIs(req: Request, res: Response) {
    try {
      const kpis = await ManufacturingEngineService.getManufacturingDashboardKPIs();
      res.json({ success: true, data: kpis });
    } catch (e: any) {
      res.status(500).json({ success: false, error: e.message });
    }
  }

  // Manufacturing Events Log
  static async getEventLogs(req: Request, res: Response) {
    try {
      const logs = await ManufacturingEventsService.getRecentEvents(100);
      res.json({ success: true, data: logs });
    } catch (e: any) {
      res.status(500).json({ success: false, error: e.message });
    }
  }

  // Digital Product Genealogy
  static async getGenealogy(req: Request, res: Response) {
    try {
      const { moId } = req.params;
      const genealogy = await ManufacturingEngineService.generateProductGenealogy(moId);
      res.json({ success: true, data: genealogy });
    } catch (e: any) {
      res.status(500).json({ success: false, error: e.message });
    }
  }

  // Digital Product Passport
  static async getPassport(req: Request, res: Response) {
    try {
      const { moId } = req.params;
      const passport = await ManufacturingEngineService.generateProductPassport(moId);
      res.json({ success: true, data: passport });
    } catch (e: any) {
      res.status(500).json({ success: false, error: e.message });
    }
  }

  // Work Center Calendar
  static async getCalendar(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const calendar = await ManufacturingEngineService.getWorkCenterCalendar(id);
      res.json({ success: true, data: calendar });
    } catch (e: any) {
      res.status(500).json({ success: false, error: e.message });
    }
  }

  // Production Scheduler Recommendation
  static async getScheduleRecommendation(req: Request, res: Response) {
    try {
      const schedule = await ManufacturingEngineService.recommendProductionSchedule();
      res.json({ success: true, data: schedule });
    } catch (e: any) {
      res.status(500).json({ success: false, error: e.message });
    }
  }
}
