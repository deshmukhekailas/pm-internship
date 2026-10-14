import { Router } from 'express';
import { InternshipController } from '../controllers/internshipController';
import { optionalAuthenticate, authenticate, requireRole } from '../middleware/authMiddleware';

const router = Router();

// Public / optional auth routes
router.get('/', optionalAuthenticate, InternshipController.list);
router.get('/saved', authenticate, requireRole('STUDENT'), InternshipController.getSaved);
router.get('/:id', optionalAuthenticate, InternshipController.getById);

// Student authenticated action
router.post('/:id/save', authenticate, requireRole('STUDENT'), InternshipController.toggleSave);

export default router;
