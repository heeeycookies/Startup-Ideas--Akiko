
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function analyzeMerchantQR(qrContent: string) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Short analysis of SG QR: ${qrContent}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            uen: { type: Type.STRING },
            suggestedAmount: { type: Type.NUMBER },
            category: { type: Type.STRING },
            safetyScore: { type: Type.NUMBER }
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
      contents: `One short payment tip for ${merchantCategory} in SG.`
    });
    return response.text;
  } catch {
    return "Use local payment bridges for zero FX fees!";
  }
}
