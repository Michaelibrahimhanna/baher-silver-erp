import { Request, Response } from 'express';
import { IdentityPlatformService, PieceStatus } from '../services/identity_platform.service';

export class IdentityPlatformController {
  static async createProductModel(req: Request, res: Response) {
    try {
      const data = await IdentityPlatformService.createProductModel(req.body);
      res.status(201).json({ success: true, data });
    } catch (err: any) {
      res.status(400).json({ success: false, error: err.message });
    }
  }

  static async listProductModels(req: Request, res: Response) {
    try {
      const data = await IdentityPlatformService.listProductModels();
      res.json({ success: true, count: data.length, data });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  }

  static async generateSKU(req: Request, res: Response) {
    try {
      const categoryCode = (req.body.category || 'RNG') as string;
      const sku = await IdentityPlatformService.generateImmutableSKU(categoryCode);
      res.json({ success: true, sku });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  }

  static async createPhysicalPiece(req: Request, res: Response) {
    try {
      const data = await IdentityPlatformService.createPhysicalPiece(req.body);
      res.status(201).json({ success: true, data });
    } catch (err: any) {
      res.status(400).json({ success: false, error: err.message });
    }
  }

  static async getPhysicalPiece(req: Request, res: Response) {
    try {
      const data = await IdentityPlatformService.getPhysicalPieceById(req.params.idOrSerial);
      if (!data) return res.status(404).json({ success: false, error: 'Physical Piece identity not found' });
      res.json({ success: true, data });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  }

  static async listPhysicalPieces(req: Request, res: Response) {
    try {
      const filters = {
        status: req.query.status as string,
        sku: req.query.sku as string,
        branchId: req.query.branchId as string
      };
      const data = await IdentityPlatformService.listPhysicalPieces(filters);
      res.json({ success: true, count: data.length, data });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  }

  static async updatePhysicalPiece(req: Request, res: Response) {
    try {
      const data = await IdentityPlatformService.updatePhysicalPiece(req.params.id, req.body);
      res.json({ success: true, data });
    } catch (err: any) {
      const statusCode = err.message.startsWith('IDENTITY_IMMUTABLE') ? 400 : 500;
      res.status(statusCode).json({ success: false, error: err.message });
    }
  }

  static async transitionStatus(req: Request, res: Response) {
    try {
      const { status, performedBy, notes } = req.body;
      const data = await IdentityPlatformService.transitionPieceStatus(req.params.id, status as PieceStatus, performedBy, notes);
      res.json({ success: true, data });
    } catch (err: any) {
      res.status(400).json({ success: false, error: err.message });
    }
  }

  static async reprintTag(req: Request, res: Response) {
    try {
      const { requestedBy, reason } = req.body;
      const data = await IdentityPlatformService.reprintTagIdentity(req.params.id, requestedBy, reason);
      res.json({ success: true, data });
    } catch (err: any) {
      res.status(400).json({ success: false, error: err.message });
    }
  }
}
