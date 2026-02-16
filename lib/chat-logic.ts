'use client';

import { useState, useEffect } from 'react';
import { db } from './firebase';
import { doc, onSnapshot, updateDoc, arrayUnion } from 'firebase/firestore';
// ייבוא רגיל - Next.js יטפל בזה כ-Server Action
import { setupBusinessInfrastructure } from '@/app/actions/setup-infrastructure';

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

  const approveProposal = async () => {
    if (!proposal || !trialId) return;
    try {
      const docRef = doc(db, "trials", trialId);
      await updateDoc(docRef, proposal.data);

      if (proposal.data.needsInfrastructure) {
        // קריאה ישירה ל-Action (מותר כי הוא 'use server')
        const businessName = manifest?.businessName || proposal.data.businessName;
        await setupBusinessInfrastructure(trialId, businessName);
      }
      setProposal(null);
    } catch (err) {
      console.error("Setup failed:", err);
    }
  };

  return { manifest, proposal, isProcessing, approveProposal, rejectProposal: () => setProposal(null) };
}
