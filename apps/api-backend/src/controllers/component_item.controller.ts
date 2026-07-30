import { Request, Response } from 'express';
import { ComponentItemService } from '../services/component_item.service';

export class ComponentItemController {
  static async listComponentItems(req: Request, res: Response) {
    try {
      const filters = {
        warehouseId: req.query.warehouseId as string,
        category: req.query.category as string
      };
      const data = await ComponentItemService.listComponentItems(filters);
      res.json({ success: true, count: data.length, data });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  }

  static async createComponentItem(req: Request, res: Response) {
    try {
      const data = await ComponentItemService.createComponentItem(req.body);
      res.status(201).json({ success: true, data });
    } catch (err: any) {
      res.status(400).json({ success: false, error: err.message });
    }
  }
}
