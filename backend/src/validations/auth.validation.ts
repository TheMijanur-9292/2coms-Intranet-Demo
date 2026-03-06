import Joi from 'joi';

export const registerSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  employeeId: Joi.string().required(),
  companyId: Joi.string().required(),
  departmentId: Joi.string().required(),
  designation: Joi.string().required(),
  role: Joi.string().valid('employee', 'manager', 'hr', 'admin').optional(),
});

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

export const updateProfileSchema = Joi.object({
  firstName: Joi.string().optional(),
  lastName: Joi.string().optional(),
  displayName: Joi.string().optional(),
  avatar: Joi.string().uri().optional(),
  preferences: Joi.object({
    notifications: Joi.object({
      inApp: Joi.boolean(),
      email: Joi.boolean(),
      push: Joi.boolean(),
    }),
    emailDigest: Joi.string().valid('none', 'daily', 'weekly'),
    theme: Joi.string().valid('light', 'dark', 'auto'),
    language: Joi.string(),
  }).optional(),
});
