import {
  StudentFeatureProfile,
  InternshipFeatureProfile,
  CompatibilityResult,
  ScoringWeights,
} from '../recommendation/types';

export interface IRecommendationService {
  name: string;
  generateRecommendation(
    student: StudentFeatureProfile,
    internship: InternshipFeatureProfile,
    weights?: ScoringWeights
  ): Promise<CompatibilityResult>;

  batchRecommend(
    student: StudentFeatureProfile,
    internships: InternshipFeatureProfile[],
    weights?: ScoringWeights
  ): Promise<CompatibilityResult[]>;
}
