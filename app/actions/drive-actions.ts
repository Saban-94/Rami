"use server";

import { db } from "@/lib/firebase-admin";
import { uploadLogoToFolder } from "@/lib/drive";

export async function uploadToDriveAction(formData: FormData) {
  // פונקציית עטיפה בסיסית
  return { success: true };
}

export async function uploadProfileImage(trialId: string, formData: FormData) {
  try {
    const file = formData.get('file') as File;
    if (!file) throw new Error("לא נבחר קובץ");

    const trialDoc = await db.collection('trials').doc(trialId).get();
    const folderId = trialDoc.data()?.driveFolderId;

    if (!folderId) throw new Error("חסר מזהה תיקייה בדרייב");

    const buffer = Buffer.from(await file.arrayBuffer());
    const fileUrl = await uploadLogoToFolder(folderId, buffer, file.name);

    await db.collection('trials').doc(trialId).update({
      "appConfig.theme.logo": fileUrl
    });

    return { success: true, url: fileUrl };
  } catch (error: any) {
    console.error("Upload error:", error);
    return { success: false, error: error.message };
  }
}
