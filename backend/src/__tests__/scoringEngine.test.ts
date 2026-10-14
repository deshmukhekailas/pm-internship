import { describe, it, expect } from 'vitest';
import { ScoringEngine, DEFAULT_WEIGHTS } from '../recommendation/scoringEngine';
import { EligibilityEngine } from '../recommendation/eligibilityEngine';
import { StudentFeatureProfile, InternshipFeatureProfile } from '../recommendation/types';

describe('ScoringEngine & Recommendation Calculation Tests', () => {
  const student: StudentFeatureProfile = {
    id: 's1',
    userId: 'u1',
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
      cgpaOrPercentage: 8.8,
      maxScale: 10,
      cgpaNormalized: 8.8,
    },
    skills: [
      { name: 'Python', category: 'TECHNICAL', proficiencyLevel: 'ADVANCED' },
      { name: 'JavaScript', category: 'TECHNICAL', proficiencyLevel: 'ADVANCED' },
      { name: 'React', category: 'TECHNICAL', proficiencyLevel: 'INTERMEDIATE' },
      { name: 'SQL', category: 'TECHNICAL', proficiencyLevel: 'ADVANCED' },
    ],
    projects: [
      {
        title: 'Full Stack Web Platform',
        description: 'Built scalable backend microservices and React dashboards with PostgreSQL.',
        technologies: 'Python, React, SQL',
      },
    ],
    experiences: [],
    careerGoal: 'Become a software architect building cloud platforms.',
  };

  const highMatchInternship: InternshipFeatureProfile = {
    id: 'i1',
    title: 'Software Engineer Intern',
    organizationName: 'Tata Consultancy Services',
    domain: 'Software Development',
    department: 'Digital Solutions',
    description: 'Build modern cloud web applications using Python and React.',
    responsibilities: 'Write robust APIs, build UI components, optimize SQL queries.',
    location: 'Mumbai',
    state: 'Maharashtra',
    workMode: 'HYBRID',
    durationMonths: 12,
    stipendAmount: 5000,
    requiredSkills: [{ name: 'Python', weight: 1.0 }, { name: 'SQL', weight: 1.0 }],
    preferredSkills: [{ name: 'React', weight: 0.7 }, { name: 'Docker', weight: 0.5 }],
    eligibility: {
      minEducationLevel: 'UNDERGRADUATE',
      allowedDegrees: ['B.Tech', 'B.E.'],
      allowedBranches: ['Computer Engineering', 'Information Technology'],
      minCgpa: 6.5,
      minGraduationYear: 2024,
      maxGraduationYear: 2027,
      minAge: 21,
      maxAge: 24,
      allowedStates: ['All'],
      mandatorySkillNames: ['Python'],
    },
  };

  it('should calculate high compatibility score for well-matched candidate', () => {
    const eligibility = EligibilityEngine.evaluate(student, highMatchInternship);
    const result = ScoringEngine.calculate(student, highMatchInternship, eligibility, DEFAULT_WEIGHTS);

    expect(result.compatibilityScore).toBeGreaterThanOrEqual(80);
    expect(result.eligibility.isEligible).toBe(true);
    expect(result.factors.skillMatch.score).toBeGreaterThanOrEqual(80);
    expect(result.factors.locationMatch.score).toBe(100);
    expect(result.reasons.length).toBeGreaterThan(0);
  });

  it('should identify missing preferred skill (Docker) in skill gap analysis', () => {
    const eligibility = EligibilityEngine.evaluate(student, highMatchInternship);
    const result = ScoringEngine.calculate(student, highMatchInternship, eligibility, DEFAULT_WEIGHTS);

    expect(result.skillGap.matchedSkills).toContain('Python');
    expect(result.skillGap.matchedSkills).toContain('SQL');
    expect(result.skillGap.matchedSkills).toContain('React');
    expect(result.skillGap.missingPreferredSkills).toContain('Docker');
    expect(result.skillGap.learningSuggestions.some((s) => s.skill === 'Docker')).toBe(true);
  });

  it('should cap compatibility score for ineligible candidates', () => {
    const ineligibleStudent: StudentFeatureProfile = {
      ...student,
      highestEducation: {
        ...student.highestEducation!,
        cgpaOrPercentage: 5.5,
        cgpaNormalized: 5.5,
      },
    };

    const eligibility = EligibilityEngine.evaluate(ineligibleStudent, highMatchInternship);
    const result = ScoringEngine.calculate(ineligibleStudent, highMatchInternship, eligibility, DEFAULT_WEIGHTS);

    expect(eligibility.isEligible).toBe(false);
    expect(result.compatibilityScore).toBeLessThanOrEqual(45);
  });
});
