import mongoose, { Document, Schema } from 'mongoose';

export interface INewJoinee extends Document {
  userId: mongoose.Types.ObjectId;
  companyId: mongoose.Types.ObjectId;
  departmentId: mongoose.Types.ObjectId;
  introduction: string;
  previousExperience?: string;
  funFacts?: string;
  welcomeMessage?: string;
  welcomeBy?: mongoose.Types.ObjectId;
  welcomeMessages: Array<{
    from: mongoose.Types.ObjectId;
    message: string;
    createdAt: Date;
  }>;
  startDate: Date;
  isActive: boolean;
  displayOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

const newJoineeSchema = new Schema<INewJoinee>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    companyId: {
      type: Schema.Types.ObjectId,
      ref: 'Company',
      required: true,
    },
    departmentId: {
      type: Schema.Types.ObjectId,
      ref: 'Department',
      required: true,
    },
    introduction: {
      type: String,
      maxlength: 1000,
    },
    previousExperience: {
      type: String,
      maxlength: 2000,
    },
    funFacts: {
      type: String,
      maxlength: 500,
    },
    welcomeMessage: {
      type: String,
      maxlength: 1000,
    },
    welcomeBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    welcomeMessages: [
      {
        from: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        message: { type: String, required: true, maxlength: 500 },
        createdAt: { type: Date, default: Date.now },
      },
    ],
    startDate: {
      type: Date,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    displayOrder: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// userId has unique:true in field definition, only add compound indexes
newJoineeSchema.index({ companyId: 1, isActive: 1, startDate: -1 });
newJoineeSchema.index({ companyId: 1, departmentId: 1 });

export default mongoose.model<INewJoinee>('NewJoinee', newJoineeSchema);
