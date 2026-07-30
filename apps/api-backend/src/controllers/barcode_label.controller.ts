import { Request, Response } from 'express';
import { BarcodeLabelService } from '../services/barcode_label.service';

export class BarcodeLabelController {
  // =============================================================================
  // BARCODE ENGINE & RENDERING
  // =============================================================================

  static async generateBarcode(req: Request, res: Response) {
    try {
      const { format, data } = req.body;
      const result = BarcodeLabelService.generateBarcode(format || 'CODE128', data);
      return res.status(201).json({
        success: true,
        message: `Barcode generated successfully (${format})`,
        data: result
      });
    } catch (err: any) {
      return res.status(400).json({ success: false, error: err.message });
    }
  }

  static async validateBarcode(req: Request, res: Response) {
    try {
      const { format, code } = req.body;
      const validation = BarcodeLabelService.validateBarcode(format || 'CODE128', code);
      return res.json({
        success: true,
        data: validation
      });
    } catch (err: any) {
      return res.status(400).json({ success: false, error: err.message });
    }
  }

  static async renderBarcode(req: Request, res: Response) {
    try {
      const { format, code, options } = req.body;
      const renderResult = BarcodeLabelService.renderBarcode(format || 'CODE128', code, options);
      return res.json({
        success: true,
        data: renderResult
      });
    } catch (err: any) {
      return res.status(400).json({ success: false, error: err.message });
    }
  }

  // =============================================================================
  // INTEGRATION WITH EPIC 02 PRODUCT IDENTITY PLATFORM
  // =============================================================================

  static async generateBarcodeForPiece(req: Request, res: Response) {
    try {
      const { idOrSerial } = req.params;
      const { format } = req.query;
      const result = await BarcodeLabelService.generateBarcodeForPiece(
        idOrSerial,
        (format as any) || 'CODE128'
      );
      return res.json({
        success: true,
        message: 'Barcode generated for physical piece',
        data: result
      });
    } catch (err: any) {
      return res.status(400).json({ success: false, error: err.message });
    }
  }

  static async generateBarcodeForProduct(req: Request, res: Response) {
    try {
      const { idOrCode } = req.params;
      const { format } = req.query;
      const result = await BarcodeLabelService.generateBarcodeForProduct(
        idOrCode,
        (format as any) || 'EAN13'
      );
      return res.json({
        success: true,
        message: 'Barcode generated for product model',
        data: result
      });
    } catch (err: any) {
      return res.status(400).json({ success: false, error: err.message });
    }
  }

  // =============================================================================
  // PRINTABLE LABEL TEMPLATES
  // =============================================================================

  static async createLabelTemplate(req: Request, res: Response) {
    try {
      const template = await BarcodeLabelService.createLabelTemplate(req.body);
      return res.status(201).json({
        success: true,
        message: 'Printable label template created successfully',
        data: template
      });
    } catch (err: any) {
      return res.status(400).json({ success: false, error: err.message });
    }
  }

  static async listLabelTemplates(req: Request, res: Response) {
    try {
      const { category } = req.query;
      const templates = await BarcodeLabelService.listLabelTemplates(category as string);
      return res.json({
        success: true,
        count: templates.length,
        data: templates
      });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err.message });
    }
  }

  static async getLabelTemplateById(req: Request, res: Response) {
    try {
      const template = await BarcodeLabelService.getLabelTemplateById(req.params.id);
      return res.json({ success: true, data: template });
    } catch (err: any) {
      return res.status(404).json({ success: false, error: err.message });
    }
  }

  static async deleteLabelTemplate(req: Request, res: Response) {
    try {
      await BarcodeLabelService.deleteLabelTemplate(req.params.id);
      return res.json({ success: true, message: 'Label template deleted successfully' });
    } catch (err: any) {
      return res.status(400).json({ success: false, error: err.message });
    }
  }

  static async duplicateLabelTemplate(req: Request, res: Response) {
    try {
      const { newCode, newName } = req.body;
      const duplicated = await BarcodeLabelService.duplicateLabelTemplate(req.params.id, newCode, newName);
      return res.status(201).json({
        success: true,
        message: 'Label template duplicated successfully',
        data: duplicated
      });
    } catch (err: any) {
      return res.status(400).json({ success: false, error: err.message });
    }
  }

  static async renderLabelPreview(req: Request, res: Response) {
    try {
      const { templateId, pieceIdOrSerial } = req.body;
      const preview = await BarcodeLabelService.renderLabelPreview(templateId, pieceIdOrSerial);
      return res.json({
        success: true,
        message: 'Label preview rendered successfully',
        data: preview
      });
    } catch (err: any) {
      return res.status(400).json({ success: false, error: err.message });
    }
  }

  static async listGenerationAudits(req: Request, res: Response) {
    try {
      const { barcodeValue, format } = req.query;
      const audits = await BarcodeLabelService.listGenerationAudits({
        barcodeValue: barcodeValue as string,
        format: format as string
      });
      return res.json({ success: true, count: audits.length, data: audits });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err.message });
    }
  }

  // =============================================================================
  // SPRINT 03: TEMPLATE VERSIONING & IMPORT / EXPORT
  // =============================================================================

  static async createTemplateVersion(req: Request, res: Response) {
    try {
      const { changelog } = req.body;
      const result = await BarcodeLabelService.createTemplateVersion(req.params.id, changelog);
      return res.status(201).json({
        success: true,
        message: `Created template version ${result.version.version}`,
        data: result
      });
    } catch (err: any) {
      return res.status(400).json({ success: false, error: err.message });
    }
  }

  static async listTemplateVersions(req: Request, res: Response) {
    try {
      const versions = await BarcodeLabelService.listTemplateVersions(req.params.id);
      return res.json({ success: true, count: versions.length, data: versions });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err.message });
    }
  }

  static async exportTemplateJson(req: Request, res: Response) {
    try {
      const pkg = await BarcodeLabelService.exportTemplateJson(req.params.id);
      return res.json({ success: true, data: pkg });
    } catch (err: any) {
      return res.status(400).json({ success: false, error: err.message });
    }
  }

  static async importTemplateJson(req: Request, res: Response) {
    try {
      const imported = await BarcodeLabelService.importTemplateJson(req.body);
      return res.status(201).json({
        success: true,
        message: 'Template package imported successfully',
        data: imported
      });
    } catch (err: any) {
      return res.status(400).json({ success: false, error: err.message });
    }
  }
}

