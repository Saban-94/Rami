"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";

// הגדרת המודל - וודא שהגדרת ב-Vercel משתנה סביבה בשם GEMINI_API_KEY
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function suggestDesignFromPrompt({ prompt }: { prompt: string }) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const systemPrompt = `
      You are a luxury UI designer for SabanOS Studio. 
      Your task is to return ONLY a JSON object that modifies the business application theme.
      The JSON structure should be:
      {
        "appConfig.theme.primaryColor": "HEX_COLOR",
        "appConfig.theme.darkMode": boolean
      }
      If the user asks for "luxury" or "gold", use #C8A55A.
      If they ask for "dark", set darkMode to true.
      Return ONLY the JSON, no markdown, no explanation.
    `;

    const result = await model.generateContent(`${systemPrompt}\n\nUser request: ${prompt}`);
    const response = await result.response;
    const text = response.text();
    
    // ניקוי הטקסט למקרה שה-AI החזיר סימני Markdown
    const cleanJson = text.replace(/```json|```/g, "").trim();
    
    return JSON.parse(cleanJson);
  } catch (error) {
    console.error("Gemini Error:", error);
    // פולבק במקרה של שגיאה כדי שהמערכת לא תקרוס
    return {
      "appConfig.theme.primaryColor": "#10b981"
    };
  }
}
