export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'STUDENT' | 'ADMIN';
  phone?: string;
  studentProfileId?: string;
}

export interface Education {
  id: string;
  level: string;
  degree: string;
  branch: string;
  institute: string;
  boardOrUniversity?: string;
  startYear: number;
  graduationYear: number;
  cgpaOrPercentage: number;
  maxScale: number;
  isCompleted: boolean;
}

export interface Skill {
  id: string;
  name: string;
  category: 'TECHNICAL' | 'SOFT' | 'TOOL' | 'DOMAIN';
}

export interface StudentSkill {
  id: string;
  skillId: string;
  skill: Skill;
  proficiencyLevel: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT';
  verified: boolean;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  technologies: string;
  role?: string;
  projectUrl?: string;
  githubUrl?: string;
}

export interface Experience {
  id: string;
  title: string;
  company: string;
  location?: string;
  experienceType: string;
  startDate: string;
  endDate?: string;
  isCurrent: boolean;
  description?: string;
}

export interface StudentProfile {
  id: string;
  userId: string;
  user: User;
  dateOfBirth?: string;
  gender?: string;
  category?: string;
  state?: string;
  district?: string;
  city?: string;
  pinCode?: string;
  bio?: string;
  careerGoal?: string;
  preferredLocations: string | string[];
  preferredDomains: string | string[];
  remotePreference: 'REMOTE' | 'ONSITE' | 'HYBRID' | 'ANY';
  profileCompletionPercentage: number;
  educations?: Education[];
  studentSkills?: StudentSkill[];
  projects?: Project[];
  experiences?: Experience[];
  resumes?: any[];
}

export interface Organization {
  id: string;
  name: string;
  slug: string;
  logoUrl?: string;
  website?: string;
  industry: string;
  description: string;
  headquarter: string;
  isGovernmentPartner: boolean;
}

export interface EligibilityRule {
  id: string;
  minEducationLevel: string;
  allowedDegrees: string | string[];
  allowedBranches: string | string[];
  minCgpa?: number;
  minGraduationYear?: number;
  maxGraduationYear?: number;
  minAge?: number;
  maxAge?: number;
  allowedStates: string | string[];
  mandatorySkillNames: string | string[];
}

export interface InternshipSkill {
  id: string;
  skillId: string;
  skill: Skill;
  isRequired: boolean;
  weight: number;
}

export interface Internship {
  id: string;
  organizationId: string;
  organization: Organization;
  title: string;
  slug: string;
  description: string;
  responsibilities: string;
  department: string;
  domain: string;
  location: string;
  state: string;
  district?: string;
  workMode: 'REMOTE' | 'ONSITE' | 'HYBRID';
  durationMonths: number;
  stipendAmount: number;
  stipendType: string;
  openings: number;
  deadline: string;
  startDate?: string;
  status: 'DRAFT' | 'PUBLISHED' | 'CLOSED' | 'ARCHIVED';
  skills?: InternshipSkill[];
  eligibilityRule?: EligibilityRule;
  isSaved?: boolean;
  hasApplied?: boolean;
  applicationStatus?: string;
  compatibilityScore?: number;
  eligibilityStatus?: 'ELIGIBLE' | 'NOT_ELIGIBLE' | 'UNKNOWN';
  isEligible?: boolean;
  failedEligibilityChecks?: string[];
  reasons?: string[];
  candidateAnalysis?: {
    eligibility: {
      status: 'ELIGIBLE' | 'NOT_ELIGIBLE' | 'UNKNOWN';
      isEligible: boolean;
      passedChecks: string[];
      failedChecks: string[];
    };
    compatibilityScore: number;
    factors: {
      skillMatch: { score: number; weight: number; weightedContribution: number; explanation: string };
      educationMatch: { score: number; weight: number; weightedContribution: number; explanation: string };
      domainMatch: { score: number; weight: number; weightedContribution: number; explanation: string };
      locationMatch: { score: number; weight: number; weightedContribution: number; explanation: string };
      experienceMatch: { score: number; weight: number; weightedContribution: number; explanation: string };
      careerGoalMatch: { score: number; weight: number; weightedContribution: number; explanation: string };
      preferenceMatch: { score: number; weight: number; weightedContribution: number; explanation: string };
    };
    skillGap: {
      matchedSkills: string[];
      missingRequiredSkills: string[];
      missingPreferredSkills: string[];
      learningSuggestions: Array<{ skill: string; importance: string; suggestion: string }>;
    };
    reasons: string[];
  };
}

export interface Recommendation {
  id: string;
  internshipId: string;
  internship: Internship;
  compatibilityScore: number;
  eligibilityStatus: 'ELIGIBLE' | 'NOT_ELIGIBLE' | 'UNKNOWN';
  skillScore: number;
  educationScore: number;
  domainScore: number;
  locationScore: number;
  experienceScore: number;
  careerGoalScore: number;
  preferenceScore: number;
  matchedSkills: string[];
  missingSkills: string[];
  reasons: string[];
  engineMode: 'LOCAL_ML' | 'LLM' | 'HYBRID';
  isSaved?: boolean;
  hasApplied?: boolean;
}

export interface Application {
  id: string;
  studentId: string;
  internshipId: string;
  internship: Internship;
  student?: StudentProfile;
  status: 'APPLIED' | 'UNDER_REVIEW' | 'SHORTLISTED' | 'ACCEPTED' | 'REJECTED' | 'WITHDRAWN';
  coverLetter?: string;
  appliedAt: string;
  matchScoreAtApplication?: number;
  notes?: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  link?: string;
  createdAt: string;
}

export interface RecommendationConfig {
  id: string;
  skillWeight: number;
  educationWeight: number;
  domainWeight: number;
  locationWeight: number;
  experienceWeight: number;
  careerGoalWeight: number;
  preferenceWeight: number;
  minScoreThreshold: number;
  aiProvider: string;
  strictEligibility: boolean;
}
