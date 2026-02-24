"use server";

import { GoogleGenAI } from "@google/genai";

export async function processBusinessRequest(message: string, history: any[], businessContext: any) {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) return "❌ חסר API KEY";

  try {
    const ai = new GoogleGenAI({ apiKey });
    
    // שינוי למודל Flash - הרבה יותר זמין ופחות נוטה ל-429
    const modelId = "gemini-1.5-flash"; 

    const cleanHistory = (history || [])
      .slice(-6) // צמצום ההיסטוריה ל-6 הודעות כדי לחסוך ב-Tokens
      .map(h => ({
        role: h.role === "user" ? "user" : "model",
        parts: [{ text: String(h.content || "") }]
      }))
      .filter(h => h.parts[0].text.trim() !== "");

    if (cleanHistory.length > 0 && cleanHistory[0].role === "model") {
      cleanHistory.shift();
    }

    const result = await ai.models.generateContent({
      model: modelId,
      contents: [
        ...cleanHistory,
        { role: "user", parts: [{ text: message }] }
      ],
      config: {
        systemInstruction: `אתה עוזר של ${businessContext?.businessName || 'אבו אל ראסם'}. ענה בקצרה.`,
      }
    });

    return result.text;

  } catch (error: any) {
    if (error.message?.includes("429")) {
      return "⚠️ גוגל הגבילו את כמות ההודעות לרגע. נסה שוב בעוד דקה.";
    }
    return `❌ שגיאה: ${error.message}`;
  }
}
