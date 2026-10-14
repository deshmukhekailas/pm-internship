import { describe, it, expect } from 'vitest';
import { TfIdfEngine } from '../recommendation/tfidf';

describe('TfIdfEngine Unit Tests', () => {
  it('should tokenize text and remove punctuation & common stop words', () => {
    const text = 'Built an advanced AI machine learning model using Python and React!';
    const tokens = TfIdfEngine.tokenize(text);

    expect(tokens).toContain('advanced');
    expect(tokens).toContain('ai');
    expect(tokens).toContain('machine');
    expect(tokens).toContain('learning');
    expect(tokens).toContain('python');
    expect(tokens).toContain('react');
    // Stop words removed
    expect(tokens).not.toContain('an');
    expect(tokens).not.toContain('and');
  });

  it('should calculate non-zero cosine similarity for overlapping descriptions', () => {
    const docA = 'Python full stack web development with PostgreSQL and cloud deployment';
    const docB = 'Looking for Python web developer with PostgreSQL database knowledge';

    const similarity = TfIdfEngine.cosineSimilarity(docA, docB);
    expect(similarity).toBeGreaterThan(0.2);
    expect(similarity).toBeLessThanOrEqual(1.0);
  });

  it('should calculate zero similarity for completely orthogonal vocabulary', () => {
    const docA = 'organic agriculture soil fertility crop rotation';
    const docB = 'quantum cryptography laser optical semiconductor physics';

    const similarity = TfIdfEngine.cosineSimilarity(docA, docB);
    expect(similarity).toBe(0.0);
  });

  it('should compute Jaccard similarity between two arrays of skills', () => {
    const candidateSkills = ['Python', 'SQL', 'React', 'Docker'];
    const requiredSkills = ['Python', 'SQL', 'AWS'];

    const jaccard = TfIdfEngine.jaccardSimilarity(candidateSkills, requiredSkills);
    // Intersection: Python, SQL (2)
    // Union: Python, SQL, React, Docker, AWS (5)
    // 2 / 5 = 0.4
    expect(jaccard).toBeCloseTo(0.4, 2);
  });
});
