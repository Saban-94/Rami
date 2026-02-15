/* lib/chat-logic.ts */
import { useState, useEffect } from 'react';
import { db } from './firebase';
import { doc, onSnapshot } from 'firebase/firestore';

export function useChatLogic(trialId: string) {
  const [manifest, setManifest] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (!trialId) return;

    // שימוש בקולקציה הנכונה 'trials'
    const docRef = doc(db, "trials", trialId);
    
    console.log("📡 Connecting to Trial:", trialId);

    const unsubscribe = onSnapshot(docRef, (snap) => {
      if (snap.exists()) {
        console.log("✅ Data Received:", snap.data());
        setManifest(snap.data());
      } else {
        console.warn("❓ Document not found in trials collection");
      }
    }, (err) => {
      console.error("🔥 Firebase Error:", err);
    });

    return () => unsubscribe();
  }, [trialId]);

  const sendAnswer = async (text: string) => {
    // לוגיקה פשוטה לשליחה
    console.log("Processing answer:", text);
    setIsProcessing(true);
    setTimeout(() => setIsProcessing(false), 1000);
  };

  return { manifest, isProcessing, sendAnswer };
}
