import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';
import { AuthRequest } from '../middleware/auth';

export class AuthController {
  static async login(req: Request, res: Response) {
    try {
      const { usernameOrEmail, password, rememberMe } = req.body;
      const ipAddress = req.ip || (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress;
      const userAgent = req.headers['user-agent'];

      const result = await AuthService.login({
        usernameOrEmail,
        password,
        rememberMe,
        ipAddress,
        userAgent
      });

      res.json({ success: true, data: result });
    } catch (err: any) {
      res.status(401).json({ success: false, error: err.message });
    }
  }

  static async refresh(req: Request, res: Response) {
    try {
      const { refreshToken } = req.body;
      if (!refreshToken) {
        return res.status(400).json({ success: false, error: 'Refresh token is required' });
      }
      const result = await AuthService.refreshToken(refreshToken);
      res.json({ success: true, data: result });
    } catch (err: any) {
      res.status(401).json({ success: false, error: err.message });
    }
  }

  static async logout(req: AuthRequest, res: Response) {
    try {
      const userId = req.user?.userId;
      const { refreshToken } = req.body || {};
      if (userId) {
        await AuthService.logout(userId, refreshToken);
      }
      res.json({ success: true, message: 'Logged out successfully' });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  }

  static async impersonate(req: AuthRequest, res: Response) {
    try {
      const superAdminUserId = req.user?.userId;
      if (!superAdminUserId) return res.status(401).json({ success: false, error: 'Unauthorized' });

      const { targetUserId } = req.body;
      if (!targetUserId) return res.status(400).json({ success: false, error: 'Target user ID is required' });

      const ipAddress = req.ip || (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress;
      const userAgent = req.headers['user-agent'];

      const result = await AuthService.impersonateUser(superAdminUserId, targetUserId, ipAddress, userAgent);
      res.json({ success: true, data: result });
    } catch (err: any) {
      res.status(400).json({ success: false, error: err.message });
    }
  }

  static async revertImpersonation(req: AuthRequest, res: Response) {
    try {
      const currentUserId = req.user?.userId;
      const impersonatorId = (req.user as any)?.impersonatorId;

      if (!impersonatorId && !currentUserId) {
        return res.status(400).json({ success: false, error: 'No active impersonation context found' });
      }

      const result = await AuthService.revertImpersonation(impersonatorId || currentUserId!);
      res.json({ success: true, data: result });
    } catch (err: any) {
      res.status(400).json({ success: false, error: err.message });
    }
  }

  static async getMe(req: AuthRequest, res: Response) {
    try {
      res.json({ success: true, data: req.user });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  }

  static async getSessions(req: AuthRequest, res: Response) {
    try {
      const userId = req.user?.userId;
      if (!userId) return res.status(401).json({ success: false, error: 'Unauthorized' });
      const data = await AuthService.getUserSessions(userId);
      res.json({ success: true, count: data.length, data });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  }

  static async revokeSession(req: AuthRequest, res: Response) {
    try {
      const userId = req.user?.userId;
      const { id } = req.params;
      const { reason } = req.body || {};
      if (!userId) return res.status(401).json({ success: false, error: 'Unauthorized' });
      await AuthService.terminateSession(id, userId, reason || 'User revoked session');
      res.json({ success: true, message: 'Session revoked successfully' });
    } catch (err: any) {
      res.status(400).json({ success: false, error: err.message });
    }
  }

  static async changePassword(req: AuthRequest, res: Response) {
    try {
      const userId = req.user?.userId;
      const { oldPassword, newPassword } = req.body;
      if (!userId) return res.status(401).json({ success: false, error: 'Unauthorized' });
      const result = await AuthService.changePassword(userId, oldPassword, newPassword);
      res.json({ success: true, data: result });
    } catch (err: any) {
      res.status(400).json({ success: false, error: err.message });
    }
  }

  static async resetPassword(req: AuthRequest, res: Response) {
    try {
      const adminUserId = req.user?.userId;
      const { targetUserId, newPassword } = req.body;
      const result = await AuthService.resetUserPassword(targetUserId, newPassword, adminUserId);
      res.json({ success: true, data: result });
    } catch (err: any) {
      res.status(400).json({ success: false, error: err.message });
    }
  }
}
