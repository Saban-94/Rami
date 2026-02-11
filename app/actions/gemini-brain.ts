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
    
    // שינוי למודל gemini-pro - הוא יציב יותר בגרסאות ישנות/חדשות
    const model = genAI.getGenerativeModel({ 
      model: "gemini-pro" 
    });

    const systemContext = `אתה עוזר עסקי עבור ${businessContext.name || 'העסק'}. ענה בעברית קצרה.`;
    const finalPrompt = `${systemContext}\n\nלקוח: ${prompt}`;

    const result = await model.generateContent(finalPrompt);
    const response = await result.response;
    return response.text();

  } catch (error: any) {
    console.error("❌ Gemini Error Details:", error);
    
    // אם גם פרו נכשל, ננסה את המודל הכי חדש שיש כרגע ב-API
    try {
        const genAIFallback = new GoogleGenerativeAI(apiKey);
        const fallbackModel = genAIFallback.getGenerativeModel({ model: "gemini-1.5-pro" });
        const result = await fallbackModel.generateContent(prompt);
        return (await result.response).text();
    } catch (innerError) {
        return "אופס, יש תקלה זמנית בחיבור לגוגל. נסה שוב בעוד דקה.";
    }
  }
}
