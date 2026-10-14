import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/authMiddleware';
import { ApplicationService } from '../services/applicationService';
import { sendSuccess, sendError } from '../utils/apiResponse';

export class ApplicationController {
  public static async apply(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params; // internship id
      const application = await ApplicationService.apply(req.user!.userId, id, req.body);
      sendSuccess(res, application, 'Application submitted successfully!', 201);
    } catch (err: any) {
      sendError(res, err.message, 400);
    }
  }

  public static async listMine(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const apps = await ApplicationService.getStudentApplications(req.user!.userId);
      sendSuccess(res, apps, 'Applications retrieved.');
    } catch (err: any) {
      sendError(res, err.message, 400);
    }
  }

  public static async getById(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const application = await ApplicationService.getApplicationById(id, req.user!.userId, req.user!.role);
      sendSuccess(res, application, 'Application details retrieved.');
    } catch (err: any) {
      sendError(res, err.message, 404);
    }
  }

  public static async withdraw(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const result = await ApplicationService.withdraw(id, req.user!.userId);
      sendSuccess(res, result, 'Application withdrawn.');
    } catch (err: any) {
      sendError(res, err.message, 400);
    }
  }
}
