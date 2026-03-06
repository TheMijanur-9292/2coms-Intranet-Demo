import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/AppError';
import logger from '../utils/logger';

interface MongoError extends Error {
  code?: number;
  keyValue?: Record<string, unknown>;
}

export const errorHandler = (
  err: Error | AppError | MongoError,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  let statusCode = 500;
  let code = 'INTERNAL_ERROR';
  let message = 'An unexpected error occurred. Please try again later.';

  // Known operational error
  if (err instanceof AppError) {
    statusCode = err.statusCode;
    code = err.code;
    message = err.message;
  }
  // Mongoose cast error (bad ObjectId)
  else if (err.name === 'CastError') {
    statusCode = 400;
    code = 'BAD_REQUEST';
    message = 'Invalid resource identifier format.';
  }
  // Mongoose duplicate key
  else if ((err as MongoError).code === 11000) {
    statusCode = 409;
    code = 'CONFLICT';
    const fields = Object.keys((err as MongoError).keyValue || {}).join(', ');
    message = `Duplicate value for field(s): ${fields}`;
  }
  // Mongoose validation errors
  else if (err.name === 'ValidationError') {
    statusCode = 422;
    code = 'VALIDATION_ERROR';
    message = Object.values((err as any).errors)
      .map((e: any) => e.message)
      .join('; ');
  }
  // JWT errors
  else if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    code = 'UNAUTHORIZED';
    message = 'Invalid authentication token.';
  } else if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    code = 'UNAUTHORIZED';
    message = 'Authentication token has expired. Please login again.';
  }

  // Log only non-operational / server errors at error level
  if (statusCode >= 500) {
    logger.error(`[${code}] ${err.message}`, { stack: err.stack });
  } else {
    logger.warn(`[${code}] ${message}`);
  }

  res.status(statusCode).json({
    success: false,
    error: {
      code,
      message,
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    },
  });
};
