/* app/actions/whatsapp-actions.ts */
"use server";

import { db } from "@/lib/firebaseAdmin";

export async function sendWhatsAppSEOUpdate(trialId: string, phone: string, businessName: string) {
  try {
    const doc = await db.collection('trials').doc(trialId).get();
    const manifest = doc.data();
    const seoTitle = manifest?.seo?.title || "האפליקציה החדשה שלך";

    // כאן מחברים את ה-API של הוואטסאפ (דוגמה למבנה הודעה)
    const message = `
🌟 *עדכון SEO חכם מבית SabanOS* 🌟

היי ${businessName}, ה-AI שלנו סיים לשדרג את הנראות שלך בגוגל!
הכותרת החדשה שלך: *${seoTitle}*

תוכל לראות את התצוגה המקדימה כאן:
https://sabanos.vercel.app/${trialId}

*SabanOS | הופכים טקסט לעסק.*
    `;

    // שליחה ל-Webhook של וואטסאפ (למשל דרך Twilio או שירות דומה)
    const response = await fetch('https://api.your-whatsapp-provider.com/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${process.env.WHATSAPP_API_KEY}` },
      body: JSON.stringify({
        to: phone,
        body: message
      }),
    });

    return { success: true };
  } catch (error) {
    console.error("WhatsApp Error:", error);
    return { success: false };
  }
}
