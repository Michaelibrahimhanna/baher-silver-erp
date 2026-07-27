import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { PermissionCacheService } from './permission_cache.service';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'baher-silver-erp-secret-key-2026';
const ACCESS_TOKEN_TTL = '15m';
const REFRESH_TOKEN_DAYS = 7;

export class AuthService {
  static async login(params: {
    usernameOrEmail: string;
    password: string;
    ipAddress?: string;
    userAgent?: string;
  }) {
    const { usernameOrEmail, password, ipAddress, userAgent } = params;

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
      const newFailedCount = user.failedLoginCount + 1;
      let lockoutUntil: Date | null = null;
      if (newFailedCount >= 5) {
        lockoutUntil = new Date(Date.now() + 15 * 60 * 1000); // 15 minute lock
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

    const userPerms = await PermissionCacheService.getUserPermissions(user.id);
    const roles = user.userRoles.map(ur => ur.role.roleCode);

    const payload = {
      userId: user.id,
      username: user.username,
      fullNameAr: user.fullNameAr,
      roles,
      branchId: user.branchId,
      warehouseId: user.warehouseId,
      permissions: Array.from(userPerms.permissions)
    };

    const accessToken = jwt.sign(payload, JWT_SECRET, { expiresIn: ACCESS_TOKEN_TTL });

    // Generate Refresh Token & Session
    const rawRefreshToken = crypto.randomBytes(40).toString('hex');
    const refreshTokenHash = crypto.createHash('sha256').update(rawRefreshToken).digest('hex');
    const expiresAt = new Date(Date.now() + REFRESH_TOKEN_DAYS * 24 * 60 * 60 * 1000);

    await prisma.userSession.create({
      data: {
        userId: user.id,
        refreshTokenHash,
        device: userAgent || 'Unknown Device',
        ipAddress: ipAddress || '127.0.0.1',
        expiresAt
      }
    });

    // Record Login History & Security Audit
    await prisma.loginHistory.create({
      data: {
        userId: user.id,
        username: user.username,
        status: 'SUCCESS',
        ipAddress,
        browser: userAgent
      }
    });

    await prisma.authAuditLog.create({
      data: {
        userId: user.id,
        action: 'LOGIN',
        entity: 'User',
        ipAddress,
        userAgent,
        status: 'SUCCESS'
      }
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
        permissions: Array.from(userPerms.permissions)
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
      permissions: Array.from(userPerms.permissions)
    };

    const newAccessToken = jwt.sign(payload, JWT_SECRET, { expiresIn: ACCESS_TOKEN_TTL });

    // Rotate Refresh Token
    const newRawRefreshToken = crypto.randomBytes(40).toString('hex');
    const newRefreshTokenHash = crypto.createHash('sha256').update(newRawRefreshToken).digest('hex');
    const newExpiresAt = new Date(Date.now() + REFRESH_TOKEN_DAYS * 24 * 60 * 60 * 1000);

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
        data: { isRevoked: true }
      });
    }

    PermissionCacheService.invalidateUser(userId);

    await prisma.authAuditLog.create({
      data: {
        userId,
        action: 'LOGOUT',
        entity: 'User',
        status: 'SUCCESS'
      }
    });

    return { success: true };
  }

  static async getUserSessions(userId: string) {
    return prisma.userSession.findMany({
      where: { userId, isRevoked: false, expiresAt: { gt: new Date() } },
      orderBy: { lastActiveAt: 'desc' }
    });
  }

  static async revokeSession(userId: string, sessionId: string) {
    return prisma.userSession.updateMany({
      where: { id: sessionId, userId },
      data: { isRevoked: true }
    });
  }

  static async changePassword(userId: string, oldPassword: string, newPassword: string) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new Error('المستخدم غير موجود');

    const isMatch = await bcrypt.compare(oldPassword, user.passwordHash);
    if (!isMatch) throw new Error('كلمة المرور الحالية غير صحيحة');

    const newHash = await bcrypt.hash(newPassword, 12);
    await prisma.user.update({
      where: { id: userId },
      data: { passwordHash: newHash }
    });

    return { success: true, message: 'تم تغيير كلمة المرور بنجاح' };
  }

  static async resetUserPassword(targetUserId: string, newPassword: string) {
    const newHash = await bcrypt.hash(newPassword, 12);
    await prisma.user.update({
      where: { id: targetUserId },
      data: { passwordHash: newHash, failedLoginCount: 0, lockoutUntil: null }
    });

    return { success: true, message: 'تم إعادة تعيين كلمة المرور بنجاح' };
  }
}
