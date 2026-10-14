import { Router } from 'express';
import authRoutes from './authRoutes';
import studentRoutes from './studentRoutes';
import internshipRoutes from './internshipRoutes';
import recommendationRoutes from './recommendationRoutes';
import applicationRoutes from './applicationRoutes';
import adminRoutes from './adminRoutes';
import notificationRoutes from './notificationRoutes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/student', studentRoutes);
router.use('/internships', internshipRoutes);
router.use('/recommendations', recommendationRoutes);
router.use('/applications', applicationRoutes);
router.use('/admin', adminRoutes);
router.use('/notifications', notificationRoutes);

export default router;
