const STOPWORDS = new Set([
  "a",
  "about",
  "above",
  "after",
  "again",
  "against",
  "all",
  "am",
  "an",
  "and",
  "any",
  "are",
  "as",
  "at",
  "be",
  "because",
  "been",
  "before",
  "being",
  "below",
  "between",
  "both",
  "but",
  "by",
  "can",
  "could",
  "did",
  "do",
  "does",
  "doing",
  "down",
  "during",
  "each",
  "few",
  "for",
  "from",
  "further",
  "had",
  "has",
  "have",
  "having",
  "he",
  "her",
  "here",
  "hers",
  "herself",
  "him",
  "himself",
  "his",
  "how",
  "i",
  "if",
  "in",
  "into",
  "is",
  "it",
  "its",
  "itself",
  "just",
  "me",
  "more",
  "most",
  "my",
  "myself",
  "no",
  "nor",
  "not",
  "now",
  "of",
  "off",
  "on",
  "once",
  "only",
  "or",
  "other",
  "our",
  "ours",
  "ourselves",
  "out",
  "over",
  "own",
  "same",
  "she",
  "should",
  "so",
  "some",
  "such",
  "than",
  "that",
  "the",
  "their",
  "theirs",
  "them",
  "themselves",
  "then",
  "there",
  "these",
  "they",
  "this",
  "those",
  "through",
  "to",
  "too",
  "under",
  "until",
  "up",
  "very",
  "was",
  "we",
  "were",
  "what",
  "when",
  "where",
  "which",
  "while",
  "who",
  "whom",
  "why",
  "with",
  "you",
  "your",
  "yours",
  "yourself",
  "yourselves"
]);

export type JDInput = {
  id: string;
  title: string;
  text: string;
};

export type ResumeInput = {
  id: string;
  name: string;
  text: string;
};

export type MatchResult = {
  resumeId: string;
  resumeName: string;
  jdId: string;
  jdTitle: string;
  score: number;
  method: "evidence" | "embedding+evidence";
  embeddingScore?: number | null;
  evidence: string[];
  gaps: string[];
};

export type MatchResponse = {
  results: MatchResult[];
  bestByResume: Record<string, MatchResult>;
};

export type EmbeddingOptions = {
  jdEmbeddings?: number[][];
  resumeEmbeddings?: number[][];
  embeddingWeight?: number;
};

const splitSentences = (text: string) =>
  text
    .replace(/\r/g, "")
    .split(/\n|\.|\?|!/)
    .map((chunk) => chunk.trim())
    .filter((chunk) => chunk.length > 0);

const tokenize = (text: string) => {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9+\s]/g, " ")
    .split(/\s+/)
    .map((token) => token.trim())
    .filter((token) => token.length > 2)
    .filter((token) => !STOPWORDS.has(token));
};

const buildFrequency = (tokens: string[]) => {
  const map = new Map<string, number>();
  tokens.forEach((token) => {
    map.set(token, (map.get(token) ?? 0) + 1);
  });
  return map;
};

const topTokens = (tokens: string[], limit = 6) => {
  const freq = buildFrequency(tokens);
  return [...freq.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([token]) => token);
};

const clampScore = (value: number) => Math.max(0, Math.min(100, Math.round(value)));

const extractEvidence = (resumeText: string, overlapTokens: string[]) => {
  if (!resumeText) return [];
  const sentences = splitSentences(resumeText);
  const evidence: string[] = [];
  sentences.forEach((sentence) => {
    const lower = sentence.toLowerCase();
    if (overlapTokens.some((token) => lower.includes(token))) {
      evidence.push(sentence);
    }
  });
  if (evidence.length > 0) {
    return evidence.slice(0, 3);
  }
  return overlapTokens.slice(0, 3);
};

const cosineSimilarity = (a: number[], b: number[]) => {
  if (a.length !== b.length || a.length === 0) return 0;
  let dot = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < a.length; i += 1) {
    dot += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  if (normA === 0 || normB === 0) return 0;
  return dot / (Math.sqrt(normA) * Math.sqrt(normB));
};

const scorePair = (
  jdText: string,
  resumeText: string,
  embeddingSimilarity?: number | null,
  embeddingWeight = 0.7
) => {
  const jdTokens = tokenize(jdText);
  const resumeTokens = tokenize(resumeText);

  if (jdTokens.length === 0 || resumeTokens.length === 0) {
    return {
      score: 0,
      method: "evidence" as const,
      embeddingScore: null,
      evidence: [],
      gaps: []
    };
  }

  const jdSet = new Set(jdTokens);
  const resumeSet = new Set(resumeTokens);
  const overlap = jdTokens.filter((token) => resumeSet.has(token));
  const overlapUnique = [...new Set(overlap)];

  const coverage = overlapUnique.length / new Set(jdTokens).size;
  const jaccard = overlapUnique.length / new Set([...jdSet, ...resumeSet]).size;

  const tokenScore = 100 * (0.65 * coverage + 0.35 * jaccard);
  let finalScore = tokenScore;
  let embeddingScore: number | null = null;
  let method: MatchResult["method"] = "evidence";

  if (typeof embeddingSimilarity === "number") {
    const normalized = Math.max(0, Math.min(1, (embeddingSimilarity + 1) / 2));
    embeddingScore = clampScore(normalized * 100);
    finalScore = 100 * (embeddingWeight * normalized + (1 - embeddingWeight) * coverage);
    method = "embedding+evidence";
  }

  const evidence = extractEvidence(resumeText, overlapUnique);
  const gaps = topTokens(jdTokens.filter((token) => !resumeSet.has(token)), 5);

  return {
    score: clampScore(finalScore),
    method,
    embeddingScore,
    evidence,
    gaps
  };
};

export const computeMatches = (
  jds: JDInput[],
  resumes: ResumeInput[],
  options: EmbeddingOptions = {}
): MatchResponse => {
  const results: MatchResult[] = [];
  const bestByResume: Record<string, MatchResult> = {};
  const embeddingWeight = options.embeddingWeight ?? 0.7;

  resumes.forEach((resume, resumeIndex) => {
    let bestMatch: MatchResult | null = null;
    jds.forEach((jd, jdIndex) => {
      const jdEmbedding = options.jdEmbeddings?.[jdIndex];
      const resumeEmbedding = options.resumeEmbeddings?.[resumeIndex];
      const similarity =
        jdEmbedding && resumeEmbedding ? cosineSimilarity(jdEmbedding, resumeEmbedding) : null;
      const { score, method, embeddingScore, evidence, gaps } = scorePair(
        jd.text,
        resume.text,
        similarity,
        embeddingWeight
      );
      const match: MatchResult = {
        resumeId: resume.id,
        resumeName: resume.name,
        jdId: jd.id,
        jdTitle: jd.title,
        score,
        method,
        embeddingScore,
        evidence,
        gaps
      };
      results.push(match);
      if (!bestMatch || match.score > bestMatch.score) {
        bestMatch = match;
      }
    });

    if (bestMatch) {
      bestByResume[resume.id] = bestMatch;
    }
  });

  return { results, bestByResume };
};
