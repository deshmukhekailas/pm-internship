import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/authMiddleware';
import { AdminService } from '../services/adminService';
import { sendSuccess, sendError } from '../utils/apiResponse';
import prisma from '../config/db';

export class AdminController {
  public static async getDashboard(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const stats = await AdminService.getDashboardStats();
      sendSuccess(res, stats, 'Admin dashboard statistics retrieved.');
    } catch (err: any) {
      sendError(res, err.message, 500);
    }
  }

  public static async listStudents(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { search, page, limit } = req.query;
      const students = await AdminService.listStudents({
        search: search as string,
        page: page ? Number(page) : 1,
        limit: limit ? Number(limit) : 15,
      });
      sendSuccess(res, students.items, 'Students list retrieved.', 200, students.meta);
    } catch (err: any) {
      sendError(res, err.message, 400);
    }
  }

  public static async listInternships(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { status, domain, search, page, limit } = req.query;
      const pageNum = Math.max(1, Number(page) || 1);
      const limitNum = Math.min(50, Number(limit) || 15);
      const skip = (pageNum - 1) * limitNum;

      const where: any = {};
      if (status && status !== 'ALL') {
        if (status === 'OPEN' || status === 'PUBLISHED') {
          where.status = { in: ['OPEN', 'PUBLISHED'] };
        } else {
          where.status = status;
        }
      }
      if (domain && domain !== 'ALL') where.domain = { contains: String(domain) };
      if (search) {
        where.OR = [
          { title: { contains: String(search) } },
          { organization: { name: { contains: String(search) } } },
        ];
      }

      const [total, items] = await Promise.all([
        prisma.internship.count({ where }),
        prisma.internship.findMany({
          where,
          include: {
            organization: true,
            skills: { include: { skill: true } },
            eligibilityRule: true,
            _count: { select: { applications: true } },
          },
          orderBy: { createdAt: 'desc' },
          skip,
          take: limitNum,
        }),
      ]);

      sendSuccess(res, items, 'Internships list retrieved.', 200, {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum),
      });
    } catch (err: any) {
      sendError(res, err.message, 400);
    }
  }

  public static async createInternship(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const created = await AdminService.createInternship(req.user!.userId, req.body);
      sendSuccess(res, created, 'Internship created successfully.', 201);
    } catch (err: any) {
      sendError(res, err.message, 400);
    }
  }

  public static async updateInternship(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const updated = await AdminService.updateInternship(req.user!.userId, id, req.body);
      sendSuccess(res, updated, 'Internship updated successfully.');
    } catch (err: any) {
      sendError(res, err.message, 400);
    }
  }

  public static async deleteInternship(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      await AdminService.deleteInternship(req.user!.userId, id);
      sendSuccess(res, null, 'Internship deleted successfully.');
    } catch (err: any) {
      sendError(res, err.message, 400);
    }
  }

  public static async listApplications(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { status, internshipId, page, limit } = req.query;
      const result = await AdminService.listApplications({
        status: status as string,
        internshipId: internshipId as string,
        page: page ? Number(page) : 1,
        limit: limit ? Number(limit) : 15,
      });
      sendSuccess(res, result.items, 'Applications retrieved.', 200, result.meta);
    } catch (err: any) {
      sendError(res, err.message, 400);
    }
  }

  public static async updateApplicationStatus(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { status, notes } = req.body;
      const updated = await AdminService.updateApplicationStatus(req.user!.userId, id, status, notes);
      sendSuccess(res, updated, `Application status updated to ${status}.`);
    } catch (err: any) {
      sendError(res, err.message, 400);
    }
  }

  public static async listOrganizations(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const orgs = await AdminService.listOrganizations();
      sendSuccess(res, orgs, 'Organizations retrieved.');
    } catch (err: any) {
      sendError(res, err.message, 400);
    }
  }

  public static async createOrganization(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const org = await AdminService.createOrganization(req.body);
      sendSuccess(res, org, 'Organization created.', 201);
    } catch (err: any) {
      sendError(res, err.message, 400);
    }
  }

  public static async getConfig(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const config = await prisma.recommendationConfig.findFirst({ where: { key: 'DEFAULT' } });
      sendSuccess(res, config, 'Configuration retrieved.');
    } catch (err: any) {
      sendError(res, err.message, 400);
    }
  }

  public static async updateConfig(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const updated = await AdminService.updateRecommendationConfig(req.user!.userId, req.body);
      sendSuccess(res, updated, 'Recommendation weights and settings updated successfully.');
    } catch (err: any) {
      sendError(res, err.message, 400);
    }
  }

  public static async exportData(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { entity } = req.params;
      if (entity === 'internships') {
        const data = await prisma.internship.findMany({ include: { organization: true } });
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Content-Disposition', 'attachment; filename="internships-export.json"');
        res.json(data);
      } else if (entity === 'applications') {
        const data = await prisma.application.findMany({
          include: {
            internship: { select: { title: true, domain: true } },
            student: { include: { user: { select: { firstName: true, lastName: true, email: true } } } },
          },
        });
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Content-Disposition', 'attachment; filename="applications-export.json"');
        res.json(data);
      } else {
        sendError(res, 'Invalid entity for export. Supported: internships, applications', 400);
      }
    } catch (err: any) {
      sendError(res, err.message, 500);
    }
  }
}
