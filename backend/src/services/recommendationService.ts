import prisma from '../config/db';
import { RecommendationFactory } from '../ai/recommendationFactory';
import { FeatureExtractor } from '../recommendation/featureExtractor';
import { ScoringWeights } from '../recommendation/types';
import { DEFAULT_WEIGHTS } from '../recommendation/scoringEngine';
import { NotificationService } from './notificationService';

export class RecommendationAppService {
  /**
   * Get active scoring configuration
   */
  public static async getConfig(): Promise<{ weights: ScoringWeights; minThreshold: number; aiProvider: string }> {
    const configRecord = await prisma.recommendationConfig.findFirst({
      where: { isActive: true },
    });

    if (!configRecord) {
      return {
        weights: DEFAULT_WEIGHTS,
        minThreshold: 40.0,
        aiProvider: 'LOCAL_ML',
      };
    }

    return {
      weights: {
        skillWeight: configRecord.skillWeight,
        educationWeight: configRecord.educationWeight,
        domainWeight: configRecord.domainWeight,
        locationWeight: configRecord.locationWeight,
        experienceWeight: configRecord.experienceWeight,
        careerGoalWeight: configRecord.careerGoalWeight,
        preferenceWeight: configRecord.preferenceWeight,
      },
      minThreshold: configRecord.minScoreThreshold,
      aiProvider: configRecord.aiProvider,
    };
  }

  /**
   * Generate or recalculate recommendations for a candidate
   */
  public static async generateForStudent(userId: string): Promise<any> {
    const studentProfile = await prisma.studentProfile.findUnique({
      where: { userId },
      include: {
        user: true,
        educations: true,
        studentSkills: { include: { skill: true } },
        projects: true,
        experiences: true,
      },
    });

    if (!studentProfile) {
      throw new Error('Student profile not found.');
    }

    const { weights, minThreshold, aiProvider } = await this.getConfig();
    const service = RecommendationFactory.getService(aiProvider);

    // Fetch all published internships
    const publishedInternships = await prisma.internship.findMany({
      where: { status: 'PUBLISHED' },
      include: {
        organization: true,
        skills: { include: { skill: true } },
        eligibilityRule: true,
      },
    });

    const studentFeature = FeatureExtractor.extractStudentFeatures(studentProfile);
    const internshipFeatures = publishedInternships.map(FeatureExtractor.extractInternshipFeatures);

    // Run batch recommendation
    const results = await service.batchRecommend(studentFeature, internshipFeatures, weights);

    // Filter by min threshold (or include all if student has few)
    const validResults = results.filter((r) => r.compatibilityScore >= minThreshold || r.eligibility.isEligible);

    // Upsert recommendations in DB
    for (const res of validResults) {
      const rec = await prisma.recommendation.upsert({
        where: {
          studentId_internshipId: {
            studentId: studentProfile.id,
            internshipId: res.internshipId,
          },
        },
        update: {
          compatibilityScore: res.compatibilityScore,
          eligibilityStatus: res.eligibility.status,
          skillScore: res.factors.skillMatch.score,
          educationScore: res.factors.educationMatch.score,
          domainScore: res.factors.domainMatch.score,
          locationScore: res.factors.locationMatch.score,
          experienceScore: res.factors.experienceMatch.score,
          careerGoalScore: res.factors.careerGoalMatch.score,
          preferenceScore: res.factors.preferenceMatch.score,
          matchedSkills: JSON.stringify(res.skillGap.matchedSkills),
          missingSkills: JSON.stringify(res.skillGap.missingRequiredSkills.concat(res.skillGap.missingPreferredSkills)),
          reasons: JSON.stringify(res.reasons),
          engineMode: res.engineMode,
        },
        create: {
          studentId: studentProfile.id,
          internshipId: res.internshipId,
          compatibilityScore: res.compatibilityScore,
          eligibilityStatus: res.eligibility.status,
          skillScore: res.factors.skillMatch.score,
          educationScore: res.factors.educationMatch.score,
          domainScore: res.factors.domainMatch.score,
          locationScore: res.factors.locationMatch.score,
          experienceScore: res.factors.experienceMatch.score,
          careerGoalScore: res.factors.careerGoalMatch.score,
          preferenceScore: res.factors.preferenceMatch.score,
          matchedSkills: JSON.stringify(res.skillGap.matchedSkills),
          missingSkills: JSON.stringify(res.skillGap.missingRequiredSkills.concat(res.skillGap.missingPreferredSkills)),
          reasons: JSON.stringify(res.reasons),
          engineMode: res.engineMode,
        },
      });

      // Clear existing reasons detail & re-insert
      await prisma.recommendationReason.deleteMany({
        where: { recommendationId: rec.id },
      });

      const factorEntries = [
        { factor: 'SKILL', explanation: res.factors.skillMatch.explanation, impactScore: res.factors.skillMatch.weightedContribution },
        { factor: 'EDUCATION', explanation: res.factors.educationMatch.explanation, impactScore: res.factors.educationMatch.weightedContribution },
        { factor: 'DOMAIN', explanation: res.factors.domainMatch.explanation, impactScore: res.factors.domainMatch.weightedContribution },
        { factor: 'LOCATION', explanation: res.factors.locationMatch.explanation, impactScore: res.factors.locationMatch.weightedContribution },
        { factor: 'EXPERIENCE', explanation: res.factors.experienceMatch.explanation, impactScore: res.factors.experienceMatch.weightedContribution },
        { factor: 'CAREER_GOAL', explanation: res.factors.careerGoalMatch.explanation, impactScore: res.factors.careerGoalMatch.weightedContribution },
      ];

      await prisma.recommendationReason.createMany({
        data: factorEntries.map((fe) => ({
          recommendationId: rec.id,
          factor: fe.factor,
          explanation: fe.explanation,
          impactScore: fe.impactScore,
        })),
      });
    }

    // Trigger notification if high compatibility found
    const topMatch = validResults[0];
    if (topMatch && topMatch.compatibilityScore >= 80) {
      const topInternship = publishedInternships.find((i) => i.id === topMatch.internshipId);
      await NotificationService.createNotification({
        userId,
        title: 'New High Compatibility Match!',
        message: `We found an internship matching your profile: ${topInternship?.title} (${topMatch.compatibilityScore}% Compatibility).`,
        type: 'RECOMMENDATION',
        link: `/student/internships/${topMatch.internshipId}`,
      });
    }

    return this.getStudentRecommendations(userId);
  }

  /**
   * Get student's recommendations
   */
  public static async getStudentRecommendations(userId: string, filters?: { minScore?: number; domain?: string }): Promise<any[]> {
    const studentProfile = await prisma.studentProfile.findUnique({
      where: { userId },
      include: {
        savedInternships: true,
        applications: true,
      },
    });

    if (!studentProfile) {
      throw new Error('Student profile not found.');
    }

    // Auto-generate if none exist yet
    const existingCount = await prisma.recommendation.count({
      where: { studentId: studentProfile.id },
    });

    if (existingCount === 0) {
      return this.generateForStudent(userId);
    }

    const where: any = {
      studentId: studentProfile.id,
      internship: { status: 'PUBLISHED' },
    };

    if (filters?.minScore) {
      where.compatibilityScore = { gte: Number(filters.minScore) };
    }

    if (filters?.domain && filters.domain !== 'ALL') {
      where.internship = {
        ...where.internship,
        domain: { contains: filters.domain },
      };
    }

    const recommendations = await prisma.recommendation.findMany({
      where,
      include: {
        internship: {
          include: {
            organization: true,
            skills: { include: { skill: true } },
            eligibilityRule: true,
          },
        },
        reasonsDetail: true,
        feedbacks: true,
      },
      orderBy: { compatibilityScore: 'desc' },
      take: 50,
    });

    const savedSet = new Set(studentProfile.savedInternships.map((s) => s.internshipId));
    const appliedSet = new Set(studentProfile.applications.map((a) => a.internshipId));

    return recommendations.map((rec) => ({
      ...rec,
      reasons: JSON.parse(rec.reasons || '[]'),
      matchedSkills: JSON.parse(rec.matchedSkills || '[]'),
      missingSkills: JSON.parse(rec.missingSkills || '[]'),
      isSaved: savedSet.has(rec.internshipId),
      hasApplied: appliedSet.has(rec.internshipId),
    }));
  }

  /**
   * Submit feedback on recommendation
   */
  public static async submitFeedback(userId: string, recommendationId: string, data: { rating: number; isRelevant: boolean; comment?: string }) {
    const studentProfile = await prisma.studentProfile.findUnique({ where: { userId } });
    if (!studentProfile) throw new Error('Student profile not found.');

    return prisma.feedback.create({
      data: {
        recommendationId,
        studentId: studentProfile.id,
        rating: data.rating,
        isRelevant: data.isRelevant,
        comment: data.comment,
      },
    });
  }

  /**
   * Compute aggregated skill gap analysis for student dashboard
   */
  public static async getStudentSkillGapSummary(userId: string) {
    const studentProfile = await prisma.studentProfile.findUnique({
      where: { userId },
      include: {
        studentSkills: { include: { skill: true } },
      },
    });

    if (!studentProfile) throw new Error('Student profile not found.');

    const topRecs = await prisma.recommendation.findMany({
      where: { studentId: studentProfile.id, eligibilityStatus: 'ELIGIBLE' },
      orderBy: { compatibilityScore: 'desc' },
      take: 10,
    });

    const skillDemandMap = new Map<string, number>();
    for (const rec of topRecs) {
      const missing: string[] = JSON.parse(rec.missingSkills || '[]');
      for (const sk of missing) {
        skillDemandMap.set(sk, (skillDemandMap.get(sk) || 0) + 1);
      }
    }

    const sortedMissingSkills = Array.from(skillDemandMap.entries())
      .map(([skill, count]) => ({ skill, frequencyInTopMatches: count }))
      .sort((a, b) => b.frequencyInTopMatches - a.frequencyInTopMatches)
      .slice(0, 5);

    return {
      currentSkillsCount: studentProfile.studentSkills.length,
      currentSkills: studentProfile.studentSkills.map((s) => s.skill.name),
      highImpactMissingSkills: sortedMissingSkills,
      notice: 'Learning suggestions are educational recommendations to enhance readiness, not guarantees of selection.',
    };
  }
}
