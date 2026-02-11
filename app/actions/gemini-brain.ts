"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";

export async function processBusinessRequest(prompt: string, businessContext: any) {
  const apiKey = process.env.GEMINI_API_KEY;
  
  if (!apiKey) {
    console.error("❌ ERROR: GEMINI_API_KEY missing");
    return "מצטער, המערכת לא מוגדרת כראוי.";
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    
    // נשתמש בשם המודל ללא ה-latest או v1, פשוט השם הנקי
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash" 
    });

    // הזרקת ההקשר ישירות לתוך הפרומפט כדי לעקוף בעיות גרסה של systemInstruction
    const fullPrompt = `
      הקשר עסקי: אתה עוזר בוואטסאפ עבור ${businessContext.name}. 
      תחום העסק: ${businessContext.industry}.
      הנחיות: ענה בקצרה, בנעימות ובעברית.
      
      הודעת הלקוח: ${prompt}
    `;

    const result = await model.generateContent(fullPrompt);
    const response = await result.response;
    return response.text();

  } catch (error: any) {
    console.error("❌ Gemini API Error Details:", error);
    return "אופס, חלה שגיאה בחיבור ל-AI. נסה שוב בעוד רגע.";
  }
}
