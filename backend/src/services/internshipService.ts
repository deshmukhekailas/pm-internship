import prisma from '../config/db';
import { FeatureExtractor } from '../recommendation/featureExtractor';
import { EligibilityEngine } from '../recommendation/eligibilityEngine';
import { ScoringEngine, DEFAULT_WEIGHTS } from '../recommendation/scoringEngine';

export class InternshipService {
  /**
   * Search and filter internships with pagination
   */
  public static async listInternships(params: {
    keyword?: string;
    domain?: string;
    location?: string;
    state?: string;
    workMode?: string;
    minStipend?: number;
    durationMonths?: number;
    skills?: string[];
    onlyEligible?: boolean;
    studentUserId?: string;
    page?: number;
    limit?: number;
    sortBy?: 'deadline' | 'stipend' | 'createdAt' | 'compatibility';
    sortOrder?: 'asc' | 'desc';
  }) {
    const page = Math.max(1, params.page || 1);
    const limit = Math.min(50, Math.max(1, params.limit || 12));
    const skip = (page - 1) * limit;

    const where: any = {
      status: 'PUBLISHED',
    };

    // Keyword search in title, description, department, responsibilities
    if (params.keyword && params.keyword.trim()) {
      const kw = params.keyword.trim();
      where.OR = [
        { title: { contains: kw } },
        { description: { contains: kw } },
        { department: { contains: kw } },
        { organization: { name: { contains: kw } } },
      ];
    }

    if (params.domain && params.domain !== 'ALL') {
      where.domain = { contains: params.domain };
    }

    if (params.workMode && params.workMode !== 'ALL') {
      where.workMode = params.workMode;
    }

    if (params.location && params.location !== 'ALL') {
      where.location = { contains: params.location };
    }

    if (params.state && params.state !== 'ALL') {
      where.state = { contains: params.state };
    }

    if (params.minStipend) {
      where.stipendAmount = { gte: Number(params.minStipend) };
    }

    if (params.durationMonths) {
      where.durationMonths = Number(params.durationMonths);
    }

    // Determine orderBy
    let orderBy: any = { createdAt: 'desc' };
    if (params.sortBy === 'deadline') {
      orderBy = { deadline: params.sortOrder || 'asc' };
    } else if (params.sortBy === 'stipend') {
      orderBy = { stipendAmount: params.sortOrder || 'desc' };
    } else if (params.sortBy === 'createdAt') {
      orderBy = { createdAt: params.sortOrder || 'desc' };
    }

    // Fetch internships
    const [total, internships] = await Promise.all([
      prisma.internship.count({ where }),
      prisma.internship.findMany({
        where,
        include: {
          organization: true,
          skills: {
            include: { skill: true },
          },
          eligibilityRule: true,
        },
        orderBy,
        skip,
        take: limit,
      }),
    ]);

    // If student user ID is present, attach personalized eligibility and compatibility preview!
    let studentProfile: any = null;
    let savedMap = new Set<string>();
    let appliedMap = new Set<string>();

    if (params.studentUserId) {
      studentProfile = await prisma.studentProfile.findUnique({
        where: { userId: params.studentUserId },
        include: {
          user: true,
          educations: true,
          studentSkills: { include: { skill: true } },
          projects: true,
          experiences: true,
          savedInternships: true,
          applications: true,
        },
      });

      if (studentProfile) {
        savedMap = new Set(studentProfile.savedInternships.map((s: any) => s.internshipId));
        appliedMap = new Set(studentProfile.applications.map((a: any) => a.internshipId));
      }
    }

    let enrichedInternships = internships.map((intern) => {
      const internFeature = FeatureExtractor.extractInternshipFeatures(intern);
      let eligibilityInfo: any = { status: 'UNKNOWN', isEligible: true, failedChecks: [] };
      let compatibilityScore: number | null = null;
      let reasons: string[] = [];

      if (studentProfile) {
        const studentFeature = FeatureExtractor.extractStudentFeatures(studentProfile);
        const elig = EligibilityEngine.evaluate(studentFeature, internFeature);
        const scoreResult = ScoringEngine.calculate(studentFeature, internFeature, elig, DEFAULT_WEIGHTS);

        eligibilityInfo = elig;
        compatibilityScore = scoreResult.compatibilityScore;
        reasons = scoreResult.reasons;
      }

      return {
        ...intern,
        isSaved: savedMap.has(intern.id),
        hasApplied: appliedMap.has(intern.id),
        eligibilityStatus: eligibilityInfo.status,
        isEligible: eligibilityInfo.isEligible,
        failedEligibilityChecks: eligibilityInfo.failedChecks,
        compatibilityScore,
        reasons,
      };
    });

    // If onlyEligible filter is requested
    if (params.onlyEligible && studentProfile) {
      enrichedInternships = enrichedInternships.filter((i) => i.isEligible);
    }

    // If sorting by compatibility
    if (params.sortBy === 'compatibility' && studentProfile) {
      enrichedInternships.sort((a, b) => (b.compatibilityScore || 0) - (a.compatibilityScore || 0));
    }

    return {
      items: enrichedInternships,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Get internship details by ID with full candidate compatibility match breakdown
   */
  public static async getInternshipById(id: string, studentUserId?: string) {
    const internship = await prisma.internship.findUnique({
      where: { id },
      include: {
        organization: true,
        skills: {
          include: { skill: true },
        },
        eligibilityRule: true,
        _count: {
          select: { applications: true },
        },
      },
    });

    if (!internship) {
      throw new Error('Internship not found.');
    }

    let candidateAnalysis: any = null;
    let isSaved = false;
    let hasApplied = false;
    let applicationStatus: string | null = null;

    if (studentUserId) {
      const studentProfile = await prisma.studentProfile.findUnique({
        where: { userId: studentUserId },
        include: {
          user: true,
          educations: true,
          studentSkills: { include: { skill: true } },
          projects: true,
          experiences: true,
          savedInternships: { where: { internshipId: id } },
          applications: { where: { internshipId: id } },
        },
      });

      if (studentProfile) {
        isSaved = studentProfile.savedInternships.length > 0;
        if (studentProfile.applications.length > 0) {
          hasApplied = true;
          applicationStatus = studentProfile.applications[0].status;
        }

        const studentFeature = FeatureExtractor.extractStudentFeatures(studentProfile);
        const internFeature = FeatureExtractor.extractInternshipFeatures(internship);
        const eligibility = EligibilityEngine.evaluate(studentFeature, internFeature);
        const scoreResult = ScoringEngine.calculate(studentFeature, internFeature, eligibility, DEFAULT_WEIGHTS);

        candidateAnalysis = {
          eligibility,
          compatibilityScore: scoreResult.compatibilityScore,
          factors: scoreResult.factors,
          skillGap: scoreResult.skillGap,
          reasons: scoreResult.reasons,
        };
      }
    }

    return {
      ...internship,
      isSaved,
      hasApplied,
      applicationStatus,
      candidateAnalysis,
    };
  }

  /**
   * Toggle save/bookmark an internship
   */
  public static async toggleSaveInternship(userId: string, internshipId: string) {
    const profile = await prisma.studentProfile.findUnique({ where: { userId } });
    if (!profile) throw new Error('Student profile not found.');

    const existing = await prisma.savedInternship.findUnique({
      where: {
        studentId_internshipId: {
          studentId: profile.id,
          internshipId,
        },
      },
    });

    if (existing) {
      await prisma.savedInternship.delete({
        where: { id: existing.id },
      });
      return { saved: false, message: 'Internship removed from saved list.' };
    } else {
      await prisma.savedInternship.create({
        data: {
          studentId: profile.id,
          internshipId,
        },
      });
      return { saved: true, message: 'Internship saved to your bookmarks.' };
    }
  }

  /**
   * Get all saved internships for a student
   */
  public static async getSavedInternships(userId: string) {
    const profile = await prisma.studentProfile.findUnique({ where: { userId } });
    if (!profile) throw new Error('Student profile not found.');

    const saved = await prisma.savedInternship.findMany({
      where: { studentId: profile.id },
      include: {
        internship: {
          include: {
            organization: true,
            skills: { include: { skill: true } },
            eligibilityRule: true,
          },
        },
      },
      orderBy: { savedAt: 'desc' },
    });

    return saved.map((s) => s.internship);
  }
}
