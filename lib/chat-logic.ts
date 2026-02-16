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

      // לוגיקה בסיסית לזיהוי כוונות
      if (text.includes('ספר') || text.includes('מספרה')) {
        setProposal({
          type: 'setup',
          rationale: 'זיהיתי עסק יופי, האם להקים תשתית?',
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
      await updateDoc(docRef, proposal.data);

      if (proposal.data.needsInfrastructure) {
        // ייבוא דינמי מוחלט - מונע מ-Webpack לנתח את הקובץ בזמן ה-Build של הלקוח
        const setupModule = await import("@/app/actions/setup-infrastructure");
        await setupModule.setupBusinessInfrastructure(trialId, manifest?.businessName || proposal.data.businessName);
      }
      setProposal(null);
    } catch (err) {
      console.error("Critical Error in infrastructure setup:", err);
    }
  };

  return { manifest, proposal, isProcessing, sendAnswer, approveProposal, rejectProposal: () => setProposal(null) };
}
