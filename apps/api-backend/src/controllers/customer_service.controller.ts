import { Request, Response } from 'express';
import { CustomerServiceService } from '../services/customer_service.service';

export class CustomerServiceController {
  /**
   * POST /api/v1/customer/service/requests
   * Submit Service / Repair / Maintenance / Inspection Request
   */
  static async createRequest(req: Request, res: Response) {
    try {
      const customerId = (req as any).customerId || req.body.customerId;
      if (!customerId) return res.status(400).json({ success: false, error: 'customerId required.' });

      const request = await CustomerServiceService.createServiceRequest({
        ...req.body,
        customerId
      });

      return res.status(201).json({
        success: true,
        message: `Service request ${request.requestNo} created successfully.`,
        data: request
      });
    } catch (err: any) {
      return res.status(400).json({ success: false, error: err.message });
    }
  }

  /**
   * GET /api/v1/customer/service/requests
   * List Customer Service Requests
   */
  static async listRequests(req: Request, res: Response) {
    try {
      const customerId = (req as any).customerId || (req.query.customerId as string);
      if (!customerId) return res.status(400).json({ success: false, error: 'customerId required.' });

      const requests = await CustomerServiceService.getCustomerServiceRequests(customerId, {
        requestType: req.query.requestType as string,
        status: req.query.status as string,
        priority: req.query.priority as string
      });

      return res.json({
        success: true,
        data: requests
      });
    } catch (err: any) {
      return res.status(400).json({ success: false, error: err.message });
    }
  }

  /**
   * GET /api/v1/customer/service/requests/:id
   * Get Service Request Details & Timeline
   */
  static async getRequestDetails(req: Request, res: Response) {
    try {
      const customerId = (req as any).customerId || (req.query.customerId as string);
      const isInternal = req.query.isInternal === 'true';
      const { id } = req.params;

      const details = await CustomerServiceService.getServiceRequestDetails(id, customerId, isInternal);
      return res.json({
        success: true,
        data: details
      });
    } catch (err: any) {
      return res.status(404).json({ success: false, error: err.message });
    }
  }

  /**
   * POST /api/v1/customer/service/requests/:id/attachments
   * Upload Service Attachment (Images, Videos, PDFs, CAD documents)
   */
  static async addAttachment(req: Request, res: Response) {
    try {
      const customerId = (req as any).customerId || req.body.customerId;
      const { id } = req.params;

      const attachment = await CustomerServiceService.addAttachment({
        ...req.body,
        serviceRequestId: id,
        customerId
      });

      return res.status(201).json({
        success: true,
        message: 'Attachment uploaded successfully.',
        data: attachment
      });
    } catch (err: any) {
      return res.status(400).json({ success: false, error: err.message });
    }
  }

  /**
   * POST /api/v1/customer/service/requests/:id/approve-cost
   * Customer Approve Service Cost
   */
  static async approveCost(req: Request, res: Response) {
    try {
      const customerId = (req as any).customerId || req.body.customerId;
      const { id } = req.params;

      const updated = await CustomerServiceService.customerApproveCost(id, customerId);
      return res.json({
        success: true,
        message: 'Service cost approved by customer.',
        data: updated
      });
    } catch (err: any) {
      return res.status(400).json({ success: false, error: err.message });
    }
  }

  /**
   * POST /api/v1/customer/service/requests/:id/survey
   * Submit Customer Satisfaction Survey
   */
  static async submitSurvey(req: Request, res: Response) {
    try {
      const customerId = (req as any).customerId || req.body.customerId;
      const { id } = req.params;

      const updated = await CustomerServiceService.submitSatisfactionSurvey({
        ...req.body,
        serviceRequestId: id,
        customerId
      });

      return res.json({
        success: true,
        message: 'Satisfaction survey submitted successfully.',
        data: updated
      });
    } catch (err: any) {
      return res.status(400).json({ success: false, error: err.message });
    }
  }

  /**
   * POST /api/v1/internal/service/requests/:id/assign
   * Internal Assign Technician / Supervisor
   */
  static async internalAssign(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const updated = await CustomerServiceService.assignTechnician(id, req.body);

      return res.json({
        success: true,
        message: `Technician assigned to service request successfully.`,
        data: updated
      });
    } catch (err: any) {
      return res.status(400).json({ success: false, error: err.message });
    }
  }

  /**
   * POST /api/v1/internal/service/requests/:id/status
   * Internal Update Service Status & Factory Response
   */
  static async internalUpdateStatus(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const updated = await CustomerServiceService.updateServiceStatus(id, req.body);

      return res.json({
        success: true,
        message: `Service status updated to '${updated.status}'.`,
        data: updated
      });
    } catch (err: any) {
      return res.status(400).json({ success: false, error: err.message });
    }
  }
}
