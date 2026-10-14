import { Router } from 'express';
import { RecommendationController } from '../controllers/recommendationController';
import { authenticate, requireRole } from '../middleware/authMiddleware';
import { validateRequest } from '../middleware/validateMiddleware';
import { feedbackSchema } from '../validators/recommendationValidator';

const router = Router();

router.use(authenticate, requireRole('STUDENT'));

router.get('/', RecommendationController.getRecommendations);
router.post('/generate', RecommendationController.generate);
router.get('/skill-gap', RecommendationController.getSkillGapSummary);
router.post('/:id/feedback', validateRequest(feedbackSchema), RecommendationController.submitFeedback);

export default router;
