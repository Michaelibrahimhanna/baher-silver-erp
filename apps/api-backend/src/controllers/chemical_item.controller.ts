import { Request, Response } from 'express';
import { ChemicalItemService } from '../services/chemical_item.service';

export class ChemicalItemController {
  static async listChemicalItems(req: Request, res: Response) {
    try {
      const filters = {
        warehouseId: req.query.warehouseId as string,
        category: req.query.category as string
      };
      const data = await ChemicalItemService.listChemicalItems(filters);
      res.json({ success: true, count: data.length, data });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  }

  static async createChemicalItem(req: Request, res: Response) {
    try {
      const data = await ChemicalItemService.createChemicalItem(req.body);
      res.status(201).json({ success: true, data });
    } catch (err: any) {
      res.status(400).json({ success: false, error: err.message });
    }
  }
}
