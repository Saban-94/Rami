"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function processBusinessRequest(prompt: string, history: any[], businessContext: any) {
  const model = genAI.getGenerativeModel({ 
    model: "gemini-1.5-flash",
    systemInstruction: `
      אתה העוזר של ${businessContext.name}. 
      חוקים קשיחים:
      1. אל תחזור על הצהרת שירותים אם כבר הצגת אותה. 
      2. אם לקוח אישר תיאום שיחה או השאיר טלפון, ענה בקיצור: "מעולה, רשמתי לפניי. נחזור אליך בהקדם ל-${history[history.length-1]?.content || 'מספר שהשארת'}."
      3. היה תמציתי. וואטסאפ זה לא אימייל.
      4. תמיד תהיה אדיב ומכירתי אבל אל תחזור על עצמך.`
  });

  // העברת היסטוריית השיחה כדי שה-AI ידע מה הוא כבר אמר
  const chat = model.startChat({
    history: history,
  });

  const result = await chat.sendMessage(prompt);
  const response = await result.response;
  return response.text();
}
