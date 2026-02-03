import OpenAI from "openai";
import type { SimilarityAnalysis } from '../types';

const apiKey = import.meta.env.VITE_API_KEY || process.env.API_KEY;
if (!apiKey) {
  console.warn("⚠️  API_KEY not found. Please set VITE_API_KEY in .env");
}

const openai = new OpenAI({
  apiKey: apiKey as string,
  dangerouslyAllowBrowser: true
});

/**
 * Calculates a deterministic AI probability based on linguistic markers
 * (Burstiness, Perplexity approximation, and stylistic variance)
 */
function calculateLinguisticAIProbability(text: string): number {
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
  if (sentences.length === 0) return 0;

  const sentenceWordCounts = sentences.map(s => s.trim().split(/\s+/).length);
  const avgSentenceLength = sentenceWordCounts.reduce((a, b) => a + b, 0) / sentences.length;

  // 1. BURSTINESS (Variance in sentence length)
  // AI tends to have consistent sentence lengths (low variance)
  const variance = sentenceWordCounts.reduce((a, b) => a + Math.pow(b - avgSentenceLength, 2), 0) / sentences.length;
  const burstinessScore = Math.min(100, Math.max(0, 100 - (Math.sqrt(variance) * 5))); // Lower variance = Higher AI probability

  // 2. VOCABULARY DIVERSITY (Type-Token Ratio)
  // AI often uses a more repetitive/optimized vocabulary
  const words = text.toLowerCase().match(/\b\w+\b/g) || [];
  const uniqueWords = new Set(words);
  const ttr = words.length > 0 ? uniqueWords.size / words.length : 1;
  const vocabScore = Math.min(100, Math.max(0, (1 - ttr) * 200)); // Lower diversity = Higher AI probability

  // 3. COMMON AI CONNECTORS
  const aiConnectors = ['additionally', 'moreover', 'furthermore', 'consequently', 'in conclusion', 'it is important to note', 'testament to'];
  const connectorCount = words.filter(w => aiConnectors.includes(w)).length;
  const connectorScore = Math.min(100, (connectorCount / sentences.length) * 150);

  // Blended Heuristic Score (40% Burstiness, 40% Vocab, 20% Stylistic)
  return Math.round((burstinessScore * 0.4) + (vocabScore * 0.4) + (connectorScore * 0.2));
}

export const analyzeSemanticSimilarity = async (content: string): Promise<SimilarityAnalysis> => {
  try {
    console.log("Starting academic integrity analysis...");

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are a forensic academic integrity engine. You must analyze the submission using a strict tripartite mathematical model:

1. EXACT MATCH DETECTION (Weight: 1.0):
   - Identify character-for-character sequences (7+ words).
   - Flag as "exact".

2. PATCHWRITING DETECTION (Weight: 0.6):
   - Identify "Near-Duplicates" (0.70 – 0.80 structural/semantic similarity).
   - This includes "Rogeting" (swapping words while keeping structure).
   - Flag as "patchwriting".

3. SEMANTIC OVERLAP DETECTION (Weight: 0.2):
   - Analyze the overall thematic alignment with known academic works.
   - Summarize this as a global "semantic_overlap" score (0-100).

SCORING FORMULA:
Final Score = (Exact_Coverage × 1.0) + (Patchwriting_Coverage × 0.6) + (Semantic_Overlap × 0.2)

CRITICAL RULES:
- If EXACT similarity > 30%, identify as "High-risk" regardless of other scores.
- Return EXACT substrings from the input for segments.
- AI Score: Probability (0-100) of synthetic origin using Perplexity/Burstiness.`
        },
        {
          role: "user",
          content: `Perform a dual analysis (Similarity + AI Origin) on this submission:

${content}

Word count: ${content.split(/\s+/).filter(w => w.length > 0).length} words`
        }
      ],
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "integrity_analysis",
          strict: true,
          schema: {
            type: "object",
            properties: {
              score: {
                type: "number",
                description: "Final Weighted Score using formula"
              },
              exact_similarity: {
                type: "number",
                description: "Percentage of words identified as exact matches"
              },
              patchwriting_similarity: {
                type: "number",
                description: "Percentage of words identified as patchwriting/near-duplicates"
              },
              semantic_overlap: {
                type: "number",
                description: "Overall thematic overlap score (0-100)"
              },
              aiScore: {
                type: "number",
                description: "AI Origin Probability (0-100)"
              },
              summary: {
                type: "string",
                description: "Executive summary."
              },
              riskLevel: {
                type: "string",
                enum: ["Acceptable", "Potential Patchwriting", "High-risk"],
                description: "Overall risk assessment"
              },
              suggestions: {
                type: "array",
                items: { type: "string" },
                description: "Revision strategies"
              },
              references: {
                type: "array",
                description: "Academic sources.",
                items: {
                  type: "object",
                  properties: {
                    title: { type: "string" },
                    url: { type: "string" }
                  },
                  required: ["title", "url"],
                  additionalProperties: false
                }
              },
              segments: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    text: { type: "string" },
                    similarity: { type: "number" },
                    type: { type: "string", enum: ["exact", "patchwriting", "semantic"] },
                    source: { type: "string" },
                    explanation: { type: "string" }
                  },
                  required: ["text", "similarity", "type", "source", "explanation"],
                  additionalProperties: false
                }
              }
            },
            required: ["score", "exact_similarity", "patchwriting_similarity", "semantic_overlap", "aiScore", "summary", "riskLevel", "suggestions", "segments", "references"],
            additionalProperties: false
          }
        }
      },
      temperature: 0.2, // Lower temperature for more consistent analysis
      top_p: 0.95,
      max_tokens: 4000
    });

    const responseContent = response.choices[0].message.content;
    if (!responseContent) throw new Error("No content in response");

    const parsed = JSON.parse(responseContent) as SimilarityAnalysis;

    // MATH-DRIVEN TRIPARTITE SCORING
    const wordPattern = /\b\w+\b/g;
    const totalWords = (content.match(wordPattern) || []).length;

    let exactMatchWords = 0;
    let patchwritingWords = 0;

    parsed.segments.forEach(seg => {
      const segmentWordCount = (seg.text.match(wordPattern) || []).length;
      if (seg.type === 'exact') exactMatchWords += segmentWordCount;
      if (seg.type === 'patchwriting') patchwritingWords += segmentWordCount;
    });

    const exactCoverage = totalWords > 0 ? (exactMatchWords / totalWords) * 100 : 0;
    const patchwritingCoverage = totalWords > 0 ? (patchwritingWords / totalWords) * 100 : 0;
    const semanticOverlap = parsed.semantic_overlap;

    // Formula: (Exact × 1.0) + (Patchwriting × 0.6) + (Semantic × 0.2)
    const finalSimilarityScore = Math.min(100, Math.round(
      (exactCoverage * 1.0) +
      (patchwritingCoverage * 0.6) +
      (semanticOverlap * 0.2)
    ));

    parsed.exact_similarity = Math.round(exactCoverage * 10) / 10;
    parsed.patchwriting_similarity = Math.round(patchwritingCoverage * 10) / 10;
    parsed.score = finalSimilarityScore;

    // AI Score Blending
    const heuristicAiScore = calculateLinguisticAIProbability(content);
    parsed.aiScore = Math.round((parsed.aiScore * 0.6) + (heuristicAiScore * 0.4));

    // Risk Classification (Logic: if exact > 30% -> High risk)
    const expectedRisk = (parsed.exact_similarity > 30 || parsed.score > 40) ? "High-risk" :
      (parsed.score >= 15) ? "Potential Patchwriting" : "Acceptable";

    parsed.riskLevel = expectedRisk;

    return parsed;
  } catch (e) {
    console.error("Failed to analyze content:", e);
    if (e instanceof Error) {
      console.error("Error message:", e.message);
      console.error("Error stack:", e.stack);
    }
    throw new Error(`Analysis failed: ${e instanceof Error ? e.message : 'Unknown error'}`);
  }
};

export const getWritingSuggestions = async (content: string): Promise<string> => {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are a writing coach. Provide 3-5 specific, actionable suggestions to improve academic writing quality, clarity, and originality. Focus on structure, argumentation, and voice development."
        },
        {
          role: "user",
          content: `Provide writing improvement suggestions for this text:\n\n${content}`
        }
      ],
      temperature: 0.7,
      max_tokens: 500
    });

    return response.choices[0].message.content || "No suggestions available.";
  } catch (e) {
    console.error("Failed to get writing suggestions:", e);
    return "Unable to generate suggestions at this time.";
  }
};

export const paraphraseSentence = async (sentence: string): Promise<string[]> => {
  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: "You are an ethical writing coach for a university student."
      },
      {
        role: "user",
        content: `Provide 3 sophisticated academic paraphrases of the following text. 
               The variations must maintain the exact meaning but use different sentence structures and vocabulary.
               Focus on avoiding word-for-word similarity while maintaining high formal tone.
               Input: "${sentence}"`
      }
    ],
    response_format: {
      type: "json_schema",
      json_schema: {
        name: "paraphrase_variations",
        strict: true,
        schema: {
          type: "object",
          properties: {
            variations: {
              type: "array",
              items: { type: "string" }
            }
          },
          required: ["variations"],
          additionalProperties: false
        }
      }
    }
  });

  try {
    const content = response.choices[0].message.content;
    if (!content) return ["Error generating paraphrases."];
    const data = JSON.parse(content);
    return data.variations;
  } catch (e) {
    return ["Error generating paraphrases. Please try again."];
  }
};

