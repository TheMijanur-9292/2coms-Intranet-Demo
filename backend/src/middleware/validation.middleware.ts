import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import { AppError } from '../utils/AppError';

const validateWith =
  (schema: Joi.ObjectSchema, target: 'body' | 'query' | 'params') =>
  (req: Request, _res: Response, next: NextFunction): void => {
    const { error, value } = schema.validate(req[target], {
      abortEarly: false,
      stripUnknown: true,
    });
    if (error) {
      const messages = error.details.map((d) => d.message).join('; ');
      return next(new AppError(`Validation error: ${messages}`, 422));
    }
    req[target] = value;
    next();
  };

export const validate = (schema: Joi.ObjectSchema) => validateWith(schema, 'body');
export const validateQuery = (schema: Joi.ObjectSchema) => validateWith(schema, 'query');
export const validateParams = (schema: Joi.ObjectSchema) => validateWith(schema, 'params');
