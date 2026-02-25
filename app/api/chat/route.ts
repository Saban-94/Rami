import { google } from "@ai-sdk/google";
import { streamText } from "ai";
import { buildSystemPrompt } from "@/lib/ai-training";
// שים לב: כאן אין צורך בייבוא של פונקציות שלא קיימות

export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const { messages, trialId } = await req.json();

    // בניית הפרומפט מהמוח שעדכנו ב-lib
    const systemPrompt = buildSystemPrompt({ businessName: "הובלות אבו אל ראסם" });

    const result = await streamText({
      model: google("gemini-1.5-flash"),
      system: systemPrompt,
      messages,
    });

    return result.toDataStreamResponse();
  } catch (error) {
    console.error("Chat API Error:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
  }
}
