import { Request, Response } from 'express';
import { StoneController } from './stone.controller';

export class InventoryController {
  static async getActiveInventorySummary(req: Request, res: Response) {
    return StoneController.listStones(req, res);
  }

  static async createGemstone(req: Request, res: Response) {
    return StoneController.createStone(req, res);
  }

  static async getSilverStock(req: Request, res: Response) {
    return res.json({ success: true, data: [] });
  }

  static async createSilverBatch(req: Request, res: Response) {
    return res.json({ success: true, data: {} });
  }
}
