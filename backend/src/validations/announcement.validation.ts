import Joi from 'joi';

export const createAnnouncementSchema = Joi.object({
  title: Joi.string().required().max(200),
  content: Joi.string().required().max(5000),
  priority: Joi.string().valid('low', 'medium', 'high', 'urgent').default('medium'),
  category: Joi.string().valid('general', 'hr', 'it', 'operations', 'finance', 'compliance').default('general'),
  targetAudience: Joi.string().valid('all', 'department', 'role', 'custom').default('all'),
  targetDepartments: Joi.array().items(Joi.string()).optional(),
  targetRoles: Joi.array().items(Joi.string()).optional(),
  targetUsers: Joi.array().items(Joi.string()).optional(),
  attachments: Joi.array().items(
    Joi.object({
      name: Joi.string().required(),
      url: Joi.string().uri().required(),
      type: Joi.string().required(),
      size: Joi.number().required(),
    })
  ).optional(),
  publishDate: Joi.date().optional(),
  expiryDate: Joi.date().optional(),
  isPinned: Joi.boolean().default(false),
});

export const updateAnnouncementSchema = Joi.object({
  title: Joi.string().max(200).optional(),
  content: Joi.string().max(5000).optional(),
  priority: Joi.string().valid('low', 'medium', 'high', 'urgent').optional(),
  category: Joi.string().valid('general', 'hr', 'it', 'operations', 'finance', 'compliance').optional(),
  targetAudience: Joi.string().valid('all', 'department', 'role', 'custom').optional(),
  targetDepartments: Joi.array().items(Joi.string()).optional(),
  targetRoles: Joi.array().items(Joi.string()).optional(),
  targetUsers: Joi.array().items(Joi.string()).optional(),
  isPinned: Joi.boolean().optional(),
  expiryDate: Joi.date().optional(),
});
