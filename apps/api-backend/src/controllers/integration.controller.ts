import { Request, Response } from 'express';
import { EnterpriseIntegrationService } from '../services/enterprise_integration.service';
import { EnterpriseEventBus } from '../services/enterprise_event_bus.service';

export class IntegrationController {
  // Enterprise Health Diagnostics
  static async getHealthDiagnostics(req: Request, res: Response) {
    try {
      const diagnostics = await EnterpriseIntegrationService.runEnterpriseHealthDiagnostics();
      res.json({ success: true, data: diagnostics });
    } catch (e: any) {
      res.status(500).json({ success: false, error: e.message });
    }
  }

  // Cross-Module Consistency Verification
  static async getConsistencyCheck(req: Request, res: Response) {
    try {
      const consistency = await EnterpriseIntegrationService.validateCrossModuleConsistency();
      res.json({ success: true, data: consistency });
    } catch (e: any) {
      res.status(500).json({ success: false, error: e.message });
    }
  }

  // Idempotent Event Publishing API
  static async publishEvent(req: Request, res: Response) {
    const idempotencyKey = req.headers['idempotency-key'] as string || req.body.idempotencyKey;
    const endpoint = '/api/v1/integration/events/publish';

    try {
      const result = await EnterpriseIntegrationService.executeIdempotentOperation(
        idempotencyKey,
        endpoint,
        req.body,
        async (correlationId) => {
          const { eventType, payload } = req.body;
          const outbox = await EnterpriseEventBus.publishOutboxEvent(
            eventType,
            { ...payload, correlationId },
            { correlationId }
          );
          return { status: 200, body: { message: `Event "${eventType}" published to Outbox.`, outbox } };
        }
      );

      res.status(result.status).json({
        success: true,
        correlationId: result.correlationId,
        fromCache: result.fromCache,
        data: result.body
      });
    } catch (e: any) {
      res.status(400).json({ success: false, error: e.message });
    }
  }

  // Outbox Processor Worker Endpoint
  static async processOutbox(req: Request, res: Response) {
    try {
      const result = await EnterpriseEventBus.processOutboxQueue(50);
      res.json({ success: true, data: result });
    } catch (e: any) {
      res.status(500).json({ success: false, error: e.message });
    }
  }

  // Dead Letter Queue (DLQ) Management
  static async getDLQ(req: Request, res: Response) {
    try {
      const dlq = await EnterpriseEventBus.getDLQEvents();
      res.json({ success: true, data: dlq });
    } catch (e: any) {
      res.status(500).json({ success: false, error: e.message });
    }
  }

  static async replayDLQ(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const replayed = await EnterpriseEventBus.replayDLQEvent(id);
      res.json({ success: true, data: replayed });
    } catch (e: any) {
      res.status(400).json({ success: false, error: e.message });
    }
  }
}
