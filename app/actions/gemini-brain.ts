"use server";

import { GoogleGenAI } from "@google/genai";

export async function processBusinessRequest(message: string, history: any[], businessContext: any) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return "❌ חסרה הגדרת מפתח בשרת";

  try {
    const ai = new GoogleGenAI({ apiKey });
    const modelId = "gemini-3-flash-preview"; 

    // שליפת שם הלקוח מההיסטוריה כדי ליצור שייכות
    const userName = history.find(h => h.role === "user" && h.content.includes("שמי הוא")) 
                     || history.find(h => h.role === "user" && h.parts?.[0]?.text?.length < 10); 
    
    const nameToUse = businessContext?.customerName || "חבר";

    const systemPrompt = `
      שם העסק: ${businessContext.businessName || 'הובלות אבו אל ראסם'} 🚛
      מחירון והנחיות: ${businessContext.pricingRules || 'שירות אדיב ומקצועי'}
      
      פרוטוקול שיחה (חשוב מאוד):
      1. אל תשתמש בכוכביות (**) להדגשה. אם תרצה להדגיש, השתמש באימוג'י מתאים לפני המילה.
      2. ברגע שהלקוח אומר את שמו, השתמש בשם שלו בכל משפט שני כדי ליצור תחושת שייכות וביטחון.
      3. טון דיבור: חם, אנושי, אחראי, ומקצועי מאוד.
      4. תסריט: ברך את הלקוח, שאל מה הציוד להובלה, מאיזו קומה, והאם יש מעלית.
      5. בסוף, בקש טלפון כדי ש${businessContext.businessName} יחזור אליו לסגירה.
    `;

    const cleanHistory = (history || [])
      .slice(-10)
      .map(h => ({
        role: h.role === "user" ? "user" : "model",
        parts: [{ text: String(h.content || "") }]
      }));

    const result = await ai.models.generateContent({
      model: modelId,
      contents: [
        ...cleanHistory,
        { role: "user", parts: [{ text: `${systemPrompt}\n\nהודעת לקוח: ${message}` }] }
      ],
      config: {
        temperature: 0.8, // הופך את התשובה לאנושית יותר
        topP: 0.95,
      }
    });

    // ניקוי כוכביות שאולי ה-AI בכל זאת הוסיף
    return result.text.replace(/\*\*/g, "");

  } catch (error: any) {
    console.error("Brain Error:", error);
    return "מצטער, יש לי עומס קטן. תכתוב לי שוב עוד רגע? 🛠️";
  }
}
