import { Request, Response } from 'express';
import { DppPublicService } from '../services/dpp_public.service';

export class DppPublicController {
  private static setPublicSecurityHeaders(res: Response) {
    res.setHeader('X-Frame-Options', 'SAMEORIGIN');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    res.setHeader(
      'Content-Security-Policy',
      "default-src 'self' https: data: 'unsafe-inline'; img-src 'self' https: data: blob:;"
    );
    res.setHeader('Cache-Control', 'public, max-age=60, s-maxage=300');
  }

  /**
   * GET /api/v1/dpp/public/:serialNoOrCode
   * Read-only public passport viewer endpoint
   */
  static async getPublicPassport(req: Request, res: Response) {
    try {
      DppPublicController.setPublicSecurityHeaders(res);
      const { serialNoOrCode } = req.params;
      const viewSource = (req.query.source as string) || req.headers['x-view-source'] as string || 'DIRECT';
      const userAgent = req.headers['user-agent'];
      const ipAddress = req.ip || req.socket.remoteAddress || '127.0.0.1';

      const passport = await DppPublicService.getPublicPassport(serialNoOrCode, {
        viewSource,
        userAgent,
        ipAddress
      });

      return res.json({
        success: true,
        data: passport
      });
    } catch (err: any) {
      return res.status(404).json({
        success: false,
        error: err.message,
        readOnly: true
      });
    }
  }

  /**
   * POST /api/v1/dpp/public/verify
   * Authenticity verification endpoint
   */
  static async verifyAuthenticity(req: Request, res: Response) {
    try {
      DppPublicController.setPublicSecurityHeaders(res);
      const { serialNo, verificationToken } = req.body;
      if (!serialNo || !verificationToken) {
        return res.status(400).json({
          success: false,
          error: 'serialNo and verificationToken are required parameters.'
        });
      }

      const result = await DppPublicService.verifyAuthenticity(serialNo, verificationToken);
      return res.json({
        success: true,
        data: result
      });
    } catch (err: any) {
      return res.status(400).json({ success: false, error: err.message });
    }
  }

  /**
   * GET /api/v1/dpp/public/verify/:token
   * Direct token verification GET route
   */
  static async verifyTokenDirect(req: Request, res: Response) {
    try {
      DppPublicController.setPublicSecurityHeaders(res);
      const { token } = req.params;
      const serialNo = (req.query.sn as string) || '';

      const result = await DppPublicService.verifyAuthenticity(serialNo, token);
      return res.json({
        success: true,
        data: result
      });
    } catch (err: any) {
      return res.status(400).json({ success: false, error: err.message });
    }
  }

  /**
   * GET /api/v1/dpp/public/:serialNoOrCode/seo
   * SEO Metadata & JSON-LD Product Schema endpoint
   */
  static async getSeoMetadata(req: Request, res: Response) {
    try {
      DppPublicController.setPublicSecurityHeaders(res);
      const { serialNoOrCode } = req.params;
      const seoData = await DppPublicService.getSeoMetadata(serialNoOrCode);
      return res.json({
        success: true,
        data: seoData
      });
    } catch (err: any) {
      return res.status(404).json({ success: false, error: err.message });
    }
  }

  /**
   * POST /api/v1/dpp/public/publish
   * Publish a DPP draft and configure expiring URL settings
   */
  static async publishPassport(req: Request, res: Response) {
    try {
      const { pieceIdOrSerial, metadata, options } = req.body;
      const published = await DppPublicService.publishPassport(pieceIdOrSerial, metadata, options);
      return res.status(201).json({
        success: true,
        message: 'Digital Product Passport published successfully',
        data: published
      });
    } catch (err: any) {
      return res.status(400).json({ success: false, error: err.message });
    }
  }

  /**
   * GET /api/v1/dpp/public/:serialNo/analytics
   * Analytics breakdown for passport views
   */
  static async getPublicAnalytics(req: Request, res: Response) {
    try {
      const { serialNo } = req.params;
      const analytics = await DppPublicService.getPublicAnalytics(serialNo);
      return res.json({
        success: true,
        data: analytics
      });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err.message });
    }
  }
}
