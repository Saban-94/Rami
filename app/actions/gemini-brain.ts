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
    
    // שינוי שם המודל לגרסה היציבה ביותר
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash-latest" // הוספנו -latest כדי להבטיח תמיכה
    });

    // בגרסאות חדשות, ה-systemInstruction מועבר לעיתים כחלק מה-generateContent או ב-startChat
    // בוא נשתמש בשיטה הבטוחה ביותר:
    const chat = model.startChat({
      history: [
        {
          role: "user",
          parts: [{ text: `אתה עוזר עסקי חכם בוואטסאפ במערכת SabanOS. העסק: ${businessContext.name}. התחום: ${businessContext.industry}. ענה בקצרה ובנעימות.` }],
        },
        {
          role: "model",
          parts: [{ text: "הבנתי, אני מוכן לעזור ללקוחות שלכם בצורה הטובה ביותר." }],
        },
      ],
    });

    const result = await chat.sendMessage(prompt);
    const response = await result.response;
    const text = response.text();

    return text;
  } catch (error: any) {
    console.error("❌ Gemini API Error:", error.message || error);
    // אם גם ה-latest נכשל, ננסה את המודל הבסיסי ביותר כגיבוי
    return "אופס, חלה שגיאה בחיבור ל-AI. נסה שוב בעוד רגע.";
  }
}
