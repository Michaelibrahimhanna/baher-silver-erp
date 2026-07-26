import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'baher-silver-erp-secret-key-2026';

export class AuthController {
  static async login(req: AuthRequest, res: Response) {
    try {
      const { username, password } = req.body;
      if (!username || !password) {
        return res.status(400).json({ success: false, error: 'Username and password required' });
      }

      // Demo auth payload simulation for ERP Super Admin
      const userPayload = {
        userId: '00000000-0000-0000-0000-000000000001',
        companyId: '00000000-0000-0000-0000-000000000000',
        username: username,
        roles: ['super_admin'],
        permissions: ['system:admin', 'inventory:read', 'inventory:write', 'production:read', 'production:execute', 'sales:manage', 'purchasing:approve']
      };

      const token = jwt.sign(userPayload, JWT_SECRET, { expiresIn: '24h' });

      return res.json({
        success: true,
        message: 'Authentication successful',
        data: {
          token,
          user: userPayload
        }
      });
    } catch (error: any) {
      return res.status(500).json({ success: false, error: error.message });
    }
  }

  static async me(req: AuthRequest, res: Response) {
    return res.json({
      success: true,
      data: req.user
    });
  }
}
