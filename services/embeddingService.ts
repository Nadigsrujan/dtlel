import OpenAI from "openai";

const apiKey = process.env.API_KEY;
const openai = new OpenAI({
    apiKey: apiKey as string,
    dangerouslyAllowBrowser: true
});

/**
 * Generate embeddings for text segments using OpenAI's embedding model
 */
export async function generateEmbeddings(texts: string[]): Promise<number[][]> {
    try {
        const response = await openai.embeddings.create({
            model: "text-embedding-3-small",
            input: texts,
        });

        return response.data.map(item => item.embedding);
    } catch (error) {
        console.error("Failed to generate embeddings:", error);
        throw error;
    }
}

/**
 * Calculate cosine similarity between two vectors
 */
export function cosineSimilarity(vecA: number[], vecB: number[]): number {
    if (vecA.length !== vecB.length) {
        throw new Error("Vectors must have the same length");
    }

    let dotProduct = 0;
    let normA = 0;
    let normB = 0;

    for (let i = 0; i < vecA.length; i++) {
        dotProduct += vecA[i] * vecB[i];
        normA += vecA[i] * vecA[i];
        normB += vecB[i] * vecB[i];
    }

    normA = Math.sqrt(normA);
    normB = Math.sqrt(normB);

    if (normA === 0 || normB === 0) {
        return 0;
    }

    return dotProduct / (normA * normB);
}
