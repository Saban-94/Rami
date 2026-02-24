"use server";

import { GoogleGenAI } from "@google/genai";

// אתחול הלקוח עם ה-API KEY מה-Vercel
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || ""
});

export async function processBusinessRequest(message: string, history: any[], businessContext: any) {
  try {
    if (!process.env.GEMINI_API_KEY) {
      console.error("Missing GEMINI_API_KEY");
      return "שגיאת מערכת: מפתח ה-API לא מוגדר.";
    }

    // שימוש במודל 3.1 Pro החדש ביותר לביצועים מקסימליים
    const modelId = "gemini-3.1-pro-preview";

    // ניקוי ובניית ההיסטוריה לפי הפרוטוקול החדש של Gemini 3
    // חייב להתחיל ב-'user' ולהיות במבנה של parts
    let cleanHistory = (history || [])
      .map(h => ({
        role: h.role === "user" ? "user" : "model",
        parts: [{ text: String(h.content || h.parts?.[0]?.text || "") }]
      }))
      .filter(h => h.parts[0].text.trim() !== "");

    // תיקון: אם ההודעה הראשונה היא של המודל, נסיר אותה (גימני דורש להתחיל ב-user)
    if (cleanHistory.length > 0 && cleanHistory[0].role === "model") {
      cleanHistory.shift();
    }

    const systemPrompt = `
      אתה עוזר AI מקצועי של "${businessContext?.businessName || 'הובלות אבו אל ראסם'}".
      תחום: ${businessContext?.industry || 'לוגיסטיקה והובלות'}.
      
      הנחיות:
      1. ענה בעברית טבעית וזורמת.
      2. אם לקוח מבקש הצעת מחיר, שאל על: תכולה, קומות, מעלית, ומיקום (מאיפה לאיפה).
      3. היה אדיב מאוד - אתה הפנים של העסק.
    `;

    // הפעלת הצ'אט עם הגדרות "חשיבה" (Thinking)
    const response = await ai.models.generateContent({
      model: modelId,
      contents: [
        ...cleanHistory,
        { role: "user", parts: [{ text: `${systemPrompt}\n\nהודעת לקוח: ${message}` }] }
      ],
      config: {
        // רמת חשיבה - LOW מתאים לצ'אט מהיר, MEDIUM למשימות תמחור מורכבות
        thinkingConfig: {
          includeThoughts: true,
          thinkingLevel: "low" 
        }
      }
    });

    return response.text;

  } catch (error: any) {
    console.error("Gemini 3.1 Critical Error:", error.message);
    
    // Fallback למודל Flash המהיר במידה ו-Pro עמוס
    try {
      const flashResponse = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [{ role: "user", parts: [{ text: message }] }]
      });
      return flashResponse.text;
    } catch (e) {
      return "מצטער, יש לי עומס קטן על הקו. תוכל לנסות שוב בעוד רגע? 🚛";
    }
  }
}
