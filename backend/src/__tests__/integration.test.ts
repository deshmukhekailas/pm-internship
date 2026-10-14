import { describe, it, expect } from 'vitest';
import { hashPassword, comparePassword } from '../utils/hash';
import { generateAccessToken, generateRefreshToken, verifyAccessToken, verifyRefreshToken } from '../utils/jwt';
import { RecommendationFactory } from '../ai/recommendationFactory';

describe('Security & Auth Utilities', () => {
  it('should correctly hash and verify passwords', async () => {
    const raw = 'SecureGovPass@123';
    const hashed = await hashPassword(raw);
    expect(hashed).not.toBe(raw);
    const valid = await comparePassword(raw, hashed);
    expect(valid).toBe(true);

    const invalid = await comparePassword('WrongPassword', hashed);
    expect(invalid).toBe(false);
  });

  it('should generate and verify JWT access and refresh tokens', () => {
    const payload = { userId: 'usr-123', email: 'applicant@pminternship.gov.in', role: 'STUDENT' as const };
    const accessToken = generateAccessToken(payload);
    expect(typeof accessToken).toBe('string');

    const decoded = verifyAccessToken(accessToken);
    expect(decoded.userId).toBe('usr-123');
    expect(decoded.role).toBe('STUDENT');

    const refreshToken = generateRefreshToken(payload);
    const decodedRefresh = verifyRefreshToken(refreshToken);
    expect(decodedRefresh.userId).toBe('usr-123');
  });
});

describe('AI Recommendation Factory', () => {
  it('should instantiate RULE_BASED service strategy', () => {
    const service = RecommendationFactory.getService('RULE_BASED');
    expect(service.name).toBe('RuleBased');
  });

  it('should instantiate LOCAL_ML service strategy', () => {
    const service = RecommendationFactory.getService('LOCAL_ML');
    expect(service.name).toBe('ML_TFIDF');
  });

  it('should fallback cleanly to ML_TFIDF on invalid strategy parameter or missing API key', () => {
    const service = RecommendationFactory.getService('UNKNOWN_STRATEGY');
    expect(service.name).toBe('ML_TFIDF');
  });
});
