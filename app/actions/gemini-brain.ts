"use server";

import { GoogleGenAI } from "@google/genai";

export async function processBusinessRequest(message: string, history: any[], businessContext: any) {
  const apiKey = process.env.GEMINI_API_KEY;

  // מלשינון 1: בדיקת מפתח בשרת
  if (!apiKey) {
    return "❌ שגיאה: GEMINI_API_KEY לא נמצא ב-Environment Variables של Vercel.";
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const modelId = "gemini-3.1-pro-preview";

    // מלשינון 2: בדיקת מבנה ההיסטוריה
    const cleanHistory = (history || [])
      .slice(-10)
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
        systemInstruction: `אתה עוזר מקצועי של ${businessContext?.businessName || 'אבו אל ראסם'}.`,
      }
    });

    if (!result || !result.text) {
      return "⚠️ שגיאה: ה-API החזיר תשובה ריקה. ייתכן שיש חסימת תוכן (Safety Filters).";
    }

    return result.text;

  } catch (error: any) {
    console.error("Detailed Server Error:", error);
    
    // מלשינון 3: פירוט השגיאה מה-SDK של גוגל
    const errorMsg = error.message || "";
    if (errorMsg.includes("400")) return `❌ שגיאה 400: מפתח API לא תקין או מודל לא זמין. (${modelId})`;
    if (errorMsg.includes("429")) return "❌ שגיאה 429: הגעת למכסת ההודעות (Quota) של גוגל.";
    if (errorMsg.includes("500")) return "❌ שגיאה 500: תקלה בשרתים של גוגל.";
    
    return `❌ כשל פנימי: ${error.message}`;
  }
}
