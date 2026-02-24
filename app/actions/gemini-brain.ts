"use server";

import { GoogleGenAI } from "@google/genai";

export async function processBusinessRequest(message: string, history: any[], businessContext: any) {
  // משיכת המפתח בתוך הפונקציה כדי להבטיח שהוא קיים ב-Runtime
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    console.error("Missing API Key in Environment Variables");
    return "שגיאה: מפתח ה-API לא מוגדר בשרת.";
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    
    // מודל Gemini 3.1 Pro - וודא שזה השם המדויק
    const modelId = "gemini-3.1-pro-preview";

    // ניקוי היסטוריה בסיסי
    const cleanHistory = (history || [])
      .slice(-10)
      .map(h => ({
        role: h.role === "user" ? "user" : "model",
        parts: [{ text: String(h.content || "") }]
      }))
      .filter(h => h.parts[0].text.trim() !== "");

    // וידוא תקינות תפקידים
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
        systemInstruction: `אתה עוזר מקצועי של ${businessContext?.businessName || 'אבו אל ראסם'}. ענה בעברית.`,
      }
    });

    return response.text || "לא התקבלה תשובה מהשרת.";

  } catch (error: any) {
    console.error("Gemini Error:", error);
    // אם המודל החדש עושה בעיות, ננסה הודעה פשוטה ללא היסטוריה כ-Fallback
    return "מצטער אח שלי, יש תקלה קטנה בחיבור. נסה לשלוח שוב.";
  }
}
