import { Request, Response } from 'express';
import { QrPassportService } from '../services/qr_passport.service';

export class QrPassportController {
  static async generateQrCode(req: Request, res: Response) {
    try {
      const { format, data, options } = req.body;
      const result = QrPassportService.generateQrCode(format || 'URL', data, options);
      return res.status(201).json({
        success: true,
        message: `QR code generated successfully (${format})`,
        data: result
      });
    } catch (err: any) {
      return res.status(400).json({ success: false, error: err.message });
    }
  }

  static async validateQrCode(req: Request, res: Response) {
    try {
      const { format, payload, errorCorrection } = req.body;
      const validation = QrPassportService.validateQrCode(format || 'URL', payload, errorCorrection);
      return res.json({
        success: true,
        data: validation
      });
    } catch (err: any) {
      return res.status(400).json({ success: false, error: err.message });
    }
  }

  static async renderQrCode(req: Request, res: Response) {
    try {
      const { format, payload, options } = req.body;
      const renderResult = QrPassportService.renderQrCode(format || 'URL', payload, options);
      return res.json({
        success: true,
        data: renderResult
      });
    } catch (err: any) {
      return res.status(400).json({ success: false, error: err.message });
    }
  }

  static async generateQrForPiece(req: Request, res: Response) {
    try {
      const { idOrSerial } = req.params;
      const { format } = req.query;
      const result = await QrPassportService.generateQrForPiece(
        idOrSerial,
        (format as any) || 'URL'
      );
      return res.json({
        success: true,
        message: 'QR code generated for physical piece',
        data: result
      });
    } catch (err: any) {
      return res.status(400).json({ success: false, error: err.message });
    }
  }

  static async createDppDraft(req: Request, res: Response) {
    try {
      const { pieceIdOrSerial, metadata } = req.body;
      const dpp = await QrPassportService.createDppDraft(pieceIdOrSerial, metadata);
      return res.status(201).json({
        success: true,
        message: 'Digital Product Passport draft created successfully',
        data: dpp
      });
    } catch (err: any) {
      return res.status(400).json({ success: false, error: err.message });
    }
  }

  static async getDppDraft(req: Request, res: Response) {
    try {
      const dpp = await QrPassportService.getDppDraft(req.params.idOrSerial);
      return res.json({ success: true, data: dpp });
    } catch (err: any) {
      return res.status(404).json({ success: false, error: err.message });
    }
  }

  static async listQrAudits(req: Request, res: Response) {
    try {
      const { qrType } = req.query;
      const audits = await QrPassportService.listQrAudits({ qrType: qrType as string });
      return res.json({ success: true, count: audits.length, data: audits });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err.message });
    }
  }
}
