import { Request, Response } from 'express';
import { WeightCaptureService } from '../services/weight_capture.service';

export class WeightCaptureController {
  static async listScaleDevices(req: Request, res: Response) {
    try {
      const data = await WeightCaptureService.listScaleDevices();
      res.json({ success: true, count: data.length, data });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  }

  static async registerScaleDevice(req: Request, res: Response) {
    try {
      const data = await WeightCaptureService.registerScaleDevice(req.body);
      res.status(201).json({ success: true, data });
    } catch (err: any) {
      res.status(400).json({ success: false, error: err.message });
    }
  }

  static async pollWeight(req: Request, res: Response) {
    try {
      const deviceId = req.params.id || req.body.deviceId;
      const data = await WeightCaptureService.processWeightReading({
        ...req.body,
        deviceId
      });
      res.json({ success: true, data });
    } catch (err: any) {
      res.status(400).json({ success: false, error: err.message });
    }
  }

  static async executeZero(req: Request, res: Response) {
    try {
      const deviceId = req.params.id;
      const data = await WeightCaptureService.executeZero(deviceId);
      res.json({ success: true, data });
    } catch (err: any) {
      res.status(400).json({ success: false, error: err.message });
    }
  }

  static async executeTare(req: Request, res: Response) {
    try {
      const deviceId = req.params.id;
      const tareWeightGrams = req.body.tareWeightGrams ? Number(req.body.tareWeightGrams) : undefined;
      const data = await WeightCaptureService.executeTare(deviceId, tareWeightGrams);
      res.json({ success: true, data });
    } catch (err: any) {
      res.status(400).json({ success: false, error: err.message });
    }
  }

  static async listAuditLogs(req: Request, res: Response) {
    try {
      const deviceId = req.query.deviceId as string;
      const data = await WeightCaptureService.listAuditLogs(deviceId);
      res.json({ success: true, count: data.length, data });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  }
}
