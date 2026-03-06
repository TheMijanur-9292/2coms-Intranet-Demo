import mongoose, { Document, Schema } from 'mongoose';

export interface IPost extends Document {
  authorId: mongoose.Types.ObjectId;
  companyId: mongoose.Types.ObjectId;
  departmentId?: mongoose.Types.ObjectId;
  type: 'post' | 'announcement' | 'project_win' | 'recognition' | 'milestone';
  content: string;
  media: Array<{
    type: 'image' | 'video' | 'document';
    url: string;
    thumbnail?: string;
    filename?: string;
    size?: number;
    mimeType?: string;
  }>;
  tags: string[];
  mentions: Array<{
    userId: mongoose.Types.ObjectId;
    notified: boolean;
  }>;
  visibility: 'public' | 'department' | 'private';
  targetDepartments: mongoose.Types.ObjectId[];
  status: 'draft' | 'published' | 'archived' | 'deleted';
  moderation: {
    status: 'pending' | 'approved' | 'rejected' | 'flagged';
    reviewedBy?: mongoose.Types.ObjectId;
    reviewedAt?: Date;
    reason?: string;
    autoModerated: boolean;
  };
  reactions: Array<{
    userId: mongoose.Types.ObjectId;
    type: 'like' | 'love' | 'celebrate' | 'insightful' | 'support';
    createdAt: Date;
  }>;
  comments: Array<{
    _id: mongoose.Types.ObjectId;
    userId: mongoose.Types.ObjectId;
    content: string;
    reactions: Array<{
      userId: mongoose.Types.ObjectId;
      type: string;
    }>;
    moderation: {
      status: string;
      reviewedBy?: mongoose.Types.ObjectId;
      reviewedAt?: Date;
    };
    createdAt: Date;
    updatedAt: Date;
  }>;
  engagement: {
    viewCount: number;
    reactionCount: number;
    commentCount: number;
    shareCount: number;
    engagementScore: number;
  };
  pinned: boolean;
  pinnedUntil?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const postSchema = new Schema<IPost>(
  {
    authorId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    companyId: {
      type: Schema.Types.ObjectId,
      ref: 'Company',
      required: true,
    },
    departmentId: {
      type: Schema.Types.ObjectId,
      ref: 'Department',
    },
    type: {
      type: String,
      enum: ['post', 'announcement', 'project_win', 'recognition', 'milestone'],
      default: 'post',
    },
    content: {
      type: String,
      required: [true, 'Content is required'],
      maxlength: 5000,
    },
    media: [
      {
        type: {
          type: String,
          enum: ['image', 'video', 'document'],
        },
        url: String,
        thumbnail: String,
        filename: String,
        size: Number,
        mimeType: String,
      },
    ],
    tags: [String],
    mentions: [
      {
        userId: { type: Schema.Types.ObjectId, ref: 'User' },
        notified: { type: Boolean, default: false },
      },
    ],
    visibility: {
      type: String,
      enum: ['public', 'department', 'private'],
      default: 'public',
    },
    targetDepartments: [{ type: Schema.Types.ObjectId, ref: 'Department' }],
    status: {
      type: String,
      enum: ['draft', 'published', 'archived', 'deleted'],
      default: 'published',
    },
    moderation: {
      status: {
        type: String,
        enum: ['pending', 'approved', 'rejected', 'flagged'],
        default: 'pending',
      },
      reviewedBy: { type: Schema.Types.ObjectId, ref: 'User' },
      reviewedAt: Date,
      reason: String,
      autoModerated: { type: Boolean, default: false },
    },
    reactions: [
      {
        userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        type: {
          type: String,
          enum: ['like', 'love', 'celebrate', 'insightful', 'support'],
          required: true,
        },
        createdAt: { type: Date, default: Date.now },
      },
    ],
    comments: [
      {
        _id: { type: Schema.Types.ObjectId, default: () => new mongoose.Types.ObjectId() },
        userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        content: { type: String, required: true, maxlength: 2000 },
        reactions: [
          {
            userId: { type: Schema.Types.ObjectId, ref: 'User' },
            type: String,
          },
        ],
        moderation: {
          status: String,
          reviewedBy: { type: Schema.Types.ObjectId, ref: 'User' },
          reviewedAt: Date,
        },
        createdAt: { type: Date, default: Date.now },
        updatedAt: { type: Date, default: Date.now },
      },
    ],
    engagement: {
      viewCount: { type: Number, default: 0 },
      reactionCount: { type: Number, default: 0 },
      commentCount: { type: Number, default: 0 },
      shareCount: { type: Number, default: 0 },
      engagementScore: { type: Number, default: 0 },
    },
    pinned: { type: Boolean, default: false },
    pinnedUntil: Date,
  },
  {
    timestamps: true,
  }
);

// Indexes
postSchema.index({ companyId: 1, createdAt: -1 });
postSchema.index({ companyId: 1, status: 1, 'moderation.status': 1 });
postSchema.index({ companyId: 1, type: 1, createdAt: -1 });
postSchema.index({ authorId: 1, createdAt: -1 });
postSchema.index({ companyId: 1, departmentId: 1, createdAt: -1 });
postSchema.index({ companyId: 1, visibility: 1, createdAt: -1 });
postSchema.index({ companyId: 1, pinned: -1, createdAt: -1 });
postSchema.index({ 'engagement.engagementScore': -1 });
postSchema.index({ tags: 1 });
postSchema.index({ content: 'text' });

export default mongoose.model<IPost>('Post', postSchema);
