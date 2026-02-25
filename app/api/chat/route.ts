import { google } from "@ai-sdk/google";
import { streamText } from "ai";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { buildSystemPrompt } from "@/lib/ai-training";

export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages, trialId } = await req.json();

  // 1. שליפת נתוני העסק הספציפיים (אבו ראסם) מה-Firebase
  const businessDoc = await getDoc(doc(db, "trials", trialId));
  const businessData = businessDoc.exists() ? businessDoc.data() : null;

  // 2. בניית ה-System Prompt עם "המוח המעודכן" וה-JSON של המחירון
  const systemPrompt = buildSystemPrompt(businessData);

  // 3. הפעלת ג'ימני עם לוגיקת המחירון המשולבת
  const result = await streamText({
    model: google("gemini-1.5-flash"),
    system: systemPrompt,
    messages,
  });

  return result.toDataStreamResponse();
}
