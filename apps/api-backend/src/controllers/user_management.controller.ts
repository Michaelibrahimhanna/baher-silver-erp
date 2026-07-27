import { Request, Response } from 'express';
import { UserManagementService } from '../services/user_management.service';

export class UserManagementController {
  static async listUsers(req: Request, res: Response) {
    try {
      const filters = {
        search: req.query.search as string,
        branchId: req.query.branchId as string,
        status: req.query.status as string
      };
      const data = await UserManagementService.listUsers(filters);
      res.json({ success: true, count: data.length, data });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  }

  static async getUserById(req: Request, res: Response) {
    try {
      const data = await UserManagementService.getUserById(req.params.id);
      if (!data) return res.status(404).json({ success: false, error: 'User not found' });
      res.json({ success: true, data });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  }

  static async createUser(req: Request, res: Response) {
    try {
      const data = await UserManagementService.createUser(req.body);
      res.status(201).json({ success: true, data });
    } catch (err: any) {
      res.status(400).json({ success: false, error: err.message });
    }
  }

  static async updateUser(req: Request, res: Response) {
    try {
      const data = await UserManagementService.updateUser(req.params.id, req.body);
      res.json({ success: true, data });
    } catch (err: any) {
      res.status(400).json({ success: false, error: err.message });
    }
  }

  static async softDeleteUser(req: Request, res: Response) {
    try {
      const data = await UserManagementService.softDeleteUser(req.params.id);
      res.json({ success: true, data });
    } catch (err: any) {
      res.status(400).json({ success: false, error: err.message });
    }
  }

  static async setPermissionOverride(req: Request, res: Response) {
    try {
      const { permissionCode, grantType } = req.body;
      const data = await UserManagementService.setUserPermissionOverride(req.params.id, permissionCode, grantType);
      res.json({ success: true, data });
    } catch (err: any) {
      res.status(400).json({ success: false, error: err.message });
    }
  }

  static async removePermissionOverride(req: Request, res: Response) {
    try {
      const { permissionCode } = req.body;
      const data = await UserManagementService.removeUserPermissionOverride(req.params.id, permissionCode);
      res.json({ success: true, data });
    } catch (err: any) {
      res.status(400).json({ success: false, error: err.message });
    }
  }
}
