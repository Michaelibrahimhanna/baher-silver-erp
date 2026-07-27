import { Request, Response } from 'express';
import { BOMService } from '../services/bom.service';

export class BOMController {
  static async getBOM(req: Request, res: Response) {
    try {
      const data = await BOMService.getBOMForProduct(req.params.id);
      res.json({ success: true, data });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  }

  static async upsertBOM(req: Request, res: Response) {
    try {
      const data = await BOMService.upsertBOM(req.params.id, req.body);
      res.json({ success: true, data });
    } catch (err: any) {
      res.status(400).json({ success: false, error: err.message });
    }
  }

  static async addLine(req: Request, res: Response) {
    try {
      const bom = await BOMService.getBOMForProduct(req.params.id);
      let bomId = bom?.id;
      if (!bomId) {
        const newBOM = await BOMService.upsertBOM(req.params.id, {});
        bomId = newBOM.id;
      }
      const data = await BOMService.addBOMLine(bomId, req.body);
      res.status(201).json({ success: true, data });
    } catch (err: any) {
      res.status(400).json({ success: false, error: err.message });
    }
  }

  static async removeLine(req: Request, res: Response) {
    try {
      const data = await BOMService.removeBOMLine(req.params.lineId);
      res.json({ success: true, data });
    } catch (err: any) {
      res.status(400).json({ success: false, error: err.message });
    }
  }
}
