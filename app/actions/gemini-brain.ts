"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";

export async function processBusinessRequest(prompt: string, businessContext: any) {
  // 1. בדיקה שהמפתח קיים בזמן ריצה
  const apiKey = process.env.GEMINI_API_KEY;
  
  if (!apiKey) {
    console.error("❌ ERROR: GEMINI_API_KEY is not defined in Environment Variables");
    return "מצטער, המערכת לא מוגדרת כראוי (חסר מפתח AI).";
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      systemInstruction: `אתה עוזר עסקי חכם בוואטסאפ במערכת SabanOS. 
      העסק הנוכחי: ${businessContext.name}. 
      התחום: ${businessContext.industry}. 
      תפקידך לענות בצורה קצרה, נעימה ומכירתית. עזור בניהול קטלוג ותורים.`
    });

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    if (!text) throw new Error("Empty response from Gemini");

    return text;
  } catch (error: any) {
    // הדפסת השגיאה ללוגים של Vercel כדי שתוכל לראות מה קרה
    console.error("❌ Gemini API Error:", error.message || error);
    return "אופס, אני זמין כרגע רק חלקית. נסה שוב בעוד רגע.";
  }
}
