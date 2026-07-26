import { Request, Response } from 'express';
import { PricingService } from '../services/pricing.service';

export class PricingController {
  static async getPricesForItem(req: Request, res: Response) {
    try {
      const data = await PricingService.getPricesForItem(req.params.itemId);
      res.json({ success: true, data });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  }

  static async setPriceProfile(req: Request, res: Response) {
    try {
      const data = await PricingService.setPriceProfile(req.body);
      res.status(201).json({ success: true, data });
    } catch (err: any) {
      res.status(400).json({ success: false, error: err.message });
    }
  }
}
