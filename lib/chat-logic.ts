/* lib/chat-logic.ts */
import { useState, useEffect } from 'react';
import { db } from './firebase';
import { doc, onSnapshot, setDoc, getDoc } from 'firebase/firestore';
import { detectIndustry } from './logic/industry-detection';

export function useChatLogic(trialId: string) {
  const [manifest, setManifest] = useState<any>(null);
  const [proposal, setProposal] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (!trialId) return;

    console.log("📡 Connecting to Firestore for ID:", trialId);

    const docRef = doc(db, "chatManifests", trialId);

    // האזנה בזמן אמת
    const unsubscribe = onSnapshot(docRef, async (snap) => {
      if (snap.exists()) {
        console.log("✅ Manifest found:", snap.data());
        setManifest(snap.data());
      } else {
        console.log("⚠️ Document missing. Creating initial manifest...");
        // יצירת מניפסט ראשוני אם הוא לא קיים כדי למנוע Spinner אינסופי
        const initialData = {
          aiConfidence: 0.1,
          industry: "Learning...",
          questions: [{ field: "business_name", text: "מה שם העסק שלך?" }],
          data: {},
          assets: {},
          createdAt: new Date().toISOString()
        };
        await setDoc(docRef, initialData);
      }
    }, (error) => {
      console.error("🔥 Firestore Subscription Error:", error);
    });

    return () => unsubscribe();
  }, [trialId]);

  const sendAnswer = async (text: string) => {
    if (!text || isProcessing) return;
    setIsProcessing(true);

    try {
      const result = detectIndustry(text);
      if (result.primary) {
        setProposal({
          type: 'update',
          rationale: `זיהיתי שהעסק שלך שייך לתחום: ${result.primary.subIndustryId}`,
          data: result.primary
        });
      }
    } catch (err) {
      console.error("Detection error:", err);
    } finally {
      setIsProcessing(false);
    }
  };

  const approveProposal = async () => {
    if (!proposal || !trialId) return;
    const docRef = doc(db, "chatManifests", trialId);
    await setDoc(docRef, { 
      industry: proposal.data.subIndustryId,
      aiConfidence: 0.8 
    }, { merge: true });
    setProposal(null);
  };

  return { 
    manifest, 
    proposal, 
    isProcessing, 
    sendAnswer, 
    approveProposal, 
    rejectProposal: () => setProposal(null) 
  };
}
