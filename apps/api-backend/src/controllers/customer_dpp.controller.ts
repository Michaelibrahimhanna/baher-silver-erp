import { Request, Response } from 'express';
import { CustomerDppService } from '../services/customer_dpp.service';

export class CustomerDppController {
  /**
   * GET /api/v1/customer/dpp/passports/:serialOrDpp
   * Get Customer Digital Product Passport Viewer Payload
   */
  static async getPassportDetails(req: Request, res: Response) {
    try {
      const customerId = (req as any).customerId || (req.query.customerId as string);
      if (!customerId) return res.status(400).json({ success: false, error: 'customerId required.' });

      const { serialOrDpp } = req.params;
      const details = await CustomerDppService.getCustomerPassportDetails(customerId, serialOrDpp);

      return res.json({
        success: true,
        data: details
      });
    } catch (err: any) {
      return res.status(404).json({ success: false, error: err.message });
    }
  }

  /**
   * POST /api/v1/customer/dpp/qr/verify
   * QR Experience & Anti-Counterfeit Verification
   */
  static async verifyQr(req: Request, res: Response) {
    try {
      const { dppCode, verificationToken, scannedBy, scanDeviceType } = req.body;
      const result = await CustomerDppService.verifyQrAuthenticity({
        dppCode,
        verificationToken,
        scannedBy,
        scanDeviceType,
        ipAddress: req.ip || '127.0.0.1'
      });

      return res.json({
        success: true,
        data: result
      });
    } catch (err: any) {
      return res.status(400).json({ success: false, error: err.message });
    }
  }

  /**
   * GET /api/v1/customer/dpp/warranties
   * Get Warranty Center Status & Submitted Claims
   */
  static async getWarrantyInfo(req: Request, res: Response) {
    try {
      const customerId = (req as any).customerId || (req.query.customerId as string);
      const pieceSerial = req.query.pieceSerial as string;
      if (!customerId || !pieceSerial) return res.status(400).json({ success: false, error: 'customerId and pieceSerial required.' });

      const result = await CustomerDppService.getWarrantyStatusAndClaims(customerId, pieceSerial);
      return res.json({
        success: true,
        data: result
      });
    } catch (err: any) {
      return res.status(400).json({ success: false, error: err.message });
    }
  }

  /**
   * POST /api/v1/customer/dpp/warranties/claims
   * Submit Customer Warranty Claim
   */
  static async submitWarrantyClaim(req: Request, res: Response) {
    try {
      const customerId = (req as any).customerId || req.body.customerId;
      if (!customerId) return res.status(400).json({ success: false, error: 'customerId required.' });

      const claim = await CustomerDppService.submitWarrantyClaim(customerId, req.body);
      return res.status(201).json({
        success: true,
        message: `Warranty claim ${claim.claimCode} submitted successfully`,
        data: claim
      });
    } catch (err: any) {
      return res.status(400).json({ success: false, error: err.message });
    }
  }

  /**
   * POST /api/v1/customer/dpp/share
   * Create Secure Expiring Share Link
   */
  static async createShareLink(req: Request, res: Response) {
    try {
      const customerId = (req as any).customerId || req.body.customerId;
      if (!customerId) return res.status(400).json({ success: false, error: 'customerId required.' });

      const { dppCode, durationDays } = req.body;
      const share = await CustomerDppService.createSecureShareLink(customerId, dppCode, durationDays);

      return res.status(201).json({
        success: true,
        message: 'Secure share link generated',
        data: share
      });
    } catch (err: any) {
      return res.status(400).json({ success: false, error: err.message });
    }
  }

  /**
   * GET /api/v1/customer/dpp/share/:shareToken
   * Read-Only Shared Passport View
   */
  static async getSharedPassport(req: Request, res: Response) {
    try {
      const { shareToken } = req.params;
      const result = await CustomerDppService.resolveSharedPassport(shareToken);

      return res.json({
        success: true,
        data: result
      });
    } catch (err: any) {
      return res.status(404).json({ success: false, error: err.message });
    }
  }

  /**
   * GET /api/v1/customer/dpp/graph/:pieceSerial
   * Get 360° Asset Relationship Graph Viewer
   */
  static async getRelationshipGraph(req: Request, res: Response) {
    try {
      const customerId = (req as any).customerId || (req.query.customerId as string);
      if (!customerId) return res.status(400).json({ success: false, error: 'customerId required.' });

      const { pieceSerial } = req.params;
      const graph = await CustomerDppService.getAssetRelationshipGraph(customerId, pieceSerial);

      return res.json({
        success: true,
        data: graph
      });
    } catch (err: any) {
      return res.status(404).json({ success: false, error: err.message });
    }
  }
}
