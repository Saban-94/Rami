"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function processBusinessRequest(prompt: string, history: any[], businessContext: any) {
  try {
    // הגנה: אם businessContext לא הגיע, נשתמש בערכי ברירת מחדל
    const bName = businessContext?.name || "SabanOS";
    const bIndustry = businessContext?.industry || "Automation";

    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      systemInstruction: `אתה העוזר של ${bName}. התחום הוא ${bIndustry}. תענה תמיד בעברית, קצר, ולעניין. אל תחזור על הצהרות שירות שכבר נאמרו.`
    });

    // המרה נכונה של ההיסטוריה לפורמט של Google SDK
    const formattedHistory = (history || []).map(msg => ({
      role: msg.role === "user" ? "user" : "model",
      parts: [{ text: msg.content || "" }],
    }));

    const chat = model.startChat({
      history: formattedHistory,
    });

    const result = await chat.sendMessage(prompt);
    const response = await result.response;
    return response.text();

  } catch (error) {
    console.error("Gemini Action Error:", error);
    // החזרת הודעה ידידותית במקום קריסה
    return "אופס, ה-AI עמוס כרגע. נסה שוב בעוד רגע.";
  }
}
