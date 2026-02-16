"use server";

import { db } from "@/lib/firebase-admin";
import { createBusinessStorage, uploadLogoToFolder } from "@/lib/drive";

/**
 * העלאת תמונת פרופיל לתיקיית הדרייב של העסק
 */
export async function uploadProfileImage(trialId: string, formData: FormData) {
  try {
    const file = formData.get('file') as File;
    if (!file) throw new Error("לא נמצא קובץ להעלאה");

    // משיכת נתוני ה-Trial כדי למצוא את ה-folderId
    const doc = await db.collection('trials').doc(trialId).get();
    const data = doc.data();
    
    if (!data?.driveFolderId) {
      throw new Error("לא הוקמה תשתית אחסון לעסק זה");
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const fileUrl = await uploadLogoToFolder(data.driveFolderId, buffer, file.name);

    // עדכון ה-Firestore עם הקישור החדש
    await db.collection('trials').doc(trialId).update({
      "appConfig.theme.logo": fileUrl
    });

    return { success: true, url: fileUrl };
  } catch (error: any) {
    console.error("Upload error:", error);
    return { success: false, error: error.message };
  }
}
