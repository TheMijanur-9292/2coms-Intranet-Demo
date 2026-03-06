import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types/express';
import { AppError } from '../utils/AppError';

export const setCompanyContext = (
  req: AuthRequest,
  _res: Response,
  next: NextFunction
): void => {
  if (!req.user?.companyId) {
    return next(new AppError('Company context is required.', 400));
  }
  req.companyFilter = { companyId: req.user.companyId };
  next();
};
