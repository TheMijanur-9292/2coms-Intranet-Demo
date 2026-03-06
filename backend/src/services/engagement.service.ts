import mongoose from 'mongoose';
import Post from '../models/Post';
import RecognitionPost from '../models/RecognitionPost';
import NewJoinee from '../models/NewJoinee';
import User from '../models/User';
import { AppError } from '../utils/AppError';
import { moderationService } from './moderation.service';
import { gamificationService } from './gamification.service';
import { notificationService } from './notifications.service';

export class EngagementService {
  // Activity Wall Methods
  async createPost(data: {
    authorId: string;
    companyId: string;
    content: string;
    media?: any[];
    tags?: string[];
    mentions?: string[];
    visibility?: string;
  }) {
    const moderationResult = await moderationService.autoModerate(data.content);

    const post = await Post.create({
      ...data,
      status: moderationResult.approved ? 'published' : 'draft',
      moderation: {
        status: moderationResult.approved ? 'approved' : 'pending',
        autoModerated: true,
      },
    });

    if (moderationResult.approved) {
      await gamificationService.awardPoints(data.authorId, 'post_created', 10);
      await User.findByIdAndUpdate(data.authorId, {
        $inc: { 'gamification.totalPosts': 1 },
      });
    }

    return await this.getPostById(post._id.toString());
  }

  async getPosts(companyId: string, filters: any) {
    const page = filters.page || 1;
    const limit = filters.limit || 20;
    const skip = (page - 1) * limit;

    const query: any = {
      companyId,
      status: 'published',
      'moderation.status': 'approved',
    };

    const posts = await Post.find(query)
      .populate('authorId', 'firstName lastName displayName avatar designation')
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip);

    const total = await Post.countDocuments(query);

    return {
      posts,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getPostById(postId: string) {
    const post = await Post.findById(postId)
      .populate('authorId', 'firstName lastName displayName avatar')
      .populate('reactions.userId', 'firstName lastName displayName avatar')
      .populate('comments.userId', 'firstName lastName displayName avatar');

    if (!post) {
      throw new AppError('Post not found', 404);
    }

    return post;
  }

  async addReaction(postId: string, userId: string, reactionType: string) {
    const post = await Post.findById(postId);
    if (!post) throw new AppError('Post not found', 404);

    post.reactions = post.reactions.filter((r: any) => r.userId.toString() !== userId);
    post.reactions.push({ userId, type: reactionType, createdAt: new Date() });
    post.engagement.reactionCount = post.reactions.length;
    post.engagement.engagementScore =
      post.reactions.length + post.comments.length * 2 + post.engagement.viewCount * 0.1;

    await post.save();
    await gamificationService.awardPoints(userId, 'reaction_given', 1);

    return post;
  }

  async addComment(postId: string, userId: string, content: string, parentId?: string) {
    const post = await Post.findById(postId);
    if (!post) throw new AppError('Post not found', 404);

    const comment: any = {
      _id: new mongoose.Types.ObjectId(),
      userId,
      content,
      reactions: [],
      moderation: { status: 'approved' },
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    if (parentId) {
      const parentComment = post.comments.id(parentId);
      if (!parentComment) throw new AppError('Parent comment not found', 404);
      if (!parentComment.replies) parentComment.replies = [];
      parentComment.replies.push(comment);
    } else {
      post.comments.push(comment);
    }

    post.engagement.commentCount = post.comments.length;
    await post.save();
    await gamificationService.awardPoints(userId, 'comment_added', 5);

    return await this.getPostById(postId);
  }

  // Peer Appreciation Methods
  async createAppreciation(data: {
    givenBy: string;
    companyId: string;
    recognizedUserId: string;
    category: string;
    message: string;
  }) {
    const appreciation = await RecognitionPost.create({
      ...data,
      type: 'peer_appreciation',
      status: 'published',
      moderation: { status: 'approved' },
      pointsAwarded: 25,
    });

    await gamificationService.awardPoints(data.recognizedUserId, 'recognition_received', 25);
    await gamificationService.awardPoints(data.givenBy, 'recognition_given', 5);

    return appreciation;
  }

  async getAppreciations(companyId: string, filters: any) {
    const page = filters.page || 1;
    const limit = filters.limit || 15;

    const appreciations = await RecognitionPost.find({
      companyId,
      type: 'peer_appreciation',
      status: 'published',
    })
      .populate('recognizedUserId', 'firstName lastName displayName avatar')
      .populate('recognizedBy', 'firstName lastName displayName avatar')
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip((page - 1) * limit);

    return {
      appreciations,
      pagination: {
        page,
        limit,
        total: await RecognitionPost.countDocuments({ companyId, type: 'peer_appreciation' }),
      },
    };
  }

  // Recognition Highlights
  async getRecognitionHighlights(companyId: string) {
    const topAppreciations = await RecognitionPost.find({
      companyId,
      type: 'peer_appreciation',
      status: 'published',
    })
      .populate('recognizedUserId', 'firstName lastName displayName avatar')
      .sort({ 'engagement.reactionCount': -1 })
      .limit(5);

    return {
      topAppreciations,
      totalAppreciations: await RecognitionPost.countDocuments({
        companyId,
        type: 'peer_appreciation',
      }),
    };
  }

  async getTopContributors(companyId: string) {
    const contributors = await User.find({ companyId })
      .sort({ 'gamification.points': -1 })
      .limit(10)
      .select('firstName lastName displayName avatar gamification');

    return contributors;
  }

  // New Joinees
  async getNewJoinees(companyId: string) {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const joinees = await NewJoinee.find({
      companyId,
      isActive: true,
      startDate: { $gte: thirtyDaysAgo },
    })
      .populate('userId', 'firstName lastName displayName avatar designation')
      .populate('departmentId', 'name')
      .sort({ startDate: -1 })
      .limit(10);

    return joinees;
  }

  async addWelcomeMessage(joineeId: string, userId: string, message: string) {
    const joinee = await NewJoinee.findById(joineeId);
    if (!joinee) throw new AppError('New joinee not found', 404);

    if (!joinee.welcomeMessages) joinee.welcomeMessages = [];
    joinee.welcomeMessages.push({
      from: userId,
      message,
      createdAt: new Date(),
    });

    await joinee.save();
    await gamificationService.awardPoints(userId, 'welcome_new_joinee', 10);

    return joinee;
  }

  // Celebrations
  async getCelebrations(companyId: string, filters: any) {
    const celebrations = await Post.find({
      companyId,
      type: 'milestone',
      status: 'published',
    })
      .populate('authorId', 'firstName lastName displayName avatar')
      .sort({ createdAt: -1 })
      .limit(filters.limit || 20);

    return {
      celebrations,
      pagination: {
        page: filters.page || 1,
        limit: filters.limit || 20,
        total: await Post.countDocuments({ companyId, type: 'milestone' }),
      },
    };
  }

  async createCelebration(data: {
    createdBy: string;
    companyId: string;
    type: string;
    content: string;
    relatedUserId?: string;
  }) {
    const celebration = await Post.create({
      authorId: data.createdBy,
      companyId: data.companyId,
      type: 'milestone',
      content: data.content,
      status: 'published',
      moderation: { status: 'approved' },
    });

    await gamificationService.awardPoints(data.createdBy, 'celebration_created', 15);

    return celebration;
  }

  // Leaderboard
  async getLeaderboard(companyId: string, period: string = 'alltime') {
    const users = await User.find({ companyId })
      .sort({ 'gamification.points': -1 })
      .limit(100)
      .select('firstName lastName displayName avatar gamification');

    const rankings = users.map((user, index) => ({
      rank: index + 1,
      userId: user._id.toString(),
      name: user.displayName || `${user.firstName} ${user.lastName}`,
      avatar: user.avatar,
      points: user.gamification.points,
      badges: user.gamification.badges.map((b: any) => b.badgeId?.name || ''),
      change: 0, // Calculate from previous period
    }));

    return {
      period,
      rankings,
      totalParticipants: users.length,
      updatedAt: new Date(),
    };
  }

  async getUserRank(companyId: string, userId: string, period: string) {
    const leaderboard = await this.getLeaderboard(companyId, period);
    const userRank = leaderboard.rankings.findIndex((r) => r.userId === userId);

    return {
      rank: userRank >= 0 ? userRank + 1 : null,
      ...leaderboard.rankings[userRank],
    };
  }

  async getUserGamificationStats(userId: string) {
    const user = await User.findById(userId).select('gamification');
    if (!user) throw new AppError('User not found', 404);

    return {
      points: user.gamification.points,
      level: user.gamification.level,
      totalPosts: user.gamification.totalPosts,
      totalComments: user.gamification.totalComments,
      totalReactions: user.gamification.totalReactions,
      badges: user.gamification.badges.length,
    };
  }

  async getUserBadges(userId: string) {
    const user = await User.findById(userId)
      .populate('gamification.badges.badgeId')
      .select('gamification.badges');
    if (!user) throw new AppError('User not found', 404);

    return user.gamification.badges;
  }

  // Helper methods
  async updatePost(postId: string, userId: string, data: any) {
    const post = await Post.findById(postId);
    if (!post) throw new AppError('Post not found', 404);
    if (post.authorId.toString() !== userId) {
      throw new AppError('Not authorized', 403);
    }

    return await Post.findByIdAndUpdate(postId, { ...data, updatedAt: new Date() }, { new: true });
  }

  async deletePost(postId: string, userId: string) {
    const post = await Post.findById(postId);
    if (!post) throw new AppError('Post not found', 404);
    if (post.authorId.toString() !== userId) {
      throw new AppError('Not authorized', 403);
    }

    await Post.findByIdAndUpdate(postId, { status: 'deleted' });
  }

  async removeReaction(postId: string, userId: string) {
    const post = await Post.findById(postId);
    if (!post) throw new AppError('Post not found', 404);

    post.reactions = post.reactions.filter((r: any) => r.userId.toString() !== userId);
    post.engagement.reactionCount = post.reactions.length;
    await post.save();

    return post;
  }

  async updateComment(postId: string, commentId: string, userId: string, content: string) {
    const post = await Post.findById(postId);
    if (!post) throw new AppError('Post not found', 404);

    const comment = post.comments.id(commentId);
    if (!comment) throw new AppError('Comment not found', 404);
    if (comment.userId.toString() !== userId) {
      throw new AppError('Not authorized', 403);
    }

    comment.content = content;
    comment.updatedAt = new Date();
    await post.save();

    return await this.getPostById(postId);
  }

  async deleteComment(postId: string, commentId: string, userId: string) {
    const post = await Post.findById(postId);
    if (!post) throw new AppError('Post not found', 404);

    const comment = post.comments.id(commentId);
    if (!comment) throw new AppError('Comment not found', 404);
    if (comment.userId.toString() !== userId) {
      throw new AppError('Not authorized', 403);
    }

    post.comments.pull(commentId);
    post.engagement.commentCount = post.comments.length;
    await post.save();

    return await this.getPostById(postId);
  }

  async sharePost(postId: string, userId: string) {
    const post = await Post.findById(postId);
    if (!post) throw new AppError('Post not found', 404);

    post.engagement.shareCount = (post.engagement.shareCount || 0) + 1;
    await post.save();

    await gamificationService.awardPoints(userId, 'post_shared', 2);
  }

  async getAppreciationById(appreciationId: string) {
    const appreciation = await RecognitionPost.findById(appreciationId)
      .populate('recognizedUserId', 'firstName lastName displayName avatar')
      .populate('recognizedBy', 'firstName lastName displayName avatar');

    if (!appreciation) {
      throw new AppError('Appreciation not found', 404);
    }

    return appreciation;
  }
}

export const engagementService = new EngagementService();
export default engagementService;
