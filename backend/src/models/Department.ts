import mongoose, { Document, Schema } from 'mongoose';

export interface IDepartment extends Document {
  name: string;
  code: string;
  companyId: mongoose.Types.ObjectId;
  description?: string;
  headId?: mongoose.Types.ObjectId;
  parentDepartmentId?: mongoose.Types.ObjectId;
  isActive: boolean;
  memberCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const departmentSchema = new Schema<IDepartment>(
  {
    name: {
      type: String,
      required: [true, 'Department name is required'],
      trim: true,
    },
    code: {
      type: String,
      required: [true, 'Department code is required'],
      uppercase: true,
    },
    companyId: {
      type: Schema.Types.ObjectId,
      ref: 'Company',
      required: true,
    },
    description: {
      type: String,
      maxlength: 500,
    },
    headId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    parentDepartmentId: {
      type: Schema.Types.ObjectId,
      ref: 'Department',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    memberCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

departmentSchema.index({ companyId: 1, code: 1 }, { unique: true });
departmentSchema.index({ companyId: 1, name: 1 });
departmentSchema.index({ companyId: 1, isActive: 1 });

export default mongoose.model<IDepartment>('Department', departmentSchema);
