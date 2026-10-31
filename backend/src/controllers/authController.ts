import { Request, Response } from 'express';
import { AuthService } from '../services/authService';
import { OtpService } from '../services/otpService';
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

  public static async sendOtp(req: Request, res: Response): Promise<void> {
    try {
      const { email, type } = req.body;
      const result = await OtpService.generateAndSendOtp(email, type);
      sendSuccess(res, result, result.message);
    } catch (err: any) {
      sendError(res, err.message, 400);
    }
  }

  public static async verifyOtp(req: Request, res: Response): Promise<void> {
    try {
      const { email, otp, type } = req.body;
      await OtpService.verifyOtp(email, otp, type);
      sendSuccess(res, { verified: true }, 'Verification code verified successfully.');
    } catch (err: any) {
      sendError(res, err.message, 400);
    }
  }

  public static async loginWithOtp(req: Request, res: Response): Promise<void> {
    try {
      const { email, otp } = req.body;
      const result = await AuthService.loginWithOtp(email, otp);
      sendSuccess(res, result, 'Signed in successfully via email verification code.');
    } catch (err: any) {
      sendError(res, err.message, 401);
    }
  }

  public static async registerWithOtp(req: Request, res: Response): Promise<void> {
    try {
      const result = await AuthService.registerWithOtp(req.body);
      sendSuccess(res, result, 'Registration successful. Welcome to the PM Internship Scheme portal!', 201);
    } catch (err: any) {
      sendError(res, err.message, 400);
    }
  }

  public static async googleAuth(req: Request, res: Response): Promise<void> {
    try {
      const { credential } = req.body;
      const result = await AuthService.loginOrRegisterWithGoogle(credential);
      const message = result.isNewUser
        ? 'Welcome! Your account has been registered with Google.'
        : 'Signed in successfully with Google.';
      sendSuccess(res, result, message, result.isNewUser ? 201 : 200);
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
