import { Request, Response } from 'express';
import { AuthService } from '../services/authService';
import { sendSuccess, sendError } from '../utils/apiResponse';
import { AuthenticatedRequest } from '../middleware/authMiddleware';

export class AuthController {
  public static async register(req: Request, res: Response): Promise<void> {
    try {
      const result = await AuthService.register(req.body);
      sendSuccess(res, result, 'Registration successful. Welcome to the PM Internship Scheme portal!', 201);
    } catch (err: any) {
      sendError(res, err.message, 400);
    }
  }

  public static async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;
      const result = await AuthService.login(email, password);
      sendSuccess(res, result, 'Login successful.');
    } catch (err: any) {
      sendError(res, err.message, 401);
    }
  }

  public static async refresh(req: Request, res: Response): Promise<void> {
    try {
      const { refreshToken } = req.body;
      const tokens = await AuthService.refreshToken(refreshToken);
      sendSuccess(res, tokens, 'Token refreshed successfully.');
    } catch (err: any) {
      sendError(res, err.message, 401);
    }
  }

  public static async me(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        sendError(res, 'Unauthorized', 401);
        return;
      }
      const user = await AuthService.getCurrentUser(req.user.userId);
      sendSuccess(res, user, 'User details retrieved.');
    } catch (err: any) {
      sendError(res, err.message, 400);
    }
  }

  public static async logout(req: Request, res: Response): Promise<void> {
    sendSuccess(res, null, 'Logged out successfully.');
  }
}
