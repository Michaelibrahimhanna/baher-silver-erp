import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { PermissionCacheService } from './permission_cache.service';
import { SecurityPolicyService } from './security_policy.service';
import { AuditChainService } from './audit_chain.service';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'baher-silver-erp-secret-key-2026';
const ACCESS_TOKEN_TTL = '15m';

export class AuthService {
  static async login(params: {
    usernameOrEmail: string;
    password: string;
    rememberMe?: boolean;
    ipAddress?: string;
    userAgent?: string;
  }) {
    const { usernameOrEmail, password, rememberMe = false, ipAddress, userAgent } = params;

    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { username: usernameOrEmail },
          { email: usernameOrEmail }
        ],
        deletedAt: null
      },
      include: {
        userRoles: { include: { role: true } }
      }
    });

    if (!user) {
      await prisma.loginHistory.create({
        data: {
          username: usernameOrEmail,
          status: 'FAILED_USER_NOT_FOUND',
          ipAddress,
          browser: userAgent
        }
      });
      throw new Error('اسم المستخدم أو كلمة المرور غير صحيحة');
    }

    // Check account lockout
    if (user.lockoutUntil && user.lockoutUntil > new Date()) {
      await prisma.loginHistory.create({
        data: {
          userId: user.id,
          username: user.username,
          status: 'LOCKED',
          ipAddress,
          browser: userAgent
        }
      });
      throw new Error('الحساب مغلق مؤقتاً بسبب تكرار المحاولات الخاطئة. حاول لاحقاً');
    }

    if (user.status !== 'ACTIVE') {
      throw new Error('هذا الحساب معطل. يرجى مراجعة مسؤول النظام');
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);

    if (!isMatch) {
      const policy = await SecurityPolicyService.getPolicy();
      const newFailedCount = user.failedLoginCount + 1;
      let lockoutUntil: Date | null = null;
      if (newFailedCount >= policy.lockoutThreshold) {
        lockoutUntil = new Date(Date.now() + policy.lockoutDurationMinutes * 60 * 1000);
      }

      await prisma.user.update({
        where: { id: user.id },
        data: { failedLoginCount: newFailedCount, lockoutUntil }
      });

      await prisma.loginHistory.create({
        data: {
          userId: user.id,
          username: user.username,
          status: 'FAILED_PASSWORD',
          ipAddress,
          browser: userAgent
        }
      });

      throw new Error('اسم المستخدم أو كلمة المرور غير صحيحة');
    }

    // Successful Login: Reset fail counters
    await prisma.user.update({
      where: { id: user.id },
      data: { failedLoginCount: 0, lockoutUntil: null, lastLoginAt: new Date() }
    });

    // Evaluate Login Risk / Suspicious Login
    await SecurityPolicyService.evaluateLoginRisk(user.id, user.username, ipAddress, userAgent);

    const userPerms = await PermissionCacheService.getUserPermissions(user.id);
    const roles = user.userRoles.map(ur => ur.role.roleCode);

    const payload = {
      userId: user.id,
      username: user.username,
      fullNameAr: user.fullNameAr,
      roles,
      branchId: user.branchId,
      warehouseId: user.warehouseId,
      permissions: Array.from(userPerms.permissions),
      mustChangePassword: user.mustChangePassword
    };

    const accessToken = jwt.sign(payload, JWT_SECRET, { expiresIn: ACCESS_TOKEN_TTL });

    // Generate Refresh Token & Session (Remember Me: 30 days vs 7 days)
    const refreshDays = rememberMe ? 30 : 7;
    const rawRefreshToken = crypto.randomBytes(40).toString('hex');
    const refreshTokenHash = crypto.createHash('sha256').update(rawRefreshToken).digest('hex');
    const expiresAt = new Date(Date.now() + refreshDays * 24 * 60 * 60 * 1000);

    await prisma.userSession.create({
      data: {
        userId: user.id,
        refreshTokenHash,
        device: userAgent || 'Unknown Device',
        ipAddress: ipAddress || '127.0.0.1',
        expiresAt
      }
    });

    // Record Login History & Hash-Chained Audit Log
    await prisma.loginHistory.create({
      data: {
        userId: user.id,
        username: user.username,
        status: 'SUCCESS',
        ipAddress,
        browser: userAgent
      }
    });

    await AuditChainService.logEvent({
      userId: user.id,
      action: 'LOGIN',
      entity: 'User',
      ipAddress,
      userAgent,
      status: 'SUCCESS',
      details: `Login successful (RememberMe: ${rememberMe})`
    });

    return {
      accessToken,
      refreshToken: rawRefreshToken,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        fullNameAr: user.fullNameAr,
        roles,
        branchId: user.branchId,
        warehouseId: user.warehouseId,
        permissions: Array.from(userPerms.permissions),
        mustChangePassword: user.mustChangePassword
      }
    };
  }

  static async refreshToken(rawRefreshToken: string) {
    const refreshTokenHash = crypto.createHash('sha256').update(rawRefreshToken).digest('hex');

    const session = await prisma.userSession.findUnique({
      where: { refreshTokenHash },
      include: { user: true }
    });

    if (!session || session.isRevoked || session.expiresAt < new Date() || session.user.deletedAt || session.user.status !== 'ACTIVE') {
      throw new Error('جلسة غير صالحة أو منتهية الصلاحية');
    }

    const user = session.user;
    const userPerms = await PermissionCacheService.getUserPermissions(user.id);

    const payload = {
      userId: user.id,
      username: user.username,
      fullNameAr: user.fullNameAr,
      roles: Array.from(userPerms.roles),
      branchId: user.branchId,
      warehouseId: user.warehouseId,
      permissions: Array.from(userPerms.permissions),
      mustChangePassword: user.mustChangePassword
    };

    const newAccessToken = jwt.sign(payload, JWT_SECRET, { expiresIn: ACCESS_TOKEN_TTL });

    // Rotate Refresh Token
    const newRawRefreshToken = crypto.randomBytes(40).toString('hex');
    const newRefreshTokenHash = crypto.createHash('sha256').update(newRawRefreshToken).digest('hex');
    const newExpiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    await prisma.userSession.update({
      where: { id: session.id },
      data: {
        refreshTokenHash: newRefreshTokenHash,
        lastActiveAt: new Date(),
        expiresAt: newExpiresAt
      }
    });

    return {
      accessToken: newAccessToken,
      refreshToken: newRawRefreshToken
    };
  }

  static async logout(userId: string, rawRefreshToken?: string) {
    if (rawRefreshToken) {
      const refreshTokenHash = crypto.createHash('sha256').update(rawRefreshToken).digest('hex');
      await prisma.userSession.updateMany({
        where: { refreshTokenHash },
        data: { isRevoked: true, terminationReason: 'User Logout' }
      });
    }

    PermissionCacheService.invalidateUser(userId);

    await AuditChainService.logEvent({
      userId,
      action: 'LOGOUT',
      entity: 'User',
      status: 'SUCCESS'
    });

    return { success: true };
  }

  // User Impersonation Workflow
  static async impersonateUser(superAdminUserId: string, targetUserId: string, ipAddress?: string, userAgent?: string) {
    const superAdmin = await prisma.user.findUnique({
      where: { id: superAdminUserId },
      include: { userRoles: { include: { role: true } } }
    });

    const isSuperAdmin = superAdmin?.userRoles.some(ur => ur.role.roleCode === 'SUPER_ADMIN');
    if (!isSuperAdmin) {
      throw new Error('عفواً، ميزة التقمص متاحة فقط لمدير النظام الفائق (Super Admin)');
    }

    const targetUser = await prisma.user.findUnique({
      where: { id: targetUserId },
      include: { userRoles: { include: { role: true } } }
    });

    if (!targetUser || targetUser.deletedAt || targetUser.status !== 'ACTIVE') {
      throw new Error('المستخدم المستهدف غير موجود أو غير نشط');
    }

    const targetPerms = await PermissionCacheService.getUserPermissions(targetUser.id);
    const roles = targetUser.userRoles.map(ur => ur.role.roleCode);

    const payload = {
      userId: targetUser.id,
      username: targetUser.username,
      fullNameAr: targetUser.fullNameAr,
      roles,
      branchId: targetUser.branchId,
      warehouseId: targetUser.warehouseId,
      permissions: Array.from(targetPerms.permissions),
      isImpersonated: true,
      impersonatorId: superAdmin.id,
      impersonatorUsername: superAdmin.username
    };

    const accessToken = jwt.sign(payload, JWT_SECRET, { expiresIn: ACCESS_TOKEN_TTL });

    // Generate Refresh Token for Impersonation Session
    const rawRefreshToken = crypto.randomBytes(40).toString('hex');
    const refreshTokenHash = crypto.createHash('sha256').update(rawRefreshToken).digest('hex');
    const expiresAt = new Date(Date.now() + 2 * 60 * 60 * 1000); // 2 hours max for impersonation

    await prisma.userSession.create({
      data: {
        userId: targetUser.id,
        refreshTokenHash,
        device: userAgent || 'Impersonation Session',
        ipAddress: ipAddress || '127.0.0.1',
        expiresAt
      }
    });

    // Mandatory Security Audit Logging
    await AuditChainService.logEvent({
      userId: targetUser.id,
      action: 'IMPERSONATE',
      entity: 'User',
      ipAddress,
      userAgent,
      status: 'SUCCESS',
      details: `Super Admin ${superAdmin.username} (${superAdmin.id}) temporarily impersonated user ${targetUser.username} (${targetUser.id})`
    });

    return {
      accessToken,
      refreshToken: rawRefreshToken,
      user: {
        id: targetUser.id,
        username: targetUser.username,
        fullNameAr: targetUser.fullNameAr,
        roles,
        branchId: targetUser.branchId,
        warehouseId: targetUser.warehouseId,
        permissions: Array.from(targetPerms.permissions),
        isImpersonated: true,
        impersonator: {
          id: superAdmin.id,
          username: superAdmin.username,
          fullNameAr: superAdmin.fullNameAr
        }
      }
    };
  }

  static async revertImpersonation(impersonatorUserId: string) {
    const admin = await prisma.user.findUnique({
      where: { id: impersonatorUserId },
      include: { userRoles: { include: { role: true } } }
    });

    if (!admin) throw new Error('حساب مدير النظام غير موجود');

    const userPerms = await PermissionCacheService.getUserPermissions(admin.id);
    const roles = admin.userRoles.map(ur => ur.role.roleCode);

    const payload = {
      userId: admin.id,
      username: admin.username,
      fullNameAr: admin.fullNameAr,
      roles,
      branchId: admin.branchId,
      warehouseId: admin.warehouseId,
      permissions: Array.from(userPerms.permissions)
    };

    const accessToken = jwt.sign(payload, JWT_SECRET, { expiresIn: ACCESS_TOKEN_TTL });

    await AuditChainService.logEvent({
      userId: admin.id,
      action: 'IMPERSONATE_REVERT',
      entity: 'User',
      status: 'SUCCESS',
      details: `User ${admin.username} restored original Super Admin context from impersonation session`
    });

    return {
      accessToken,
      user: {
        id: admin.id,
        username: admin.username,
        fullNameAr: admin.fullNameAr,
        roles,
        branchId: admin.branchId,
        warehouseId: admin.warehouseId,
        permissions: Array.from(userPerms.permissions)
      }
    };
  }

  // Session Management with Mandatory Termination Reason
  static async getUserSessions(userId: string) {
    return prisma.userSession.findMany({
      where: { userId, isRevoked: false, expiresAt: { gt: new Date() } },
      orderBy: { lastActiveAt: 'desc' }
    });
  }

  static async getAllActiveSessions() {
    return prisma.userSession.findMany({
      where: { isRevoked: false, expiresAt: { gt: new Date() } },
      include: {
        user: {
          select: { id: true, username: true, fullNameAr: true, branchId: true }
        }
      },
      orderBy: { lastActiveAt: 'desc' }
    });
  }

  static async terminateSession(sessionId: string, terminatedByUserId: string, reason: string) {
    const session = await prisma.userSession.findUnique({ where: { id: sessionId } });
    if (!session) throw new Error('الجلسة غير موجودة');

    await prisma.userSession.update({
      where: { id: sessionId },
      data: {
        isRevoked: true,
        terminationReason: reason || 'إنهاء قسري من مسؤول النظام',
        terminatedByUserId
      }
    });

    PermissionCacheService.invalidateUser(session.userId);

    await AuditChainService.logEvent({
      userId: terminatedByUserId,
      action: 'FORCE_TERMINATE_SESSION',
      entity: 'UserSession',
      details: `Session #${sessionId} of user ${session.userId} terminated. Reason: ${reason}`
    });

    return { success: true, message: 'تم إنهاء الجلسة بنجاح' };
  }

  static async terminateAllUserSessions(targetUserId: string, terminatedByUserId: string, reason: string) {
    await prisma.userSession.updateMany({
      where: { userId: targetUserId, isRevoked: false },
      data: {
        isRevoked: true,
        terminationReason: reason || 'إنهاء كلي لكافة جلسات المستخدم',
        terminatedByUserId
      }
    });

    PermissionCacheService.invalidateUser(targetUserId);

    await AuditChainService.logEvent({
      userId: terminatedByUserId,
      action: 'FORCE_TERMINATE_ALL_SESSIONS',
      entity: 'User',
      details: `All active sessions for user ${targetUserId} terminated. Reason: ${reason}`
    });

    return { success: true, message: 'تم إنهاء جميع جلسات المستخدم بنجاح' };
  }

  static async changePassword(userId: string, oldPassword: string, newPassword: string) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new Error('المستخدم غير موجود');

    const isMatch = await bcrypt.compare(oldPassword, user.passwordHash);
    if (!isMatch) throw new Error('كلمة المرور الحالية غير صحيحة');

    // Validate Password Complexity & History
    const validation = await SecurityPolicyService.validatePasswordComplexity(newPassword, userId);
    if (!validation.valid) {
      throw new Error(validation.errors.join(' | '));
    }

    const newHash = await bcrypt.hash(newPassword, 12);
    await prisma.user.update({
      where: { id: userId },
      data: { passwordHash: newHash, mustChangePassword: false }
    });

    // Record Password History
    await SecurityPolicyService.recordPasswordHistory(userId, newHash);

    await AuditChainService.logEvent({
      userId,
      action: 'CHANGE_PASSWORD',
      entity: 'User',
      details: 'Password changed successfully'
    });

    return { success: true, message: 'تم تغيير كلمة المرور بنجاح' };
  }

  static async resetUserPassword(targetUserId: string, newPassword: string, adminUserId?: string) {
    const validation = await SecurityPolicyService.validatePasswordComplexity(newPassword, targetUserId);
    if (!validation.valid) {
      throw new Error(validation.errors.join(' | '));
    }

    const newHash = await bcrypt.hash(newPassword, 12);
    await prisma.user.update({
      where: { id: targetUserId },
      data: { passwordHash: newHash, failedLoginCount: 0, lockoutUntil: null }
    });

    await SecurityPolicyService.recordPasswordHistory(targetUserId, newHash);

    await AuditChainService.logEvent({
      userId: adminUserId || targetUserId,
      action: 'RESET_PASSWORD',
      entity: 'User',
      details: `Password for user ${targetUserId} reset by admin`
    });

    return { success: true, message: 'تم إعادة تعيين كلمة المرور بنجاح' };
  }
}
