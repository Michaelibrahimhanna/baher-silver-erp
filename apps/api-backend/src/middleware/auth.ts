import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthenticatedUser {
  userId: string;
  companyId: string;
  branchId?: string;
  username: string;
  roles: string[];
  permissions: string[];
}

export interface AuthRequest extends Request {
  user?: AuthenticatedUser;
}

const JWT_SECRET = process.env.JWT_SECRET || 'baher-silver-erp-secret-key-2026';

export function authenticateJWT(req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, error: 'Unauthorized access token missing' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as AuthenticatedUser;
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ success: false, error: 'Invalid or expired access token' });
  }
}

export function requirePermission(permissionCode: string) {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ success: false, error: 'User not authenticated' });
    }
    const hasPerm = req.user.permissions.includes(permissionCode) || req.user.permissions.includes('system:admin');
    if (!hasPerm) {
      return res.status(403).json({ success: false, error: `Forbidden: Missing required permission '${permissionCode}'` });
    }
    next();
  };
}
