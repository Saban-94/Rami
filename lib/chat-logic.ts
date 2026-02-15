/* lib/chat-logic.ts */
import { useState, useEffect } from 'react';
import { detectIndustry } from './logic/industry-detection';
import { db } from './firebase';
import { doc, onSnapshot, updateDoc } from 'firebase/firestore';

export function useChatLogic(trialId: string) {
  const [manifest, setManifest] = useState<any>(null);
  const [proposal, setProposal] = useState<any>(null);

  useEffect(() => {
    if (!trialId) return;
    return onSnapshot(doc(db, "chatManifests", trialId), (snap) => {
      if (snap.exists()) setManifest(snap.data());
    });
  }, [trialId]);

  const sendAnswer = async (text: string) => {
    const result = detectIndustry(text);
    if (result.primary) {
      setProposal({
        type: 'patch',
        rationale: `זיהיתי שאתה בתחום ה-${result.primary.subIndustryId}`,
        data: result.primary
      });
    }
  };

  return { manifest, proposal, sendAnswer, approveProposal: () => setProposal(null) };
}

// פונקציות עזר ליצירת נכסים
export function generateWebsiteAsset(manifest: any) { /* לוגיקת בניית אתר */ return { blocks: [] }; }
export async function publishManifestToProduction(id: string, m: any) { /* עדכון Firestore */ }
