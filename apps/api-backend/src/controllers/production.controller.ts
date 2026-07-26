import { Request, Response } from 'express';
import { ProductionService } from '../services/production.service';

export class ProductionController {
  static async getWipOrders(req: Request, res: Response) {
    const data = await ProductionService.getWipOrders();
    res.json({ success: true, data });
  }

  static async getWorkerYield(req: Request, res: Response) {
    const data = await ProductionService.getWorkerYield();
    res.json({ success: true, data });
  }

  static async createOrder(req: Request, res: Response) {
    const data = await ProductionService.createOrder(req.body);
    res.status(201).json({ success: true, data });
  }
}
