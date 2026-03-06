import Joi from 'joi';

export const createPostSchema = Joi.object({
  type: Joi.string().valid('post', 'announcement', 'project_win', 'recognition', 'milestone').default('post'),
  content: Joi.string().required().max(5000),
  media: Joi.array().items(
    Joi.object({
      type: Joi.string().valid('image', 'video', 'document'),
      url: Joi.string().uri().required(),
      thumbnail: Joi.string().uri(),
      filename: Joi.string(),
      size: Joi.number(),
      mimeType: Joi.string(),
    })
  ).optional(),
  tags: Joi.array().items(Joi.string()).optional(),
  mentions: Joi.array().items(Joi.string()).optional(),
  visibility: Joi.string().valid('public', 'department', 'private').default('public'),
  targetDepartments: Joi.array().items(Joi.string()).optional(),
});

export const updatePostSchema = Joi.object({
  content: Joi.string().max(5000).optional(),
  media: Joi.array().items(
    Joi.object({
      type: Joi.string().valid('image', 'video', 'document'),
      url: Joi.string().uri().required(),
      thumbnail: Joi.string().uri(),
    })
  ).optional(),
  tags: Joi.array().items(Joi.string()).optional(),
  visibility: Joi.string().valid('public', 'department', 'private').optional(),
});

export const addReactionSchema = Joi.object({
  type: Joi.string().valid('like', 'love', 'celebrate', 'insightful', 'support').required(),
});

export const addCommentSchema = Joi.object({
  content: Joi.string().required().max(2000),
});

export const updateCommentSchema = Joi.object({
  content: Joi.string().required().max(2000),
});
