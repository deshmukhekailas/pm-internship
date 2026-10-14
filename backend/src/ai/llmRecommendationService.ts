import { GoogleGenerativeAI } from '@google/generative-ai';
import { IRecommendationService } from './recommendationService.interface';
import {
  StudentFeatureProfile,
  InternshipFeatureProfile,
  CompatibilityResult,
  ScoringWeights,
} from '../recommendation/types';
import { MLRecommendationService } from './mlRecommendationService';
import { config } from '../config/env';
import { logger } from '../utils/logger';

export class LLMRecommendationService implements IRecommendationService {
  public name = 'LLM_Gemini';
  private mlFallback: MLRecommendationService;
  private genAI: GoogleGenerativeAI | null = null;

  constructor() {
    this.mlFallback = new MLRecommendationService();
    if (config.geminiApiKey) {
      try {
        this.genAI = new GoogleGenerativeAI(config.geminiApiKey);
      } catch (err: any) {
        logger.warn('Failed to initialize Google Generative AI client:', err.message);
      }
    }
  }

  public async generateRecommendation(
    student: StudentFeatureProfile,
    internship: InternshipFeatureProfile,
    weights?: ScoringWeights
  ): Promise<CompatibilityResult> {
    // Start with deterministic ML baseline
    const baseResult = await this.mlFallback.generateRecommendation(student, internship, weights);

    // If no LLM client configured, return base ML result
    if (!this.genAI || !config.geminiApiKey) {
      return baseResult;
    }

    try {
      const model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

      const prompt = `You are an AI career advisor for the Government of India's PM Internship Scheme.
Evaluate this student candidate against this internship opportunity.

Candidate Profile:
- Name: ${student.name}
- Education: ${student.highestEducation ? `${student.highestEducation.degree} in ${student.highestEducation.branch} from ${student.highestEducation.institute} (CGPA: ${student.highestEducation.cgpaOrPercentage})` : 'Not specified'}
- Skills: ${student.skills.map((s) => `${s.name} (${s.proficiencyLevel})`).join(', ')}
- Projects: ${student.projects.map((p) => `${p.title}: ${p.description}`).join('; ')}
- Career Goals: ${student.careerGoal || 'Growth in core engineering and technology'}
- Preferred Location: ${student.preferredLocations.join(', ') || 'Any'}

Internship:
- Title: ${internship.title}
- Organization: ${internship.organizationName}
- Domain: ${internship.domain}
- Required Skills: ${internship.requiredSkills.map((s) => s.name).join(', ')}
- Preferred Skills: ${internship.preferredSkills.map((s) => s.name).join(', ')}
- Location: ${internship.location}, ${internship.state} (${internship.workMode})
- Description: ${internship.description}

Provide:
1. Two concise, personalized bullet points explaining WHY this internship suits the candidate.
2. One constructive skill gap or learning tip.

Format your response strictly as JSON with keys:
{
  "personalizedReasons": ["bullet 1", "bullet 2"],
  "learningAdvice": "advice string",
  "semanticScoreBoost": 0
}`;

      const response = await model.generateContent(prompt);
      const text = response.response.text();
      const cleaned = text.replace(/```json/g, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(cleaned);

      if (parsed.personalizedReasons && Array.isArray(parsed.personalizedReasons)) {
        baseResult.reasons = [
          ...parsed.personalizedReasons.map((r: string) => `✓ ${r}`),
          ...baseResult.reasons.slice(0, 2),
        ].slice(0, 5);
      }

      if (parsed.learningAdvice) {
        baseResult.reasons.push(`△ ${parsed.learningAdvice}`);
      }

      baseResult.engineMode = 'LLM';
      return baseResult;
    } catch (err: any) {
      logger.warn('LLM enrichment skipped or timed out, using deterministic ML result:', err.message);
      return baseResult;
    }
  }

  public async batchRecommend(
    student: StudentFeatureProfile,
    internships: InternshipFeatureProfile[],
    weights?: ScoringWeights
  ): Promise<CompatibilityResult[]> {
    // Generate base ML recommendations first
    const baseResults = await this.mlFallback.batchRecommend(student, internships, weights);

    // If LLM configured, enrich top 5 recommendations with deeper LLM insights
    if (this.genAI && config.geminiApiKey) {
      const topCount = Math.min(5, baseResults.length);
      for (let i = 0; i < topCount; i++) {
        const intern = internships.find((item) => item.id === baseResults[i].internshipId);
        if (intern) {
          try {
            baseResults[i] = await this.generateRecommendation(student, intern, weights);
          } catch {
            // continue with fallback
          }
        }
      }
    }

    return baseResults;
  }
}
