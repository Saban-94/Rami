"use server";

import { db } from "@/lib/firebase-admin";
import { uploadLogoToFolder } from "@/lib/drive";

/**
 * העלאת לוגו/תמונת פרופיל וסנכרון מיידי למניפסט העסק
 */
export async function uploadProfileImage(trialId: string, formData: FormData) {
  try {
    const file = formData.get("file") as File;
    if (!file) throw new Error("לא נבחר קובץ");

    // 1. שליפת מזהה התיקייה מה-Firestore
    const trialDoc = await db.collection("trials").doc(trialId).get();
    if (!trialDoc.exists) throw new Error("העסק לא נמצא במערכת");
    
    const folderId = trialDoc.data()?.driveFolderId;
    if (!folderId) throw new Error("תשתית הדרייב (FolderId) חסרה עבור עסק זה");

    // 2. הכנת הקובץ והעלאה ל-Google Drive
    const buffer = Buffer.from(await file.arrayBuffer());
    const fileUrl = await uploadLogoToFolder(folderId, buffer, file.name);

    // 3. עדכון ה-Manifest ב-Firestore - זה מה שמעדכן את האייפון בלייב
    await db.collection("trials").doc(trialId).update({
      "appConfig.theme.logo": fileUrl,
      "updatedAt": new Date().toISOString()
    });

    return { success: true, url: fileUrl };
  } catch (error: any) {
    console.error("❌ Drive Upload Error:", error);
    return { success: false, error: error.message || "תקלה בהעלאת הקובץ" };
  }
}

/**
 * פונקציית מעטפת (Wrapper) למקרים כלליים
 */
export async function uploadToDriveAction(formData: FormData) {
  return { success: true, message: "General upload triggered" };
}
