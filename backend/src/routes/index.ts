import { Router } from 'express';
import authRoutes from './auth.routes';
import postsRoutes from './posts.routes';
import announcementsRoutes from './announcements.routes';
import engagementRoutes from './engagement.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/posts', postsRoutes);
router.use('/announcements', announcementsRoutes);
router.use('/engagement', engagementRoutes);

export default router;
