import { Request, Response } from 'express';
import { CustomerCollaborationService } from '../services/customer_collaboration.service';

export class CustomerCollaborationController {
  /**
   * GET /api/v1/customer/orders
   * List Customer Manufacturing Orders with Status Filters
   */
  static async listOrders(req: Request, res: Response) {
    try {
      const customerId = (req as any).customerId || (req.query.customerId as string);
      if (!customerId) return res.status(400).json({ success: false, error: 'customerId required.' });

      const { status, search } = req.query;
      const orders = await CustomerCollaborationService.listCustomerOrders(customerId, {
        status: status as string,
        search: search as string
      });

      return res.json({
        success: true,
        count: orders.length,
        data: orders
      });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err.message });
    }
  }

  /**
   * GET /api/v1/customer/orders/:moId/timeline
   * Get Live Order Production Timeline, Progress %, & ETA Metrics
   */
  static async getTimeline(req: Request, res: Response) {
    try {
      const customerId = (req as any).customerId || (req.query.customerId as string);
      if (!customerId) return res.status(400).json({ success: false, error: 'customerId required.' });

      const { moId } = req.params;
      const timeline = await CustomerCollaborationService.getCustomerOrderTimeline(customerId, moId);

      return res.json({
        success: true,
        data: timeline
      });
    } catch (err: any) {
      return res.status(404).json({ success: false, error: err.message });
    }
  }

  /**
   * POST /api/v1/customer/orders/:moId/approval
   * Customer Design Approval / Rejection / Revision Request (V1, V2, V3...)
   */
  static async submitApproval(req: Request, res: Response) {
    try {
      const customerId = (req as any).customerId || req.body.customerId;
      if (!customerId) return res.status(400).json({ success: false, error: 'customerId required.' });

      const { moId } = req.params;
      const approval = await CustomerCollaborationService.submitDesignApprovalAction(customerId, {
        moId,
        ...req.body
      });

      return res.status(201).json({
        success: true,
        message: `Design approval status updated: ${approval.status}`,
        data: approval
      });
    } catch (err: any) {
      return res.status(400).json({ success: false, error: err.message });
    }
  }

  /**
   * POST /api/v1/customer/orders/:moId/attachments
   * Upload Order Attachments (Images, PDF, CAD STL/3DM/DXF)
   */
  static async uploadAttachment(req: Request, res: Response) {
    try {
      const customerId = (req as any).customerId || req.body.customerId;
      if (!customerId) return res.status(400).json({ success: false, error: 'customerId required.' });

      const { moId } = req.params;
      const attachment = await CustomerCollaborationService.uploadOrderAttachment(customerId, {
        moId,
        ...req.body
      });

      return res.status(201).json({
        success: true,
        message: 'Order attachment uploaded successfully',
        data: attachment
      });
    } catch (err: any) {
      return res.status(400).json({ success: false, error: err.message });
    }
  }

  /**
   * GET /api/v1/customer/orders/:moId/notes
   * Get Order Notes (Internal vs Customer Notes Isolation)
   */
  static async getNotes(req: Request, res: Response) {
    try {
      const customerId = (req as any).customerId || (req.query.customerId as string);
      if (!customerId) return res.status(400).json({ success: false, error: 'customerId required.' });

      const { moId } = req.params;
      const isInternal = req.query.internal === 'true';

      const notes = await CustomerCollaborationService.getOrderNotes(customerId, moId, isInternal);
      return res.json({
        success: true,
        count: notes.length,
        data: notes
      });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err.message });
    }
  }

  /**
   * POST /api/v1/customer/orders/:moId/notes
   * Add Order Note
   */
  static async addNote(req: Request, res: Response) {
    try {
      const { moId } = req.params;
      const note = await CustomerCollaborationService.addOrderNote({
        moId,
        ...req.body
      });

      return res.status(201).json({
        success: true,
        message: 'Order note added',
        data: note
      });
    } catch (err: any) {
      return res.status(400).json({ success: false, error: err.message });
    }
  }
}
