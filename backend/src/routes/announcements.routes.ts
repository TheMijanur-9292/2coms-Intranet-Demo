import { Router } from 'express';
import * as announcementsController from '../controllers/announcements.controller';
import { authenticate } from '../middleware/auth.middleware';
import { setCompanyContext } from '../middleware/company.middleware';
import { requireHR } from '../middleware/rbac.middleware';
import { validate } from '../middleware/validation.middleware';
import {
  createAnnouncementSchema,
  updateAnnouncementSchema,
} from '../validations/announcement.validation';

const router = Router();

router.use(authenticate);
router.use(setCompanyContext);

router.get('/', announcementsController.getAnnouncements);
router.get('/:id', announcementsController.getAnnouncement);
router.post('/:id/mark-read', announcementsController.markAsRead);

// HR/Admin only routes
router.post('/', requireHR, validate(createAnnouncementSchema), announcementsController.createAnnouncement);
router.put('/:id', requireHR, validate(updateAnnouncementSchema), announcementsController.updateAnnouncement);
router.delete('/:id', requireHR, announcementsController.deleteAnnouncement);

export default router;
