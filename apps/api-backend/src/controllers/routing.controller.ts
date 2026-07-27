import { Request, Response } from 'express';
import { RoutingService } from '../services/routing.service';

export class RoutingController {
  static async getRouting(req: Request, res: Response) {
    try {
      const data = await RoutingService.getRoutingForProduct(req.params.id);
      res.json({ success: true, data });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  }

  static async upsertRouting(req: Request, res: Response) {
    try {
      const data = await RoutingService.upsertRouting(req.params.id, req.body);
      res.json({ success: true, data });
    } catch (err: any) {
      res.status(400).json({ success: false, error: err.message });
    }
  }
}
