import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AuthRequest } from '../types/express';
import User from '../models/User';
import { AppError } from '../utils/AppError';

interface JwtPayload {
  userId: string;
  companyId: string;
  departmentId?: string;
  role: string;
  email: string;
}

export const authenticate = async (
  req: AuthRequest,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      return next(new AppError('Authentication required. Please login.', 401));
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;

    const user = await User.findById(decoded.userId).select('+isActive').lean();
    if (!user || !user.isActive) {
      return next(new AppError('User account is inactive or no longer exists.', 401));
    }

    req.user = {
      id: decoded.userId,
      companyId: decoded.companyId,
      departmentId: decoded.departmentId,
      role: decoded.role,
      email: decoded.email,
    };

    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return next(new AppError('Authentication token expired. Please login again.', 401));
    }
    if (error instanceof jwt.JsonWebTokenError) {
      return next(new AppError('Invalid authentication token. Please login again.', 401));
    }
    next(error);
  }
};
