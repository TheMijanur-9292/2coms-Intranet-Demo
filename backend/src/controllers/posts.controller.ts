import { Response } from 'express';
import { AuthRequest } from '../types/express';
import { asyncHandler } from '../utils/asyncHandler';
import postsService from '../services/posts.service';

export const createPost = asyncHandler(async (req: AuthRequest, res: Response) => {
  const post = await postsService.createPost({
    ...req.body,
    authorId: req.user!.id,
    companyId: req.user!.companyId,
    departmentId: req.user!.departmentId || req.body.departmentId,
  });

  res.status(201).json({
    success: true,
    message: 'Post created successfully',
    data: { post },
  });
});

export const getPosts = asyncHandler(async (req: AuthRequest, res: Response) => {
  const result = await postsService.getPosts(req.user!.companyId, req.query);

  res.json({
    success: true,
    data: result.posts,
    pagination: result.pagination,
  });
});

export const getPost = asyncHandler(async (req: AuthRequest, res: Response) => {
  const post = await postsService.getPostById(req.params.id);

  res.json({
    success: true,
    data: { post },
  });
});

export const updatePost = asyncHandler(async (req: AuthRequest, res: Response) => {
  const post = await postsService.updatePost(req.params.id, req.user!.id, req.body);

  res.json({
    success: true,
    message: 'Post updated successfully',
    data: { post },
  });
});

export const deletePost = asyncHandler(async (req: AuthRequest, res: Response) => {
  await postsService.deletePost(req.params.id, req.user!.id, req.user!.role);

  res.json({
    success: true,
    message: 'Post deleted successfully',
  });
});

export const addReaction = asyncHandler(async (req: AuthRequest, res: Response) => {
  const post = await postsService.addReaction(req.params.id, req.user!.id, req.body.type);

  res.json({
    success: true,
    message: 'Reaction added successfully',
    data: { post },
  });
});

export const removeReaction = asyncHandler(async (req: AuthRequest, res: Response) => {
  const post = await postsService.removeReaction(req.params.id, req.user!.id);

  res.json({
    success: true,
    message: 'Reaction removed successfully',
    data: { post },
  });
});

export const addComment = asyncHandler(async (req: AuthRequest, res: Response) => {
  const post = await postsService.addComment(req.params.id, req.user!.id, req.body.content);

  res.json({
    success: true,
    message: 'Comment added successfully',
    data: { post },
  });
});

export const updateComment = asyncHandler(async (req: AuthRequest, res: Response) => {
  const post = await postsService.updateComment(
    req.params.id,
    req.params.commentId,
    req.user!.id,
    req.body.content
  );

  res.json({
    success: true,
    message: 'Comment updated successfully',
    data: { post },
  });
});

export const deleteComment = asyncHandler(async (req: AuthRequest, res: Response) => {
  const post = await postsService.deleteComment(
    req.params.id,
    req.params.commentId,
    req.user!.id,
    req.user!.role
  );

  res.json({
    success: true,
    message: 'Comment deleted successfully',
    data: { post },
  });
});
