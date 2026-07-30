import { Request, Response } from 'express';
import { DppJourneyService } from '../services/dpp_journey.service';

export class DppJourneyController {
  private static setSecurityHeaders(res: Response) {
    res.setHeader('X-Frame-Options', 'SAMEORIGIN');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    res.setHeader('Cache-Control', 'public, max-age=60, s-maxage=300');
  }

  /**
   * GET /api/v1/dpp/journey/:serialNoOrCode
   * Full customer journey & after-sales data payload
   */
  static async getJourneyData(req: Request, res: Response) {
    try {
      DppJourneyController.setSecurityHeaders(res);
      const { serialNoOrCode } = req.params;
      const journey = await DppJourneyService.getJourneyData(serialNoOrCode);
      return res.json({
        success: true,
        data: journey
      });
    } catch (err: any) {
      return res.status(404).json({ success: false, error: err.message });
    }
  }

  /**
   * GET /api/v1/dpp/journey/:serialNoOrCode/care-warranty
   */
  static async getCareAndWarranty(req: Request, res: Response) {
    try {
      DppJourneyController.setSecurityHeaders(res);
      const { serialNoOrCode } = req.params;
      const data = await DppJourneyService.getCareAndWarranty(serialNoOrCode);
      return res.json({ success: true, data });
    } catch (err: any) {
      return res.status(404).json({ success: false, error: err.message });
    }
  }

  /**
   * GET /api/v1/dpp/journey/:serialNoOrCode/certificates
   */
  static async getCertificates(req: Request, res: Response) {
    try {
      DppJourneyController.setSecurityHeaders(res);
      const { serialNoOrCode } = req.params;
      const data = await DppJourneyService.getCertificates(serialNoOrCode);
      return res.json({ success: true, data });
    } catch (err: any) {
      return res.status(404).json({ success: false, error: err.message });
    }
  }

  /**
   * GET /api/v1/dpp/journey/:serialNoOrCode/timeline
   */
  static async getTimeline(req: Request, res: Response) {
    try {
      DppJourneyController.setSecurityHeaders(res);
      const { serialNoOrCode } = req.params;
      const data = await DppJourneyService.getTimeline(serialNoOrCode);
      return res.json({ success: true, data });
    } catch (err: any) {
      return res.status(404).json({ success: false, error: err.message });
    }
  }

  /**
   * GET /api/v1/dpp/journey/:serialNoOrCode/pdf
   * Download or view Digital Passport PDF Certificate
   */
  static async downloadPassportPdf(req: Request, res: Response) {
    try {
      DppJourneyController.setSecurityHeaders(res);
      const { serialNoOrCode } = req.params;
      const format = (req.query.format as string) || 'json';

      const pdfData = await DppJourneyService.generatePassportPdfData(serialNoOrCode);

      if (format === 'html') {
        res.setHeader('Content-Type', 'text/html; charset=utf-8');
        return res.send(pdfData.pdfHtml);
      }

      return res.json({
        success: true,
        message: 'Digital Product Passport PDF Certificate Data Ready',
        data: pdfData
      });
    } catch (err: any) {
      return res.status(404).json({ success: false, error: err.message });
    }
  }
}
