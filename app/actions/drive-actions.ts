"use server";

import { db } from "@/lib/firebase-admin";
import { uploadLogoToFolder } from "@/lib/drive";

export async function uploadToDriveAction(formData: FormData) {
  // פונקציית מעטפת לשימוש כללי
  return { success: true };
}

export async function uploadProfileImage(trialId: string, formData: FormData) {
  try {
    const file = formData.get('file') as File;
    if (!file) throw new Error("No file selected");

    const trialDoc = await db.collection('trials').doc(trialId).get();
    const folderId = trialDoc.data()?.driveFolderId;

    if (!folderId) throw new Error("Infrastructure missing folder ID");

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
