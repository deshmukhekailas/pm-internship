import { IRecommendationService } from './recommendationService.interface';
import {
  StudentFeatureProfile,
  InternshipFeatureProfile,
  CompatibilityResult,
  ScoringWeights,
} from '../recommendation/types';
import { EligibilityEngine } from '../recommendation/eligibilityEngine';
import { ScoringEngine, DEFAULT_WEIGHTS } from '../recommendation/scoringEngine';

export class RuleBasedRecommendationService implements IRecommendationService {
  public name = 'RuleBased';

  public async generateRecommendation(
    student: StudentFeatureProfile,
    internship: InternshipFeatureProfile,
    weights: ScoringWeights = DEFAULT_WEIGHTS
  ): Promise<CompatibilityResult> {
    const eligibility = EligibilityEngine.evaluate(student, internship);
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
      const res = await this.generateRecommendation(student, internship, weights);
      results.push(res);
    }
    return results.sort((a, b) => b.compatibilityScore - a.compatibilityScore);
  }
}
