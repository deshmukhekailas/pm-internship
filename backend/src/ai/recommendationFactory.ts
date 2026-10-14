import { IRecommendationService } from './recommendationService.interface';
import { RuleBasedRecommendationService } from './ruleBasedRecommendationService';
import { MLRecommendationService } from './mlRecommendationService';
import { LLMRecommendationService } from './llmRecommendationService';
import { config } from '../config/env';

export class RecommendationFactory {
  private static ruleBasedService = new RuleBasedRecommendationService();
  private static mlService = new MLRecommendationService();
  private static llmService = new LLMRecommendationService();

  public static getService(provider?: string): IRecommendationService {
    const selected = provider || config.aiProvider;

    switch (selected.toUpperCase()) {
      case 'RULE_BASED':
        return this.ruleBasedService;
      case 'GEMINI':
      case 'LLM':
      case 'HYBRID':
        return config.geminiApiKey ? this.llmService : this.mlService;
      case 'LOCAL_ML':
      default:
        return this.mlService;
    }
  }
}
