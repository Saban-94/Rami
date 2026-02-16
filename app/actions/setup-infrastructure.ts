'use server';
import 'server-only';

import { db } from "@/lib/firebase-admin";
import { createBusinessStorage } from "@/lib/drive";
import { createBusinessCalendar } from "@/lib/calendar";

export async function setupBusinessInfrastructure(trialId: string, businessName: string) {
  console.log(`🚀 Starting infrastructure setup for: ${businessName} (${trialId})`);
  
  try {
    // 1. יצירת אחסון בדרייב
    const driveFolderId = await createBusinessStorage(businessName);
    
    // 2. יצירת יומן גוגל
    const calendarId = await createBusinessCalendar(businessName);
    
    // 3. עדכון ה-Firestore
    await db.collection('trials').doc(trialId).update({
      driveFolderId,
      calendarId,
      infrastructureReady: true,
      updatedAt: new Date().toISOString()
    });

    return { success: true, driveFolderId, calendarId };
  } catch (error) {
    console.error("❌ Infrastructure Setup Failed:", error);
    throw new Error("Failed to setup business infrastructure");
  }
}
