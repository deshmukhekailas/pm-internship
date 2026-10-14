import prisma from '../config/db';
import { FeatureExtractor } from '../recommendation/featureExtractor';
import { EligibilityEngine } from '../recommendation/eligibilityEngine';
import { ScoringEngine, DEFAULT_WEIGHTS } from '../recommendation/scoringEngine';
import { NotificationService } from './notificationService';
import { AuditService } from './auditService';

export class ApplicationService {
  /**
   * Apply for an internship
   */
  public static async apply(userId: string, internshipId: string, data: { coverLetter?: string; resumeId?: string }) {
    const studentProfile = await prisma.studentProfile.findUnique({
      where: { userId },
      include: {
        user: true,
        educations: true,
        studentSkills: { include: { skill: true } },
        projects: true,
        experiences: true,
        resumes: true,
      },
    });

    if (!studentProfile) {
      throw new Error('Student profile not found. Please complete your registration.');
    }

    const internship = await prisma.internship.findUnique({
      where: { id: internshipId },
      include: {
        organization: true,
        skills: { include: { skill: true } },
        eligibilityRule: true,
      },
    });

    if (!internship) {
      throw new Error('Internship opportunity not found.');
    }

    if (internship.status !== 'PUBLISHED') {
      throw new Error('This internship is no longer accepting new applications.');
    }

    // Check application deadline
    if (new Date(internship.deadline) < new Date()) {
      throw new Error('Application deadline for this internship has expired.');
    }

    // Prevent duplicate application
    const existing = await prisma.application.findUnique({
      where: {
        studentId_internshipId: {
          studentId: studentProfile.id,
          internshipId,
        },
      },
    });

    if (existing) {
      throw new Error('You have already submitted an application for this internship.');
    }

    // Calculate match score at the moment of application
    const studentFeature = FeatureExtractor.extractStudentFeatures(studentProfile);
    const internFeature = FeatureExtractor.extractInternshipFeatures(internship);
    const eligibility = EligibilityEngine.evaluate(studentFeature, internFeature);
    const scoreResult = ScoringEngine.calculate(studentFeature, internFeature, eligibility, DEFAULT_WEIGHTS);

    const application = await prisma.application.create({
      data: {
        studentId: studentProfile.id,
        internshipId,
        coverLetter: data.coverLetter,
        resumeId: data.resumeId || (studentProfile.resumes[0]?.id || null),
        matchScoreAtApplication: scoreResult.compatibilityScore,
        status: 'APPLIED',
      },
      include: {
        internship: {
          include: {
            organization: true,
          },
        },
      },
    });

    // Notify student
    await NotificationService.createNotification({
      userId,
      title: 'Application Submitted Successfully',
      message: `Your application for "${internship.title}" at ${internship.organization.name} has been received.`,
      type: 'APPLICATION',
      link: `/student/applications`,
    });

    await AuditService.log({
      userId,
      action: 'APPLY_INTERNSHIP',
      resource: 'Application',
      resourceId: application.id,
      details: { internshipId, title: internship.title },
    });

    return application;
  }

  /**
   * Get student applications
   */
  public static async getStudentApplications(userId: string) {
    const studentProfile = await prisma.studentProfile.findUnique({ where: { userId } });
    if (!studentProfile) throw new Error('Student profile not found.');

    return prisma.application.findMany({
      where: { studentId: studentProfile.id },
      include: {
        internship: {
          include: {
            organization: true,
            skills: { include: { skill: true } },
          },
        },
      },
      orderBy: { appliedAt: 'desc' },
    });
  }

  /**
   * Get application details by ID
   */
  public static async getApplicationById(id: string, userId: string, role: string) {
    const application = await prisma.application.findUnique({
      where: { id },
      include: {
        internship: {
          include: {
            organization: true,
            skills: { include: { skill: true } },
            eligibilityRule: true,
          },
        },
        student: {
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                phone: true,
              },
            },
            educations: true,
            studentSkills: { include: { skill: true } },
            projects: true,
            experiences: true,
            resumes: true,
          },
        },
      },
    });

    if (!application) {
      throw new Error('Application record not found.');
    }

    // Role check: Admin can view all, student can only view their own
    if (role !== 'ADMIN' && application.student.userId !== userId) {
      throw new Error('Unauthorized to view this application.');
    }

    return application;
  }

  /**
   * Withdraw an application
   */
  public static async withdraw(id: string, userId: string) {
    const studentProfile = await prisma.studentProfile.findUnique({ where: { userId } });
    if (!studentProfile) throw new Error('Student profile not found.');

    const app = await prisma.application.findFirst({
      where: { id, studentId: studentProfile.id },
    });

    if (!app) {
      throw new Error('Application not found or unauthorized.');
    }

    if (app.status === 'ACCEPTED' || app.status === 'REJECTED') {
      throw new Error(`Cannot withdraw an application that has already been ${app.status.toLowerCase()}.`);
    }

    return prisma.application.update({
      where: { id },
      data: { status: 'WITHDRAWN' },
    });
  }
}
