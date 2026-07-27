import { Request, Response } from 'express';
import { VariantService } from '../services/variant.service';

export class VariantController {
  static async listVariants(req: Request, res: Response) {
    try {
      const data = await VariantService.getVariantsForProduct(req.params.id);
      res.json({ success: true, count: data.length, data });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  }

  static async createVariant(req: Request, res: Response) {
    try {
      const data = await VariantService.createVariant(req.params.id, req.body);
      res.status(201).json({ success: true, data });
    } catch (err: any) {
      res.status(400).json({ success: false, error: err.message });
    }
  }

  static async updateVariant(req: Request, res: Response) {
    try {
      const data = await VariantService.updateVariant(req.params.vid, req.body);
      res.json({ success: true, data });
    } catch (err: any) {
      res.status(400).json({ success: false, error: err.message });
    }
  }

  static async deleteVariant(req: Request, res: Response) {
    try {
      const data = await VariantService.deleteVariant(req.params.vid);
      res.json({ success: true, data });
    } catch (err: any) {
      res.status(400).json({ success: false, error: err.message });
    }
  }
}
