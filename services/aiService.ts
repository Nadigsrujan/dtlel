import OpenAI from "openai";
import type { SimilarityAnalysis } from '../types';
import nlp from 'compromise';

const getApiKey = () => {
  if (typeof import.meta !== 'undefined' && import.meta.env) {
    return import.meta.env.VITE_API_KEY;
  }
  return process.env.API_KEY || process.env.OPENAI_API_KEY;
};

const apiKey = getApiKey();
if (!apiKey) {
  console.warn("⚠️  API_KEY not found. Please set VITE_API_KEY in .env");
}

const openai = new OpenAI({
  apiKey: apiKey as string,
  dangerouslyAllowBrowser: true
});

// ============================================================================
// CORE AI DETECTION LOGIC (LLM-SPECIFIC PATTERN ANALYSIS)
// ============================================================================

/**
 * Detects AI-generated text by looking for LLM-specific patterns.
 * IMPORTANT: Formal writing is NOT automatically AI. 
 * We look for specific "LLM fingerprints" that humans rarely produce.
 */
async function detectAIGenerated(text: string): Promise<{ aiScore: number, explanation: string }> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are an expert at detecting AI-GENERATED text (from ChatGPT, Claude, GPT-4, etc).

AI DETECTION PATTERNS (score HIGH if present):

1. **Educational "Explainer" Style**:
   - Text that explains a concept broadly without personal insight
   - Covers multiple aspects superficially (breadth over depth)
   - Sounds like a Wikipedia summary or textbook introduction
   - Example: "X is one of the most influential... revolutionized... at the core of X is..."

2. **LLM-Specific Phrases**:
   - "It's important to note", "It's worth mentioning"
   - "On one hand... on the other hand"
   - "In conclusion", "Overall", "To summarize"
   - "significantly", "revolutionized", "fundamental"

3. **Structural Patterns**:
   - Intro → Multiple points → Conclusion format
   - Each paragraph covers a different aspect
   - Balanced, comprehensive coverage of a topic
   - No personal opinions or unique insights

4. **Content Characteristics**:
   - Explains what something IS rather than arguing a point
   - No specific dates, names, or citations
   - Generic examples instead of concrete ones
   - Reads like an answer to "Explain X to me"

CRITICAL: If text reads like a response to "Write me an explanation of [topic]", it's likely AI (score 70+).

THESE ARE HUMAN INDICATORS (score LOW):
- Personal anecdotes or experiences
- Specific citations with dates/authors
- Unique opinions or controversial takes
- Conversational tone with personality

ACTUAL WIKIPEDIA/ENCYCLOPEDIA TEXT (score 30-40%, NOT AI):
- Uses em-dashes (—) for parenthetical info
- Has very precise, factual definitions
- Contains specific technical terminology without explanation
- NO "Overall", "In conclusion", or summary paragraphs
- Structured as encyclopedia entries, not explanations
- Example: "A robot is a machine—especially one programmable by a computer—capable of..."
- If text looks like it was COPIED from Wikipedia (not written about a Wikipedia topic), score LOW

SCORING:
- 80-100%: Clearly AI-generated explainer content
- 60-79%: Likely AI-assisted or edited AI
- 40-59%: Could be either, some patterns present
- 0-39%: Human-written with clear voice/specifics

OUTPUT JSON: { "ai_probability": number, "reasoning": string }`
        },
        {
          role: "user",
          content: `ANALYZE FOR AI GENERATION:\n\n${text}`
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.0,
      seed: 12345,
      top_p: 0.1,
      max_tokens: 1000
    });

    const content = response.choices[0].message.content;
    if (!content) throw new Error("No analysis returned");
    const result = JSON.parse(content);

    return {
      aiScore: result.ai_probability || 0,
      explanation: result.reasoning || "No explanation provided."
    };

  } catch (error) {
    console.error("AI detection failed:", error);
    return { aiScore: 0, explanation: "Analysis failed." };
  }
}

// ============================================================================
// PLAGIARISM/SIMILARITY DETECTION (INTERNET SOURCE MATCHING)
// ============================================================================

/**
 * Detects if text was copied from existing internet sources.
 * This is SEPARATE from AI detection - copied human text is plagiarism, not AI.
 */
async function detectPlagiarism(text: string): Promise<{ score: number, segments: any[], isFromInternet: boolean, specificSource: string, allSources: string[] }> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are an EXPERT PLAGIARISM DETECTION system that identifies SPECIFIC SOURCES.

YOUR TASK: Analyze text and identify WHERE it was copied from with SPECIFIC source names.

SOURCE IDENTIFICATION RULES:

1. **Academic/Research Sources** - Be SPECIFIC:
   - arXiv papers (e.g., "arXiv - Attention Is All You Need")
   - IEEE/ACM publications
   - Nature, Science journals
   - Conference papers (NeurIPS, ICML, etc.)
   - For transformer/AI content: likely from "arXiv - Vaswani et al. 2017" or Wikipedia

2. **Wikipedia** - Identify the article:
   - "Wikipedia - Transformer (machine learning model)"
   - "Wikipedia - Deep learning"
   - "Wikipedia - Neural network"

3. **Educational/Textbook**:
   - "Deep Learning textbook (Goodfellow et al.)"
   - "Stanford CS229 course materials"
   - "MIT OpenCourseWare"

4. **News/Blogs**:
   - "Towards Data Science"
   - "Medium AI articles"
   - "TechCrunch", "Wired", etc.

SEGMENT ANALYSIS:
For each distinct paragraph or section, identify:
- The specific text segment
- The most likely source (BE SPECIFIC - use actual names)
- Similarity percentage (how closely it matches known content)

SCORING:
- 85-100%: Verbatim or near-verbatim from identifiable source
- 70-84%: Heavily paraphrased from known source
- 50-69%: Common explanations found in multiple sources
- 0-49%: Likely original

OUTPUT JSON:
{
  "score": number,
  "is_from_internet": boolean,
  "specific_source": string (PRIMARY source - be specific like "Wikipedia - Transformer (machine learning)" or "arXiv - Attention Is All You Need"),
  "all_sources": [string] (list ALL identified sources),
  "segments": [
    {
      "text": string (the copied portion, 50-150 chars),
      "source": string (SPECIFIC source name),
      "similarity": number (0-100)
    }
  ]
}`
        },
        {
          role: "user",
          content: `ANALYZE FOR PLAGIARISM:\n\n${text}`
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.0,
      seed: 12345,
      top_p: 0.1,
    });

    const content = response.choices[0].message.content;
    const result = content ? JSON.parse(content) : { score: 0, segments: [], is_from_internet: false, specific_source: "none", all_sources: [] };
    
    // Only trust "isFromInternet" if there's an actual specific source
    const hasSpecificSource = result.specific_source && result.specific_source !== "none" && result.specific_source !== "";
    
    // Format segments with proper type field for UI display
    const formattedSegments = (result.segments || []).map((seg: any) => ({
      text: seg.text || "",
      source: seg.source || result.specific_source || "Unknown source",
      similarity: (seg.similarity || 0) / 100, // Convert to 0-1 range
      type: 'exact' as const
    }));
    
    return {
      score: result.score || 0,
      segments: formattedSegments,
      isFromInternet: hasSpecificSource && result.is_from_internet,
      specificSource: result.specific_source || "none",
      allSources: result.all_sources || []
    };
  } catch (error) {
    console.error("Plagiarism detection failed:", error);
    return { score: 0, segments: [], isFromInternet: false, specificSource: "none", allSources: [] };
  }
}

// ============================================================================
// MAIN ANALYSIS FUNCTION
// ============================================================================

export const analyzeSemanticSimilarity = async (rawContent: string): Promise<SimilarityAnalysis> => {
  const content = rawContent.replace(/\r?\n|\r/g, ' ').replace(/\s+/g, ' ').trim();
  
  console.log("Starting Analysis...");

  // Run AI and Plagiarism detection in parallel
  const [aiResult, plagiarismResult] = await Promise.all([
    detectAIGenerated(content),
    detectPlagiarism(content)
  ]);

  console.log(`[LLM] AI: ${aiResult.aiScore}% | Plagiarism: ${plagiarismResult.score}% | Source: ${plagiarismResult.specificSource}`);

  let finalAiScore = aiResult.aiScore;
  let finalPlagiarismScore = plagiarismResult.score;
  const confirmedSource = plagiarismResult.specificSource;
  const segments = plagiarismResult.segments || [];

  // NEW SCORING PHILOSOPHY:
  // - Report BOTH AI and plagiarism scores accurately
  // - AI-generated text about common topics WILL match Wikipedia/sources
  // - Don't suppress AI score just because sources were found
  // - Only reduce scores when there's clear evidence one dominates
  
  // CASE 1: BOTH HIGH (AI >= 60% AND Plagiarism >= 70%)
  // This means: AI generated text that sounds like existing sources
  // Report BOTH scores - user needs to know it's AI-written but sounds like copied content
  if (aiResult.aiScore >= 60 && finalPlagiarismScore >= 70) {
    console.log("Detected: AI-GENERATED text that matches existing sources.");
    // Keep both scores high - this is accurate
    finalAiScore = aiResult.aiScore;
    // Slightly reduce plagiarism since content may be AI-regenerated, not copied
    finalPlagiarismScore = Math.max(finalPlagiarismScore - 15, 50);
  }
  // CASE 2: HIGH PLAGIARISM, LOW AI (Plagiarism >= 70%, AI < 40%)
  // This is truly copied human text
  else if (finalPlagiarismScore >= 70 && aiResult.aiScore < 40) {
    console.log(`COPIED CONTENT: From "${plagiarismResult.specificSource}"`);
    finalAiScore = aiResult.aiScore;
  }
  // CASE 3: HIGH AI, MODERATE/LOW PLAGIARISM (AI >= 60%, Plagiarism < 70%)
  // AI-generated content, reduce plagiarism since it's regenerated not copied
  else if (aiResult.aiScore >= 60 && finalPlagiarismScore < 70) {
    console.log("Detected: AI-GENERATED content.");
    finalAiScore = aiResult.aiScore;
    finalPlagiarismScore = Math.min(finalPlagiarismScore, 30);
  }
  // CASE 4: LOW BOTH - Original human writing
  else if (aiResult.aiScore < 40 && finalPlagiarismScore < 50) {
    console.log("Detected: Likely original human writing.");
  }
  // CASE 5: MODERATE SIGNALS - Report as-is
  else {
    console.log("Detected: Mixed signals - reporting raw scores.");
  }

  // Determine Risk Level
  let riskLevel: 'Acceptable' | 'Potential Patchwriting' | 'High-risk' = 'Acceptable';
  if (finalAiScore > 70 || finalPlagiarismScore > 60) riskLevel = 'High-risk';
  else if (finalAiScore > 40 || finalPlagiarismScore > 30) riskLevel = 'Potential Patchwriting';

  // Generate Summary
  let summary = "";
  if (finalAiScore >= 60 && finalPlagiarismScore >= 50) {
    // Both high - AI generated content that sounds like existing sources
    summary = `⚠️ AI-GENERATED (${finalAiScore}%) content that resembles existing sources (${finalPlagiarismScore}% similarity to ${confirmedSource || 'online content'}). ${aiResult.explanation}`;
  } else if (finalAiScore >= 60) {
    summary = `High probability of AI generation (${finalAiScore}%). ${aiResult.explanation}`;
  } else if (finalPlagiarismScore > 50) {
    summary = `⚠️ High similarity to external sources (${finalPlagiarismScore}%). Likely copied from ${confirmedSource || 'online sources'}.`;
  } else if (finalAiScore > 30 || finalPlagiarismScore > 20) {
    summary = `Mixed signals detected. Some characteristics suggest AI assistance or borrowed content.`;
  } else {
    summary = `This appears to be original human writing with no significant AI or plagiarism indicators.`;
  }

  // Build references from identified sources
  const allSources = plagiarismResult.allSources || [];
  if (confirmedSource && confirmedSource !== "none" && !allSources.includes(confirmedSource)) {
    allSources.unshift(confirmedSource);
  }
  const references = allSources.map(src => ({ title: src, url: src }));

  return {
    score: Math.round(finalPlagiarismScore),
    exact_similarity: Math.round(finalPlagiarismScore),
    patchwriting_similarity: 0,
    semantic_overlap: 0,
    aiScore: Math.round(finalAiScore),
    summary,
    riskLevel,
    suggestions: [],
    segments,
    references
  };
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
      seed: 123,
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


