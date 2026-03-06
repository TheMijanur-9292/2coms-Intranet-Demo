import mongoose, { Document, Model, Schema } from 'mongoose';

export interface ICompany extends Document {
  name: string;
  code: string;
  domain?: string;
  logo?: string;
  description?: string;
  settings: {
    allowCrossCompanyView: boolean;
    moderationRequired: boolean;
    gamificationEnabled: boolean;
    allowPublicAnnouncements: boolean;
    maxFileUploadSize: number;
  };
  subscription: {
    plan: 'basic' | 'premium' | 'enterprise';
    maxUsers: number;
    expiresAt?: Date;
    isActive: boolean;
  };
  createdAt: Date;
  updatedAt: Date;
}

const companySchema = new Schema<ICompany>(
  {
    name: {
      type: String,
      required: [true, 'Company name is required'],
      unique: true,
      trim: true,
    },
    code: {
      type: String,
      required: [true, 'Company code is required'],
      unique: true,
      uppercase: true,
      trim: true,
    },
    domain: { type: String, trim: true },
    logo: String,
    description: { type: String, maxlength: 500 },
    settings: {
      allowCrossCompanyView: { type: Boolean, default: false },
      moderationRequired: { type: Boolean, default: true },
      gamificationEnabled: { type: Boolean, default: true },
      allowPublicAnnouncements: { type: Boolean, default: true },
      maxFileUploadSize: { type: Number, default: 10 },
    },
    subscription: {
      plan: {
        type: String,
        enum: ['basic', 'premium', 'enterprise'],
        default: 'basic',
      },
      maxUsers: { type: Number, default: 100 },
      expiresAt: Date,
      isActive: { type: Boolean, default: true },
    },
  },
  { timestamps: true }
);

// Note: unique: true in field definitions already creates these indexes,
// so we only add non-unique query indexes here
companySchema.index({ 'subscription.isActive': 1 });

const Company: Model<ICompany> =
  mongoose.models.Company || mongoose.model<ICompany>('Company', companySchema);

export default Company;
