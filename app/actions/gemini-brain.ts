"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function processBusinessRequest(prompt: string, history: any, businessContext: any) {
  try {
    // 1. הגנה על ה-Context
    const bName = businessContext?.name || "SabanOS";
    const bIndustry = businessContext?.industry || "Automation";

    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      systemInstruction: `אתה העוזר של ${bName}. התחום: ${bIndustry}. תענה תמיד בעברית, קצר, ולעניין. אל תחזור על הצהרות שירות שכבר נאמרו.`
    });

    // 2. תיקון קריטי: וודוא שההיסטוריה היא מערך
    let safeHistory = [];
    if (Array.isArray(history)) {
      safeHistory = history;
    } else if (typeof history === 'object' && history !== null) {
      // אם זה אובייקט בודד, נכניס אותו למערך
      safeHistory = [history];
    }

    // 3. המרה לפורמט שגימני דורש (role ו-parts)
    const formattedHistory = safeHistory
      .filter((msg: any) => msg && msg.content) // סינון הודעות ריקות
      .map((msg: any) => ({
        role: msg.role === "user" ? "user" : "model",
        parts: [{ text: String(msg.content) }],
      }));

    const chat = model.startChat({
      history: formattedHistory,
    });

    const result = await chat.sendMessage(prompt);
    const response = await result.response;
    return response.text();

  } catch (error) {
    console.error("Gemini Action Error:", error);
    // החזרת הודעה במקום קריסת המערכת
    return "אופס, ה-AI עמוס כרגע. נסה שוב בעוד רגע.";
  }
}
