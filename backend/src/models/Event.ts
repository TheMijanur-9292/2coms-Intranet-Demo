import mongoose, { Document, Schema } from 'mongoose';

export interface IEvent extends Document {
  companyId: mongoose.Types.ObjectId;
  departmentId?: mongoose.Types.ObjectId;
  title: string;
  description: string;
  type: 'meeting' | 'celebration' | 'training' | 'social' | 'holiday' | 'deadline' | 'other';
  startDate: Date;
  endDate: Date;
  location?: string;
  isVirtual: boolean;
  meetingLink?: string;
  organizerId: mongoose.Types.ObjectId;
  attendees: Array<{
    userId: mongoose.Types.ObjectId;
    status: 'invited' | 'accepted' | 'declined' | 'maybe';
    respondedAt?: Date;
  }>;
  maxAttendees?: number;
  isRecurring: boolean;
  recurrencePattern?: {
    frequency: 'daily' | 'weekly' | 'monthly' | 'yearly';
    interval: number;
    endDate?: Date;
    daysOfWeek?: number[];
    dayOfMonth?: number;
  };
  reminders: Array<{
    type: 'email' | 'push' | 'in_app';
    minutesBefore: number;
  }>;
  visibility: 'public' | 'department' | 'private';
  status: 'draft' | 'scheduled' | 'ongoing' | 'completed' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
}

const eventSchema = new Schema<IEvent>(
  {
    companyId: {
      type: Schema.Types.ObjectId,
      ref: 'Company',
      required: true,
    },
    departmentId: {
      type: Schema.Types.ObjectId,
      ref: 'Department',
    },
    title: {
      type: String,
      required: true,
      maxlength: 200,
    },
    description: {
      type: String,
      maxlength: 2000,
    },
    type: {
      type: String,
      enum: ['meeting', 'celebration', 'training', 'social', 'holiday', 'deadline', 'other'],
      default: 'meeting',
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    location: String,
    isVirtual: {
      type: Boolean,
      default: false,
    },
    meetingLink: String,
    organizerId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    attendees: [
      {
        userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        status: {
          type: String,
          enum: ['invited', 'accepted', 'declined', 'maybe'],
          default: 'invited',
        },
        respondedAt: Date,
      },
    ],
    maxAttendees: Number,
    isRecurring: {
      type: Boolean,
      default: false,
    },
    recurrencePattern: {
      frequency: {
        type: String,
        enum: ['daily', 'weekly', 'monthly', 'yearly'],
      },
      interval: Number,
      endDate: Date,
      daysOfWeek: [Number],
      dayOfMonth: Number,
    },
    reminders: [
      {
        type: {
          type: String,
          enum: ['email', 'push', 'in_app'],
        },
        minutesBefore: Number,
      },
    ],
    visibility: {
      type: String,
      enum: ['public', 'department', 'private'],
      default: 'public',
    },
    status: {
      type: String,
      enum: ['draft', 'scheduled', 'ongoing', 'completed', 'cancelled'],
      default: 'scheduled',
    },
  },
  {
    timestamps: true,
  }
);

eventSchema.index({ companyId: 1, startDate: 1 });
eventSchema.index({ companyId: 1, startDate: 1, endDate: 1 });
eventSchema.index({ organizerId: 1 });
eventSchema.index({ 'attendees.userId': 1 });

export default mongoose.model<IEvent>('Event', eventSchema);
