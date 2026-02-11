"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function processBusinessRequest(prompt: string, history: any[], businessContext: any) {
  try {
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      systemInstruction: `אתה העוזר של ${businessContext.name}. תענה תמיד בעברית, קצר, ולעניין. אל תחזור על עצמך.`
    });

    // התחלת צ'אט עם היסטוריה
    const chat = model.startChat({
      history: history || [],
    });

    const result = await chat.sendMessage(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Gemini Action Error:", error);
    throw new Error("Failed to process request");
  }
}
