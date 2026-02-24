"use server";

import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || ""
});

export async function processBusinessRequest(message: string, history: any[], businessContext: any) {
  try {
    const modelId = "gemini-3.1-pro-preview";

    // ניקוי ההיסטוריה לפורמט של גוגל (זוכר רק 10 אחרונות)
    const cleanHistory = (history || [])
      .slice(-10) 
      .map(h => ({
        role: h.role === "user" ? "user" : "model",
        parts: [{ text: String(h.content || "") }]
      }))
      .filter(h => h.parts[0].text.trim() !== "");

    // וודא שההיסטוריה מתחילה ב-user
    if (cleanHistory.length > 0 && cleanHistory[0].role === "model") {
      cleanHistory.shift();
    }

    const response = await ai.models.generateContent({
      model: modelId,
      contents: [
        ...cleanHistory,
        { role: "user", parts: [{ text: message }] }
      ],
      config: {
        systemInstruction: `אתה העוזר של ${businessContext?.businessName}. ענה בעברית.`,
        thinkingConfig: { thinkingLevel: "low" }
      }
    });

    return response.text;
  } catch (error) {
    console.error("AI Error:", error);
    return null;
  }
}
