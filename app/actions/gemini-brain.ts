"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";

export async function processBusinessRequest(prompt: string, businessContext: any) {
  const apiKey = process.env.GEMINI_API_KEY;
  
  if (!apiKey) {
    console.error("❌ GEMINI_API_KEY Missing in Vercel");
    return "שגיאה: מפתח ה-AI לא הוגדר.";
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    
    // לפי עדכון ינואר/פברואר 2026 - חובה להשתמש בשם המלא
    const model = genAI.getGenerativeModel({ 
      model: "gemini-3-flash-preview" 
    });

    // הזרקת קונטקסט מקצועי עבור SabanOS
    const systemPrompt = `
      אתה עוזר עסקי חכם עבור SabanOS (מערכת של רמי).
      העסק מתמחה באוטומציות (Make, Zapier), CRM (Monday, Pipedrive) וייעוץ טכנולוגי.
      הלקוח פנה אליך עכשיו. ענה בעברית, קצר, מקצועי ומכירתי.
    `;

    const result = await model.generateContent(`${systemPrompt}\n\nלקוח: ${prompt}`);
    const response = await result.response;
    return response.text();

  } catch (error: any) {
    console.error("❌ Gemini API Error:", error.message);
    
    // Fallback למודל 2.5 אם גוגל עושים בעיות ב-Gemini 3 באזור שלך
    try {
      const fallbackModel = new GoogleGenerativeAI(apiKey).getGenerativeModel({ model: "gemini-2.5-flash" });
      const result = await fallbackModel.generateContent(prompt);
      return (await result.response).text();
    } catch (inner) {
      return "מצטער, יש עומס זמני במערכות גוגל. נסה שוב בעוד רגע.";
    }
  }
}
