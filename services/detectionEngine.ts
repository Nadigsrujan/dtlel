import OpenAI from "openai";
import nlp from 'compromise';

const apiKey = process.env.API_KEY;
const openai = new OpenAI({
    apiKey: apiKey as string,
    dangerouslyAllowBrowser: true
});

export interface DetectionSegment {
    exactText: string;
    matchType: "Exact Match" | "Near-Duplicate";
    similarityScore: number;
    sourceLabel: string;
    locationHint: number;
}

export interface DetectionResult {
    exactMatchPercentage: number;
    nearDuplicatePercentage: number;
    totalSimilarity: number;
    distributionPattern: "clustered" | "distributed";
    segments: DetectionSegment[];
}

/**
 * Split text into sentences for analysis
 */
function getSentences(text: string): string[] {
    return nlp(text).sentences().out('array') as string[];
}

/**
 * Main detection engine - uses LLM to detect plagiarism against its training corpus
 * This simulates a detection engine by using the LLM's implicit knowledge as corpus
 */
export async function detectSimilarity(text: string): Promise<DetectionResult> {
    if (!text || text.trim().length === 0) {
        return {
            exactMatchPercentage: 0,
            nearDuplicatePercentage: 0,
            totalSimilarity: 0,
            distributionPattern: "distributed",
            segments: []
        };
    }

    try {
        const response = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
                {
                    role: "system",
                    content: `You are a DETECTION ENGINE for academic plagiarism.

Your job is to identify text that matches your training data (academic papers, textbooks, etc.).

WHAT TO FLAG (be selective):
✓ Direct quotes without citation (3+ consecutive words identical)
✓ Paraphrased passages from specific sources (sentence structure preserved)
✓ Technical explanations copied from textbooks
✓ Definitions copied from academic sources
✓ Research findings described in the same way as published work

WHAT NOT TO FLAG:
✗ Common academic phrases ("in conclusion", "this paper discusses")
✗ Standard terminology and definitions in the field
✗ Generic topic sentences
✗ Original student analysis and synthesis
✗ Proper citations and quoted material

SCORING GUIDELINES:
- Exact match (verbatim): 0.9-1.0
- Close paraphrase (same structure, different words): 0.6-0.8
- Loose similarity (same concepts, different expression): 0.3-0.5

CRITICAL RULES:
1. Return EXACT substrings from the input (character-for-character)
2. Only flag segments if they genuinely match known sources
3. Calculate similarity % based on word count of flagged segments
4. Be CONSERVATIVE - when in doubt, don't flag
5. Segment text into logical blocks (3-7 sentences each)`
                },
                {
                    role: "user",
                    content: `DETECT plagiarism in this text:\n\n${text}`
                }
            ],
            response_format: {
                type: "json_schema",
                json_schema: {
                    name: "detection_results",
                    strict: true,
                    schema: {
                        type: "object",
                        properties: {
                            exactMatchPercentage: {
                                type: "number",
                                description: "Percentage of words in exact/near-exact matches"
                            },
                            nearDuplicatePercentage: {
                                type: "number",
                                description: "Percentage of words in paraphrased matches"
                            },
                            totalSimilarity: {
                                type: "number",
                                description: "Sum of exact and near-duplicate percentages"
                            },
                            distributionPattern: {
                                type: "string",
                                enum: ["clustered", "distributed"]
                            },
                            segments: {
                                type: "array",
                                items: {
                                    type: "object",
                                    properties: {
                                        exactText: {
                                            type: "string",
                                            description: "EXACT substring from input - must match character-for-character"
                                        },
                                        matchType: {
                                            type: "string",
                                            enum: ["Exact Match", "Near-Duplicate"]
                                        },
                                        similarityScore: {
                                            type: "number",
                                            description: "0.0 to 1.0 - how similar to known source"
                                        },
                                        sourceLabel: {
                                            type: "string",
                                            description: "Type of source: 'Academic paper', 'Textbook', 'Wikipedia', etc."
                                        },
                                        locationHint: {
                                            type: "number",
                                            description: "Approximate paragraph number (0-indexed)"
                                        }
                                    },
                                    required: ["exactText", "matchType", "similarityScore", "sourceLabel", "locationHint"],
                                    additionalProperties: false
                                }
                            }
                        },
                        required: ["exactMatchPercentage", "nearDuplicatePercentage", "totalSimilarity", "distributionPattern", "segments"],
                        additionalProperties: false
                    }
                }
            },
            temperature: 0.2,
            max_tokens: 4000
        });

        const content = response.choices[0].message.content;
        if (!content) throw new Error("No detection results");

        const result = JSON.parse(content) as DetectionResult;

        // Validate and recalculate percentages based on actual word coverage
        const totalWords = text.split(/\s+/).filter(w => w.length > 0).length;
        let exactWords = 0;
        let nearDuplicateWords = 0;

        result.segments.forEach(seg => {
            const wordCount = seg.exactText.split(/\s+/).filter(w => w.length > 0).length;
            if (seg.matchType === "Exact Match" || seg.similarityScore >= 0.8) {
                exactWords += wordCount;
            } else {
                nearDuplicateWords += wordCount;
            }
        });

        // Recalculate percentages for accuracy
        result.exactMatchPercentage = Math.round((exactWords / totalWords) * 1000) / 10;
        result.nearDuplicatePercentage = Math.round((nearDuplicateWords / totalWords) * 1000) / 10;
        result.totalSimilarity = Math.round((result.exactMatchPercentage + result.nearDuplicatePercentage) * 10) / 10;

        console.log(`Detection complete: ${result.segments.length} segments flagged, ${result.totalSimilarity}% similarity (${exactWords + nearDuplicateWords}/${totalWords} words)`);

        return result;
    } catch (error) {
        console.error("Detection engine error:", error);
        throw error;
    }
}
