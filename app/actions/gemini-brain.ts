"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

/**
 * פונקציה לעדכון עיצוב/תוכן/קטלוג על בסיס פרומפט (מה ששלחת)
 */
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
    console.error("Gemini Design Error:", error);
    return { error: "Failed to sync design with Gemini Brain" };
  }
}

/**
 * הפונקציה שהייתה חסרה וגרמה לשגיאת ה-Build!
 * מטפלת בהודעות צ'אט רגילות מול הלקוח
 */
export async function processBusinessRequest(message: string, businessData: any) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const systemPrompt = `
      You are the AI assistant for "${businessData?.name || 'this business'}".
      Tone: ${businessData?.aiPersonality?.tone || 'professional and friendly'}.
      Context: ${businessData?.aiPersonality?.systemPrompt || 'Help the user with their questions.'}
      Business Industry: ${businessData?.industry || 'Service provider'}.
      Services/Products: ${JSON.stringify(businessData?.services || businessData?.catalog?.products || [])}.

      Instruction: Provide a helpful, concise response in Hebrew. 
      If the user wants to book a service, guide them politely.
    `;

    const result = await model.generateContent([
      { text: systemPrompt },
      { text: `User message: ${message}` }
    ]);

    const responseText = result.response.text();
    
    return {
      content: responseText
    };
  } catch (error) {
    console.error("Gemini Chat Error:", error);
    return { 
      content: "מצטער, חלה שגיאה בחיבור למוח של ה-AI. נסה שוב בעוד רגע." 
    };
  }
}
