/* app/actions/setup-infrastructure.ts */
"use server";

import { db } from "../../lib/firebaseAdmin";
import { createBusinessStorage } from "@/lib/drive";
import { createBusinessCalendar } from "@/lib/calendar";

export async function setupBusinessInfrastructure(trialId: string, businessName: string) {
  try {
    console.log(`🚀 Starting Infrastructure Setup for: ${businessName}`);

    // 1. יצירת תיקייה ייחודית בתוך ה-SabanOS_Warehouse בדרייב
    const driveFolderId = await createBusinessStorage(businessName, trialId);

    // 2. יצירת יומן נפרד בתוך החשבון ramims2026@gmail.com
    const calendarId = await createBusinessCalendar(businessName);

    // 3. עדכון ה-Firestore עם ה-IDs החדשים
    const docRef = db.collection('trials').doc(trialId);
    await docRef.update({
      driveFolderId,
      calendarId,
      infrastructureReady: true,
      setupDate: new Date().toISOString()
    });

    return { 
      success: true, 
      driveFolderId, 
      calendarId 
    };

  } catch (error: any) {
    console.error("Infrastructure Setup Failed:", error);
    return { success: false, error: error.message };
  }
}
