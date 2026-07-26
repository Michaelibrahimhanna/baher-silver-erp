import { Request, Response } from 'express';
import { SalesService } from '../services/sales.service';

export class SalesController {
  static async listCustomers(req: Request, res: Response) {
    const data = await SalesService.listCustomers();
    res.json({ success: true, data });
  }

  static async createCustomer(req: Request, res: Response) {
    const data = await SalesService.createCustomer(req.body);
    res.status(201).json({ success: true, data });
  }

  static async listSalesOrders(req: Request, res: Response) {
    const data = await SalesService.listSalesOrders();
    res.json({ success: true, data });
  }

  static async createSalesOrder(req: Request, res: Response) {
    const data = await SalesService.createSalesOrder(req.body);
    res.status(201).json({ success: true, data });
  }
}
