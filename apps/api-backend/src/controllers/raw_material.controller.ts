import { Request, Response } from 'express';
import { RawMaterialService } from '../services/raw_material.service';

export class RawMaterialController {
  static async listRawMaterials(req: Request, res: Response) {
    try {
      const category = req.query.category as string;
      const data = await RawMaterialService.listRawMaterials(category);
      res.json({ success: true, count: data.length, data });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  }

  static async createRawMaterial(req: Request, res: Response) {
    try {
      const data = await RawMaterialService.createRawMaterial(req.body);
      res.status(201).json({ success: true, data });
    } catch (err: any) {
      res.status(400).json({ success: false, error: err.message });
    }
  }
}
