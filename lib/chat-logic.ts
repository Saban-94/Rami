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
      if (snap.exists()) {
        setManifest(snap.data());
      }
    }, (err) => console.error("Firestore Sync Error:", err));

    return () => unsubscribe();
  }, [trialId]);

  const sendAnswer = async (text: string) => {
    if (!text || isProcessing || !trialId) return;
    setIsProcessing(true);

    try {
      const docRef = doc(db, "trials", trialId);
      const lowerText = text.toLowerCase();

      await updateDoc(docRef, {
        messages: arrayUnion({
          role: 'user',
          text,
          timestamp: new Date().toISOString()
        })
      });

      // מילון מונחים לזיהוי ענפים
      const beautyKeys = ['תספורת', 'זקן', 'שיער', 'פן', 'ספר', 'מספרה', 'barber', 'hair'];
      const medicalKeys = ['רופא', 'מרפאה', 'שיניים', 'כואב', 'קליניקה', 'בדיקה', 'dentist', 'clinic'];
      const buildKeys = ['חומרי בניין', 'ברזל', 'בטון', 'שיפוץ', 'קבלן', 'בלוקים', 'אספקה', 'מלט', 'גבס', 'בנייה'];
      const luxuryKeys = ['יוקרה', 'יוקרתי', 'vip', 'פרימיום', 'זהב', 'luxury', 'אלגנטי'];

      const isBeauty = beautyKeys.some(key => lowerText.includes(key));
      const isMedical = medicalKeys.some(key => lowerText.includes(key));
      const isBuild = buildKeys.some(key => lowerText.includes(key));
      const isLuxury = luxuryKeys.some(key => lowerText.includes(key));

      let updateData: any = {};
      let rationale = "";

      if (isBeauty) {
        updateData = {
          businessType: 'beauty',
          "appConfig.theme.primaryColor": "#1a1a1a",
          "seo.title": `${manifest?.businessName || 'מספרה'} | עיצוב שיער מקצועי`,
        };
        rationale = "זיהיתי שמדובר במספרה. הגדרתי עיצוב ו-SEO מתאים.";
      } else if (isMedical) {
        updateData = {
          businessType: 'medical',
          "appConfig.theme.primaryColor": "#0ea5e9",
          "seo.title": `${manifest?.businessName || 'מרפאה'} | טיפול מומחים`,
        };
        rationale = "זיהיתי כוונה רפואית. הגדרתי SEO אמין.";
      }

      if (!manifest?.driveFolderId && (updateData.businessName || manifest?.businessName)) {
        updateData.needsInfrastructure = true;
        rationale += " אני מכין עבורך תיקייה בדרייב ויומן עסקי.";
      }

      if (Object.keys(updateData).length > 0) {
        setProposal({
          type: 'smart_update',
          rationale: rationale,
          data: updateData
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

    try {
      const docRef = doc(db, "trials", trialId);
      await updateDoc(docRef, proposal.data);

      if (proposal.data.needsInfrastructure) {
        // התיקון הקריטי: ייבוא דינמי למניעת זליגת קוד שרת
        const { setupBusinessInfrastructure } = await import("@/app/actions/setup-infrastructure");
        const businessName = manifest?.businessName || proposal.data.businessName;
        await setupBusinessInfrastructure(trialId, businessName);
      }

      setProposal(null);
    } catch (err) {
      console.error("Approval Failed:", err);
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
