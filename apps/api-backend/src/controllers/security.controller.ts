import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { SecurityPolicyService } from '../services/security_policy.service';
import { SecurityHardeningService } from '../services/security_hardening.service';
import { AuthService } from '../services/auth.service';
import { AuditChainService } from '../services/audit_chain.service';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class SecurityController {
  static async getDashboardKpis(req: AuthRequest, res: Response) {
    try {
      const activeUsers = await prisma.user.count({ where: { status: 'ACTIVE', deletedAt: null } });
      const disabledUsers = await prisma.user.count({ where: { status: 'DISABLED', deletedAt: null } });
      const lockedUsers = await prisma.user.count({ where: { lockoutUntil: { gt: new Date() } } });
      const activeSessions = await prisma.userSession.count({ where: { isRevoked: false, expiresAt: { gt: new Date() } } });

      const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
      const failedLogins24h = await prisma.loginHistory.count({
        where: { status: { in: ['FAILED_PASSWORD', 'LOCKED'] }, timestamp: { gte: oneDayAgo } }
      });
      const suspiciousLogins24h = await prisma.authAuditLog.count({
        where: { action: 'SUSPICIOUS_LOGIN_DETECTED', timestamp: { gte: oneDayAgo } }
      });

      const pendingApprovals = await prisma.securityApprovalRequest.count({ where: { status: 'PENDING' } });
      const healthScore = await SecurityHardeningService.calculateSecurityHealthScore();

      res.json({
        success: true,
        data: {
          kpis: {
            activeUsers,
            disabledUsers,
            lockedUsers,
            activeSessions,
            failedLogins24h,
            suspiciousLogins24h,
            pendingApprovals,
            healthScore: healthScore.totalScore,
            healthStatus: healthScore.status
          },
          healthDetails: healthScore
        }
      });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  }

  static async getHealthCheck(req: Request, res: Response) {
    try {
      const health = await SecurityHardeningService.calculateSecurityHealthScore();
      res.json({ success: true, data: health });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  }

  static async getPasswordPolicy(req: Request, res: Response) {
    try {
      const policy = await SecurityPolicyService.getPolicy();
      res.json({ success: true, data: policy });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  }

  static async updatePasswordPolicy(req: AuthRequest, res: Response) {
    try {
      const adminUserId = req.user?.userId;
      const policy = await SecurityPolicyService.updatePolicy(req.body, adminUserId);
      res.json({ success: true, data: policy });
    } catch (err: any) {
      res.status(400).json({ success: false, error: err.message });
    }
  }

  static async getActiveSessions(req: AuthRequest, res: Response) {
    try {
      const sessions = await AuthService.getAllActiveSessions();
      res.json({ success: true, count: sessions.length, data: sessions });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  }

  static async terminateSession(req: AuthRequest, res: Response) {
    try {
      const adminUserId = req.user?.userId || 'SYSTEM';
      const { sessionId } = req.params;
      const { reason } = req.body;
      if (!reason) {
        return res.status(400).json({ success: false, error: 'سبب إنهاء الجلسة إجباري (Mandatory termination reason required)' });
      }
      const result = await AuthService.terminateSession(sessionId, adminUserId, reason);
      res.json({ success: true, data: result });
    } catch (err: any) {
      res.status(400).json({ success: false, error: err.message });
    }
  }

  static async terminateAllUserSessions(req: AuthRequest, res: Response) {
    try {
      const adminUserId = req.user?.userId || 'SYSTEM';
      const { userId } = req.params;
      const { reason } = req.body;
      if (!reason) {
        return res.status(400).json({ success: false, error: 'سبب إنهاء الجلسات إجباري (Mandatory termination reason required)' });
      }
      const result = await AuthService.terminateAllUserSessions(userId, adminUserId, reason);
      res.json({ success: true, data: result });
    } catch (err: any) {
      res.status(400).json({ success: false, error: err.message });
    }
  }

  static async getPermissionDiff(req: AuthRequest, res: Response) {
    try {
      const { roleId, userId, proposedPermissionCodes } = req.body;
      const diff = await SecurityHardeningService.calculatePermissionDiff({ roleId, userId, proposedPermissionCodes });
      res.json({ success: true, data: diff });
    } catch (err: any) {
      res.status(400).json({ success: false, error: err.message });
    }
  }

  static async getUserTimeline(req: AuthRequest, res: Response) {
    try {
      const { userId } = req.params;
      const timeline = await SecurityHardeningService.getUserSecurityTimeline(userId);
      res.json({ success: true, data: timeline });
    } catch (err: any) {
      res.status(400).json({ success: false, error: err.message });
    }
  }

  static async createApprovalRequest(req: AuthRequest, res: Response) {
    try {
      const requestedBy = req.user?.userId;
      if (!requestedBy) return res.status(401).json({ success: false, error: 'Unauthorized' });

      const { requestType, targetId, payload } = req.body;
      const result = await SecurityHardeningService.createApprovalRequest({ requestType, targetId, requestedBy, payload });
      res.json({ success: true, data: result });
    } catch (err: any) {
      res.status(400).json({ success: false, error: err.message });
    }
  }

  static async listApprovalRequests(req: AuthRequest, res: Response) {
    try {
      const status = (req.query.status as string) || 'PENDING';
      const data = await SecurityHardeningService.listApprovalRequests(status);
      res.json({ success: true, count: data.length, data });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  }

  static async processApprovalRequest(req: AuthRequest, res: Response) {
    try {
      const approvedBy = req.user?.userId;
      if (!approvedBy) return res.status(401).json({ success: false, error: 'Unauthorized' });

      const { id } = req.params;
      const { approve, rejectionNote } = req.body;

      const result = await SecurityHardeningService.processApprovalRequest(id, approvedBy, approve, rejectionNote);
      res.json({ success: true, data: result });
    } catch (err: any) {
      res.status(400).json({ success: false, error: err.message });
    }
  }

  static async activateBreakGlass(req: AuthRequest, res: Response) {
    try {
      const adminUserId = req.user?.userId || 'SYSTEM';
      const { reason, durationHours } = req.body;

      if (!reason || reason.trim().length < 10) {
        return res.status(400).json({ success: false, error: 'يجب توضيح سبب تفعيل حساب الطوارئ بالتفصيل (من 10 أحرف على الأقل)' });
      }

      const result = await SecurityPolicyService.activateBreakGlass(adminUserId, reason, durationHours);
      res.json({ success: true, data: result });
    } catch (err: any) {
      res.status(400).json({ success: false, error: err.message });
    }
  }

  static async deactivateBreakGlass(req: AuthRequest, res: Response) {
    try {
      const adminUserId = req.user?.userId || 'SYSTEM';
      const result = await SecurityPolicyService.deactivateBreakGlass(adminUserId);
      res.json({ success: true, data: result });
    } catch (err: any) {
      res.status(400).json({ success: false, error: err.message });
    }
  }

  static async generate2FARecoveryCodes(req: AuthRequest, res: Response) {
    try {
      const userId = req.user?.userId;
      if (!userId) return res.status(401).json({ success: false, error: 'Unauthorized' });
      const result = await SecurityPolicyService.generateRecoveryCodes(userId);
      res.json({ success: true, data: result });
    } catch (err: any) {
      res.status(400).json({ success: false, error: err.message });
    }
  }

  static async verify2FARecoveryCode(req: AuthRequest, res: Response) {
    try {
      const userId = req.user?.userId;
      const { code } = req.body;
      if (!userId) return res.status(401).json({ success: false, error: 'Unauthorized' });
      const result = await SecurityPolicyService.verifyAndConsumeRecoveryCode(userId, code);
      res.json({ success: true, data: result });
    } catch (err: any) {
      res.status(400).json({ success: false, error: err.message });
    }
  }

  static async verifyAuditChain(req: AuthRequest, res: Response) {
    try {
      const verification = await AuditChainService.verifyChainIntegrity();
      res.json({ success: true, data: verification });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  }
}
