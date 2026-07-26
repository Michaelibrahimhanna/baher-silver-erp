import { Request, Response } from 'express';
import { AuditService } from '../services/audit.service';

export class AuditController {
  static async listAudits(req: Request, res: Response) {
    try {
      const data = await AuditService.listAudits();
      res.json({ success: true, count: data.length, data });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  }

  static async performAudit(req: Request, res: Response) {
    try {
      const data = await AuditService.performAudit(req.body);
      res.status(201).json({ success: true, data });
    } catch (err: any) {
      res.status(400).json({ success: false, error: err.message });
    }
  }
}
