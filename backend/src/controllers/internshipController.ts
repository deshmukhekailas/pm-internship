import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/authMiddleware';
import { InternshipService } from '../services/internshipService';
import { sendSuccess, sendError } from '../utils/apiResponse';

export class InternshipController {
  public static async list(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const {
        keyword,
        domain,
        location,
        state,
        workMode,
        minStipend,
        durationMonths,
        onlyEligible,
        page,
        limit,
        sortBy,
        sortOrder,
      } = req.query;

      const result = await InternshipService.listInternships({
        keyword: keyword as string,
        domain: domain as string,
        location: location as string,
        state: state as string,
        workMode: workMode as string,
        minStipend: minStipend ? Number(minStipend) : undefined,
        durationMonths: durationMonths ? Number(durationMonths) : undefined,
        onlyEligible: onlyEligible === 'true',
        studentUserId: req.user?.userId,
        page: page ? Number(page) : 1,
        limit: limit ? Number(limit) : 12,
        sortBy: sortBy as any,
        sortOrder: sortOrder as any,
      });

      sendSuccess(res, result.items, 'Internships fetched successfully.', 200, result.meta);
    } catch (err: any) {
      sendError(res, err.message, 400);
    }
  }

  public static async getById(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const internship = await InternshipService.getInternshipById(id, req.user?.userId);
      sendSuccess(res, internship, 'Internship details retrieved.');
    } catch (err: any) {
      sendError(res, err.message, 404);
    }
  }

  public static async toggleSave(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const result = await InternshipService.toggleSaveInternship(req.user!.userId, id);
      sendSuccess(res, result, result.message);
    } catch (err: any) {
      sendError(res, err.message, 400);
    }
  }

  public static async getSaved(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const saved = await InternshipService.getSavedInternships(req.user!.userId);
      sendSuccess(res, saved, 'Saved internships retrieved.');
    } catch (err: any) {
      sendError(res, err.message, 400);
    }
  }
}
