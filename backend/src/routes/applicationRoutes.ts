import { Router } from 'express';
import { ApplicationController } from '../controllers/applicationController';
import { authenticate, requireRole } from '../middleware/authMiddleware';
import { validateRequest } from '../middleware/validateMiddleware';
import { applyInternshipSchema } from '../validators/internshipValidator';

const router = Router();

router.use(authenticate);

router.get('/', requireRole('STUDENT'), ApplicationController.listMine);
router.post('/apply/:id', requireRole('STUDENT'), validateRequest(applyInternshipSchema), ApplicationController.apply);
router.get('/:id', ApplicationController.getById);
router.post('/:id/withdraw', requireRole('STUDENT'), ApplicationController.withdraw);

export default router;
