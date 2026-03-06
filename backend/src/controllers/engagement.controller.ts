import { Response } from 'express';
import { AuthRequest } from '../types/express';
import { asyncHandler } from '../utils/asyncHandler';
import { engagementService } from '../services/engagement.service';

export const getPosts = asyncHandler(async (req: AuthRequest, res: Response) => {
  const result = await engagementService.getPosts(req.user!.companyId, req.query);
  res.json({ success: true, data: result.posts, pagination: result.pagination });
});

export const createPost = asyncHandler(async (req: AuthRequest, res: Response) => {
  const post = await engagementService.createPost({
    ...req.body,
    authorId: req.user!.id,
    companyId: req.user!.companyId,
  });
  res.status(201).json({ success: true, data: { post } });
});

export const getPost = asyncHandler(async (req: AuthRequest, res: Response) => {
  const post = await engagementService.getPostById(req.params.id);
  res.json({ success: true, data: { post } });
});

export const updatePost = asyncHandler(async (req: AuthRequest, res: Response) => {
  const post = await engagementService.updatePost(req.params.id, req.user!.id, req.body);
  res.json({ success: true, data: { post } });
});

export const deletePost = asyncHandler(async (req: AuthRequest, res: Response) => {
  await engagementService.deletePost(req.params.id, req.user!.id);
  res.json({ success: true, message: 'Post deleted' });
});

export const addReaction = asyncHandler(async (req: AuthRequest, res: Response) => {
  const post = await engagementService.addReaction(
    req.params.id,
    req.user!.id,
    req.body.type
  );
  res.json({ success: true, data: { post } });
});

export const removeReaction = asyncHandler(async (req: AuthRequest, res: Response) => {
  const post = await engagementService.removeReaction(req.params.id, req.user!.id);
  res.json({ success: true, data: { post } });
});

export const addComment = asyncHandler(async (req: AuthRequest, res: Response) => {
  const post = await engagementService.addComment(
    req.params.id,
    req.user!.id,
    req.body.content,
    req.body.parentId
  );
  res.json({ success: true, data: { post } });
});

export const updateComment = asyncHandler(async (req: AuthRequest, res: Response) => {
  const post = await engagementService.updateComment(
    req.params.id,
    req.params.commentId,
    req.user!.id,
    req.body.content
  );
  res.json({ success: true, data: { post } });
});

export const deleteComment = asyncHandler(async (req: AuthRequest, res: Response) => {
  const post = await engagementService.deleteComment(
    req.params.id,
    req.params.commentId,
    req.user!.id
  );
  res.json({ success: true, data: { post } });
});

export const sharePost = asyncHandler(async (req: AuthRequest, res: Response) => {
  await engagementService.sharePost(req.params.id, req.user!.id);
  res.json({ success: true, message: 'Post shared' });
});

export const getAppreciations = asyncHandler(async (req: AuthRequest, res: Response) => {
  const result = await engagementService.getAppreciations(req.user!.companyId, req.query);
  res.json({ success: true, data: result.appreciations, pagination: result.pagination });
});

export const createAppreciation = asyncHandler(async (req: AuthRequest, res: Response) => {
  const appreciation = await engagementService.createAppreciation({
    ...req.body,
    givenBy: req.user!.id,
    companyId: req.user!.companyId,
  });
  res.status(201).json({ success: true, data: { appreciation } });
});

export const getAppreciation = asyncHandler(async (req: AuthRequest, res: Response) => {
  const appreciation = await engagementService.getAppreciationById(req.params.id);
  res.json({ success: true, data: { appreciation } });
});

export const getRecognitionHighlights = asyncHandler(async (req: AuthRequest, res: Response) => {
  const highlights = await engagementService.getRecognitionHighlights(req.user!.companyId);
  res.json({ success: true, data: { highlights } });
});

export const getTopContributors = asyncHandler(async (req: AuthRequest, res: Response) => {
  const contributors = await engagementService.getTopContributors(req.user!.companyId);
  res.json({ success: true, data: { contributors } });
});

export const getNewJoinees = asyncHandler(async (req: AuthRequest, res: Response) => {
  const joinees = await engagementService.getNewJoinees(req.user!.companyId);
  res.json({ success: true, data: { joinees } });
});

export const addWelcomeMessage = asyncHandler(async (req: AuthRequest, res: Response) => {
  await engagementService.addWelcomeMessage(
    req.params.id,
    req.user!.id,
    req.body.message
  );
  res.json({ success: true, message: 'Welcome message added' });
});

export const getCelebrations = asyncHandler(async (req: AuthRequest, res: Response) => {
  const result = await engagementService.getCelebrations(req.user!.companyId, req.query);
  res.json({ success: true, data: result.celebrations, pagination: result.pagination });
});

export const createCelebration = asyncHandler(async (req: AuthRequest, res: Response) => {
  const celebration = await engagementService.createCelebration({
    ...req.body,
    createdBy: req.user!.id,
    companyId: req.user!.companyId,
  });
  res.status(201).json({ success: true, data: { celebration } });
});

export const getLeaderboard = asyncHandler(async (req: AuthRequest, res: Response) => {
  const leaderboard = await engagementService.getLeaderboard(
    req.user!.companyId,
    req.query.period as string || 'alltime'
  );
  res.json({ success: true, data: { leaderboard } });
});

export const getUserRank = asyncHandler(async (req: AuthRequest, res: Response) => {
  const rank = await engagementService.getUserRank(
    req.user!.companyId,
    req.params.userId,
    req.query.period as string || 'alltime'
  );
  res.json({ success: true, data: { rank } });
});

export const getUserGamificationStats = asyncHandler(async (req: AuthRequest, res: Response) => {
  const stats = await engagementService.getUserGamificationStats(req.params.userId);
  res.json({ success: true, data: { stats } });
});

export const getUserBadges = asyncHandler(async (req: AuthRequest, res: Response) => {
  const badges = await engagementService.getUserBadges(req.params.userId);
  res.json({ success: true, data: { badges } });
});
