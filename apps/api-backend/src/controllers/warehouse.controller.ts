import { Request, Response } from 'express';
import { WarehouseService } from '../services/warehouse.service';

export class WarehouseController {
  static async listWarehouses(req: Request, res: Response) {
    try {
      const data = await WarehouseService.listWarehouses();
      res.json({ success: true, data });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  }

  static async listLocations(req: Request, res: Response) {
    try {
      const warehouseId = req.query.warehouseId as string;
      const data = await WarehouseService.listLocations(warehouseId);
      res.json({ success: true, data });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  }

  static async createLocation(req: Request, res: Response) {
    try {
      const data = await WarehouseService.createLocation(req.body);
      res.status(201).json({ success: true, data });
    } catch (err: any) {
      res.status(400).json({ success: false, error: err.message });
    }
  }
}
