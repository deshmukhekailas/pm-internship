import { z } from 'zod';

export const createInternshipSchema = z.object({
  body: z.object({
    organizationId: z.string().min(1, 'Organization ID is required'),
    title: z.string().min(3, 'Internship title must be at least 3 characters'),
    description: z.string().min(20, 'Description must be at least 20 characters'),
    responsibilities: z.string().min(10, 'Responsibilities must be provided'),
    department: z.string().min(2, 'Department is required'),
    domain: z.string().min(2, 'Domain is required'),
    location: z.string().min(2, 'Location is required'),
    state: z.string().min(2, 'State is required'),
    district: z.string().optional().nullable(),
    workMode: z.enum(['REMOTE', 'ONSITE', 'HYBRID']).default('ONSITE'),
    durationMonths: z.number().int().min(1).max(24).default(12),
    stipendAmount: z.number().min(0).default(5000),
    stipendType: z.enum(['MONTHLY', 'FIXED', 'UNPAID']).default('MONTHLY'),
    openings: z.number().int().min(1).default(5),
    deadline: z.string(),
    startDate: z.string().optional().nullable(),
    status: z.enum(['DRAFT', 'PUBLISHED', 'CLOSED', 'ARCHIVED']).default('PUBLISHED'),
    skills: z.array(
      z.object({
        skillName: z.string(),
        isRequired: z.boolean().default(true),
        weight: z.number().default(1.0),
      })
    ).optional(),
    eligibility: z.object({
      minEducationLevel: z.string().default('UNDERGRADUATE'),
      allowedDegrees: z.array(z.string()).default([]),
      allowedBranches: z.array(z.string()).default([]),
      minCgpa: z.number().optional().nullable(),
      minGraduationYear: z.number().optional().nullable(),
      maxGraduationYear: z.number().optional().nullable(),
      minAge: z.number().optional().nullable(),
      maxAge: z.number().optional().nullable(),
      allowedStates: z.array(z.string()).default([]),
      mandatorySkillNames: z.array(z.string()).default([]),
    }).optional(),
  }),
});

export const updateInternshipSchema = z.object({
  body: createInternshipSchema.shape.body.partial(),
});

export const applyInternshipSchema = z.object({
  body: z.object({
    coverLetter: z.string().optional().nullable(),
    resumeId: z.string().optional().nullable(),
  }),
});
