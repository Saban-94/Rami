import { useState, useEffect } from 'react';
import { db } from './firebase';
import { doc, onSnapshot, updateDoc, arrayUnion } from 'firebase/firestore';

export function useChatLogic(trialId: string) {
  const [manifest, setManifest] = useState<any>(null);
  const [proposal, setProposal] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (!trialId) return;
    const docRef = doc(db, "trials", trialId);
    const unsubscribe = onSnapshot(docRef, (snap) => {
      if (snap.exists()) setManifest(snap.data());
    });
    return () => unsubscribe();
  }, [trialId]);

  const sendAnswer = async (text: string) => {
    if (!text || isProcessing || !trialId) return;
    setIsProcessing(true);
    try {
      const docRef = doc(db, "trials", trialId);
      const lowerText = text.toLowerCase();
      await updateDoc(docRef, {
        messages: arrayUnion({ role: 'user', text, timestamp: new Date().toISOString() })
      });

      // לוגיקת זיהוי פשוטה להדגמה
      if (lowerText.includes('ספר') || lowerText.includes('מספרה')) {
        setProposal({
          type: 'smart_update',
          rationale: 'זיהיתי שמדובר במספרה. האם להקים תשתית דיגיטלית?',
          data: { businessType: 'beauty', needsInfrastructure: true }
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  const approveProposal = async () => {
    if (!proposal || !trialId) return;
    try {
      const docRef = doc(db, "trials", trialId);
      
      // שלב 1: עדכון ה-Manifest ב-Firestore (צד לקוח)
      await updateDoc(docRef, proposal.data);

      // שלב 2: הפעלת תשתית בשרת רק אם נדרש
      if (proposal.data.needsInfrastructure) {
        // שימוש ב-Dynamic Import בתוך הפונקציה בלבד!
        const { setupBusinessInfrastructure } = await import("@/app/actions/setup-infrastructure");
        await setupBusinessInfrastructure(trialId, manifest?.businessName || proposal.data.businessName);
      }
      
      setProposal(null);
    } catch (err) {
      console.error("Setup failed:", err);
    }
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
