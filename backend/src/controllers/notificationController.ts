import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/authMiddleware';
import { NotificationService } from '../services/notificationService';
import { sendSuccess, sendError } from '../utils/apiResponse';

export class NotificationController {
  public static async list(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const notifications = await NotificationService.getUserNotifications(req.user!.userId);
      sendSuccess(res, notifications, 'Notifications retrieved.');
    } catch (err: any) {
      sendError(res, err.message, 400);
    }
  }

  public static async markRead(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      await NotificationService.markAsRead(id, req.user!.userId);
      sendSuccess(res, null, 'Notification marked as read.');
    } catch (err: any) {
      sendError(res, err.message, 400);
    }
  }

  public static async markAllRead(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      await NotificationService.markAllAsRead(req.user!.userId);
      sendSuccess(res, null, 'All notifications marked as read.');
    } catch (err: any) {
      sendError(res, err.message, 400);
    }
  }
}
