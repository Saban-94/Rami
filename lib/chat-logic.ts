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
      await updateDoc(docRef, {
        messages: arrayUnion({ role: 'user', text, timestamp: new Date().toISOString() })
      });

      const lowerText = text.toLowerCase();
      // לוגיקת זיהוי בסיסית
      if (lowerText.includes('ספר') || lowerText.includes('תספורת')) {
        setProposal({
          type: 'setup',
          rationale: 'זיהיתי עסק יופי. להקים תשתית דיגיטלית?',
          data: { businessType: 'beauty', needsInfrastructure: true }
        });
      }
    } catch (err) { console.error(err); } finally { setIsProcessing(false); }
  };

  const approveProposal = async () => {
    if (!proposal || !trialId) return;
    try {
      const docRef = doc(db, "trials", trialId);
      await updateDoc(docRef, proposal.data);

      if (proposal.data.needsInfrastructure) {
        // התיקון הקריטי: ייבוא דינמי בזמן ריצה בלבד
        const infrastructure = await import("@/app/actions/setup-infrastructure");
        await infrastructure.setupBusinessInfrastructure(trialId, manifest?.businessName || "עסק חדש");
      }
      setProposal(null);
    } catch (err) { console.error("Infrastructure setup error:", err); }
  };

  return { manifest, proposal, isProcessing, sendAnswer, approveProposal, rejectProposal: () => setProposal(null) };
}
