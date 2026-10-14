import { describe, it, expect } from 'vitest';
import { EligibilityEngine } from '../recommendation/eligibilityEngine';
import { StudentFeatureProfile, InternshipFeatureProfile } from '../recommendation/types';

describe('EligibilityEngine Unit Tests', () => {
  const baseStudent: StudentFeatureProfile = {
    id: 'student-1',
    userId: 'user-1',
    name: 'Aarav Sharma',
    age: 22,
    state: 'Maharashtra',
    city: 'Mumbai',
    preferredLocations: ['Mumbai'],
    preferredDomains: ['Software Development'],
    remotePreference: 'HYBRID',
    highestEducation: {
      level: 'UNDERGRADUATE',
      degree: 'B.Tech',
      branch: 'Computer Engineering',
      institute: 'VJTI Mumbai',
      graduationYear: 2026,
      cgpaOrPercentage: 8.5,
      maxScale: 10,
      cgpaNormalized: 8.5,
    },
    skills: [
      { name: 'Python', category: 'TECHNICAL', proficiencyLevel: 'ADVANCED' },
      { name: 'JavaScript', category: 'TECHNICAL', proficiencyLevel: 'ADVANCED' },
      { name: 'SQL', category: 'TECHNICAL', proficiencyLevel: 'INTERMEDIATE' },
    ],
    projects: [],
    experiences: [],
  };

  const baseInternship: InternshipFeatureProfile = {
    id: 'intern-1',
    title: 'Software Development Intern',
    organizationName: 'Tata Consultancy Services',
    domain: 'Software Development',
    department: 'Engineering',
    description: 'Work on cloud web platforms',
    responsibilities: 'Develop APIs and dashboards',
    location: 'Mumbai',
    state: 'Maharashtra',
    workMode: 'HYBRID',
    durationMonths: 12,
    stipendAmount: 5000,
    requiredSkills: [{ name: 'Python', weight: 1.0 }, { name: 'SQL', weight: 1.0 }],
    preferredSkills: [{ name: 'React', weight: 0.7 }],
    eligibility: {
      minEducationLevel: 'UNDERGRADUATE',
      allowedDegrees: ['B.Tech', 'B.E.', 'MCA'],
      allowedBranches: ['Computer Engineering', 'Information Technology', 'Computer Science'],
      minCgpa: 7.0,
      minGraduationYear: 2024,
      maxGraduationYear: 2027,
      minAge: 21,
      maxAge: 24,
      allowedStates: ['All'],
      mandatorySkillNames: ['Python'],
    },
  };

  it('1. should mark an eligible candidate as ELIGIBLE', () => {
    const result = EligibilityEngine.evaluate(baseStudent, baseInternship);
    expect(result.status).toBe('ELIGIBLE');
    expect(result.isEligible).toBe(true);
    expect(result.failedChecks.length).toBe(0);
    expect(result.passedChecks.length).toBeGreaterThan(0);
  });

  it('2. should reject candidate whose CGPA is below the minimum threshold', () => {
    const lowCgpaStudent: StudentFeatureProfile = {
      ...baseStudent,
      highestEducation: {
        ...baseStudent.highestEducation!,
        cgpaOrPercentage: 6.2,
        cgpaNormalized: 6.2,
      },
    };

    const result = EligibilityEngine.evaluate(lowCgpaStudent, baseInternship);
    expect(result.status).toBe('NOT_ELIGIBLE');
    expect(result.isEligible).toBe(false);
    expect(result.failedChecks.some((f) => f.includes('below the required cutoff'))).toBe(true);
  });

  it('3. should reject candidate with degree outside the allowed list', () => {
    const artsStudent: StudentFeatureProfile = {
      ...baseStudent,
      highestEducation: {
        ...baseStudent.highestEducation!,
        degree: 'B.A.',
        branch: 'History',
      },
    };

    const result = EligibilityEngine.evaluate(artsStudent, baseInternship);
    expect(result.status).toBe('NOT_ELIGIBLE');
    expect(result.isEligible).toBe(false);
    expect(result.failedChecks.some((f) => f.includes('is not in eligible list'))).toBe(true);
  });

  it('4. should reject candidate missing a mandatory prerequisite skill', () => {
    const missingSkillStudent: StudentFeatureProfile = {
      ...baseStudent,
      skills: [{ name: 'Java', category: 'TECHNICAL', proficiencyLevel: 'INTERMEDIATE' }],
    };

    const result = EligibilityEngine.evaluate(missingSkillStudent, baseInternship);
    expect(result.status).toBe('NOT_ELIGIBLE');
    expect(result.isEligible).toBe(false);
    expect(result.failedChecks.some((f) => f.includes('Missing mandatory prerequisite skill'))).toBe(true);
  });

  it('5. should reject candidate exceeding the maximum age limit', () => {
    const olderStudent: StudentFeatureProfile = {
      ...baseStudent,
      age: 26,
    };

    const result = EligibilityEngine.evaluate(olderStudent, baseInternship);
    expect(result.status).toBe('NOT_ELIGIBLE');
    expect(result.isEligible).toBe(false);
    expect(result.failedChecks.some((f) => f.includes('exceeds maximum limit'))).toBe(true);
  });
});
