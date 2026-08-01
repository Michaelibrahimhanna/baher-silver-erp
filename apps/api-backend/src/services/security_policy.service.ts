import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { AuditChainService } from './audit_chain.service';

const prisma = new PrismaClient();

export class SecurityPolicyService {
  static async getPolicy() {
    let policy = await prisma.securityPolicyConfig.findUnique({
      where: { id: 'default-security-policy' }
    });

    if (!policy) {
      policy = await prisma.securityPolicyConfig.create({
        data: {
          id: 'default-security-policy',
          minLength: 8,
          requireUppercase: true,
          requireLowercase: true,
          requireNumbers: true,
          requireSpecialChars: true,
          maxAgeDays: 90,
          preventReuseCount: 5,
          lockoutThreshold: 5,
          lockoutDurationMinutes: 15,
          featureSaasMultiTenant: false
        }
      });
    }

    return policy;
  }

  static async updatePolicy(updates: Partial<{
    minLength: number;
    requireUppercase: boolean;
    requireLowercase: boolean;
    requireNumbers: boolean;
    requireSpecialChars: boolean;
    maxAgeDays: number;
    preventReuseCount: number;
    lockoutThreshold: number;
    lockoutDurationMinutes: number;
    featureSaasMultiTenant: boolean;
  }>, adminUserId?: string) {
    const policy = await prisma.securityPolicyConfig.upsert({
      where: { id: 'default-security-policy' },
      update: updates,
      create: {
        id: 'default-security-policy',
        ...updates
      }
    });

    await AuditChainService.logEvent({
      userId: adminUserId,
      action: 'UPDATE_SECURITY_POLICY',
      entity: 'SecurityPolicyConfig',
      details: `Updated policy rules: ${JSON.stringify(updates)}`
    });

    return policy;
  }

  static async validatePasswordComplexity(password: string, userId?: string): Promise<{ valid: boolean; errors: string[] }> {
    const policy = await this.getPolicy();
    const errors: string[] = [];

    if (password.length < policy.minLength) {
      errors.push(`كلمة المرور يجب أن لا تقل عن ${policy.minLength} أحرف (Password must be at least ${policy.minLength} chars)`);
    }

    if (policy.requireUppercase && !/[A-Z]/.test(password)) {
      errors.push('كلمة المرور يجب أن تحتوي على حرف كبير واحد على الأقل (Must contain at least one uppercase letter)');
    }

    if (policy.requireLowercase && !/[a-z]/.test(password)) {
      errors.push('كلمة المرور يجب أن تحتوي على حرف صغير واحد على الأقل (Must contain at least one lowercase letter)');
    }

    if (policy.requireNumbers && !/[0-9]/.test(password)) {
      errors.push('كلمة المرور يجب أن تحتوي على رقم واحد على الأقل (Must contain at least one number)');
    }

    if (policy.requireSpecialChars && !/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
      errors.push('كلمة المرور يجب أن تحتوي على رمز خاص واحد على الأقل (Must contain at least one special character)');
    }

    // Check Password History reuse
    if (userId && policy.preventReuseCount > 0) {
      const history = await prisma.passwordHistory.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        take: policy.preventReuseCount
      });

      for (const entry of history) {
        const isMatch = await bcrypt.compare(password, entry.passwordHash);
        if (isMatch) {
          errors.push(`لا يمكن إعادة استخدام آخر ${policy.preventReuseCount} كلمات مرور تم استخدامها سابقاً (Cannot reuse any of your last ${policy.preventReuseCount} passwords)`);
          break;
        }
      }
    }

    return { valid: errors.length === 0, errors };
  }

  static async recordPasswordHistory(userId: string, passwordHash: string) {
    const policy = await this.getPolicy();
    await prisma.passwordHistory.create({
      data: { userId, passwordHash }
    });

    // Cleanup history beyond limit
    const allHistory = await prisma.passwordHistory.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    });

    if (allHistory.length > policy.preventReuseCount * 2) {
      const toDelete = allHistory.slice(policy.preventReuseCount * 2).map(h => h.id);
      await prisma.passwordHistory.deleteMany({
        where: { id: { in: toDelete } }
      });
    }
  }

  static async evaluateLoginRisk(userId: string, username: string, ipAddress?: string, userAgent?: string) {
    // Detect new IP / user agent for active user
    const previousSuccess = await prisma.loginHistory.findFirst({
      where: { userId, status: 'SUCCESS' },
      orderBy: { timestamp: 'desc' }
    });

    let isSuspicious = false;
    let reason = '';

    if (previousSuccess) {
      if (ipAddress && previousSuccess.ipAddress && previousSuccess.ipAddress !== ipAddress) {
        isSuspicious = true;
        reason += `[New IP: ${ipAddress} vs ${previousSuccess.ipAddress}] `;
      }
      if (userAgent && previousSuccess.browser && previousSuccess.browser !== userAgent) {
        isSuspicious = true;
        reason += `[New Device/Browser] `;
      }
    }

    // High velocity failures check in last 10 minutes
    const tenMinAgo = new Date(Date.now() - 10 * 60 * 1000);
    const recentFailures = await prisma.loginHistory.count({
      where: { username, status: { in: ['FAILED_PASSWORD', 'LOCKED'] }, timestamp: { gte: tenMinAgo } }
    });

    if (recentFailures >= 3) {
      isSuspicious = true;
      reason += `[High Velocity Failures: ${recentFailures} in 10m] `;
    }

    if (isSuspicious) {
      await AuditChainService.logEvent({
        userId,
        action: 'SUSPICIOUS_LOGIN_DETECTED',
        entity: 'User',
        ipAddress,
        userAgent,
        status: 'WARNING',
        details: `Suspicious login detected for ${username}: ${reason}`
      });
    }

    return { isSuspicious, reason };
  }

  // Break Glass Emergency Account Protocol
  static async activateBreakGlass(adminUserId: string, reason: string, durationHours = 4) {
    const breakGlassUser = await prisma.user.findFirst({
      where: { isBreakGlassAccount: true, deletedAt: null }
    });

    if (!breakGlassUser) {
      throw new Error('حساب الطوارئ غير مهيأ في النظام');
    }

    // Activate account, force immediate password reset
    const tempPassword = `BG-${crypto.randomBytes(6).toString('hex')}!2026`;
    const passwordHash = await bcrypt.hash(tempPassword, 12);

    await prisma.user.update({
      where: { id: breakGlassUser.id },
      data: {
        status: 'ACTIVE',
        passwordHash,
        mustChangePassword: true,
        failedLoginCount: 0,
        lockoutUntil: null
      }
    });

    await AuditChainService.logEvent({
      userId: adminUserId,
      action: 'BREAK_GLASS_ACTIVATED',
      entity: 'BreakGlassAccount',
      status: 'CRITICAL_SECURITY_EVENT',
      details: `CRITICAL: Break Glass Emergency Account activated by user ${adminUserId}. Reason: ${reason}`
    });

    return {
      success: true,
      username: breakGlassUser.username,
      temporaryPassword: tempPassword,
      expiresInHours: durationHours,
      message: 'تم تفعيل حساب الطوارئ بنجاح. يجب تغيير كلمة المرور فور تسجيل الدخول.'
    };
  }

  static async deactivateBreakGlass(adminUserId: string) {
    const breakGlassUser = await prisma.user.findFirst({
      where: { isBreakGlassAccount: true }
    });

    if (breakGlassUser) {
      await prisma.user.update({
        where: { id: breakGlassUser.id },
        data: { status: 'DISABLED' }
      });

      await AuditChainService.logEvent({
        userId: adminUserId,
        action: 'BREAK_GLASS_DEACTIVATED',
        entity: 'BreakGlassAccount',
        details: `Break Glass Emergency Account deactivated by admin ${adminUserId}`
      });
    }

    return { success: true, message: 'تم إيقاف حساب الطوارئ بنجاح' };
  }

  // 2FA Disaster Recovery Codes
  static async generateRecoveryCodes(userId: string) {
    await prisma.userTwoFactorRecoveryCode.deleteMany({ where: { userId } });

    const rawCodes: string[] = [];
    for (let i = 0; i < 10; i++) {
      const code = crypto.randomBytes(4).toString('hex').toUpperCase();
      rawCodes.push(code);

      const codeHash = crypto.createHash('sha256').update(code).digest('hex');
      await prisma.userTwoFactorRecoveryCode.create({
        data: { userId, codeHash }
      });
    }

    await AuditChainService.logEvent({
      userId,
      action: 'GENERATE_2FA_RECOVERY_CODES',
      entity: 'User',
      details: 'Generated 10 emergency 2FA disaster recovery codes'
    });

    return { recoveryCodes: rawCodes };
  }

  static async verifyAndConsumeRecoveryCode(userId: string, code: string) {
    const codeHash = crypto.createHash('sha256').update(code.trim().toUpperCase()).digest('hex');

    const match = await prisma.userTwoFactorRecoveryCode.findFirst({
      where: { userId, codeHash, isUsed: false }
    });

    if (!match) {
      throw new Error('رمز استعادة الطوارئ غير صحيح أو تم استخدامه سابقاً');
    }

    await prisma.userTwoFactorRecoveryCode.update({
      where: { id: match.id },
      data: { isUsed: true, usedAt: new Date() }
    });

    await AuditChainService.logEvent({
      userId,
      action: 'CONSUMED_2FA_RECOVERY_CODE',
      entity: 'User',
      details: 'Consumed one-time 2FA recovery code during emergency access'
    });

    return { success: true };
  }
}
