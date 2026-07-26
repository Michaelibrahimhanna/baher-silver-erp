import { Request, Response } from 'express';
import { SupplierService } from '../services/supplier.service';

export class PurchasingController {
  static async listSuppliers(req: Request, res: Response) {
    try {
      const data = await SupplierService.listSuppliers();
      res.json({ success: true, count: data.length, data });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  }

  static async createSupplier(req: Request, res: Response) {
    try {
      const data = await SupplierService.createSupplier(req.body);
      res.status(201).json({ success: true, data });
    } catch (err: any) {
      res.status(400).json({ success: false, error: err.message });
    }
  }

  static async listPurchaseOrders(req: Request, res: Response) {
    res.json({ success: true, data: [] });
  }

  static async createPurchaseOrder(req: Request, res: Response) {
    res.status(201).json({ success: true, data: {} });
  }
}
