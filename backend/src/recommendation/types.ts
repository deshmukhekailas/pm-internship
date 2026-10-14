export interface ScoringWeights {
  skillWeight: number;       // default 30
  educationWeight: number;   // default 20
  domainWeight: number;      // default 15
  locationWeight: number;    // default 10
  experienceWeight: number;  // default 10
  careerGoalWeight: number;  // default 10
  preferenceWeight: number;  // default 5
}

export interface StudentFeatureProfile {
  id: string;
  userId: string;
  name: string;
  age?: number;
  state?: string;
  city?: string;
  preferredLocations: string[];
  preferredDomains: string[];
  remotePreference: string;
  careerGoal?: string;
  bio?: string;
  highestEducation?: {
    level: string;
    degree: string;
    branch: string;
    institute: string;
    graduationYear: number;
    cgpaOrPercentage: number;
    maxScale: number;
    cgpaNormalized: number; // 0 to 10
  };
  skills: Array<{
    name: string;
    category: string;
    proficiencyLevel: string; // BEGINNER, INTERMEDIATE, ADVANCED, EXPERT
  }>;
  projects: Array<{
    title: string;
    description: string;
    technologies: string;
  }>;
  experiences: Array<{
    title: string;
    company: string;
    description?: string;
  }>;
}

export interface InternshipFeatureProfile {
  id: string;
  title: string;
  organizationName: string;
  domain: string;
  department: string;
  description: string;
  responsibilities: string;
  location: string;
  state: string;
  workMode: string;
  durationMonths: number;
  stipendAmount: number;
  requiredSkills: Array<{
    name: string;
    weight: number;
  }>;
  preferredSkills: Array<{
    name: string;
    weight: number;
  }>;
  eligibility?: {
    minEducationLevel?: string;
    allowedDegrees: string[];
    allowedBranches: string[];
    minCgpa?: number;
    minGraduationYear?: number;
    maxGraduationYear?: number;
    minAge?: number;
    maxAge?: number;
    allowedStates: string[];
    mandatorySkillNames: string[];
  };
}

export interface EligibilityResult {
  status: 'ELIGIBLE' | 'NOT_ELIGIBLE' | 'UNKNOWN';
  isEligible: boolean;
  passedChecks: string[];
  failedChecks: string[];
  notes: string[];
}

export interface SkillGapAnalysis {
  matchedSkills: string[];
  missingRequiredSkills: string[];
  missingPreferredSkills: string[];
  learningSuggestions: Array<{
    skill: string;
    importance: 'REQUIRED' | 'PREFERRED';
    suggestion: string;
  }>;
}

export interface FactorBreakdown {
  score: number; // 0 to 100
  weight: number; // in percentage, e.g. 30
  weightedContribution: number;
  explanation: string;
}

export interface CompatibilityResult {
  internshipId: string;
  compatibilityScore: number; // 0 to 100
  eligibility: EligibilityResult;
  factors: {
    skillMatch: FactorBreakdown;
    educationMatch: FactorBreakdown;
    domainMatch: FactorBreakdown;
    locationMatch: FactorBreakdown;
    experienceMatch: FactorBreakdown;
    careerGoalMatch: FactorBreakdown;
    preferenceMatch: FactorBreakdown;
  };
  skillGap: SkillGapAnalysis;
  reasons: string[];
  engineMode: 'LOCAL_ML' | 'LLM' | 'HYBRID';
}
