import { Request, Response } from 'express';
import { CustomerPortalService } from '../services/customer_portal.service';

export class CustomerPortalController {
  /**
   * POST /api/v1/customer/auth/login
   * Customer Login & Session Token Issuance
   */
  static async login(req: Request, res: Response) {
    try {
      const { email, password, isRememberMe, deviceFingerprint } = req.body;
      const result = await CustomerPortalService.registerOrLoginCustomer(email, password, {
        isRememberMe,
        deviceFingerprint,
        ipAddress: req.ip || '127.0.0.1',
        userAgent: req.get('user-agent') || 'Browser'
      });

      return res.json({
        success: true,
        message: 'Customer authentication successful',
        data: result
      });
    } catch (err: any) {
      return res.status(401).json({ success: false, error: err.message });
    }
  }

  /**
   * POST /api/v1/customer/auth/logout
   * Customer Logout & Session Revocation
   */
  static async logout(req: Request, res: Response) {
    try {
      const token = req.headers['x-customer-session'] as string || req.body.sessionToken;
      if (!token) return res.status(400).json({ success: false, error: 'Session token required.' });

      const result = await CustomerPortalService.logoutCustomer(token);
      return res.json({
        success: true,
        message: result.message
      });
    } catch (err: any) {
      return res.status(400).json({ success: false, error: err.message });
    }
  }

  /**
   * POST /api/v1/customer/auth/password-reset
   * Request Password Reset
   */
  static async requestPasswordReset(req: Request, res: Response) {
    try {
      const { email } = req.body;
      const result = await CustomerPortalService.requestPasswordReset(email);
      return res.json({
        success: true,
        message: result.message,
        resetToken: result.resetToken
      });
    } catch (err: any) {
      return res.status(400).json({ success: false, error: err.message });
    }
  }

  /**
   * GET /api/v1/customer/profile
   * Get Customer Profile & Organization Branding
   */
  static async getProfile(req: Request, res: Response) {
    try {
      const customerId = (req as any).customerId || (req.query.customerId as string);
      if (!customerId) return res.status(400).json({ success: false, error: 'customerId required.' });

      const profile = await CustomerPortalService.getCustomerProfile(customerId);
      return res.json({
        success: true,
        data: profile
      });
    } catch (err: any) {
      return res.status(404).json({ success: false, error: err.message });
    }
  }

  /**
   * PUT /api/v1/customer/profile
   * Update Customer Profile & Preferred Language (AR/EN)
   */
  static async updateProfile(req: Request, res: Response) {
    try {
      const customerId = (req as any).customerId || req.body.customerId;
      if (!customerId) return res.status(400).json({ success: false, error: 'customerId required.' });

      const updated = await CustomerPortalService.updateCustomerProfile(customerId, req.body);
      return res.json({
        success: true,
        message: 'Customer profile updated successfully',
        data: updated
      });
    } catch (err: any) {
      return res.status(400).json({ success: false, error: err.message });
    }
  }

  /**
   * GET /api/v1/customer/catalog
   * Public Product Catalog (Visible to everyone)
   */
  static async getPublicCatalog(req: Request, res: Response) {
    try {
      const { category, search } = req.query;
      const catalog = await CustomerPortalService.getPublicProductCatalog({
        category: category as string,
        search: search as string
      });

      return res.json({
        success: true,
        count: catalog.length,
        data: catalog
      });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err.message });
    }
  }

  /**
   * GET /api/v1/customer/workspace/summary
   * Private Customer Workspace Dashboard (Multi-tenant Tenant Isolation)
   */
  static async getWorkspaceSummary(req: Request, res: Response) {
    try {
      const customerId = (req as any).customerId || (req.query.customerId as string);
      if (!customerId) return res.status(400).json({ success: false, error: 'customerId parameter is required for workspace isolation.' });

      const summary = await CustomerPortalService.getCustomerWorkspaceSummary(customerId);
      return res.json({
        success: true,
        data: summary
      });
    } catch (err: any) {
      return res.status(400).json({ success: false, error: err.message });
    }
  }

  /**
   * GET /api/v1/customer/products/private
   * Private Customer Products (Multi-tenant Tenant Isolation)
   */
  static async getPrivateProducts(req: Request, res: Response) {
    try {
      const customerId = (req as any).customerId || (req.query.customerId as string);
      if (!customerId) return res.status(400).json({ success: false, error: 'customerId required.' });

      const products = await CustomerPortalService.getCustomerPrivateProducts(customerId);
      return res.json({
        success: true,
        count: products.length,
        data: products
      });
    } catch (err: any) {
      return res.status(400).json({ success: false, error: err.message });
    }
  }
}
