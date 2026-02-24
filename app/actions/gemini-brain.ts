"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function processBusinessRequest(message: string, history: any[], businessContext: any) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const systemPrompt = `
      You are the SabanOS Business Assistant. 
      Business Name: ${businessContext?.name || 'SabanOS'}
      Industry: ${businessContext?.industry || 'Automation'}
      Instructions: Reply in Hebrew. Be professional, friendly, and concise. 
      Use the chat history provided to maintain context.
    `;

    const chat = model.startChat({
      history: history || [],
      generationConfig: { maxOutputTokens: 800 },
    });

    const result = await chat.sendMessage(`${systemPrompt}\n\nUser Message: ${message}`);
    return result.response.text();
  } catch (error) {
    console.error("Gemini Brain Error:", error);
    return "מצטער, הייתה לי שגיאה קטנה בחיבור. אפשר לנסות שוב?";
  }
}

export async function suggestDesignFromPrompt({ prompt }: { prompt: string }) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const systemPrompt = `You are a Business Architect. Return ONLY a valid JSON object.`;
    const result = await model.generateContent(`${systemPrompt}\n\nUser request: ${prompt}`);
    const cleanJson = result.response.text().replace(/```json|```/g, "").trim();
    return JSON.parse(cleanJson);
  } catch (error) {
    console.error("Gemini Design Error:", error);
    return { error: "Failed to generate design" };
  }
}
