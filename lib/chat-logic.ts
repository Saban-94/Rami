/* lib/chat-logic.ts */
import { useState, useEffect } from 'react';
import { db } from './firebase';
import { doc, onSnapshot, updateDoc, arrayUnion } from 'firebase/firestore';
import { detectIndustry } from './logic/industry-detection';

export function useChatLogic(trialId: string) {
  const [manifest, setManifest] = useState<any>(null);
  const [proposal, setProposal] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (!trialId) return;

    const docRef = doc(db, "trials", trialId);
    console.log("📡 Connecting to Trial:", trialId);

    const unsubscribe = onSnapshot(docRef, (snap) => {
      if (snap.exists()) {
        const data = snap.data();
        setManifest({
          ...data,
          activeCustomer: data.customers?.[0] || null,
          theme: data.theme || { primaryColor: "#3b82f6" }
        });
      }
    }, (err) => console.error("🔥 Firestore Error:", err));

    return () => unsubscribe();
  }, [trialId]);

  const sendAnswer = async (text: string) => {
    if (!text || isProcessing) return;
    setIsProcessing(true);

    try {
      const docRef = doc(db, "trials", trialId);
      
      // עדכון היסטוריית הצ'אט ב-Firebase
      await updateDoc(docRef, {
        messages: arrayUnion({
          role: 'user',
          text,
          timestamp: new Date().toISOString()
        })
      });

      // ניתוח בינה מלאכותית
      const result = detectIndustry(text);
      if (result.primary) {
        setProposal({
          type: 'industry_update',
          rationale: `זיהיתי שהעסק שייך לתחום: ${result.primary.subIndustryId}. האם לעדכן את עיצוב האתר והשאלות בהתאם?`,
          data: result.primary
        });
      }
    } catch (err) {
      console.error("Analysis Error:", err);
    } finally {
      setIsProcessing(false);
    }
  };

  const approveProposal = async () => {
    if (!proposal || !trialId) return;
    const docRef = doc(db, "trials", trialId);
    await updateDoc(docRef, {
      industry: proposal.data.subIndustryId,
      aiConfidence: 0.95,
      "theme.primaryColor": proposal.data.subIndustryId === 'automotive' ? '#ef4444' : '#3b82f6'
    });
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
