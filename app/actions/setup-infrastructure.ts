'use server';
import 'server-only';

import { db } from "@/lib/firebase-admin";
import { createBusinessStorage } from "@/lib/drive";
import { createBusinessCalendar } from "@/lib/calendar";

export async function setupBusinessInfrastructure(trialId: string, businessName: string) {
  try {
    // 1. יצירת אחסון
    const driveFolderId = await createBusinessStorage(businessName);
    
    // 2. יצירת יומן
    const calendarId = await createBusinessCalendar(businessName);
    
    // 3. עדכון Firestore
    await db.collection('trials').doc(trialId).update({
      driveFolderId,
      calendarId,
      infrastructureReady: true,
      updatedAt: new Date().toISOString()
    });

    return { success: true };
  } catch (error) {
    console.error("Infrastructure Setup Error:", error);
    return { success: false, error: "Failed to build infrastructure" };
  }
}
