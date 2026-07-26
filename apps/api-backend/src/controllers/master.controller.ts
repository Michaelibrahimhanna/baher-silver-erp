import { Request, Response } from 'express';
import { MasterService } from '../services/master.service';

export class MasterController {
  static async listMasterItems(req: Request, res: Response) {
    try {
      const category = req.query.category as string;
      const search = req.query.search as string;
      const data = await MasterService.listMasterItems(category, search);
      res.json({ success: true, count: data.length, data });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  }

  static async getSmartSizes(req: Request, res: Response) {
    try {
      const shape = req.query.shape as string;
      const data = await MasterService.getSmartSizesByShape(shape);
      res.json({ success: true, count: data.length, data });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  }

  static async getHierarchy(req: Request, res: Response) {
    try {
      const data = await MasterService.getStoneHierarchy();
      res.json({ success: true, data });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  }

  static async createMasterItem(req: Request, res: Response) {
    try {
      const data = await MasterService.createMasterItem(req.body);
      res.status(201).json({ success: true, data });
    } catch (err: any) {
      res.status(400).json({ success: false, error: err.message });
    }
  }

  static async updateMasterItem(req: Request, res: Response) {
    try {
      const data = await MasterService.updateMasterItem(req.params.id, req.body);
      res.json({ success: true, data });
    } catch (err: any) {
      res.status(400).json({ success: false, error: err.message });
    }
  }

  static async toggleActive(req: Request, res: Response) {
    try {
      const data = await MasterService.toggleActive(req.params.id);
      res.json({ success: true, data });
    } catch (err: any) {
      res.status(400).json({ success: false, error: err.message });
    }
  }

  static async importMasterItems(req: Request, res: Response) {
    try {
      const items = req.body.items || [];
      const data = await MasterService.importMasterItems(items);
      res.json({ success: true, importedCount: data.length, data });
    } catch (err: any) {
      res.status(400).json({ success: false, error: err.message });
    }
  }
}
