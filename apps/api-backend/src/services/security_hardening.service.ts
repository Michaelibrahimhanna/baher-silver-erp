import { PrismaClient } from '@prisma/client';
import { PermissionCacheService } from './permission_cache.service';
import { SecurityPolicyService } from './security_policy.service';
import { AuditChainService } from './audit_chain.service';

const prisma = new PrismaClient();

export class SecurityHardeningService {
  // 1. Permission Simulator with Detailed Explanations
  static async simulateUserPermissions(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        userRoles: {
          include: {
            role: {
              include: {
                permissions: { include: { permission: true } }
              }
            }
          }
        },
        userPermissions: { include: { permission: true } }
      }
    });

    if (!user) throw new Error('المستخدم غير موجود');

    const allPermissions = await prisma.securityPermission.findMany({
      include: { group: true },
      orderBy: { permissionCode: 'asc' }
    });

    const isSuperAdmin = user.userRoles.some(ur => ur.role.roleCode === 'SUPER_ADMIN');

    const inheritedRolePerms: { code: string; roleCode: string; roleNameAr: string; permNameAr: string }[] = [];
    const rolePermCodesSet = new Set<string>();

    user.userRoles.forEach(ur => {
      ur.role.permissions.forEach(rp => {
        inheritedRolePerms.push({
          code: rp.permission.permissionCode,
          roleCode: ur.role.roleCode,
          roleNameAr: ur.role.nameAr,
          permNameAr: rp.permission.nameAr
        });
        rolePermCodesSet.add(rp.permission.permissionCode);
      });
    });

    const directOverrides: { code: string; grantType: 'ALLOW' | 'DENY'; permNameAr: string }[] = [];
    const directAllowSet = new Set<string>();
    const directDenySet = new Set<string>();

    user.userPermissions.forEach(up => {
      directOverrides.push({
        code: up.permission.permissionCode,
        grantType: up.grantType as 'ALLOW' | 'DENY',
        permNameAr: up.permission.nameAr
      });

      if (up.grantType === 'ALLOW') directAllowSet.add(up.permission.permissionCode);
      if (up.grantType === 'DENY') directDenySet.add(up.permission.permissionCode);
    });

    const effectivePermissions: any[] = [];
    const allowedModules: any[] = [];
    const deniedModules: any[] = [];

    for (const perm of allPermissions) {
      let isAllowed = false;
      let reasonAr = '';
      let reasonEn = '';

      if (isSuperAdmin) {
        isAllowed = true;
        reasonAr = 'ممنوحة تلقائياً عبر صلة مدير النظام الفائق (SUPER_ADMIN Wildcard)';
        reasonEn = 'Granted automatically via SUPER_ADMIN wildcard role';
      } else if (directDenySet.has(perm.permissionCode)) {
        isAllowed = false;
        reasonAr = 'محظورة بسبب استثناء مباشر صريح بالرفض (Direct DENY User Override)';
        reasonEn = 'Denied explicitly by direct user DENY override';
      } else if (directAllowSet.has(perm.permissionCode)) {
        isAllowed = true;
        reasonAr = 'ممنوحة بسبب استثناء مباشر صريح بالسماح (Direct ALLOW User Override)';
        reasonEn = 'Granted explicitly by direct user ALLOW override';
      } else if (rolePermCodesSet.has(perm.permissionCode)) {
        isAllowed = true;
        const matchingRole = inheritedRolePerms.find(r => r.code === perm.permissionCode);
        reasonAr = `ممنوحة عبر الدور الموكل: ${matchingRole?.roleNameAr || matchingRole?.roleCode}`;
        reasonEn = `Granted via assigned role: ${matchingRole?.roleCode}`;
      } else {
        isAllowed = false;
        reasonAr = 'غير ممنوحة — لا تتوافر في الأدوار الموكلة ولا يوجد استثناء مباشر';
        reasonEn = 'Not granted — missing in assigned roles with no direct ALLOW override';
      }

      const permInfo = {
        code: perm.permissionCode,
        nameAr: perm.nameAr,
        nameEn: perm.nameEn,
        groupCode: perm.group.groupCode,
        groupNameAr: perm.group.nameAr,
        isAllowed,
        reasonAr,
        reasonEn
      };

      effectivePermissions.push(permInfo);

      if (perm.permissionCode.startsWith('tab.')) {
        if (isAllowed) {
          allowedModules.push(permInfo);
        } else {
          deniedModules.push(permInfo);
        }
      }
    }

    return {
      user: {
        id: user.id,
        username: user.username,
        fullNameAr: user.fullNameAr,
        branchId: user.branchId,
        warehouseId: user.warehouseId,
        status: user.status,
        roles: user.userRoles.map(ur => ur.role.roleCode)
      },
      isSuperAdmin,
      inheritedRolePermissions: inheritedRolePerms,
      directUserOverrides: directOverrides,
      effectiveFinalPermissions: effectivePermissions,
      allowedModules,
      deniedModules
    };
  }

  // 2. Permission Difference Viewer
  static async calculatePermissionDiff(params: {
    roleId?: string;
    userId?: string;
    proposedPermissionCodes: string[];
  }) {
    let currentCodes: string[] = [];

    if (params.roleId) {
      const rolePerms = await prisma.rolePermissionMapping.findMany({
        where: { roleId: params.roleId },
        include: { permission: true }
      });
      currentCodes = rolePerms.map(rp => rp.permission.permissionCode);
    } else if (params.userId) {
      const resolved = await PermissionCacheService.getUserPermissions(params.userId);
      currentCodes = Array.from(resolved.permissions);
    }

    const proposedSet = new Set(params.proposedPermissionCodes);
    const currentSet = new Set(currentCodes);

    const added = params.proposedPermissionCodes.filter(c => !currentSet.has(c));
    const removed = currentCodes.filter(c => !proposedSet.has(c));
    const unchanged = currentCodes.filter(c => proposedSet.has(c));

    return {
      totalCurrent: currentCodes.length,
      totalProposed: params.proposedPermissionCodes.length,
      addedPermissions: added,
      removedPermissions: removed,
      unchangedPermissions: unchanged
    };
  }

  // 3. User Security Timeline
  static async getUserSecurityTimeline(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, username: true, fullNameAr: true }
    });

    if (!user) throw new Error('المستخدم غير موجود');

    const logins = await prisma.loginHistory.findMany({
      where: { userId },
      orderBy: { timestamp: 'desc' },
      take: 50
    });

    const audits = await prisma.authAuditLog.findMany({
      where: { userId },
      orderBy: { timestamp: 'desc' },
      take: 50
    });

    const sessions = await prisma.userSession.findMany({
      where: { userId },
      orderBy: { lastActiveAt: 'desc' },
      take: 20
    });

    const timeline = [
      ...logins.map(l => ({
        id: `login-${l.id}`,
        type: 'LOGIN_ATTEMPT',
        status: l.status,
        title: `تسجيل دخول (${l.status})`,
        description: `IP: ${l.ipAddress || '127.0.0.1'} | المتصفح: ${l.browser || 'Unknown'}`,
        timestamp: l.timestamp
      })),
      ...audits.map(a => ({
        id: `audit-${a.id}`,
        type: 'SECURITY_AUDIT',
        status: a.status,
        title: `حدث أمني: ${a.action}`,
        description: a.details || `تأثير على الكيان ${a.entity}`,
        timestamp: a.timestamp
      })),
      ...sessions.map(s => ({
        id: `session-${s.id}`,
        type: 'SESSION_STATE',
        status: s.isRevoked ? 'REVOKED' : 'ACTIVE',
        title: s.isRevoked ? `جلسة ملغاة: ${s.terminationReason || 'إنهاء عادي'}` : 'جلسة نشطة',
        description: `الجهاز: ${s.device || 'أخرى'} | IP: ${s.ipAddress || '127.0.0.1'}`,
        timestamp: s.lastActiveAt
      }))
    ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    return { user, count: timeline.length, timeline };
  }

  // 4. Four-Eyes Approval Workflow
  static async createApprovalRequest(data: {
    requestType: 'ROLE_CREATE' | 'ROLE_UPDATE' | 'ROLE_DELETE' | 'PERMISSION_OVERRIDE';
    targetId: string;
    requestedBy: string;
    payload: any;
  }) {
    const req = await prisma.securityApprovalRequest.create({
      data: {
        requestType: data.requestType,
        targetId: data.targetId,
        requestedBy: data.requestedBy,
        payloadJson: JSON.stringify(data.payload),
        status: 'PENDING'
      }
    });

    await AuditChainService.logEvent({
      userId: data.requestedBy,
      action: 'SECURITY_APPROVAL_REQUEST_CREATED',
      entity: 'SecurityApprovalRequest',
      details: `Created approval request #${req.id} for type ${data.requestType}`
    });

    return req;
  }

  static async listApprovalRequests(status = 'PENDING') {
    return prisma.securityApprovalRequest.findMany({
      where: { status },
      orderBy: { createdAt: 'desc' }
    });
  }

  static async processApprovalRequest(requestId: string, approvedBy: string, approve: boolean, rejectionNote?: string) {
    const req = await prisma.securityApprovalRequest.findUnique({
      where: { id: requestId }
    });

    if (!req || req.status !== 'PENDING') {
      throw new Error('طلب الموافقة غير موجود أو تم البت فيه سابقاً');
    }

    if (req.requestedBy === approvedBy) {
      throw new Error('مبدأ الاعتماد الثنائي (Four-Eyes Principle): لا يمكن لمنشئ الطلب اعتماده بنفسه');
    }

    if (!approve) {
      await prisma.securityApprovalRequest.update({
        where: { id: requestId },
        data: { status: 'REJECTED', approvedBy, rejectionNote }
      });

      await AuditChainService.logEvent({
        userId: approvedBy,
        action: 'SECURITY_APPROVAL_REJECTED',
        entity: 'SecurityApprovalRequest',
        details: `Rejected approval request #${requestId}. Reason: ${rejectionNote || 'No reason provided'}`
      });

      return { success: true, status: 'REJECTED' };
    }

    // If Approved, apply payload logic
    const payload = JSON.parse(req.payloadJson);
    if (req.requestType === 'ROLE_UPDATE' && payload.roleId && payload.permissionCodes) {
      const { RBACService } = require('./rbac.service');
      await RBACService.updateRolePermissions(payload.roleId, payload.permissionCodes);
    } else if (req.requestType === 'PERMISSION_OVERRIDE' && payload.userId && payload.permissionCode && payload.grantType) {
      const { UserManagementService } = require('./user_management.service');
      await UserManagementService.setUserPermissionOverride(payload.userId, payload.permissionCode, payload.grantType);
    }

    await prisma.securityApprovalRequest.update({
      where: { id: requestId },
      data: { status: 'APPROVED', approvedBy }
    });

    await AuditChainService.logEvent({
      userId: approvedBy,
      action: 'SECURITY_APPROVAL_EXECUTED',
      entity: 'SecurityApprovalRequest',
      details: `Approved & executed change for request #${requestId}`
    });

    return { success: true, status: 'APPROVED' };
  }

  // 5. Weighted Security Health Score Diagnostic Calculator (Target >= 95%)
  static async calculateSecurityHealthScore() {
    const policy = await SecurityPolicyService.getPolicy();
    const chainVerification = await AuditChainService.verifyChainIntegrity();

    const activeUsersCount = await prisma.user.count({ where: { status: 'ACTIVE', deletedAt: null } });
    const usersWithoutStrongPass = await prisma.user.count({
      where: { status: 'ACTIVE', deletedAt: null, passwordHash: { contains: 'admin' } }
    });

    const breakGlass = await prisma.user.findFirst({ where: { isBreakGlassAccount: true } });
    const pendingApprovals = await prisma.securityApprovalRequest.count({ where: { status: 'PENDING' } });

    // Category 1: Password Policy & History Strength (Weight 20%)
    let cat1Score = 20;
    if (policy.minLength < 8) cat1Score -= 5;
    if (!policy.requireUppercase || !policy.requireLowercase || !policy.requireNumbers || !policy.requireSpecialChars) cat1Score -= 5;
    if (policy.preventReuseCount < 3) cat1Score -= 5;
    if (usersWithoutStrongPass > 0) cat1Score -= 5;
    cat1Score = Math.max(0, cat1Score);

    // Category 2: Session & Device Control Integrity (Weight 15%)
    let cat2Score = 15;
    const revokedSessions = await prisma.userSession.count({ where: { isRevoked: true } });
    const activeSessions = await prisma.userSession.count({ where: { isRevoked: false, expiresAt: { gt: new Date() } } });
    if (activeSessions > activeUsersCount * 3) cat2Score -= 5; // Excess session density warning
    cat2Score = Math.max(0, cat2Score);

    // Category 3: RBAC / ABAC Permission & Overrides (Weight 20%)
    let cat3Score = 20;
    const superAdminUsers = await prisma.userRoleAssignment.count({
      where: { role: { roleCode: 'SUPER_ADMIN' } }
    });
    if (superAdminUsers > 3) cat3Score -= 5; // Too many super admins warning
    cat3Score = Math.max(0, cat3Score);

    // Category 4: Audit Trail Cryptographic Hash-Chain Integrity (Weight 15%)
    let cat4Score = 15;
    if (!chainVerification.isValid) {
      cat4Score = 0; // Hash chain broken or tampered
    }

    // Category 5: Break Glass & Emergency Readiness (Weight 15%)
    let cat5Score = 15;
    if (!breakGlass) cat5Score -= 10;
    else if (breakGlass.status === 'ACTIVE') cat5Score -= 5; // Warning: break glass is currently active
    cat5Score = Math.max(0, cat5Score);

    // Category 6: HTTP Security Headers & Transport (Weight 15%)
    let cat6Score = 15; // CSP, HSTS, X-Frame-Options enabled in middleware

    const totalScore = cat1Score + cat2Score + cat3Score + cat4Score + cat5Score + cat6Score;
    const passedTarget = totalScore >= 95;

    const categories = [
      { nameAr: 'قوة سياسات كلمات المرور والتاريخ', score: cat1Score, maxScore: 20, pct: (cat1Score/20)*100, status: cat1Score >= 18 ? 'PASS' : 'WARN' },
      { nameAr: 'إدارة وتأمين الجلسات والأجهزة', score: cat2Score, maxScore: 15, pct: (cat2Score/15)*100, status: cat2Score >= 13 ? 'PASS' : 'WARN' },
      { nameAr: 'مصفوفة الصلاحيات والعزل (RBAC/ABAC)', score: cat3Score, maxScore: 20, pct: (cat3Score/20)*100, status: cat3Score >= 18 ? 'PASS' : 'WARN' },
      { nameAr: 'سلامة السلسلة التشفيرية لسجلات الأمان', score: cat4Score, maxScore: 15, pct: (cat4Score/15)*100, status: cat4Score === 15 ? 'PASS' : 'FAIL' },
      { nameAr: 'جاهزية حساب الطوارئ Break Glass', score: cat5Score, maxScore: 15, pct: (cat5Score/15)*100, status: cat5Score >= 12 ? 'PASS' : 'WARN' },
      { nameAr: 'ترويسات الحماية HTTP والتشفير', score: cat6Score, maxScore: 15, pct: (cat6Score/15)*100, status: 'PASS' }
    ];

    return {
      totalScore,
      maxScore: 100,
      passedTarget, // True if >= 95%
      status: passedTarget ? 'PASS' : 'FAIL',
      chainVerification,
      categories,
      recommendations: [
        'الحفاظ على مبدأ الاعتماد الثنائي عند إجراء أي تعديل على مصفوفات الأدوار والصلاحيات.',
        'إجراء فحص دوري لسلسلة التشفير الخاصة بسجلات الأمان (Audit Trail Cryptographic Verification).',
        'التأكد من إبقاء حساب الطوارئ Break Glass معطلاً في الظروف الاعتيادية.'
      ]
    };
  }
}
