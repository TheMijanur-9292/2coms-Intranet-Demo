import mongoose, { Document, Schema } from 'mongoose';

export interface IAnnouncement extends Document {
  companyId: mongoose.Types.ObjectId;
  authorId: mongoose.Types.ObjectId;
  title: string;
  content: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  category: 'general' | 'hr' | 'it' | 'operations' | 'finance' | 'compliance';
  targetAudience: 'all' | 'department' | 'role' | 'custom';
  targetDepartments: mongoose.Types.ObjectId[];
  targetRoles: string[];
  targetUsers: mongoose.Types.ObjectId[];
  attachments: Array<{
    name: string;
    url: string;
    type: string;
    size: number;
  }>;
  publishDate: Date;
  expiryDate?: Date;
  isPinned: boolean;
  readBy: Array<{
    userId: mongoose.Types.ObjectId;
    readAt: Date;
  }>;
  status: 'draft' | 'scheduled' | 'published' | 'expired' | 'archived';
  moderation: {
    status: 'pending' | 'approved' | 'rejected';
    reviewedBy?: mongoose.Types.ObjectId;
    reviewedAt?: Date;
  };
  createdAt: Date;
  updatedAt: Date;
}

const announcementSchema = new Schema<IAnnouncement>(
  {
    companyId: {
      type: Schema.Types.ObjectId,
      ref: 'Company',
      required: true,
    },
    authorId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: [true, 'Title is required'],
      maxlength: 200,
    },
    content: {
      type: String,
      required: [true, 'Content is required'],
      maxlength: 5000,
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high', 'urgent'],
      default: 'medium',
    },
    category: {
      type: String,
      enum: ['general', 'hr', 'it', 'operations', 'finance', 'compliance'],
      default: 'general',
    },
    targetAudience: {
      type: String,
      enum: ['all', 'department', 'role', 'custom'],
      default: 'all',
    },
    targetDepartments: [{ type: Schema.Types.ObjectId, ref: 'Department' }],
    targetRoles: [String],
    targetUsers: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    attachments: [
      {
        name: String,
        url: String,
        type: String,
        size: Number,
      },
    ],
    publishDate: {
      type: Date,
      default: Date.now,
    },
    expiryDate: Date,
    isPinned: {
      type: Boolean,
      default: false,
    },
    readBy: [
      {
        userId: { type: Schema.Types.ObjectId, ref: 'User' },
        readAt: { type: Date, default: Date.now },
      },
    ],
    status: {
      type: String,
      enum: ['draft', 'scheduled', 'published', 'expired', 'archived'],
      default: 'published',
    },
    moderation: {
      status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'approved',
      },
      reviewedBy: { type: Schema.Types.ObjectId, ref: 'User' },
      reviewedAt: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
announcementSchema.index({ companyId: 1, publishDate: -1 });
announcementSchema.index({ companyId: 1, isPinned: -1, priority: -1, publishDate: -1 });
announcementSchema.index({ companyId: 1, status: 1, publishDate: -1 });
announcementSchema.index({ companyId: 1, category: 1, publishDate: -1 });
announcementSchema.index({ title: 'text', content: 'text' });

export default mongoose.model<IAnnouncement>('Announcement', announcementSchema);
