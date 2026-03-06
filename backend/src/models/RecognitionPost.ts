import mongoose, { Document, Schema } from 'mongoose';

export interface IRecognitionPost extends Document {
  companyId: mongoose.Types.ObjectId;
  recognizedUserId: mongoose.Types.ObjectId;
  recognizedBy: mongoose.Types.ObjectId;
  type: 'peer_appreciation' | 'achievement' | 'milestone' | 'award';
  title: string;
  description: string;
  category: 'teamwork' | 'innovation' | 'excellence' | 'leadership' | 'customer_service' | 'other';
  pointsAwarded: number;
  badgeId?: mongoose.Types.ObjectId;
  media: Array<{
    type: 'image' | 'video';
    url: string;
    thumbnail?: string;
  }>;
  reactions: Array<{
    userId: mongoose.Types.ObjectId;
    type: 'like' | 'love' | 'celebrate' | 'support';
    createdAt: Date;
  }>;
  comments: Array<{
    _id: mongoose.Types.ObjectId;
    userId: mongoose.Types.ObjectId;
    content: string;
    createdAt: Date;
    updatedAt: Date;
  }>;
  status: 'draft' | 'published' | 'archived';
  moderation: {
    status: 'pending' | 'approved' | 'rejected';
    reviewedBy?: mongoose.Types.ObjectId;
    reviewedAt?: Date;
  };
  createdAt: Date;
  updatedAt: Date;
}

const recognitionPostSchema = new Schema<IRecognitionPost>(
  {
    companyId: {
      type: Schema.Types.ObjectId,
      ref: 'Company',
      required: true,
    },
    recognizedUserId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    recognizedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    type: {
      type: String,
      enum: ['peer_appreciation', 'achievement', 'milestone', 'award'],
      required: true,
    },
    title: {
      type: String,
      required: true,
      maxlength: 200,
    },
    description: {
      type: String,
      required: true,
      maxlength: 2000,
    },
    category: {
      type: String,
      enum: ['teamwork', 'innovation', 'excellence', 'leadership', 'customer_service', 'other'],
      default: 'other',
    },
    pointsAwarded: {
      type: Number,
      default: 0,
      min: 0,
    },
    badgeId: {
      type: Schema.Types.ObjectId,
      ref: 'Badge',
    },
    media: [
      {
        type: { type: String, enum: ['image', 'video'] },
        url: String,
        thumbnail: String,
      },
    ],
    reactions: [
      {
        userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        type: {
          type: String,
          enum: ['like', 'love', 'celebrate', 'support'],
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
        createdAt: { type: Date, default: Date.now },
        updatedAt: { type: Date, default: Date.now },
      },
    ],
    status: {
      type: String,
      enum: ['draft', 'published', 'archived'],
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

recognitionPostSchema.index({ companyId: 1, createdAt: -1 });
recognitionPostSchema.index({ recognizedUserId: 1, createdAt: -1 });
recognitionPostSchema.index({ companyId: 1, type: 1, createdAt: -1 });

export default mongoose.model<IRecognitionPost>('RecognitionPost', recognitionPostSchema);
