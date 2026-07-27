import { PermissionCacheService } from './permission_cache.service';

export interface SecurityContext {
  userId: string;
  username: string;
  roles: string[];
  permissions: Set<string>;
  branchId: string | null;
  warehouseId: string | null;
  isSuperAdmin: boolean;
}

export class ABACEngineService {
  static async evaluatePermission(userId: string, requiredPermission: string): Promise<boolean> {
    const cached = await PermissionCacheService.getUserPermissions(userId);
    
    if (cached.permissions.has('*') || cached.roles.includes('SUPER_ADMIN')) {
      return true;
    }

    return cached.permissions.has(requiredPermission);
  }

  static async buildSecurityContext(userId: string, username: string): Promise<SecurityContext> {
    const cached = await PermissionCacheService.getUserPermissions(userId);
    const isSuperAdmin = cached.roles.includes('SUPER_ADMIN') || cached.permissions.has('*');

    return {
      userId,
      username,
      roles: cached.roles,
      permissions: cached.permissions,
      branchId: cached.branchId,
      warehouseId: cached.warehouseId,
      isSuperAdmin
    };
  }

  static getRLSWhereClause(context: SecurityContext, resourceBranchField = 'branchId', resourceWarehouseField = 'warehouseId'): any {
    // Super admins bypass Row-Level Security
    if (context.isSuperAdmin) {
      return {};
    }

    const whereClause: any = {};

    if (context.branchId) {
      whereClause[resourceBranchField] = context.branchId;
    }

    if (context.warehouseId) {
      whereClause[resourceWarehouseField] = context.warehouseId;
    }

    return whereClause;
  }
}
