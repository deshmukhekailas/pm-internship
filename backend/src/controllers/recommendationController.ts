import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/authMiddleware';
import { RecommendationAppService } from '../services/recommendationService';
import { sendSuccess, sendError } from '../utils/apiResponse';

export class RecommendationController {
  public static async getRecommendations(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { minScore, domain } = req.query;
      const recs = await RecommendationAppService.getStudentRecommendations(req.user!.userId, {
        minScore: minScore ? Number(minScore) : undefined,
        domain: domain as string,
      });
      sendSuccess(res, recs, 'Personalized recommendations retrieved.');
    } catch (err: any) {
      sendError(res, err.message, 400);
    }
  }

  public static async generate(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const recs = await RecommendationAppService.generateForStudent(req.user!.userId);
      sendSuccess(res, recs, 'Recommendations calculated successfully.');
    } catch (err: any) {
      sendError(res, err.message, 400);
    }
  }

  public static async getSkillGapSummary(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const summary = await RecommendationAppService.getStudentSkillGapSummary(req.user!.userId);
      sendSuccess(res, summary, 'Skill gap analysis retrieved.');
    } catch (err: any) {
      sendError(res, err.message, 400);
    }
  }

  public static async submitFeedback(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const feedback = await RecommendationAppService.submitFeedback(req.user!.userId, id, req.body);
      sendSuccess(res, feedback, 'Thank you! Your feedback helps calibrate the recommendation engine.', 201);
    } catch (err: any) {
      sendError(res, err.message, 400);
    }
  }
}
