import { Request, Response } from 'express';
import { DppAdminService } from '../services/dpp_admin.service';

export class DppAdminController {
  /**
   * GET /api/v1/dpp/admin/passports
   * List passports with filtering & search
   */
  static async listPassports(req: Request, res: Response) {
    try {
      const { status, search, limit, offset } = req.query;
      const result = await DppAdminService.listPassports({
        status: status as string,
        search: search as string,
        limit: limit ? parseInt(limit as string, 10) : 50,
        offset: offset ? parseInt(offset as string, 10) : 0
      });

      return res.json({
        success: true,
        data: result
      });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err.message });
    }
  }

  /**
   * GET /api/v1/dpp/admin/passports/:idOrSerial
   * Get full passport edit details with version history
   */
  static async getPassportById(req: Request, res: Response) {
    try {
      const { idOrSerial } = req.params;
      const result = await DppAdminService.getPassportById(idOrSerial);
      return res.json({
        success: true,
        data: result
      });
    } catch (err: any) {
      return res.status(404).json({ success: false, error: err.message });
    }
  }

  /**
   * PUT /api/v1/dpp/admin/passports/:idOrSerial
   * Update passport content
   */
  static async updatePassportContent(req: Request, res: Response) {
    try {
      const { idOrSerial } = req.params;
      const operatorName = (req as any).user?.username || (req as any).user?.name || 'ADMIN';
      const updated = await DppAdminService.updatePassportContent(idOrSerial, req.body, operatorName);

      return res.json({
        success: true,
        message: 'Digital Product Passport content updated successfully',
        data: updated
      });
    } catch (err: any) {
      return res.status(400).json({ success: false, error: err.message });
    }
  }

  /**
   * POST /api/v1/dpp/admin/passports/:idOrSerial/rollback
   * Rollback passport content to a specific version sequence
   */
  static async rollbackVersion(req: Request, res: Response) {
    try {
      const { idOrSerial } = req.params;
      const { versionSeq } = req.body;
      const operatorName = (req as any).user?.username || (req as any).user?.name || 'ADMIN';

      if (!versionSeq) {
        return res.status(400).json({ success: false, error: 'versionSeq is required for rollback.' });
      }

      const rolledBack = await DppAdminService.rollbackVersion(idOrSerial, parseInt(versionSeq, 10), operatorName);
      return res.json({
        success: true,
        message: `Successfully rolled back passport content to version v${versionSeq}`,
        data: rolledBack
      });
    } catch (err: any) {
      return res.status(400).json({ success: false, error: err.message });
    }
  }

  /**
   * POST /api/v1/dpp/admin/passports/:idOrSerial/status
   * Transition publishing workflow status
   */
  static async transitionPublishingStatus(req: Request, res: Response) {
    try {
      const { idOrSerial } = req.params;
      const { targetStatus, reason, scheduledPublishAt } = req.body;
      const operatorName = (req as any).user?.username || (req as any).user?.name || 'ADMIN';

      if (!targetStatus) {
        return res.status(400).json({ success: false, error: 'targetStatus parameter is required.' });
      }

      const updated = await DppAdminService.transitionPublishingStatus(
        idOrSerial,
        targetStatus,
        operatorName,
        {
          reason,
          scheduledPublishAt: scheduledPublishAt ? new Date(scheduledPublishAt) : undefined
        }
      );

      return res.json({
        success: true,
        message: `Passport status transitioned to ${targetStatus}`,
        data: updated
      });
    } catch (err: any) {
      return res.status(400).json({ success: false, error: err.message });
    }
  }

  /**
   * POST /api/v1/dpp/admin/passports/bulk-status
   * Bulk publish / archive operations
   */
  static async bulkTransitionStatus(req: Request, res: Response) {
    try {
      const { serialNos, targetStatus, reason } = req.body;
      const operatorName = (req as any).user?.username || (req as any).user?.name || 'ADMIN';

      if (!Array.isArray(serialNos) || !targetStatus) {
        return res.status(400).json({ success: false, error: 'serialNos (array) and targetStatus are required.' });
      }

      const results = await DppAdminService.bulkTransitionStatus(serialNos, targetStatus, operatorName, reason);
      return res.json({
        success: true,
        message: 'Bulk publishing status operation completed',
        data: results
      });
    } catch (err: any) {
      return res.status(400).json({ success: false, error: err.message });
    }
  }

  /**
   * POST /api/v1/dpp/admin/passports/:idOrSerial/media
   * Manage Media Library & Automatic WebP Asset Optimization
   */
  static async manageMediaLibrary(req: Request, res: Response) {
    try {
      const { idOrSerial } = req.params;
      const updated = await DppAdminService.manageMediaLibrary(idOrSerial, req.body);
      return res.json({
        success: true,
        message: 'Media assets updated and WebP optimization applied',
        data: updated
      });
    } catch (err: any) {
      return res.status(400).json({ success: false, error: err.message });
    }
  }

  /**
   * GET /api/v1/dpp/admin/templates
   * List certificate templates
   */
  static async listCertificateTemplates(req: Request, res: Response) {
    try {
      const templates = await DppAdminService.listCertificateTemplates();
      return res.json({
        success: true,
        data: templates
      });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err.message });
    }
  }

  /**
   * POST /api/v1/dpp/admin/templates
   * Create new certificate template
   */
  static async createCertificateTemplate(req: Request, res: Response) {
    try {
      const template = await DppAdminService.createCertificateTemplate(req.body);
      return res.status(201).json({
        success: true,
        message: 'Certificate template created successfully',
        data: template
      });
    } catch (err: any) {
      return res.status(400).json({ success: false, error: err.message });
    }
  }

  /**
   * GET /api/v1/dpp/admin/analytics/dashboard
   * Advanced Analytics Dashboard Summary
   */
  static async getAdvancedAnalyticsDashboard(req: Request, res: Response) {
    try {
      const summary = await DppAdminService.getAdvancedAnalyticsDashboard();
      return res.json({
        success: true,
        data: summary
      });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err.message });
    }
  }
}
