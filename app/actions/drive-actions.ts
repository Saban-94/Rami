/* app/actions/drive-actions.ts */
"use client"; // אנחנו נשתמש בזה כ-Client Action שקורא ל-API או Server Action אמיתי

import { db } from "@/lib/firebase"; // Client SDK
import { doc, updateDoc, arrayUnion } from "firebase/firestore";

export async function uploadToDriveAction(formData: FormData) {
  try {
    const file = formData.get("file") as File;
    const folderId = formData.get("folderId") as string;
    const trialId = formData.get("trialId") as string;

    if (!file || !folderId) throw new Error("Missing file or folderId");

    // שליחה ל-API Route הפנימי (כדי להשתמש ב-Node Runtime של Google APIs)
    const response = await fetch("/api/drive/upload", {
      method: "POST",
      body: formData,
    });

    const result = await response.json();

    if (result.success) {
      // עדכון ה-Firestore שהלקוח העלה קובץ - כדי שהדוקטור ישמע "דינג"
      const docRef = doc(db, "trials", trialId);
      await updateDoc(docRef, {
        trainingHistory: arrayUnion({
          date: new Date().toLocaleString("he-IL"),
          text: `📁 קובץ חדש הועלה: ${file.name}`,
          fileLink: result.webViewLink
        })
      });
      return { success: true, link: result.webViewLink };
    }
    
    return { success: false };
  } catch (error) {
    console.error("Upload Action Error:", error);
    return { success: false };
  }
}
