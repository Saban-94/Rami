"use server";

import { GoogleGenAI } from "@google/genai";

export async function processBusinessRequest(message: string, history: any[], businessContext: any) {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) return "❌ חסר API KEY בשרת.";

  try {
    // אתחול הלקוח - ה-SDK החדש יודע לנתב לבד
    const ai = new GoogleGenAI({ apiKey });
    
    // תיקון המודל: ב-2026 משתמשים בשמות הנקיים או ב-Gemini 3 Flash
    // אם gemini-1.5-flash לא נמצא, אנחנו עוברים ל-gemini-3-flash-preview
    const modelId = "gemini-3-flash-preview"; 

    const cleanHistory = (history || [])
      .slice(-6)
      .map(h => ({
        role: h.role === "user" ? "user" : "model",
        parts: [{ text: String(h.content || "") }]
      }))
      .filter(h => h.parts[0].text.trim() !== "");

    if (cleanHistory.length > 0 && cleanHistory[0].role === "model") {
      cleanHistory.shift();
    }

    const result = await ai.models.generateContent({
      model: modelId, // כאן השתנה השם
      contents: [
        ...cleanHistory,
        { role: "user", parts: [{ text: message }] }
      ],
      config: {
        systemInstruction: `אתה עוזר של ${businessContext?.businessName || 'אבו אל ראסם'}.`,
      }
    });

    return result.text;

  } catch (error: any) {
    console.error("Gemini Error:", error.message);
    
    // מלשינון fallback - אם גם זה נכשל, ננסה את השם הישיר
    if (error.message.includes("404")) {
        return "❌ שגיאה 404: המודל gemini-3-flash-preview לא זוהה. נסה לעדכן ל-gemini-2.0-flash-exp כברירת מחדל.";
    }
    
    return `❌ שגיאה: ${error.message}`;
  }
}
