import { z } from 'zod';

export const feedbackSchema = z.object({
  body: z.object({
    rating: z.number().int().min(1).max(5),
    isRelevant: z.boolean(),
    comment: z.string().optional().nullable(),
  }),
});

export const updateConfigSchema = z.object({
  body: z.object({
    skillWeight: z.number().min(0).max(100),
    educationWeight: z.number().min(0).max(100),
    domainWeight: z.number().min(0).max(100),
    locationWeight: z.number().min(0).max(100),
    experienceWeight: z.number().min(0).max(100),
    careerGoalWeight: z.number().min(0).max(100),
    preferenceWeight: z.number().min(0).max(100),
    minScoreThreshold: z.number().min(0).max(100).optional(),
    aiProvider: z.enum(['LOCAL_ML', 'GEMINI', 'HYBRID']).optional(),
    strictEligibility: z.boolean().optional(),
  }),
});
