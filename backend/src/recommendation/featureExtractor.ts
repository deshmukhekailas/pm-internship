import { StudentFeatureProfile, InternshipFeatureProfile } from './types';

export class FeatureExtractor {
  /**
   * Safely parse JSON array or string
   */
  public static parseJsonArray(input: any, defaultValue: string[] = []): string[] {
    if (!input) return defaultValue;
    if (Array.isArray(input)) return input;
    try {
      const parsed = JSON.parse(input);
      return Array.isArray(parsed) ? parsed : defaultValue;
    } catch {
      if (typeof input === 'string' && input.includes(',')) {
        return input.split(',').map((s) => s.trim());
      }
      return [String(input)];
    }
  }

  /**
   * Normalize CGPA or Percentage to a 10-point scale
   */
  public static normalizeCgpa(cgpaOrPercentage: number, maxScale: number = 10): number {
    if (!cgpaOrPercentage || cgpaOrPercentage <= 0) return 0;
    if (maxScale === 100 || cgpaOrPercentage > 10) {
      // Convert percentage (e.g. 85%) to 10-point scale: 85 / 10 = 8.5
      return Math.min(10, Math.round((cgpaOrPercentage / 10) * 10) / 10);
    }
    if (maxScale === 4) {
      return Math.min(10, Math.round(((cgpaOrPercentage / 4) * 10) * 10) / 10);
    }
    return Math.min(10, cgpaOrPercentage);
  }

  /**
   * Calculate age in years from date of birth
   */
  public static calculateAge(dob?: Date | string | null): number | undefined {
    if (!dob) return undefined;
    const birthDate = new Date(dob);
    if (isNaN(birthDate.getTime())) return undefined;

    const diffMs = Date.now() - birthDate.getTime();
    const ageDate = new Date(diffMs);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  }

  /**
   * Extract features from a Student Profile Prisma entity
   */
  public static extractStudentFeatures(profile: any): StudentFeatureProfile {
    const user = profile.user || {};
    const fullName = `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Candidate';
    const age = this.calculateAge(profile.dateOfBirth);

    // Pick highest education level
    let highestEducation: StudentFeatureProfile['highestEducation'] = undefined;
    if (profile.educations && profile.educations.length > 0) {
      // Sort by graduation year descending
      const sortedEdu = [...profile.educations].sort(
        (a, b) => (b.graduationYear || 0) - (a.graduationYear || 0)
      );
      const top = sortedEdu[0];
      highestEducation = {
        level: top.level,
        degree: top.degree,
        branch: top.branch,
        institute: top.institute,
        graduationYear: top.graduationYear,
        cgpaOrPercentage: top.cgpaOrPercentage,
        maxScale: top.maxScale || 10,
        cgpaNormalized: this.normalizeCgpa(top.cgpaOrPercentage, top.maxScale),
      };
    }

    const skills = (profile.studentSkills || []).map((ss: any) => ({
      name: ss.skill?.name || ss.skillName || 'Skill',
      category: ss.skill?.category || 'TECHNICAL',
      proficiencyLevel: ss.proficiencyLevel || 'INTERMEDIATE',
    }));

    const projects = (profile.projects || []).map((p: any) => ({
      title: p.title || '',
      description: p.description || '',
      technologies: p.technologies || '',
    }));

    const experiences = (profile.experiences || []).map((e: any) => ({
      title: e.title || '',
      company: e.company || '',
      description: e.description || '',
    }));

    return {
      id: profile.id,
      userId: profile.userId,
      name: fullName,
      age,
      state: profile.state || undefined,
      city: profile.city || undefined,
      preferredLocations: this.parseJsonArray(profile.preferredLocations),
      preferredDomains: this.parseJsonArray(profile.preferredDomains),
      remotePreference: profile.remotePreference || 'ANY',
      careerGoal: profile.careerGoal || undefined,
      bio: profile.bio || undefined,
      highestEducation,
      skills,
      projects,
      experiences,
    };
  }

  /**
   * Extract features from an Internship Prisma entity
   */
  public static extractInternshipFeatures(internship: any): InternshipFeatureProfile {
    const requiredSkills: InternshipFeatureProfile['requiredSkills'] = [];
    const preferredSkills: InternshipFeatureProfile['preferredSkills'] = [];

    if (internship.skills && Array.isArray(internship.skills)) {
      for (const item of internship.skills) {
        const skillName = item.skill?.name || item.skillName || 'Skill';
        if (item.isRequired) {
          requiredSkills.push({ name: skillName, weight: item.weight || 1.0 });
        } else {
          preferredSkills.push({ name: skillName, weight: item.weight || 0.7 });
        }
      }
    }

    let eligibility: InternshipFeatureProfile['eligibility'] = undefined;
    if (internship.eligibilityRule) {
      const rule = internship.eligibilityRule;
      eligibility = {
        minEducationLevel: rule.minEducationLevel,
        allowedDegrees: this.parseJsonArray(rule.allowedDegrees),
        allowedBranches: this.parseJsonArray(rule.allowedBranches),
        minCgpa: rule.minCgpa !== null ? rule.minCgpa : undefined,
        minGraduationYear: rule.minGraduationYear || undefined,
        maxGraduationYear: rule.maxGraduationYear || undefined,
        minAge: rule.minAge || undefined,
        maxAge: rule.maxAge || undefined,
        allowedStates: this.parseJsonArray(rule.allowedStates),
        mandatorySkillNames: this.parseJsonArray(rule.mandatorySkillNames),
      };
    }

    return {
      id: internship.id,
      title: internship.title,
      organizationName: internship.organization?.name || 'Partner Organization',
      domain: internship.domain,
      department: internship.department,
      description: internship.description,
      responsibilities: internship.responsibilities,
      location: internship.location,
      state: internship.state,
      workMode: internship.workMode,
      durationMonths: internship.durationMonths,
      stipendAmount: internship.stipendAmount,
      requiredSkills,
      preferredSkills,
      eligibility,
    };
  }
}
