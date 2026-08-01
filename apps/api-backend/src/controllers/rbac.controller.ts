import { Request, Response } from 'express';
import { RBACService } from '../services/rbac.service';
import { SecurityHardeningService } from '../services/security_hardening.service';

export class RBACController {
  static async listPermissionGroups(req: Request, res: Response) {
    try {
      const data = await RBACService.listPermissionGroups();
      res.json({ success: true, count: data.length, data });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  }

  static async listRoles(req: Request, res: Response) {
    try {
      const data = await RBACService.listRoles();
      res.json({ success: true, count: data.length, data });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  }

  static async createRole(req: Request, res: Response) {
    try {
      const data = await RBACService.createRole(req.body);
      res.status(201).json({ success: true, data });
    } catch (err: any) {
      res.status(400).json({ success: false, error: err.message });
    }
  }

  static async updateRolePermissions(req: Request, res: Response) {
    try {
      const { permissionCodes } = req.body;
      const data = await RBACService.updateRolePermissions(req.params.id, permissionCodes || []);
      res.json({ success: true, data });
    } catch (err: any) {
      res.status(400).json({ success: false, error: err.message });
    }
  }

  static async simulatePermissions(req: Request, res: Response) {
    try {
      const { userId } = req.params;
      const data = await SecurityHardeningService.simulateUserPermissions(userId);
      res.json({ success: true, data });
    } catch (err: any) {
      res.status(400).json({ success: false, error: err.message });
    }
  }

  static async getPermissionDiff(req: Request, res: Response) {
    try {
      const { roleId, userId, proposedPermissionCodes } = req.body;
      const data = await SecurityHardeningService.calculatePermissionDiff({ roleId, userId, proposedPermissionCodes });
      res.json({ success: true, data });
    } catch (err: any) {
      res.status(400).json({ success: false, error: err.message });
    }
  }

  static async getLoginHistory(req: Request, res: Response) {
    try {
      const filters = {
        search: req.query.search as string,
        status: req.query.status as string
      };
      const data = await RBACService.getLoginHistory(filters);
      res.json({ success: true, count: data.length, data });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  }

  static async getAuthAuditLogs(req: Request, res: Response) {
    try {
      const filters = { action: req.query.action as string };
      const data = await RBACService.getAuthAuditLogs(filters);
      res.json({ success: true, count: data.length, data });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  }
}
