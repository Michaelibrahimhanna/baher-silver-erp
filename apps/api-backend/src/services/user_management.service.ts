import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { PermissionCacheService } from './permission_cache.service';

const prisma = new PrismaClient();

export class UserManagementService {
  static async listUsers(filters: { search?: string; branchId?: string; status?: string }) {
    const where: any = { deletedAt: null };

    if (filters.branchId) where.branchId = filters.branchId;
    if (filters.status) where.status = filters.status;

    if (filters.search) {
      const q = filters.search;
      where.OR = [
        { username: { contains: q } },
        { fullNameAr: { contains: q } },
        { email: { contains: q } },
        { phone: { contains: q } }
      ];
    }

    return prisma.user.findMany({
      where,
      select: {
        id: true,
        username: true,
        email: true,
        phone: true,
        fullNameAr: true,
        fullNameEn: true,
        branchId: true,
        warehouseId: true,
        department: true,
        position: true,
        status: true,
        isSystemUser: true,
        isTwoFactorEnabled: true,
        lastLoginAt: true,
        createdAt: true,
        userRoles: { include: { role: true } },
        userPermissions: { include: { permission: true } }
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  static async getUserById(id: string) {
    const user = await prisma.user.findFirst({
      where: { id, deletedAt: null },
      select: {
        id: true,
        username: true,
        email: true,
        phone: true,
        fullNameAr: true,
        fullNameEn: true,
        branchId: true,
        warehouseId: true,
        department: true,
        position: true,
        status: true,
        isSystemUser: true,
        isTwoFactorEnabled: true,
        lastLoginAt: true,
        createdAt: true,
        userRoles: { include: { role: true } },
        userPermissions: { include: { permission: true } }
      }
    });

    if (!user) return null;

    const resolved = await PermissionCacheService.getUserPermissions(id);
    return {
      ...user,
      resolvedPermissions: Array.from(resolved.permissions)
    };
  }

  static async createUser(data: {
    username: string;
    email?: string;
    phone?: string;
    password: string;
    fullNameAr: string;
    fullNameEn?: string;
    branchId?: string;
    warehouseId?: string;
    department?: string;
    position?: string;
    roleCodes?: string[];
    isSystemUser?: boolean;
  }) {
    const passwordHash = await bcrypt.hash(data.password, 12);

    const user = await prisma.user.create({
      data: {
        username: data.username,
        email: data.email,
        phone: data.phone,
        passwordHash,
        fullNameAr: data.fullNameAr,
        fullNameEn: data.fullNameEn,
        branchId: data.branchId || 'BRANCH-MAIN',
        warehouseId: data.warehouseId || 'wh-finished',
        department: data.department || 'إدارة المصنع',
        position: data.position || 'موظف',
        isSystemUser: data.isSystemUser || false
      }
    });

    // Assign roles if provided
    if (data.roleCodes && data.roleCodes.length) {
      const roles = await prisma.securityRole.findMany({
        where: { roleCode: { in: data.roleCodes } }
      });

      for (const role of roles) {
        await prisma.userRoleAssignment.create({
          data: { userId: user.id, roleId: role.id }
        });
      }
    }

    PermissionCacheService.invalidateUser(user.id);
    return this.getUserById(user.id);
  }

  static async updateUser(id: string, data: any) {
    const updateData: any = {
      fullNameAr: data.fullNameAr,
      fullNameEn: data.fullNameEn,
      email: data.email,
      phone: data.phone,
      branchId: data.branchId,
      warehouseId: data.warehouseId,
      department: data.department,
      position: data.position,
      status: data.status
    };

    if (data.password) {
      updateData.passwordHash = await bcrypt.hash(data.password, 12);
    }

    await prisma.user.update({
      where: { id },
      data: updateData
    });

    // Update Role assignments if provided
    if (data.roleCodes && Array.isArray(data.roleCodes)) {
      await prisma.userRoleAssignment.deleteMany({ where: { userId: id } });
      const roles = await prisma.securityRole.findMany({
        where: { roleCode: { in: data.roleCodes } }
      });
      for (const role of roles) {
        await prisma.userRoleAssignment.create({
          data: { userId: id, roleId: role.id }
        });
      }
    }

    PermissionCacheService.invalidateUser(id);
    return this.getUserById(id);
  }

  static async softDeleteUser(id: string) {
    const user = await prisma.user.findUnique({ where: { id } });
    if (user?.isSystemUser) {
      throw new Error('لا يمكن أرشفة حساب النظام الآلي');
    }

    await prisma.user.update({
      where: { id },
      data: { deletedAt: new Date(), status: 'DISABLED' }
    });

    PermissionCacheService.invalidateUser(id);
    return { success: true };
  }

  static async setUserPermissionOverride(userId: string, permissionCode: string, grantType: 'ALLOW' | 'DENY') {
    const permission = await prisma.securityPermission.findUnique({
      where: { permissionCode }
    });

    if (!permission) throw new Error(`Permission code '${permissionCode}' not found`);

    await prisma.userPermissionOverride.upsert({
      where: { userId_permissionId: { userId, permissionId: permission.id } },
      update: { grantType },
      create: { userId, permissionId: permission.id, grantType }
    });

    PermissionCacheService.invalidateUser(userId);
    return this.getUserById(userId);
  }

  static async removeUserPermissionOverride(userId: string, permissionCode: string) {
    const permission = await prisma.securityPermission.findUnique({
      where: { permissionCode }
    });

    if (permission) {
      await prisma.userPermissionOverride.deleteMany({
        where: { userId, permissionId: permission.id }
      });
    }

    PermissionCacheService.invalidateUser(userId);
    return this.getUserById(userId);
  }
}
