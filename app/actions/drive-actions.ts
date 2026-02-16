"use server";

import { db } from "@/lib/firebase-admin";
import { uploadLogoToFolder } from "@/lib/drive";

export async function uploadToDriveAction(formData: FormData) {
  // פונקציית עטיפה בסיסית
  return { success: true };
}

export async function uploadToDriveAction(formData: FormData) {
  try {
    const file = formData.get("file") as File;
    if (!file) return { success: false, error: "No file" };

    // כאן תבוא לוגיקת ההעלאה לדרייב שכתבנו קודם...
    console.log("Uploading file:", file.name);

    return { success: true, message: "File uploaded successfully" };
  } catch (error) {
    console.error("Upload Error:", error);
    return { success: false, error: "Server error during upload" };
  }
}

    return { success: true, url: fileUrl };
  } catch (error: any) {
    console.error("Upload error:", error);
    return { success: false, error: error.message };
  }
}
