import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export async function POST(req: Request) {
  const { leadData, trialId } = await req.json();

  try {
    // 1. שמירת הליד ב-Firebase עבור הדשבורד שבנינו
    const docRef = await addDoc(collection(db, "trials", trialId, "leads"), {
      ...leadData,
      createdAt: serverTimestamp(),
      status: "new"
    });

    // 2. שליחת התראת וואטסאפ לאבו ראסם (דרך Webhook)
    // אנחנו שולחים את זה לכתובת שתגדיר ב-Make/Zapier
    if (leadData.phone) {
      await fetch("YOUR_WHATSAPP_WEBHOOK_URL", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: "97250XXXXXXX", // הטלפון של אבו ראסם
          message: `
🔥 *ליד חדש מ-SabanOS!* 🔥

👤 *לקוח:* ${leadData.name}
📞 *טלפון:* ${leadData.phone}
🚚 *מסלול:* ${leadData.origin} ➔ ${leadData.destination}
❄️ *קירור:* ${leadData.isRefrigerated ? "כן ✅" : "לא"}
💰 *הערכת AI:* ₪${leadData.estimatedPrice}

*סיכום:* ${leadData.summary}

אבו ראסם, הלקוח מחכה לשיחה שלך! 🚀
          `
        })
      });
    }

    return Response.json({ success: true, id: docRef.id });
  } catch (error) {
    return Response.json({ success: false, error: "Failed to save lead" }, { status: 500 });
  }
}
