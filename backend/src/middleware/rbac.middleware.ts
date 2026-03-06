import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types/express';
import { AppError } from '../utils/AppError';

export const requireRole = (...allowedRoles: string[]) =>
  (req: AuthRequest, _res: Response, next: NextFunction): void => {
    if (!req.user) return next(new AppError('Authentication required.', 401));
    if (!allowedRoles.includes(req.user.role)) {
      return next(
        new AppError(`Access denied. Required role: ${allowedRoles.join(' or ')}.`, 403)
      );
    }
    next();
  };

export const requireHR = requireRole('hr', 'admin');
export const requireAdmin = requireRole('admin');
export const requireManager = requireRole('manager', 'hr', 'admin');
