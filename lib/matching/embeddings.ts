const OPENAI_API_KEY = process.env.OPENAI_API_KEY ?? "";
const OPENAI_BASE_URL = process.env.OPENAI_BASE_URL ?? "https://api.openai.com/v1";
const OPENAI_EMBEDDING_MODEL = process.env.OPENAI_EMBEDDING_MODEL ?? "text-embedding-3-small";
const MATCH_USE_EMBEDDINGS = process.env.MATCH_USE_EMBEDDINGS ?? "true";

const truncateText = (text: string, limit = 8000) => {
  if (text.length <= limit) return text;
  return text.slice(0, limit);
};

export const shouldUseEmbeddings = () =>
  Boolean(OPENAI_API_KEY) && MATCH_USE_EMBEDDINGS.toLowerCase() !== "false";

export type EmbeddingBatch = {
  vectors: number[][];
  model: string;
  provider: "openai";
};

export const embedTexts = async (texts: string[]): Promise<EmbeddingBatch | null> => {
  if (!shouldUseEmbeddings()) return null;

  const cleaned = texts.map((text) => truncateText(text));

  const response = await fetch(`${OPENAI_BASE_URL}/embeddings`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model: OPENAI_EMBEDDING_MODEL,
      input: cleaned
    })
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || "Embedding request failed");
  }

  const data = (await response.json()) as {
    data: Array<{ embedding: number[] }>;
    model: string;
  };

  const vectors = data.data.map((item) => item.embedding);

  return {
    vectors,
    model: data.model ?? OPENAI_EMBEDDING_MODEL,
    provider: "openai"
  };
};
