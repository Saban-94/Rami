/* lib/chat-logic.ts */
import { useState, useEffect } from 'react';
import { db } from './firebase';
import { doc, onSnapshot, getDoc, setDoc } from 'firebase/firestore';

export function useChatLogic(trialId: string) {
  const [manifest, setManifest] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (!trialId) return;

    const docRef = doc(db, "trials", trialId);
    console.log("📡 Connecting to Trial:", trialId);

    // מנגנון הגנה: ניסיון קריאה ישיר אם ה-Snapshot נתקע
    const forceFetch = async () => {
      try {
        const snap = await getDoc(docRef);
        if (snap.exists() && !manifest) {
          console.log("⚡ Force Fetch Success:", snap.data());
          setManifest(snap.data());
        }
      } catch (e) {
        console.error("Force fetch failed", e);
      }
    };

    const timeout = setTimeout(forceFetch, 3000); // אם אחרי 3 שניות אין תשובה, תמשוך בכוח

    const unsubscribe = onSnapshot(docRef, (snap) => {
      clearTimeout(timeout);
      if (snap.exists()) {
        console.log("✅ Live Data Received:", snap.data());
        setManifest(snap.data());
      } else {
        console.warn("❓ Document missing in 'trials' collection");
        // אופציונלי: יצירת מסמך ראשוני אם הוא לא קיים
      }
    }, (err) => {
      console.error("🔥 Firebase Connection Error:", err);
      clearTimeout(timeout);
    });

    return () => {
      unsubscribe();
      clearTimeout(timeout);
    };
  }, [trialId]);

  const sendAnswer = async (text: string) => {
    // לוגיקה לשליחה...
  };

  return { manifest, isProcessing, sendAnswer };
}
