import Joi from 'joi';

export const createPostSchema = Joi.object({
  content: Joi.string().required().max(5000),
  media: Joi.array().items(
    Joi.object({
      type: Joi.string().valid('image', 'video'),
      url: Joi.string().uri().required(),
      thumbnail: Joi.string().uri(),
    })
  ).optional(),
  tags: Joi.array().items(Joi.string()).optional(),
  mentions: Joi.array().items(Joi.string()).optional(),
  visibility: Joi.string().valid('public', 'department', 'private').default('public'),
});

export const addCommentSchema = Joi.object({
  content: Joi.string().required().max(2000),
  parentId: Joi.string().optional(),
});

export const createAppreciationSchema = Joi.object({
  recognizedUserId: Joi.string().required(),
  category: Joi.string().valid('teamwork', 'innovation', 'support', 'excellence', 'leadership').required(),
  message: Joi.string().required().max(1000),
  media: Joi.array().items(
    Joi.object({
      type: Joi.string().valid('image', 'video'),
      url: Joi.string().uri().required(),
    })
  ).optional(),
});

export const createCelebrationSchema = Joi.object({
  type: Joi.string().valid('birthday', 'anniversary', 'achievement', 'milestone').required(),
  content: Joi.string().required().max(2000),
  relatedUserId: Joi.string().optional(),
  media: Joi.array().items(
    Joi.object({
      type: Joi.string().valid('image', 'video'),
      url: Joi.string().uri().required(),
    })
  ).optional(),
});

export const addReactionSchema = Joi.object({
  type: Joi.string().valid('like', 'love', 'celebrate', 'insightful', 'support').required(),
});
