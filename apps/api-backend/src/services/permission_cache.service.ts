import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface CachedPermissions {
  permissions: Set<string>;
  roles: string[];
  branchId: string | null;
  warehouseId: string | null;
  cachedAt: number;
}

export class PermissionCacheService {
  private static cache = new Map<string, CachedPermissions>();
  private static TTL_MS = 5 * 60 * 1000; // 5 minutes TTL

  static async getUserPermissions(userId: string): Promise<CachedPermissions> {
    const now = Date.now();
    const cached = this.cache.get(userId);

    if (cached && (now - cached.cachedAt) < this.TTL_MS) {
      return cached;
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        userRoles: {
          include: {
            role: {
              include: {
                permissions: {
                  include: { permission: true }
                }
              }
            }
          }
        },
        userPermissions: {
          include: { permission: true }
        }
      }
    });

    if (!user || user.status !== 'ACTIVE' || user.deletedAt) {
      const empty: CachedPermissions = {
        permissions: new Set(),
        roles: [],
        branchId: null,
        warehouseId: null,
        cachedAt: now
      };
      this.cache.set(userId, empty);
      return empty;
    }

    const permissionSet = new Set<string>();
    const roles: string[] = [];

    // 1. Resolve role permissions
    user.userRoles.forEach(ur => {
      if (!ur.role.deletedAt) {
        roles.push(ur.role.roleCode);
        ur.role.permissions.forEach(rp => {
          if (!rp.permission.deletedAt) {
            permissionSet.add(rp.permission.permissionCode);
          }
        });
      }
    });

    // 2. Apply Direct Overrides (ALLOW adds, DENY removes)
    user.userPermissions.forEach(up => {
      if (!up.permission.deletedAt) {
        if (up.grantType === 'ALLOW') {
          permissionSet.add(up.permission.permissionCode);
        } else if (up.grantType === 'DENY') {
          permissionSet.delete(up.permission.permissionCode);
        }
      }
    });

    // Super admin bypass
    if (roles.includes('SUPER_ADMIN') || roles.includes('system:admin')) {
      permissionSet.add('*');
    }

    const result: CachedPermissions = {
      permissions: permissionSet,
      roles,
      branchId: user.branchId,
      warehouseId: user.warehouseId,
      cachedAt: now
    };

    this.cache.set(userId, result);
    return result;
  }

  static invalidateUser(userId: string) {
    this.cache.delete(userId);
  }

  static invalidateAll() {
    this.cache.clear();
  }
}
