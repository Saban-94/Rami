"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";

export async function processBusinessRequest(prompt: string, businessContext: any) {
  const apiKey = process.env.GEMINI_API_KEY;
  
  if (!apiKey) {
    console.error("❌ GEMINI_API_KEY Missing");
    return "חסר מפתח AI.";
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    
    // לפי עדכון ה-API מינואר 2026:
    // נשתמש במודל החדש ביותר ששוחרר
    const model = genAI.getGenerativeModel({ 
      model: "gemini-3-flash-preview" 
    });

    const systemContext = `אתה עוזר עסקי חכם ב-SabanOS עבור ${businessContext.name || 'העסק'}. ענה בעברית קצרה ומקצועית.`;
    
    // שליחת התוכן בפורמט הפשוט ביותר
    const result = await model.generateContent(`${systemContext}\n\nשאלה מהלקוח: ${prompt}`);
    const response = await result.response;
    return response.text();

  } catch (error: any) {
    console.error("❌ Gemini Error:", error.message || error);
    
    // אם ה-Preview עדיין עושה בעיות, ננסה את ה-Alias הכללי שגוגל עדכנו
    try {
      const genAIFallback = new GoogleGenerativeAI(apiKey);
      const fallbackModel = genAIFallback.getGenerativeModel({ model: "gemini-flash-latest" });
      const result = await fallbackModel.generateContent(prompt);
      return (await result.response).text();
    } catch (inner) {
      return "אחי, יש עדכון במערכות של גוגל. אני מתחבר מחדש, נסה שוב בעוד דקה.";
    }
  }
}
