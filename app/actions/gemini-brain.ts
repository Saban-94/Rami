"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function processBusinessRequest(prompt: string, history: any, businessContext: any) {
  try {
    // מעבר למודל פלאש - מהיר יותר ועם מכסה חינמית גדולה בהרבה
    const model = genAI.getGenerativeModel({ 
      model: "gemini-3-flash-preview", 
    });

    const bName = businessContext?.name || "SabanOS";
    const bIndustry = businessContext?.industry || "Automation";

    const systemInstruction = `אתה העוזר של ${bName}. התחום: ${bIndustry}. 
    ענה בעברית טבעית וקצרה (סגנון וואטסאפ). אל תחזור על הצהרות שירות שכבר נאמרו.`;

    let safeHistory = Array.isArray(history) ? history : [];

    const formattedHistory = safeHistory
      .filter((msg: any) => msg && msg.content)
      .map((msg: any) => ({
        role: msg.role === "user" ? "user" : "model",
        parts: [{ text: String(msg.content) }],
      }));

    const chat = model.startChat({
      history: formattedHistory,
    });

    const finalPrompt = `[הנחיית מערכת: ${systemInstruction}]\n\nמשתמש: ${prompt}`;

    const result = await chat.sendMessage(finalPrompt);
    const response = await result.response;
    return response.text();

  } catch (error: any) {
    console.error("Gemini Quota/API Error:", error);
    
    if (error.status === 429) {
      return "אופס, אני קצת עמוס כרגע. נסה שוב בעוד כמה שניות.";
    }
    
    return "אופס, יש תקלה זמנית. נסה שוב בעוד דקה.";
  }
}
