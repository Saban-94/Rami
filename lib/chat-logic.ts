/* lib/chat-logic.ts */
import { useState, useEffect } from 'react';
import { db } from './firebase';
import { doc, onSnapshot, setDoc, updateDoc } from 'firebase/firestore';
import { detectIndustry } from './logic/industry-detection';

export function useChatLogic(trialId: string) {
  const [manifest, setManifest] = useState<any>(null);
  const [proposal, setProposal] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (!trialId) return;

    // שינוי קריטי: אנחנו מושכים מהקולקציה 'trials' כפי שמופיע ב-DB שלך
    const docRef = doc(db, "trials", trialId);

    console.log("📡 Listening to Trial ID:", trialId);

    const unsubscribe = onSnapshot(docRef, (snap) => {
      if (snap.exists()) {
        const data = snap.data();
        console.log("✅ Trial Data loaded:", data);
        
        // כאן אנחנו עושים נורמליזציה: אם המסמך בפורמט 'trial', נהפוך אותו למבנה שנוח לסטודיו
        setManifest({
          ...data,
          // חילוץ לקוח ראשון מהמערך אם קיים (לזיהוי לקוח)
          activeCustomer: data.customers?.[0] || null,
          // הבטחת קיום שדות בסיסיים למניעת קריסות UI
          questions: data.questions || [{ field: "name", text: "מה שם העסק שלך?" }],
          aiConfidence: data.aiConfidence || 0.1
        });
      } else {
        console.error("❌ Document not found in 'trials' collection");
      }
    }, (error) => {
      console.error("🔥 Firestore Error:", error);
    });

    return () => unsubscribe();
  }, [trialId]);

  const sendAnswer = async (text: string) => {
    if (!text || isProcessing) return;
    setIsProcessing(true);

    try {
      // הרצת מנוע ה-NER והזיהוי שבנינו
      const result = detectIndustry(text);
      
      if (result.primary) {
        setProposal({
          type: 'industry_update',
          rationale: `זיהיתי שהלקוח מתעניין בתחום: ${result.primary.subIndustryName}`,
          data: result.primary
        });
      }
    } catch (err) {
      console.error("Detection analysis failed:", err);
    } finally {
      setIsProcessing(false);
    }
  };

  const approveProposal = async () => {
    if (!proposal || !trialId) return;
    const docRef = doc(db, "trials", trialId);
    
    try {
      await updateDoc(docRef, {
        industry: proposal.data.subIndustryId,
        aiConfidence: 0.9,
        lastUpdate: new Date().toISOString()
      });
      setProposal(null);
    } catch (err) {
      console.error("Failed to update trial:", err);
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
