"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";

export async function processBusinessRequest(prompt: string, businessContext: any) {
  const apiKey = process.env.GEMINI_API_KEY;
  
  if (!apiKey) {
    console.error("❌ ERROR: GEMINI_API_KEY missing");
    return "מצטער, המערכת לא מוגדרת כראוי.";
  }

  try {
    // הוספת גרסת ה-API באופן מפורש כדי לעקוף את שגיאת ה-404 של ה-v1beta
    const genAI = new GoogleGenerativeAI(apiKey);
    
    // כאן אנחנו מגדירים את המודל בצורה הכי יציבה שיש לגרסה 0.21.0
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
    }, { apiVersion: 'v1' }); // <--- זה השורה שפותרת את ה-404!

    const systemInstruction = `אתה עוזר עסקי חכם בוואטסאפ. העסק: ${businessContext.name}. תחום: ${businessContext.industry}. ענה בעברית, קצר ולעניין.`;

    // שליחת התוכן
    const result = await model.generateContent(`${systemInstruction}\n\nלקוח: ${prompt}`);
    const response = await result.response;
    const text = response.text();

    return text;
  } catch (error: any) {
    console.error("❌ Gemini API Error Details:", error);
    
    // בדיקה אם זו שגיאת מפתח או שגיאת מודל
    if (error.message?.includes("API key not valid")) {
      return "שגיאה: מפתח ה-AI אינו תקין. בדוק את ההגדרות ב-Vercel.";
    }
    
    return "אופס, ה-AI עמוס כרגע. נסה שוב בעוד רגע.";
  }
}
