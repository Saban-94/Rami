"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function processBusinessRequest(prompt: string, history: any, businessContext: any) {
  try {
    const bName = businessContext?.name || "SabanOS";
    const bIndustry = businessContext?.industry || "Automation";

    // שימוש בשם המודל המלא והמעודכן ביותר לפתרון שגיאת 404
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash-latest", 
    });

    const systemInstruction = `אתה העוזר של ${bName}. התחום: ${bIndustry}. תענה תמיד בעברית, קצר, ולעניין. אל תחזור על הצהרות שירות שכבר נאמרו.`;

    // וידוא שההיסטוריה בפורמט תקין
    let safeHistory = [];
    if (Array.isArray(history)) {
      safeHistory = history;
    }

    const formattedHistory = safeHistory
      .filter((msg: any) => msg && msg.content)
      .map((msg: any) => ({
        role: msg.role === "user" ? "user" : "model",
        parts: [{ text: String(msg.content) }],
      }));

    // יצירת הצ'אט עם ה-System Instruction בתוך ה-SendMessage או ה-StartChat
    const chat = model.startChat({
      history: formattedHistory,
      generationConfig: {
        maxOutputTokens: 500,
      },
    });

    // הזרקת ההוראות כחלק מהפנייה הראשונה או כתוספת להקשר
    const finalPrompt = `הנחיית מערכת: ${systemInstruction}\n\nמשתמש: ${prompt}`;

    const result = await chat.sendMessage(finalPrompt);
    const response = await result.response;
    return response.text();

  } catch (error: any) {
    console.error("Gemini API Error Details:", error);
    
    // אם המודל עדיין לא נמצא, ננסה גרסה חלופית או נחזיר הודעת שגיאה ברורה
    if (error.status === 404) {
       return "אופס, נראה שיש עדכון במערכות של גוגל. אני מתחבר מחדש, נסה שוב בעוד רגע.";
    }
    
    return "אופס, ה-AI עמוס כרגע. נסה שוב בעוד רגע.";
  }
}
