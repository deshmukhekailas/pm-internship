import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/authMiddleware';
import { StudentService } from '../services/studentService';
import { sendSuccess, sendError } from '../utils/apiResponse';

export class StudentController {
  public static async getProfile(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const profile = await StudentService.getProfile(req.user!.userId);
      sendSuccess(res, profile, 'Profile retrieved successfully.');
    } catch (err: any) {
      sendError(res, err.message, 400);
    }
  }

  public static async updateProfile(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const updated = await StudentService.updateProfile(req.user!.userId, req.body);
      sendSuccess(res, updated, 'Profile updated successfully.');
    } catch (err: any) {
      sendError(res, err.message, 400);
    }
  }

  public static async addEducation(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const edu = await StudentService.addEducation(req.user!.userId, req.body);
      sendSuccess(res, edu, 'Education added successfully.', 201);
    } catch (err: any) {
      sendError(res, err.message, 400);
    }
  }

  public static async deleteEducation(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      await StudentService.deleteEducation(req.user!.userId, id);
      sendSuccess(res, null, 'Education deleted successfully.');
    } catch (err: any) {
      sendError(res, err.message, 400);
    }
  }

  public static async addSkill(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const skill = await StudentService.addSkill(req.user!.userId, req.body);
      sendSuccess(res, skill, 'Skill added successfully.', 201);
    } catch (err: any) {
      sendError(res, err.message, 400);
    }
  }

  public static async deleteSkill(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      await StudentService.deleteSkill(req.user!.userId, id);
      sendSuccess(res, null, 'Skill removed successfully.');
    } catch (err: any) {
      sendError(res, err.message, 400);
    }
  }

  public static async addProject(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const project = await StudentService.addProject(req.user!.userId, req.body);
      sendSuccess(res, project, 'Project added successfully.', 201);
    } catch (err: any) {
      sendError(res, err.message, 400);
    }
  }

  public static async deleteProject(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      await StudentService.deleteProject(req.user!.userId, id);
      sendSuccess(res, null, 'Project removed successfully.');
    } catch (err: any) {
      sendError(res, err.message, 400);
    }
  }

  public static async uploadResume(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.file) {
        sendError(res, 'No resume file uploaded.', 400);
        return;
      }
      const result = await StudentService.processResumeUpload(req.user!.userId, req.file);
      sendSuccess(res, result, 'Resume parsed successfully. Please review the extracted data.', 201);
    } catch (err: any) {
      sendError(res, err.message, 400);
    }
  }

  public static async confirmResumeData(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { resumeId, confirmedData } = req.body;
      const updatedProfile = await StudentService.applyResumeDataToProfile(req.user!.userId, resumeId, confirmedData);
      sendSuccess(res, updatedProfile, 'Resume information successfully synced to your profile.');
    } catch (err: any) {
      sendError(res, err.message, 400);
    }
  }
}
