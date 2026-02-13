
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function analyzeMerchantQR(qrContent: string) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Analyze this SG QR string and extract merchant details. String: ${qrContent}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            uen: { type: Type.STRING },
            suggestedAmount: { type: Type.NUMBER },
            category: { type: Type.STRING },
            safetyScore: { type: Type.NUMBER, description: "1-100" }
          },
          required: ["name", "uen", "category"]
        }
      }
    });

    return JSON.parse(response.text);
  } catch (error) {
    console.error("Gemini Analysis failed:", error);
    return null;
  }
}

export async function getTravelTip(merchantCategory: string) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Give a 1-sentence travel payment tip for a tourist paying at a ${merchantCategory} in Singapore. Keep it helpful and brief.`
    });
    return response.text;
  } catch {
    return "Check for seasonal discounts when using GrabPay at local hawker centers!";
  }
}
