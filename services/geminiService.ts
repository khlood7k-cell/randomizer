
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const suggestNames = async (topic: string): Promise<string[]> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Generate a list of 10 relevant names or items for the topic: "${topic}". Provide just the names as a list.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            suggestions: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "A list of suggested names or items"
            }
          },
          required: ["suggestions"]
        }
      }
    });

    const data = JSON.parse(response.text || '{"suggestions": []}');
    return data.suggestions || [];
  } catch (error) {
    console.error("Gemini Suggestion Error:", error);
    return [];
  }
};
