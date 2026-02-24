"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";

// וודא שהמפתח הזה מוגדר ב-Vercel!
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function processBusinessRequest(message: string, history: any[], businessContext: any) {
  try {
    if (!process.env.GEMINI_API_KEY) {
      console.error("Missing Gemini API Key in Environment Variables");
      return "שגיאת תצורה: חסר מפתח API.";
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // ניקוי היסטוריה - קריטי למניעת שגיאות 400
    const cleanHistory = (history || []).map(h => ({
      role: h.role === "user" ? "user" : "model",
      parts: [{ text: String(h.content || h.parts?.[0]?.text || "") }]
    })).filter(h => h.parts[0].text.trim() !== "");

    const chat = model.startChat({
      history: cleanHistory,
    });

    // יצירת הקשר עסקי חזק
    const systemPrompt = `
      אתה העוזר האישי של חברת "${businessContext?.businessName || businessContext?.name || 'הובלות אבו אל ראסם'}".
      תחום פעילות: ${businessContext?.industry || 'הובלות ולוגיסטיקה'}.
      ענה בעברית טבעית, אדיבה ומקצועית. 
      אם שואלים על מחיר, בקש פרטים על הקומות, מעלית ותכולה.
    `;

    const result = await chat.sendMessage(`${systemPrompt}\n\nהודעת משתמש: ${message}`);
    const response = await result.response;
    const text = response.text();
    
    return text;

  } catch (error: any) {
    console.error("Detailed Gemini Error:", error.message || error);
    // החזרת הודעה מפורטת יותר ללוגים
    return null; 
  }
}
