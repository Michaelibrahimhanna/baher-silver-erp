import { Request, Response } from 'express';
import { ProductService } from '../services/product.service';

export class ProductController {
  static async listProducts(req: Request, res: Response) {
    try {
      const filters = {
        search: req.query.search as string,
        category: req.query.category as string,
        collection: req.query.collection as string,
        silverPurity: req.query.silverPurity as string
      };
      const data = await ProductService.listProducts(filters);
      res.json({ success: true, count: data.length, data });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  }

  static async getProductById(req: Request, res: Response) {
    try {
      const data = await ProductService.getProductById(req.params.id);
      if (!data) return res.status(404).json({ success: false, error: 'Product not found' });
      res.json({ success: true, data });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  }

  static async createProduct(req: Request, res: Response) {
    try {
      const data = await ProductService.createProduct(req.body);
      res.status(201).json({ success: true, data });
    } catch (err: any) {
      res.status(400).json({ success: false, error: err.message });
    }
  }

  static async updateProduct(req: Request, res: Response) {
    try {
      const data = await ProductService.updateProduct(req.params.id, req.body);
      res.json({ success: true, data });
    } catch (err: any) {
      res.status(400).json({ success: false, error: err.message });
    }
  }

  static async deleteProduct(req: Request, res: Response) {
    try {
      const data = await ProductService.deleteProduct(req.params.id);
      res.json({ success: true, data });
    } catch (err: any) {
      res.status(400).json({ success: false, error: err.message });
    }
  }
}
