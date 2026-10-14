import { IRecommendationService } from './recommendationService.interface';
import {
  StudentFeatureProfile,
  InternshipFeatureProfile,
  CompatibilityResult,
  ScoringWeights,
} from '../recommendation/types';
import { EligibilityEngine } from '../recommendation/eligibilityEngine';
import { ScoringEngine, DEFAULT_WEIGHTS } from '../recommendation/scoringEngine';

export class MLRecommendationService implements IRecommendationService {
  public name = 'ML_TFIDF';

  public async generateRecommendation(
    student: StudentFeatureProfile,
    internship: InternshipFeatureProfile,
    weights: ScoringWeights = DEFAULT_WEIGHTS
  ): Promise<CompatibilityResult> {
    // 1. Mandatory Eligibility Check
    const eligibility = EligibilityEngine.evaluate(student, internship);

    // 2. Multi-factor Scoring with TF-IDF and Cosine similarity
    const result = ScoringEngine.calculate(student, internship, eligibility, weights);
    result.engineMode = 'LOCAL_ML';

    return result;
  }

  public async batchRecommend(
    student: StudentFeatureProfile,
    internships: InternshipFeatureProfile[],
    weights: ScoringWeights = DEFAULT_WEIGHTS
  ): Promise<CompatibilityResult[]> {
    const results: CompatibilityResult[] = [];

    for (const internship of internships) {
      const scoreResult = await this.generateRecommendation(student, internship, weights);
      results.push(scoreResult);
    }

    // Rank descending by compatibility score
    return results.sort((a, b) => b.compatibilityScore - a.compatibilityScore);
  }
}
