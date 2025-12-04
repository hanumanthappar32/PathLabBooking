import { GoogleGenAI, Type } from "@google/genai";
import { LabTest } from "../types";

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getAIRecommendations = async (symptoms: string, availableTests: LabTest[]): Promise<string[]> => {
  if (!process.env.API_KEY) {
    console.warn("API Key missing for Gemini.");
    return [];
  }

  const model = "gemini-2.5-flash";
  const testsContext = availableTests.map(t => `${t.id}: ${t.name} (${t.description})`).join('\n');

  const prompt = `
    You are a helpful medical assistant for Ravi Diagnostic Lab.
    User Symptoms: "${symptoms}"

    Available Tests in our Lab:
    ${testsContext}

    Based on the symptoms, recommend 1 to 3 most relevant tests from the list above.
    Only return the IDs of the tests in a JSON array.
    If no tests are relevant, return an empty array.
  `;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: { type: Type.STRING }
        }
      }
    });

    let jsonText = response.text;
    if (!jsonText) return [];

    // Clean markdown code blocks if present (e.g., ```json ... ```)
    jsonText = jsonText.replace(/^```json\s*/, "").replace(/```$/, "").trim();
    
    return JSON.parse(jsonText);
  } catch (error) {
    console.error("Gemini AI Recommendation Error:", error);
    return [];
  }
};