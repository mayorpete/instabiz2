
import { GoogleGenAI, Type } from "@google/genai";
import { BusinessAnalysis } from "../types";

export async function analyzeInstagramProfile(profileUrl: string): Promise<{ analysis: BusinessAnalysis, sources: any[] }> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const prompt = `
    Perform a deep analysis of the Instagram business profile at this URL: ${profileUrl}.
    If the URL is a direct link, search for public information about this specific business handle.
    
    Tasks:
    1. Identify the Business Name.
    2. Determine their Industry/Category.
    3. Describe their likely Target Audience.
    4. Summarize their Core Value Proposition.
    5. Analyze their Brand Voice (e.g., witty, professional, luxurious, approachable).
    6. List 3 key services or products they offer.
    7. Generate 3 variations of a "First Contact" intro message to send them after they follow me.
       - Casual: Friendly and low-pressure.
       - Professional: Polished and business-oriented.
       - Concise: Very short (max 2 sentences).

    Provide the output in valid JSON format.
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: prompt,
    config: {
      tools: [{ googleSearch: {} }],
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          category: { type: Type.STRING },
          targetAudience: { type: Type.STRING },
          valueProposition: { type: Type.STRING },
          brandVoice: { type: Type.STRING },
          keyServices: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          },
          suggestedMessages: {
            type: Type.OBJECT,
            properties: {
              casual: { type: Type.STRING },
              professional: { type: Type.STRING },
              concise: { type: Type.STRING }
            }
          }
        },
        required: ["name", "category", "targetAudience", "valueProposition", "brandVoice", "keyServices", "suggestedMessages"]
      }
    }
  });

  const text = response.text;
  if (!text) throw new Error("No response from AI");

  const analysis: BusinessAnalysis = JSON.parse(text);
  const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];

  return { analysis, sources };
}
