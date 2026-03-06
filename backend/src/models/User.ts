import mongoose, { Document, Model, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt, { SignOptions } from 'jsonwebtoken';

// ─── Interfaces ────────────────────────────────────────────────────────────

export interface IUserPreferences {
  notifications: boolean;
  emailDigest: boolean;
  theme: 'light' | 'dark' | 'corporate';
  language: string;
}

export interface IUserGamification {
  points: number;
  badges: string[];
  level: number;
  totalPosts: number;
  totalComments: number;
  totalReactions: number;
}

export interface IUser extends Document {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  displayName: string;
  avatar?: string;
  employeeId: string;
  companyId: mongoose.Types.ObjectId;
  departmentId: mongoose.Types.ObjectId;
  designation: string;
  role: 'employee' | 'manager' | 'hr' | 'admin';
  managerId?: mongoose.Types.ObjectId;
  joinDate: Date;
  isActive: boolean;
  isEmailVerified: boolean;
  lastLogin?: Date;
  preferences: IUserPreferences;
  gamification: IUserGamification;
  comparePassword(candidatePassword: string): Promise<boolean>;
  generateAuthToken(): string;
}

// ─── Schema ────────────────────────────────────────────────────────────────

const userSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [8, 'Password must be at least 8 characters'],
      select: false,
    },
    firstName: { type: String, required: true, trim: true, maxlength: 50 },
    lastName: { type: String, required: true, trim: true, maxlength: 50 },
    displayName: { type: String, trim: true, maxlength: 100 },
    avatar: { type: String },
    employeeId: { type: String, required: true, trim: true },
    companyId: { type: Schema.Types.ObjectId, ref: 'Company', required: true },
    departmentId: { type: Schema.Types.ObjectId, ref: 'Department', required: true },
    designation: { type: String, required: true, trim: true, maxlength: 100 },
    role: {
      type: String,
      enum: ['employee', 'manager', 'hr', 'admin'],
      default: 'employee',
    },
    managerId: { type: Schema.Types.ObjectId, ref: 'User' },
    joinDate: { type: Date, default: Date.now },
    isActive: { type: Boolean, default: true },
    isEmailVerified: { type: Boolean, default: false },
    lastLogin: { type: Date },
    preferences: {
      notifications: { type: Boolean, default: true },
      emailDigest: { type: Boolean, default: true },
      theme: { type: String, enum: ['light', 'dark', 'corporate'], default: 'light' },
      language: { type: String, default: 'en' },
    },
    gamification: {
      points: { type: Number, default: 0 },
      badges: [{ type: String }],
      level: { type: Number, default: 1 },
      totalPosts: { type: Number, default: 0 },
      totalComments: { type: Number, default: 0 },
      totalReactions: { type: Number, default: 0 },
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (_doc, ret) => {
        delete ret.password;
        return ret;
      },
    },
  }
);

// ─── Indexes ───────────────────────────────────────────────────────────────
// Note: email has unique:true in the field definition, so no duplicate index needed here
userSchema.index({ employeeId: 1, companyId: 1 }, { unique: true });
userSchema.index({ companyId: 1 });
userSchema.index({ departmentId: 1 });
userSchema.index({ role: 1 });

// ─── Hooks ────────────────────────────────────────────────────────────────

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    if (!this.displayName) this.displayName = `${this.firstName} ${this.lastName}`;
    next();
  } catch (err) {
    next(err as Error);
  }
});

// ─── Methods ──────────────────────────────────────────────────────────────

userSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.generateAuthToken = function (): string {
  const payload = {
    userId: (this._id as mongoose.Types.ObjectId).toString(),
    companyId: (this.companyId as mongoose.Types.ObjectId).toString(),
    departmentId: this.departmentId
      ? (this.departmentId as mongoose.Types.ObjectId).toString()
      : undefined,
    role: this.role,
    email: this.email,
  };

  const options: SignOptions = {
    expiresIn: (process.env.JWT_EXPIRE || '7d') as SignOptions['expiresIn'],
  };

  return jwt.sign(payload, process.env.JWT_SECRET as string, options);
};

// ─── Model ────────────────────────────────────────────────────────────────

const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>('User', userSchema);

export default User;
