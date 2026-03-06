import User from '../models/User';
import Company from '../models/Company';
import Department from '../models/Department';
import { AppError } from '../utils/AppError';
import logger from '../utils/logger';

export class AuthService {
  async register(data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    employeeId: string;
    companyId: string;
    departmentId: string;
    designation: string;
    role?: string;
  }) {
    const [existingEmail, existingEmployee, company, department] = await Promise.all([
      User.findOne({ email: data.email.toLowerCase() }),
      User.findOne({ employeeId: data.employeeId, companyId: data.companyId }),
      Company.findById(data.companyId),
      Department.findById(data.departmentId),
    ]);

    if (existingEmail) throw new AppError('An account with this email already exists.', 409);
    if (existingEmployee) throw new AppError('Employee ID already exists in this company.', 409);
    if (!company) throw new AppError('Company not found.', 404);
    if (!department) throw new AppError('Department not found.', 404);

    const user = await User.create({
      ...data,
      email: data.email.toLowerCase(),
      role: data.role || 'employee',
      displayName: `${data.firstName} ${data.lastName}`,
    });

    // Increment dept member count (non-critical — don't fail the whole register)
    Department.findByIdAndUpdate(data.departmentId, { $inc: { memberCount: 1 } }).catch((e) =>
      logger.warn('Failed to increment department memberCount:', e)
    );

    logger.info(`New user registered: ${user.email} [${user.role}]`);
    return user;
  }

  async login(email: string, password: string) {
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    if (!user) throw new AppError('Invalid email or password.', 401);
    if (!user.isActive) throw new AppError('Your account has been deactivated. Contact your admin.', 401);

    const isMatch = await user.comparePassword(password);
    if (!isMatch) throw new AppError('Invalid email or password.', 401);

    user.lastLogin = new Date();
    await user.save({ validateBeforeSave: false });

    const token = user.generateAuthToken();

    // Return user without password
    const { password: _pw, ...userWithoutPassword } = user.toObject() as Record<string, unknown>;

    logger.info(`User logged in: ${user.email}`);
    return { user: userWithoutPassword, token };
  }

  async getCurrentUser(userId: string) {
    const user = await User.findById(userId)
      .populate('companyId', 'name code logo')
      .populate('departmentId', 'name code')
      .populate('managerId', 'firstName lastName displayName avatar');

    if (!user) throw new AppError('User not found.', 404);
    return user;
  }

  async updateProfile(
    userId: string,
    data: {
      firstName?: string;
      lastName?: string;
      displayName?: string;
      avatar?: string;
      preferences?: Record<string, unknown>;
    }
  ) {
    const user = await User.findByIdAndUpdate(userId, { $set: data }, { new: true, runValidators: true });
    if (!user) throw new AppError('User not found.', 404);
    logger.info(`Profile updated for user: ${userId}`);
    return user;
  }
}

export default new AuthService();
