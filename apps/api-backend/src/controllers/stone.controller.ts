import { Request, Response } from 'express';
import { StoneService } from '../services/stone.service';

export class StoneController {
  static async listStones(req: Request, res: Response) {
    try {
      const filters = {
        search: req.query.search as string,
        category: req.query.category as string,
        warehouseId: req.query.warehouseId as string,
        color: req.query.color as string,
        shape: req.query.shape as string
      };
      const data = await StoneService.listStones(filters);
      res.json({ success: true, count: data.length, data });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  }

  static async getStoneById(req: Request, res: Response) {
    try {
      const data = await StoneService.getStoneById(req.params.id);
      if (!data) return res.status(404).json({ success: false, error: 'Stone not found' });
      res.json({ success: true, data });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  }

  static async createStone(req: Request, res: Response) {
    try {
      const data = await StoneService.createStone(req.body);
      res.status(201).json({ success: true, data });
    } catch (err: any) {
      res.status(400).json({ success: false, error: err.message });
    }
  }
}
