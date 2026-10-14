/**
 * TF-IDF and Cosine Similarity Vectorizer
 * Implements deterministic text processing, tokenization, stop-word filtering,
 * TF-IDF weight calculation, and Cosine Similarity.
 */

const STOP_WORDS = new Set([
  'a', 'about', 'above', 'after', 'again', 'against', 'all', 'am', 'an', 'and',
  'any', 'are', 'aren\'t', 'as', 'at', 'be', 'because', 'been', 'before', 'being',
  'below', 'between', 'both', 'but', 'by', 'can', 'cannot', 'could', 'did', 'do',
  'does', 'doing', 'down', 'during', 'each', 'few', 'for', 'from', 'further', 'had',
  'has', 'have', 'having', 'he', 'her', 'here', 'hers', 'herself', 'him', 'himself',
  'his', 'how', 'i', 'if', 'in', 'into', 'is', 'isn\'t', 'it', 'its', 'itself',
  'me', 'more', 'most', 'my', 'myself', 'no', 'nor', 'not', 'of', 'off', 'on',
  'once', 'only', 'or', 'other', 'ought', 'our', 'ours', 'ourselves', 'out', 'over',
  'own', 'same', 'she', 'should', 'so', 'some', 'such', 'than', 'that', 'the',
  'their', 'theirs', 'them', 'themselves', 'then', 'there', 'these', 'they', 'this',
  'those', 'through', 'to', 'too', 'under', 'until', 'up', 'very', 'was', 'we',
  'were', 'what', 'when', 'where', 'which', 'while', 'who', 'whom', 'why', 'with',
  'would', 'you', 'your', 'yours', 'yourself', 'yourselves', 'will', 'shall', 'can',
  'worked', 'built', 'using', 'developed', 'created', 'including', 'responsible'
]);

export class TfIdfEngine {
  /**
   * Tokenize and preprocess text
   */
  public static tokenize(text: string): string[] {
    if (!text) return [];
    return text
      .toLowerCase()
      .replace(/[^a-z0-9+#.\s]/g, ' ')
      .split(/\s+/)
      .map((term) => term.trim())
      .filter((term) => term.length > 1 && !STOP_WORDS.has(term));
  }

  /**
   * Calculate term frequencies (TF) for a document
   */
  public static calculateTf(tokens: string[]): Map<string, number> {
    const tf = new Map<string, number>();
    if (tokens.length === 0) return tf;

    for (const token of tokens) {
      tf.set(token, (tf.get(token) || 0) + 1);
    }

    // Normalize TF
    for (const [token, count] of tf.entries()) {
      tf.set(token, count / tokens.length);
    }

    return tf;
  }

  /**
   * Compute Cosine Similarity between two text strings
   */
  public static cosineSimilarity(textA: string, textB: string): number {
    const tokensA = this.tokenize(textA);
    const tokensB = this.tokenize(textB);

    if (tokensA.length === 0 || tokensB.length === 0) {
      return 0.0;
    }

    const tfA = this.calculateTf(tokensA);
    const tfB = this.calculateTf(tokensB);

    // Combine vocabulary
    const vocabulary = new Set<string>([...tfA.keys(), ...tfB.keys()]);

    let dotProduct = 0;
    let normA = 0;
    let normB = 0;

    for (const term of vocabulary) {
      const weightA = tfA.get(term) || 0;
      const weightB = tfB.get(term) || 0;

      dotProduct += weightA * weightB;
      normA += weightA * weightA;
      normB += weightB * weightB;
    }

    if (normA === 0 || normB === 0) {
      return 0.0;
    }

    const similarity = dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
    return Math.min(1.0, Math.max(0.0, similarity));
  }

  /**
   * Normalized Jaccard similarity between two sets of terms/skills
   */
  public static jaccardSimilarity(listA: string[], listB: string[]): number {
    const setA = new Set(listA.map((s) => s.toLowerCase().trim()));
    const setB = new Set(listB.map((s) => s.toLowerCase().trim()));

    if (setA.size === 0 && setB.size === 0) return 1.0;
    if (setA.size === 0 || setB.size === 0) return 0.0;

    let intersectionSize = 0;
    for (const item of setA) {
      if (setB.has(item)) {
        intersectionSize++;
      }
    }

    const unionSize = setA.size + setB.size - intersectionSize;
    return unionSize === 0 ? 0 : intersectionSize / unionSize;
  }
}
