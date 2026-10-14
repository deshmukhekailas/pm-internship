import { z } from 'zod';

export const updateProfileSchema = z.object({
  body: z.object({
    dateOfBirth: z.string().optional().nullable(),
    gender: z.string().optional().nullable(),
    category: z.string().optional().nullable(),
    state: z.string().optional().nullable(),
    district: z.string().optional().nullable(),
    city: z.string().optional().nullable(),
    pinCode: z.string().optional().nullable(),
    bio: z.string().optional().nullable(),
    careerGoal: z.string().optional().nullable(),
    preferredLocations: z.array(z.string()).optional(),
    preferredDomains: z.array(z.string()).optional(),
    remotePreference: z.enum(['REMOTE', 'ONSITE', 'HYBRID', 'ANY']).optional(),
  }),
});

export const addEducationSchema = z.object({
  body: z.object({
    level: z.enum(['TENTH', 'TWELFTH', 'DIPLOMA', 'UNDERGRADUATE', 'POSTGRADUATE', 'DOCTORATE']),
    degree: z.string().min(2, 'Degree name is required'),
    branch: z.string().min(2, 'Branch or field of study is required'),
    institute: z.string().min(2, 'Institute name is required'),
    boardOrUniversity: z.string().optional().nullable(),
    startYear: z.number().int().min(1980).max(2035),
    graduationYear: z.number().int().min(1980).max(2035),
    cgpaOrPercentage: z.number().min(0).max(100),
    maxScale: z.number().default(10.0),
    isCompleted: z.boolean().default(false),
  }),
});

export const addSkillSchema = z.object({
  body: z.object({
    skillName: z.string().min(1, 'Skill name is required'),
    category: z.enum(['TECHNICAL', 'SOFT', 'TOOL', 'DOMAIN']).optional().default('TECHNICAL'),
    proficiencyLevel: z.enum(['BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'EXPERT']).default('INTERMEDIATE'),
  }),
});

export const addProjectSchema = z.object({
  body: z.object({
    title: z.string().min(2, 'Project title is required'),
    description: z.string().min(10, 'Project description must be at least 10 characters'),
    technologies: z.string().min(1, 'Technologies are required'),
    role: z.string().optional().nullable(),
    projectUrl: z.string().url().optional().nullable().or(z.literal('')),
    githubUrl: z.string().url().optional().nullable().or(z.literal('')),
    startDate: z.string().optional().nullable(),
    endDate: z.string().optional().nullable(),
  }),
});

export const addExperienceSchema = z.object({
  body: z.object({
    title: z.string().min(2, 'Job/Internship title is required'),
    company: z.string().min(2, 'Company name is required'),
    location: z.string().optional().nullable(),
    experienceType: z.enum(['INTERNSHIP', 'APPRENTICESHIP', 'PART_TIME', 'FULL_TIME', 'VOLUNTEER']).default('INTERNSHIP'),
    startDate: z.string(),
    endDate: z.string().optional().nullable(),
    isCurrent: z.boolean().default(false),
    description: z.string().optional().nullable(),
  }),
});
