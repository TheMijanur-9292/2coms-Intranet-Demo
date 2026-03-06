import { Router } from 'express';
import * as postsController from '../controllers/posts.controller';
import { authenticate } from '../middleware/auth.middleware';
import { setCompanyContext } from '../middleware/company.middleware';
import { validate, validateParams } from '../middleware/validation.middleware';
import {
  createPostSchema,
  updatePostSchema,
  addReactionSchema,
  addCommentSchema,
  updateCommentSchema,
} from '../validations/post.validation';
import Joi from 'joi';

const router = Router();

// All routes require authentication and company context
router.use(authenticate);
router.use(setCompanyContext);

router.get('/', postsController.getPosts);
router.post('/', validate(createPostSchema), postsController.createPost);
router.get('/:id', postsController.getPost);
router.put('/:id', validate(updatePostSchema), postsController.updatePost);
router.delete('/:id', postsController.deletePost);

router.post('/:id/react', validate(addReactionSchema), postsController.addReaction);
router.delete('/:id/react', postsController.removeReaction);

router.post('/:id/comments', validate(addCommentSchema), postsController.addComment);
router.put('/:id/comments/:commentId', validate(updateCommentSchema), postsController.updateComment);
router.delete('/:id/comments/:commentId', postsController.deleteComment);

export default router;
