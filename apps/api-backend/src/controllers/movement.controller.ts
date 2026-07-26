import { Request, Response } from 'express';
import { MovementService } from '../services/movement.service';

export class MovementController {
  static async listMovements(req: Request, res: Response) {
    try {
      const filters = {
        itemId: req.query.itemId as string,
        itemCode: req.query.itemCode as string,
        txType: req.query.txType as string
      };
      const data = await MovementService.listMovements(filters);
      res.json({ success: true, count: data.length, data });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  }

  static async recordMovement(req: Request, res: Response) {
    try {
      const data = await MovementService.recordMovement(req.body);
      res.status(201).json({ success: true, data });
    } catch (err: any) {
      res.status(400).json({ success: false, error: err.message });
    }
  }
}
