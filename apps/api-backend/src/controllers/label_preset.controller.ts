import { Request, Response } from 'express';
import { LabelPresetService } from '../services/label_preset.service';

export class LabelPresetController {
  static async createPrintPreset(req: Request, res: Response) {
    try {
      const preset = await LabelPresetService.createPrintPreset(req.body);
      return res.status(201).json({
        success: true,
        message: 'Print preset created successfully',
        data: preset
      });
    } catch (err: any) {
      return res.status(400).json({ success: false, error: err.message });
    }
  }

  static async listPrintPresets(req: Request, res: Response) {
    try {
      const { branchId, stationId } = req.query;
      const presets = await LabelPresetService.listPrintPresets({
        branchId: branchId as string,
        stationId: stationId as string
      });
      return res.json({
        success: true,
        count: presets.length,
        data: presets
      });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err.message });
    }
  }

  static async resolvePresetForStation(req: Request, res: Response) {
    try {
      const { branchId, stationId } = req.query;
      const preset = await LabelPresetService.resolvePresetForStation(
        branchId as string,
        stationId as string
      );
      return res.json({
        success: true,
        data: preset
      });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err.message });
    }
  }

  static async deletePrintPreset(req: Request, res: Response) {
    try {
      await LabelPresetService.deletePrintPreset(req.params.id);
      return res.json({ success: true, message: 'Print preset deleted successfully' });
    } catch (err: any) {
      return res.status(400).json({ success: false, error: err.message });
    }
  }
}
