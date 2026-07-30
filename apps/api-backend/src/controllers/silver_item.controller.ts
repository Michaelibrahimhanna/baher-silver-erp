import { Request, Response } from 'express';
import { SilverItemService } from '../services/silver_item.service';

export class SilverItemController {
  static async listSilverItems(req: Request, res: Response) {
    try {
      const filters = {
        warehouseId: req.query.warehouseId as string,
        silverCategory: req.query.silverCategory as string
      };
      const data = await SilverItemService.listSilverItems(filters);
      res.json({ success: true, count: data.length, data });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  }

  static async getSilverItemById(req: Request, res: Response) {
    try {
      const data = await SilverItemService.getSilverItemById(req.params.id);
      if (!data) return res.status(404).json({ success: false, error: 'Silver item not found' });
      res.json({ success: true, data });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  }

  static async createSilverItem(req: Request, res: Response) {
    try {
      const data = await SilverItemService.createSilverItem(req.body);
      res.status(201).json({ success: true, data });
    } catch (err: any) {
      res.status(400).json({ success: false, error: err.message });
    }
  }
}
