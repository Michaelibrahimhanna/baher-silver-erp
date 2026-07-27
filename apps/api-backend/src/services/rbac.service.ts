import { PrismaClient } from '@prisma/client';
import { PermissionCacheService } from './permission_cache.service';

const prisma = new PrismaClient();

export class RBACService {
  static async listPermissionGroups() {
    return prisma.permissionGroup.findMany({
      include: {
        permissions: { where: { deletedAt: null } }
      },
      orderBy: { sortOrder: 'asc' }
    });
  }

  static async listRoles() {
    return prisma.securityRole.findMany({
      where: { deletedAt: null },
      include: {
        permissions: {
          include: { permission: true }
        }
      },
      orderBy: { priority: 'asc' }
    });
  }

  static async createRole(data: { roleCode: string; nameAr: string; nameEn: string; description?: string; permissionCodes?: string[] }) {
    const role = await prisma.securityRole.create({
      data: {
        roleCode: data.roleCode,
        nameAr: data.nameAr,
        nameEn: data.nameEn,
        description: data.description
      }
    });

    if (data.permissionCodes && data.permissionCodes.length) {
      await this.updateRolePermissions(role.id, data.permissionCodes);
    }

    return role;
  }

  static async updateRolePermissions(roleId: string, permissionCodes: string[]) {
    await prisma.rolePermissionMapping.deleteMany({ where: { roleId } });

    const permissions = await prisma.securityPermission.findMany({
      where: { permissionCode: { in: permissionCodes } }
    });

    for (const perm of permissions) {
      await prisma.rolePermissionMapping.create({
        data: { roleId, permissionId: perm.id }
      });
    }

    PermissionCacheService.invalidateAll();
    return prisma.securityRole.findUnique({
      where: { id: roleId },
      include: { permissions: { include: { permission: true } } }
    });
  }

  static async getLoginHistory(filters: { search?: string; status?: string }) {
    const where: any = {};
    if (filters.status) where.status = filters.status;
    if (filters.search) {
      where.OR = [
        { username: { contains: filters.search } },
        { ipAddress: { contains: filters.search } }
      ];
    }

    return prisma.loginHistory.findMany({
      where,
      take: 100,
      orderBy: { timestamp: 'desc' }
    });
  }

  static async getAuthAuditLogs(filters: { action?: string }) {
    const where: any = {};
    if (filters.action) where.action = filters.action;

    return prisma.authAuditLog.findMany({
      where,
      take: 100,
      orderBy: { timestamp: 'desc' }
    });
  }
}
