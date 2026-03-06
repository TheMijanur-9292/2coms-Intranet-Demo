import { Router } from 'express';
import * as engagementController from '../controllers/engagement.controller';
import { authenticate } from '../middleware/auth.middleware';
import { setCompanyContext } from '../middleware/company.middleware';
import { validate } from '../middleware/validation.middleware';
import {
  createPostSchema,
  addCommentSchema,
  createAppreciationSchema,
  createCelebrationSchema,
} from '../validations/engagement.validation';

const router = Router();

router.use(authenticate);
router.use(setCompanyContext);

// Activity Wall
router.get('/posts', engagementController.getPosts);
router.post('/posts', validate(createPostSchema), engagementController.createPost);
router.get('/posts/:id', engagementController.getPost);
router.put('/posts/:id', engagementController.updatePost);
router.delete('/posts/:id', engagementController.deletePost);
router.post('/posts/:id/react', engagementController.addReaction);
router.delete('/posts/:id/react', engagementController.removeReaction);
router.post('/posts/:id/comments', validate(addCommentSchema), engagementController.addComment);
router.put('/posts/:id/comments/:commentId', engagementController.updateComment);
router.delete('/posts/:id/comments/:commentId', engagementController.deleteComment);
router.post('/posts/:id/share', engagementController.sharePost);

// Peer Appreciation
router.get('/appreciation', engagementController.getAppreciations);
router.post('/appreciation', validate(createAppreciationSchema), engagementController.createAppreciation);
router.get('/appreciation/:id', engagementController.getAppreciation);

// Recognition Highlights
router.get('/recognition/highlights', engagementController.getRecognitionHighlights);
router.get('/recognition/top-contributors', engagementController.getTopContributors);

// New Joinees
router.get('/new-joinees', engagementController.getNewJoinees);
router.post('/new-joinees/:id/welcome', engagementController.addWelcomeMessage);

// Celebrations
router.get('/celebrations', engagementController.getCelebrations);
router.post('/celebrations', validate(createCelebrationSchema), engagementController.createCelebration);

// Gamification
router.get('/leaderboard', engagementController.getLeaderboard);
router.get('/leaderboard/user/:userId', engagementController.getUserRank);
router.get('/gamification/stats/:userId', engagementController.getUserGamificationStats);
router.get('/gamification/badges/:userId', engagementController.getUserBadges);

export default router;
