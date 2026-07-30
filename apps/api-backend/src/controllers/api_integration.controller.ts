import { Request, Response } from 'express';
import { ApiIntegrationService } from '../services/api_integration.service';

export class ApiIntegrationController {
  /**
   * POST /api/v1/integration/tokens
   * Generate Public API Token
   */
  static async generateToken(req: Request, res: Response) {
    try {
      const result = await ApiIntegrationService.generateApiToken(req.body);
      return res.status(201).json({
        success: true,
        message: 'API token generated successfully. Store secret securely.',
        data: result
      });
    } catch (err: any) {
      return res.status(400).json({ success: false, error: err.message });
    }
  }

  /**
   * GET /api/v1/integration/tokens
   * List Active API Tokens
   */
  static async listTokens(req: Request, res: Response) {
    try {
      const companyId = (req.query.companyId as string) || 'default-company';
      const customerId = (req as any).customerId || (req.query.customerId as string);

      const tokens = await ApiIntegrationService.listApiTokens(companyId, customerId);
      return res.json({ success: true, data: tokens });
    } catch (err: any) {
      return res.status(400).json({ success: false, error: err.message });
    }
  }

  /**
   * DELETE /api/v1/integration/tokens/:id
   * Revoke API Token
   */
  static async revokeToken(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const revoked = await ApiIntegrationService.revokeApiToken(id);

      return res.json({
        success: true,
        message: 'API token revoked successfully.',
        data: revoked
      });
    } catch (err: any) {
      return res.status(400).json({ success: false, error: err.message });
    }
  }

  /**
   * GET /api/v1/integration/branding
   * Get Multi-Company White-Label Branding
   */
  static async getBranding(req: Request, res: Response) {
    try {
      const companyId = (req.query.companyId as string) || 'default-company';
      const branding = await ApiIntegrationService.getCompanyBranding(companyId);

      return res.json({ success: true, data: branding });
    } catch (err: any) {
      return res.status(400).json({ success: false, error: err.message });
    }
  }

  /**
   * PUT /api/v1/integration/branding
   * Update Multi-Company White-Label Branding
   */
  static async updateBranding(req: Request, res: Response) {
    try {
      const updated = await ApiIntegrationService.updateCompanyBranding(req.body);
      return res.json({
        success: true,
        message: 'Company branding updated successfully.',
        data: updated
      });
    } catch (err: any) {
      return res.status(400).json({ success: false, error: err.message });
    }
  }

  /**
   * POST /api/v1/integration/webhooks
   * Register Webhook Subscription
   */
  static async registerWebhook(req: Request, res: Response) {
    try {
      const webhook = await ApiIntegrationService.registerWebhook(req.body);
      return res.status(201).json({
        success: true,
        message: 'Webhook subscription created successfully.',
        data: webhook
      });
    } catch (err: any) {
      return res.status(400).json({ success: false, error: err.message });
    }
  }

  /**
   * GET /api/v1/integration/retention
   * Get Data Retention Policies
   */
  static async getRetentionPolicies(req: Request, res: Response) {
    try {
      const policies = await ApiIntegrationService.getRetentionPolicies(req.query.companyId as string);
      return res.json({ success: true, data: policies });
    } catch (err: any) {
      return res.status(400).json({ success: false, error: err.message });
    }
  }
}
