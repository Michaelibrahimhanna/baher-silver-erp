import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { ABACEngineService, SecurityContext } from '../services/abac_engine.service';

export interface AuthenticatedUser {
  userId: string;
  username: string;
  fullNameAr: string;
  roles: string[];
  branchId: string | null;
  warehouseId: string | null;
  permissions: string[];
}

export interface AuthRequest extends Request {
  user?: AuthenticatedUser;
  securityContext?: SecurityContext;
}

const JWT_SECRET = process.env.JWT_SECRET || 'baher-silver-erp-secret-key-2026';

export async function authenticateJWT(req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, error: 'Unauthorized: Missing access token' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as AuthenticatedUser;
    req.user = decoded;

    // Build fresh SecurityContext with live RLS and permission cache
    req.securityContext = await ABACEngineService.buildSecurityContext(decoded.userId, decoded.username);
    next();
  } catch (err: any) {
    return res.status(401).json({ success: false, error: 'Unauthorized: Invalid or expired access token' });
  }
}

export function requirePermission(permissionCode: string) {
  return async (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user || !req.securityContext) {
      return res.status(401).json({ success: false, error: 'Unauthorized: User not authenticated' });
    }

    const hasPerm = req.securityContext.isSuperAdmin || 
                    req.securityContext.permissions.has('*') || 
                    req.securityContext.permissions.has(permissionCode);

    if (!hasPerm) {
      return res.status(403).json({
        success: false,
        error: `Forbidden: Missing required permission '${permissionCode}'`
      });
    }

    next();
  };
}

export function enforceRLS(resourceBranchField = 'branchId', resourceWarehouseField = 'warehouseId') {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (req.securityContext) {
      (req as any).rlsWhere = ABACEngineService.getRLSWhereClause(req.securityContext, resourceBranchField, resourceWarehouseField);
    }
    next();
  };
}
