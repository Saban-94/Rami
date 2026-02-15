/* app/actions/manifest.ts */
"use server";

import { db } from "@/lib/firebase"; // וודא שהנתיב ל-firebase.ts תקין
import { doc, getDoc } from "firebase/firestore";

export async function getManifestAction(trialId?: string) {
  try {
    // אם אין trialId, נשתמש בברירת מחדל או נחזיר ריק
    const id = trialId || "default_manifest";
    const docRef = doc(db, "chatManifests", id);
    const snap = await getDoc(docRef);

    if (snap.exists()) {
      return { success: true, manifest: snap.data() };
    }
    
    return { success: false, manifest: null };
  } catch (error) {
    console.error("Error fetching manifest:", error);
    return { success: false, manifest: null };
  }
}
