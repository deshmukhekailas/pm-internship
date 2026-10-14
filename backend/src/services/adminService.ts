import prisma from '../config/db';
import { NotificationService } from './notificationService';
import { AuditService } from './auditService';
import { ScoringWeights } from '../recommendation/types';

export class AdminService {
  /**
   * Admin dashboard metrics & analytics
   */
  public static async getDashboardStats() {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const [
      totalStudents,
      totalInternships,
      activeInternships,
      totalApplications,
      applicationsThisMonth,
      totalOrganizations,
      totalRecommendations,
      feedbacks,
    ] = await Promise.all([
      prisma.user.count({ where: { role: 'STUDENT' } }),
      prisma.internship.count(),
      prisma.internship.count({ where: { status: 'PUBLISHED' } }),
      prisma.application.count(),
      prisma.application.count({ where: { appliedAt: { gte: thirtyDaysAgo } } }),
      prisma.organization.count(),
      prisma.recommendation.count(),
      prisma.feedback.findMany({ select: { rating: true, isRelevant: true } }),
    ]);

    // Average feedback rating
    let avgFeedbackRating = 4.5;
    let relevantCount = 0;
    if (feedbacks.length > 0) {
      const sum = feedbacks.reduce((acc, f) => acc + f.rating, 0);
      avgFeedbackRating = Math.round((sum / feedbacks.length) * 10) / 10;
      relevantCount = feedbacks.filter((f) => f.isRelevant).length;
    }
    const relevanceRate = feedbacks.length > 0 ? Math.round((relevantCount / feedbacks.length) * 100) : 92;

    // Applications by status
    const applicationsByStatus = await prisma.application.groupBy({
      by: ['status'],
      _count: { _all: true },
    });

    // Internships by domain
    const internshipsByDomain = await prisma.internship.groupBy({
      by: ['domain'],
      _count: { _all: true },
      orderBy: { _count: { domain: 'desc' } },
      take: 6,
    });

    // Top skills in demand
    const skillsInDemand = await prisma.internshipSkill.groupBy({
      by: ['skillId'],
      _count: { _all: true },
      orderBy: { _count: { skillId: 'desc' } },
      take: 8,
    });

    const skillIds = skillsInDemand.map((s) => s.skillId);
    const skillRecords = await prisma.skill.findMany({
      where: { id: { in: skillIds } },
    });
    const skillMap = new Map(skillRecords.map((s) => [s.id, s.name]));

    const topSkills = skillsInDemand.map((s) => ({
      skill: skillMap.get(s.skillId) || 'Skill',
      count: s._count._all,
    }));

    // Conversion rate
    const conversionRate = totalRecommendations > 0 ? Math.round((totalApplications / totalRecommendations) * 100 * 10) / 10 : 8.5;

    return {
      totalStudents,
      totalInternships,
      activeInternships,
      totalApplications,
      applicationsThisMonth,
      totalOrganizations,
      totalRecommendations,
      avgFeedbackRating,
      relevanceRate,
      conversionRate,
      applicationsByStatus: applicationsByStatus.map((a) => ({ status: a.status, count: a._count._all })),
      internshipsByDomain: internshipsByDomain.map((d) => ({ domain: d.domain, count: d._count._all })),
      topSkills,
    };
  }

  /**
   * List students with profile overview
   */
  public static async listStudents(params: { search?: string; page?: number; limit?: number }) {
    const page = Math.max(1, params.page || 1);
    const limit = Math.min(50, Math.max(1, params.limit || 15));
    const skip = (page - 1) * limit;

    const where: any = { role: 'STUDENT' };

    if (params.search && params.search.trim()) {
      const q = params.search.trim();
      where.OR = [
        { firstName: { contains: q } },
        { lastName: { contains: q } },
        { email: { contains: q } },
      ];
    }

    const [total, students] = await Promise.all([
      prisma.user.count({ where }),
      prisma.user.findMany({
        where,
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          phone: true,
          createdAt: true,
          isActive: true,
          studentProfile: {
            include: {
              educations: true,
              studentSkills: { include: { skill: true } },
              _count: {
                select: {
                  applications: true,
                  recommendations: true,
                  savedInternships: true,
                },
              },
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
    ]);

    return {
      items: students,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Create internship with skills and eligibility rule
   */
  public static async createInternship(adminUserId: string, data: any) {
    const slug = data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Date.now().toString().slice(-4);

    const internship = await prisma.internship.create({
      data: {
        organizationId: data.organizationId,
        title: data.title,
        slug,
        description: data.description,
        responsibilities: data.responsibilities,
        department: data.department,
        domain: data.domain,
        location: data.location,
        state: data.state,
        district: data.district,
        workMode: data.workMode || 'ONSITE',
        durationMonths: data.durationMonths || 12,
        stipendAmount: data.stipendAmount || 5000,
        stipendType: data.stipendType || 'MONTHLY',
        openings: data.openings || 5,
        deadline: new Date(data.deadline),
        startDate: data.startDate ? new Date(data.startDate) : null,
        status: data.status || 'PUBLISHED',
      },
    });

    // Add skills
    if (data.skills && Array.isArray(data.skills)) {
      for (const item of data.skills) {
        let skill = await prisma.skill.findUnique({ where: { name: item.skillName.trim() } });
        if (!skill) {
          skill = await prisma.skill.create({
            data: {
              name: item.skillName.trim(),
              standardizedName: item.skillName.trim().toLowerCase(),
            },
          });
        }
        await prisma.internshipSkill.create({
          data: {
            internshipId: internship.id,
            skillId: skill.id,
            isRequired: item.isRequired !== undefined ? item.isRequired : true,
            weight: item.weight || 1.0,
          },
        });
      }
    }

    // Add eligibility rule
    if (data.eligibility) {
      await prisma.eligibilityRule.create({
        data: {
          internshipId: internship.id,
          minEducationLevel: data.eligibility.minEducationLevel || 'UNDERGRADUATE',
          allowedDegrees: JSON.stringify(data.eligibility.allowedDegrees || []),
          allowedBranches: JSON.stringify(data.eligibility.allowedBranches || []),
          minCgpa: data.eligibility.minCgpa !== undefined ? data.eligibility.minCgpa : null,
          minGraduationYear: data.eligibility.minGraduationYear || null,
          maxGraduationYear: data.eligibility.maxGraduationYear || null,
          minAge: data.eligibility.minAge || 21,
          maxAge: data.eligibility.maxAge || 24,
          allowedStates: JSON.stringify(data.eligibility.allowedStates || []),
          mandatorySkillNames: JSON.stringify(data.eligibility.mandatorySkillNames || []),
        },
      });
    }

    await AuditService.log({
      userId: adminUserId,
      action: 'CREATE_INTERNSHIP',
      resource: 'Internship',
      resourceId: internship.id,
      details: { title: internship.title },
    });

    return internship;
  }

  /**
   * Update internship
   */
  public static async updateInternship(adminUserId: string, id: string, data: any) {
    const updated = await prisma.internship.update({
      where: { id },
      data: {
        title: data.title,
        description: data.description,
        responsibilities: data.responsibilities,
        department: data.department,
        domain: data.domain,
        location: data.location,
        state: data.state,
        district: data.district,
        workMode: data.workMode,
        durationMonths: data.durationMonths,
        stipendAmount: data.stipendAmount,
        openings: data.openings,
        deadline: data.deadline ? new Date(data.deadline) : undefined,
        status: data.status,
      },
    });

    if (data.eligibility) {
      await prisma.eligibilityRule.upsert({
        where: { internshipId: id },
        update: {
          minEducationLevel: data.eligibility.minEducationLevel,
          allowedDegrees: data.eligibility.allowedDegrees ? JSON.stringify(data.eligibility.allowedDegrees) : undefined,
          allowedBranches: data.eligibility.allowedBranches ? JSON.stringify(data.eligibility.allowedBranches) : undefined,
          minCgpa: data.eligibility.minCgpa,
          minGraduationYear: data.eligibility.minGraduationYear,
          maxGraduationYear: data.eligibility.maxGraduationYear,
          minAge: data.eligibility.minAge,
          maxAge: data.eligibility.maxAge,
          allowedStates: data.eligibility.allowedStates ? JSON.stringify(data.eligibility.allowedStates) : undefined,
          mandatorySkillNames: data.eligibility.mandatorySkillNames ? JSON.stringify(data.eligibility.mandatorySkillNames) : undefined,
        },
        create: {
          internshipId: id,
          minEducationLevel: data.eligibility.minEducationLevel || 'UNDERGRADUATE',
          allowedDegrees: JSON.stringify(data.eligibility.allowedDegrees || []),
          allowedBranches: JSON.stringify(data.eligibility.allowedBranches || []),
          minCgpa: data.eligibility.minCgpa,
          minGraduationYear: data.eligibility.minGraduationYear,
          maxGraduationYear: data.eligibility.maxGraduationYear,
          minAge: data.eligibility.minAge || 21,
          maxAge: data.eligibility.maxAge || 24,
          allowedStates: JSON.stringify(data.eligibility.allowedStates || []),
          mandatorySkillNames: JSON.stringify(data.eligibility.mandatorySkillNames || []),
        },
      });
    }

    await AuditService.log({
      userId: adminUserId,
      action: 'UPDATE_INTERNSHIP',
      resource: 'Internship',
      resourceId: id,
    });

    return updated;
  }

  /**
   * Delete internship
   */
  public static async deleteInternship(adminUserId: string, id: string) {
    await prisma.internship.delete({ where: { id } });
    await AuditService.log({
      userId: adminUserId,
      action: 'DELETE_INTERNSHIP',
      resource: 'Internship',
      resourceId: id,
    });
    return { success: true };
  }

  /**
   * List all applications for review
   */
  public static async listApplications(params: { status?: string; internshipId?: string; page?: number; limit?: number }) {
    const page = Math.max(1, params.page || 1);
    const limit = Math.min(50, Math.max(1, params.limit || 15));
    const skip = (page - 1) * limit;

    const where: any = {};
    if (params.status && params.status !== 'ALL') {
      where.status = params.status;
    }
    if (params.internshipId) {
      where.internshipId = params.internshipId;
    }

    const [total, items] = await Promise.all([
      prisma.application.count({ where }),
      prisma.application.findMany({
        where,
        include: {
          internship: {
            include: {
              organization: true,
            },
          },
          student: {
            include: {
              user: true,
              educations: true,
              studentSkills: { include: { skill: true } },
            },
          },
        },
        orderBy: { appliedAt: 'desc' },
        skip,
        take: limit,
      }),
    ]);

    return {
      items,
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }

  /**
   * Update application status (SHORTLISTED, ACCEPTED, REJECTED)
   */
  public static async updateApplicationStatus(adminUserId: string, applicationId: string, status: string, notes?: string) {
    const application = await prisma.application.update({
      where: { id: applicationId },
      data: {
        status: status as any,
        notes,
        reviewedAt: new Date(),
      },
      include: {
        student: { include: { user: true } },
        internship: { include: { organization: true } },
      },
    });

    // Notify candidate
    let message = `Your application status for "${application.internship.title}" has been updated to ${status}.`;
    if (status === 'SHORTLISTED') {
      message = `Congratulations! You have been shortlisted for "${application.internship.title}" at ${application.internship.organization.name}.`;
    } else if (status === 'ACCEPTED') {
      message = `Offer Extended! Congratulations on being selected for "${application.internship.title}" at ${application.internship.organization.name}.`;
    }

    await NotificationService.createNotification({
      userId: application.student.userId,
      title: `Application Status: ${status}`,
      message,
      type: 'APPLICATION',
      link: `/student/applications`,
    });

    await AuditService.log({
      userId: adminUserId,
      action: 'UPDATE_APPLICATION_STATUS',
      resource: 'Application',
      resourceId: applicationId,
      details: { status, notes },
    });

    return application;
  }

  /**
   * Manage organizations (CRUD)
   */
  public static async listOrganizations() {
    return prisma.organization.findMany({
      include: {
        _count: {
          select: { internships: true },
        },
      },
      orderBy: { name: 'asc' },
    });
  }

  public static async createOrganization(data: any) {
    const slug = data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    return prisma.organization.create({
      data: {
        name: data.name,
        slug,
        industry: data.industry,
        description: data.description,
        headquarter: data.headquarter,
        website: data.website,
        isGovernmentPartner: data.isGovernmentPartner !== undefined ? data.isGovernmentPartner : true,
      },
    });
  }

  /**
   * Update recommendation weights & configuration
   */
  public static async updateRecommendationConfig(adminUserId: string, weights: ScoringWeights & { minScoreThreshold?: number; aiProvider?: string; strictEligibility?: boolean }) {
    const updated = await prisma.recommendationConfig.upsert({
      where: { key: 'DEFAULT' },
      update: {
        skillWeight: weights.skillWeight,
        educationWeight: weights.educationWeight,
        domainWeight: weights.domainWeight,
        locationWeight: weights.locationWeight,
        experienceWeight: weights.experienceWeight,
        careerGoalWeight: weights.careerGoalWeight,
        preferenceWeight: weights.preferenceWeight,
        minScoreThreshold: weights.minScoreThreshold || 40.0,
        aiProvider: weights.aiProvider || 'LOCAL_ML',
        strictEligibility: weights.strictEligibility !== undefined ? weights.strictEligibility : true,
      },
      create: {
        key: 'DEFAULT',
        skillWeight: weights.skillWeight,
        educationWeight: weights.educationWeight,
        domainWeight: weights.domainWeight,
        locationWeight: weights.locationWeight,
        experienceWeight: weights.experienceWeight,
        careerGoalWeight: weights.careerGoalWeight,
        preferenceWeight: weights.preferenceWeight,
        minScoreThreshold: weights.minScoreThreshold || 40.0,
        aiProvider: weights.aiProvider || 'LOCAL_ML',
        strictEligibility: weights.strictEligibility !== undefined ? weights.strictEligibility : true,
      },
    });

    await AuditService.log({
      userId: adminUserId,
      action: 'UPDATE_RECOMMENDATION_CONFIG',
      resource: 'RecommendationConfig',
      details: weights,
    });

    return updated;
  }
}
