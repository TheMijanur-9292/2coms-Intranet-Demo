import Announcement from '../models/Announcement';
import { AppError } from '../utils/AppError';
import User from '../models/User';

export class AnnouncementsService {
  async createAnnouncement(data: {
    companyId: string;
    authorId: string;
    title: string;
    content: string;
    priority?: string;
    category?: string;
    targetAudience?: string;
    targetDepartments?: string[];
    targetRoles?: string[];
    targetUsers?: string[];
    attachments?: any[];
    publishDate?: Date;
    expiryDate?: Date;
    isPinned?: boolean;
  }) {
    const announcement = await Announcement.create({
      ...data,
      status: 'published',
      moderation: {
        status: 'approved',
      },
    });

    return await this.getAnnouncementById(announcement._id.toString());
  }

  async getAnnouncements(companyId: string, userId: string, userDepartmentId: string, userRole: string, filters: {
    page?: number;
    limit?: number;
    priority?: string;
    category?: string;
    isPinned?: boolean;
  }) {
    const page = filters.page || 1;
    const limit = filters.limit || 20;
    const skip = (page - 1) * limit;

    // Build audience filter
    const audienceConditions: any[] = [{ targetAudience: 'all' }];
    
    if (userDepartmentId) {
      audienceConditions.push({
        $and: [
          { targetAudience: 'department' },
          { targetDepartments: { $in: [userDepartmentId] } },
        ],
      });
    }
    
    audienceConditions.push({
      $and: [
        { targetAudience: 'role' },
        { targetRoles: { $in: [userRole] } },
      ],
    });

    audienceConditions.push({
      $and: [
        { targetAudience: 'custom' },
        { targetUsers: { $in: [userId] } },
      ],
    });

    const query: any = {
      companyId,
      status: 'published',
      'moderation.status': 'approved',
      $or: audienceConditions,
      $and: [
        {
          $or: [
            { publishDate: { $lte: new Date() } },
            { publishDate: { $exists: false } },
          ],
        },
        {
          $or: [
            { expiryDate: { $gte: new Date() } },
            { expiryDate: { $exists: false } },
          ],
        },
      ],
    };

    if (filters.priority) query.priority = filters.priority;
    if (filters.category) query.category = filters.category;
    if (filters.isPinned !== undefined) query.isPinned = filters.isPinned;

    const announcements = await Announcement.find(query)
      .populate('authorId', 'firstName lastName displayName avatar')
      .populate('targetDepartments', 'name code')
      .sort({ isPinned: -1, priority: -1, publishDate: -1 })
      .limit(limit)
      .skip(skip);

    const total = await Announcement.countDocuments(query);

    return {
      announcements,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getAnnouncementById(announcementId: string) {
    const announcement = await Announcement.findById(announcementId)
      .populate('authorId', 'firstName lastName displayName avatar')
      .populate('targetDepartments', 'name code')
      .populate('targetUsers', 'firstName lastName displayName avatar');

    if (!announcement) {
      throw new AppError('Announcement not found', 404);
    }

    return announcement;
  }

  async markAsRead(announcementId: string, userId: string) {
    const announcement = await Announcement.findById(announcementId);
    if (!announcement) {
      throw new AppError('Announcement not found', 404);
    }

    // Check if already read
    const alreadyRead = announcement.readBy.some(
      (r: any) => r.userId.toString() === userId
    );

    if (!alreadyRead) {
      announcement.readBy.push({
        userId: new (require('mongoose').Types.ObjectId)(userId),
        readAt: new Date(),
      });
      await announcement.save();
    }

    return announcement;
  }

  async updateAnnouncement(announcementId: string, userId: string, data: any) {
    const announcement = await Announcement.findById(announcementId);
    if (!announcement) {
      throw new AppError('Announcement not found', 404);
    }

    if (announcement.authorId.toString() !== userId) {
      throw new AppError('Not authorized to update this announcement', 403);
    }

    const updated = await Announcement.findByIdAndUpdate(
      announcementId,
      { ...data, updatedAt: new Date() },
      { new: true, runValidators: true }
    );

    return updated;
  }

  async deleteAnnouncement(announcementId: string, userId: string, userRole: string) {
    const announcement = await Announcement.findById(announcementId);
    if (!announcement) {
      throw new AppError('Announcement not found', 404);
    }

    if (announcement.authorId.toString() !== userId && !['hr', 'admin'].includes(userRole)) {
      throw new AppError('Not authorized to delete this announcement', 403);
    }

    await Announcement.findByIdAndUpdate(announcementId, { status: 'archived' });
  }
}

export default new AnnouncementsService();
