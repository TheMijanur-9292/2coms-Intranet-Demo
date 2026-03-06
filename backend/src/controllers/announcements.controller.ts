import { Response } from 'express';
import { AuthRequest } from '../types/express';
import { asyncHandler } from '../utils/asyncHandler';
import announcementsService from '../services/announcements.service';
import User from '../models/User';

export const createAnnouncement = asyncHandler(async (req: AuthRequest, res: Response) => {
  const announcement = await announcementsService.createAnnouncement({
    ...req.body,
    companyId: req.user!.companyId,
    authorId: req.user!.id,
  });

  res.status(201).json({
    success: true,
    message: 'Announcement created successfully',
    data: { announcement },
  });
});

export const getAnnouncements = asyncHandler(async (req: AuthRequest, res: Response) => {
  const user = await User.findById(req.user!.id);
  const result = await announcementsService.getAnnouncements(
    req.user!.companyId,
    req.user!.id,
    user?.departmentId.toString() || '',
    req.user!.role,
    req.query
  );

  res.json({
    success: true,
    data: result.announcements,
    pagination: result.pagination,
  });
});

export const getAnnouncement = asyncHandler(async (req: AuthRequest, res: Response) => {
  const announcement = await announcementsService.getAnnouncementById(req.params.id);

  res.json({
    success: true,
    data: { announcement },
  });
});

export const markAsRead = asyncHandler(async (req: AuthRequest, res: Response) => {
  const announcement = await announcementsService.markAsRead(req.params.id, req.user!.id);

  res.json({
    success: true,
    message: 'Announcement marked as read',
    data: { announcement },
  });
});

export const updateAnnouncement = asyncHandler(async (req: AuthRequest, res: Response) => {
  const announcement = await announcementsService.updateAnnouncement(
    req.params.id,
    req.user!.id,
    req.body
  );

  res.json({
    success: true,
    message: 'Announcement updated successfully',
    data: { announcement },
  });
});

export const deleteAnnouncement = asyncHandler(async (req: AuthRequest, res: Response) => {
  await announcementsService.deleteAnnouncement(
    req.params.id,
    req.user!.id,
    req.user!.role
  );

  res.json({
    success: true,
    message: 'Announcement deleted successfully',
  });
});
