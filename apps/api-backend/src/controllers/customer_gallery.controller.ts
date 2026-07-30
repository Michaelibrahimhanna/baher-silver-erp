import { Request, Response } from 'express';
import { CustomerGalleryService } from '../services/customer_gallery.service';

export class CustomerGalleryController {
  /**
   * GET /api/v1/customer/gallery/products
   * Search Private Gallery Products
   */
  static async getProducts(req: Request, res: Response) {
    try {
      const customerId = (req as any).customerId || (req.query.customerId as string);
      if (!customerId) return res.status(400).json({ success: false, error: 'customerId required.' });

      const { search, category, tag } = req.query;
      const products = await CustomerGalleryService.getPrivateGalleryProducts(customerId, {
        search: search as string,
        category: category as string,
        tag: tag as string
      });

      return res.json({
        success: true,
        count: products.length,
        data: products
      });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err.message });
    }
  }

  /**
   * POST /api/v1/customer/gallery/collections
   * Create Collection / Custom Folder
   */
  static async createCollection(req: Request, res: Response) {
    try {
      const customerId = (req as any).customerId || req.body.customerId;
      if (!customerId) return res.status(400).json({ success: false, error: 'customerId required.' });

      const collection = await CustomerGalleryService.createCollection(customerId, req.body);
      return res.status(201).json({
        success: true,
        message: 'Collection created successfully',
        data: collection
      });
    } catch (err: any) {
      return res.status(400).json({ success: false, error: err.message });
    }
  }

  /**
   * GET /api/v1/customer/gallery/collections
   * List Customer Collections
   */
  static async listCollections(req: Request, res: Response) {
    try {
      const customerId = (req as any).customerId || (req.query.customerId as string);
      if (!customerId) return res.status(400).json({ success: false, error: 'customerId required.' });

      const collections = await CustomerGalleryService.listCollections(customerId);
      return res.json({
        success: true,
        count: collections.length,
        data: collections
      });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err.message });
    }
  }

  /**
   * POST /api/v1/customer/gallery/assets
   * Upload Design Asset (STL, 3DM, DXF) & 3D Viewer URL
   */
  static async uploadAsset(req: Request, res: Response) {
    try {
      const customerId = (req as any).customerId || req.body.customerId;
      if (!customerId) return res.status(400).json({ success: false, error: 'customerId required.' });

      const result = await CustomerGalleryService.uploadDesignAsset(customerId, req.body);
      return res.status(201).json({
        success: true,
        message: 'Design asset uploaded successfully',
        data: result
      });
    } catch (err: any) {
      return res.status(400).json({ success: false, error: err.message });
    }
  }

  /**
   * POST /api/v1/customer/gallery/assets/:assetId/versions
   * Create New Design Version (V1 -> V2 -> V3)
   */
  static async createVersion(req: Request, res: Response) {
    try {
      const customerId = (req as any).customerId || req.body.customerId;
      if (!customerId) return res.status(400).json({ success: false, error: 'customerId required.' });

      const { assetId } = req.params;
      const result = await CustomerGalleryService.createDesignVersion(customerId, assetId, req.body);

      return res.status(201).json({
        success: true,
        message: 'Design version updated',
        data: result
      });
    } catch (err: any) {
      return res.status(400).json({ success: false, error: err.message });
    }
  }

  /**
   * POST /api/v1/customer/gallery/assets/:assetId/rollback
   * Rollback Design Asset Version
   */
  static async rollbackVersion(req: Request, res: Response) {
    try {
      const customerId = (req as any).customerId || req.body.customerId;
      if (!customerId) return res.status(400).json({ success: false, error: 'customerId required.' });

      const { assetId } = req.params;
      const { targetVersion } = req.body;

      const rollback = await CustomerGalleryService.rollbackDesignVersion(customerId, assetId, targetVersion);
      return res.json({
        success: true,
        message: `Design asset rolled back to version ${targetVersion}`,
        data: rollback
      });
    } catch (err: any) {
      return res.status(400).json({ success: false, error: err.message });
    }
  }

  /**
   * POST /api/v1/customer/gallery/favorites/toggle
   * Toggle Product / Asset Favorite Bookmark
   */
  static async toggleFavorite(req: Request, res: Response) {
    try {
      const customerId = (req as any).customerId || req.body.customerId;
      if (!customerId) return res.status(400).json({ success: false, error: 'customerId required.' });

      const result = await CustomerGalleryService.toggleFavorite(customerId, req.body);
      return res.json({
        success: true,
        message: result.message,
        data: result
      });
    } catch (err: any) {
      return res.status(400).json({ success: false, error: err.message });
    }
  }

  /**
   * GET /api/v1/customer/gallery/favorites
   * List Customer Favorites
   */
  static async listFavorites(req: Request, res: Response) {
    try {
      const customerId = (req as any).customerId || (req.query.customerId as string);
      if (!customerId) return res.status(400).json({ success: false, error: 'customerId required.' });

      const favorites = await CustomerGalleryService.listFavorites(customerId);
      return res.json({
        success: true,
        count: favorites.length,
        data: favorites
      });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err.message });
    }
  }
}
