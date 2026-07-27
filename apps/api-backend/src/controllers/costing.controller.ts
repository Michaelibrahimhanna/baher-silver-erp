import { Request, Response } from 'express';
import { CostingService } from '../services/costing.service';

export class CostingController {
  static async getCost(req: Request, res: Response) {
    try {
      const data = await CostingService.getCostForProduct(req.params.id);
      res.json({ success: true, data });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  }

  static async calculateCost(req: Request, res: Response) {
    try {
      const { sellingPrice } = req.body || {};
      const data = await CostingService.calculateCost(req.params.id, sellingPrice ? parseFloat(sellingPrice) : undefined);
      res.json({ success: true, data });
    } catch (err: any) {
      res.status(400).json({ success: false, error: err.message });
    }
  }
}
