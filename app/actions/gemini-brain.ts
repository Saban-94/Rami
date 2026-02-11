"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";

// אתחול ה-AI עם המפתח שלך
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function processBusinessRequest(prompt: string, history: any, businessContext: any) {
  try {
    // הגדרת מזהי מודל מעודכנים לפי ינואר 2026
    // אנחנו נשתמש ב-gemini-3-pro-preview לביצועים הכי חזקים
    const model = genAI.getGenerativeModel({ 
      model: "gemini-3-pro-preview", 
    });

    const bName = businessContext?.name || "SabanOS";
    const bIndustry = businessContext?.industry || "Automation";

    const systemInstruction = `אתה העוזר של ${bName}. התחום: ${bIndustry}. 
    ענה תמיד בעברית טבעית, קצרה ולעניין (סגנון וואטסאפ). 
    אל תחזור על הצהרות שירות שכבר נאמרו בשיחה. 
    אם הלקוח משאיר פרטים, אשר שקיבלת אותם והמשך הלאה.`;

    // וידוא שההיסטוריה היא מערך תקין
    let safeHistory = [];
    if (Array.isArray(history)) {
      safeHistory = history;
    }

    // המרה לפורמט ה-SDK החדש
    const formattedHistory = safeHistory
      .filter((msg: any) => msg && msg.content)
      .map((msg: any) => ({
        role: msg.role === "user" ? "user" : "model",
        parts: [{ text: String(msg.content) }],
      }));

    const chat = model.startChat({
      history: formattedHistory,
    });

    // הזרקת ההוראות כחלק מההקשר (Context)
    const finalPrompt = `[System Message: ${systemInstruction}]\n\nUser Message: ${prompt}`;

    const result = await chat.sendMessage(finalPrompt);
    const response = await result.response;
    return response.text();

  } catch (error: any) {
    console.error("Gemini 2026 API Error:", error);
    
    // טיפול ספציפי בשגיאות מודל לא נמצא
    if (error.status === 404) {
      return "אופס, נראה שיש עדכון במערכת. אני מתחבר למודל החדש, נסה שוב בעוד רגע.";
    }
    
    return "אופס, ה-AI עמוס כרגע. נסה שוב בעוד דקה.";
  }
}
