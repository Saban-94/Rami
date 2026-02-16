"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function suggestDesignFromPrompt({ prompt }: { prompt: string }) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const systemPrompt = `
      You are the SabanOS Business Architect. Your response must be ONLY a valid JSON object.
      You can modify:
      1. Theme (primaryColor, darkMode, fonts)
      2. Content (businessName, marketingSlogan)
      3. Catalog (products: [{name, price, salePrice, isSelected, description}])
      4. Layout (sections order)

      Context: If the user asks for "Sale", create a discount on existing products. 
      If user asks for "Post advice", provide marketing advice in a field called "marketingAdvice".
      
      Structure:
      {
        "appConfig.theme.primaryColor": "HEX",
        "appConfig.theme.fontFamily": "STRING",
        "businessName": "STRING",
        "marketingAdvice": "HEBREW_TEXT",
        "catalog.products": [...],
        "sections": [...]
      }
    `;

    const result = await model.generateContent(`${systemPrompt}\n\nUser request: ${prompt}`);
    const cleanJson = result.response.text().replace(/```json|```/g, "").trim();
    return JSON.parse(cleanJson);
  } catch (error) {
    console.error("Gemini Error:", error);
    return { error: "Failed to sync with Gemini Brain" };
  }
}
