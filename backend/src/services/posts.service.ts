import mongoose from 'mongoose';
import Post from '../models/Post';
import User from '../models/User';
import { AppError } from '../utils/AppError';
import { moderationService } from './moderation.service';
import { gamificationService } from './gamification.service';
import { notificationService } from './notifications.service';

export class PostsService {
  async createPost(data: {
    authorId: string;
    companyId: string;
    departmentId?: string;
    type: string;
    content: string;
    media?: any[];
    tags?: string[];
    mentions?: string[];
    visibility?: string;
  }) {
    // Auto-moderate content
    const moderationResult = await moderationService.autoModerate(data.content);

    const post = await Post.create({
      ...data,
      status: moderationResult.approved ? 'published' : 'draft',
      moderation: {
        status: moderationResult.approved ? 'approved' : 'pending',
        autoModerated: true,
      },
      engagement: {
        viewCount: 0,
        reactionCount: 0,
        commentCount: 0,
        shareCount: 0,
        engagementScore: 0,
      },
    });

    // Award points for post creation
    if (moderationResult.approved) {
      await gamificationService.awardPoints(data.authorId, 'post_created', 10);
      await User.findByIdAndUpdate(data.authorId, {
        $inc: { 'gamification.totalPosts': 1 },
      });
    }

    // Notify mentioned users
    if (data.mentions && data.mentions.length > 0) {
      await notificationService.createMentions(data.mentions, {
        type: 'mention',
        title: 'You were mentioned',
        message: 'You were mentioned in a post',
        link: `/activity-wall/${post._id}`,
        relatedId: post._id.toString(),
      });
    }

    return await this.getPostById(post._id.toString());
  }

  async getPosts(companyId: string, filters: {
    page?: number;
    limit?: number;
    type?: string;
    departmentId?: string;
    status?: string;
    sort?: string;
  }) {
    const page = filters.page || 1;
    const limit = filters.limit || 20;
    const skip = (page - 1) * limit;

    const query: any = {
      companyId,
      status: filters.status || 'published',
      'moderation.status': 'approved',
    };

    if (filters.type) query.type = filters.type;
    if (filters.departmentId) query.departmentId = filters.departmentId;

    const sortOptions: any = {};
    if (filters.sort === 'popular') {
      sortOptions['engagement.engagementScore'] = -1;
    } else {
      sortOptions.createdAt = -1;
    }

    const posts = await Post.find(query)
      .populate('authorId', 'firstName lastName displayName avatar designation')
      .populate('departmentId', 'name code')
      .sort(sortOptions)
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
      .populate('authorId', 'firstName lastName displayName avatar designation')
      .populate('departmentId', 'name code')
      .populate('reactions.userId', 'firstName lastName displayName avatar')
      .populate('comments.userId', 'firstName lastName displayName avatar');

    if (!post) {
      throw new AppError('Post not found', 404);
    }

    return post;
  }

  async updatePost(postId: string, userId: string, data: {
    content?: string;
    media?: any[];
    tags?: string[];
    visibility?: string;
  }) {
    const post = await Post.findById(postId);
    if (!post) {
      throw new AppError('Post not found', 404);
    }

    // Check ownership or admin role
    if (post.authorId.toString() !== userId) {
      throw new AppError('Not authorized to update this post', 403);
    }

    // Re-moderate if content changed
    if (data.content) {
      const moderationResult = await moderationService.autoModerate(data.content);
      data['moderation.status'] = moderationResult.approved ? 'approved' : 'pending';
    }

    const updatedPost = await Post.findByIdAndUpdate(
      postId,
      { ...data, updatedAt: new Date() },
      { new: true, runValidators: true }
    );

    return updatedPost;
  }

  async deletePost(postId: string, userId: string, userRole: string) {
    const post = await Post.findById(postId);
    if (!post) {
      throw new AppError('Post not found', 404);
    }

    // Check ownership or admin role
    if (post.authorId.toString() !== userId && !['hr', 'admin'].includes(userRole)) {
      throw new AppError('Not authorized to delete this post', 403);
    }

    await Post.findByIdAndUpdate(postId, { status: 'deleted' });
  }

  async addReaction(postId: string, userId: string, reactionType: string) {
    const post = await Post.findById(postId);
    if (!post) {
      throw new AppError('Post not found', 404);
    }

    // Remove existing reaction from user
    post.reactions = post.reactions.filter(
      (r: any) => r.userId.toString() !== userId
    );

    // Add new reaction
    post.reactions.push({
      userId,
      type: reactionType,
      createdAt: new Date(),
    });

    // Update engagement metrics
    post.engagement.reactionCount = post.reactions.length;
    post.engagement.engagementScore =
      post.reactions.length + post.comments.length * 2 + post.engagement.viewCount * 0.1;

    await post.save();

    // Award points
    await gamificationService.awardPoints(userId, 'reaction_given', 1);
    await User.findByIdAndUpdate(userId, {
      $inc: { 'gamification.totalReactions': 1 },
    });

    // Notify post author
    if (post.authorId.toString() !== userId) {
      await notificationService.create(userId, {
        type: 'reaction',
        title: 'New reaction',
        message: 'Someone reacted to your post',
        link: `/activity-wall/${postId}`,
        relatedId: postId,
      });
    }

    return post;
  }

  async removeReaction(postId: string, userId: string) {
    const post = await Post.findById(postId);
    if (!post) {
      throw new AppError('Post not found', 404);
    }

    post.reactions = post.reactions.filter(
      (r: any) => r.userId.toString() !== userId
    );

    post.engagement.reactionCount = post.reactions.length;
    post.engagement.engagementScore =
      post.reactions.length + post.comments.length * 2 + post.engagement.viewCount * 0.1;

    await post.save();
    return post;
  }

  async addComment(postId: string, userId: string, content: string) {
    const post = await Post.findById(postId);
    if (!post) {
      throw new AppError('Post not found', 404);
    }

    const comment = {
      _id: new mongoose.Types.ObjectId(),
      userId,
      content,
      reactions: [],
      moderation: { status: 'approved' },
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    post.comments.push(comment);
    post.engagement.commentCount = post.comments.length;
    post.engagement.engagementScore =
      post.reactions.length + post.comments.length * 2 + post.engagement.viewCount * 0.1;

    await post.save();

    // Award points
    await gamificationService.awardPoints(userId, 'comment_added', 5);
    await User.findByIdAndUpdate(userId, {
      $inc: { 'gamification.totalComments': 1 },
    });

    // Notify post author
    if (post.authorId.toString() !== userId) {
      await notificationService.create(userId, {
        type: 'comment',
        title: 'New comment',
        message: 'Someone commented on your post',
        link: `/activity-wall/${postId}`,
        relatedId: postId,
      });
    }

    return await this.getPostById(postId);
  }

  async updateComment(postId: string, commentId: string, userId: string, content: string) {
    const post = await Post.findById(postId);
    if (!post) {
      throw new AppError('Post not found', 404);
    }

    const comment = post.comments.id(commentId);
    if (!comment) {
      throw new AppError('Comment not found', 404);
    }

    if (comment.userId.toString() !== userId) {
      throw new AppError('Not authorized to update this comment', 403);
    }

    comment.content = content;
    comment.updatedAt = new Date();
    comment.isEdited = true;

    await post.save();
    return await this.getPostById(postId);
  }

  async deleteComment(postId: string, commentId: string, userId: string, userRole: string) {
    const post = await Post.findById(postId);
    if (!post) {
      throw new AppError('Post not found', 404);
    }

    const comment = post.comments.id(commentId);
    if (!comment) {
      throw new AppError('Comment not found', 404);
    }

    if (comment.userId.toString() !== userId && !['hr', 'admin'].includes(userRole)) {
      throw new AppError('Not authorized to delete this comment', 403);
    }

    post.comments.pull(commentId);
    post.engagement.commentCount = post.comments.length;
    post.engagement.engagementScore =
      post.reactions.length + post.comments.length * 2 + post.engagement.viewCount * 0.1;

    await post.save();
    return await this.getPostById(postId);
  }
}

export default new PostsService();
