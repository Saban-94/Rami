/* lib/chat-logic.ts */
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
        messages: arrayUnion({
          role: 'user',
          text,
          timestamp: new Date().toISOString()
        })
      });

      // --- הגדרת המשתנים (כאן הפתרון לשגיאה!) ---
      const beautyKeywords = ['תספורת', 'זקן', 'שיער', 'פן', 'ספר', 'מספרה', 'barber', 'hair'];
      const medicalKeywords = ['רופא', 'מרפאה', 'שיניים', 'כואב', 'קליניקה', 'dentist', 'clinic'];
      const luxuryKeywords = ['יוקרה', 'יוקרתי', 'vip', 'פרימיום', 'זהב', 'luxury'];

      const isBeauty = beautyKeywords.some(key => lowerText.includes(key));
      const isMedical = medicalKeywords.some(key => lowerText.includes(key));
      const isLuxury = luxuryKeywords.some(key => lowerText.includes(key));

      let updateData: any = {};
      let rationale = "";

      // בדיקת לוגיקה והכנת SEO
      if (isBeauty) {
        updateData = {
          businessType: 'beauty',
          "appConfig.theme.primaryColor": "#1a1a1a",
          "seo.title": `${manifest?.businessName || 'מספרה'} | עיצוב שיער מקצועי`,
          "seo.description": `המספרה המובילה לעיצוב שיער וזקן. בואו לחוויית טיפוח ב${manifest?.businessName || 'מספרה'}.`
        };
        rationale = "זיהיתי שמדובר במספרה. התאמתי את העיצוב וה-SEO לתחום היופי.";
      } 
      
      else if (isMedical) {
        updateData = {
          businessType: 'medical',
          "appConfig.theme.primaryColor": "#0ea5e9",
          "seo.title": `${manifest?.businessName || 'מרפאה'} | טיפול מקצועי ואישי`,
          "seo.description": `מרפאת מומחים המעניקה טיפול איכותי וקביעת תורים מהירה.`
        };
        rationale = "זיהיתי תחום רפואי. הגדרתי SEO שמתמקד במקצועיות ואמינות.";
      }

      if (isLuxury) {
        updateData.activeTemplate = 'luxury';
        rationale += " בנוסף, שדרגתי אותך לתבנית VIP יוקרתית.";
      }

      // הקפצת ההצעה ל-Console
      if (Object.keys(updateData).length > 0) {
        setProposal({
          type: 'industry_update',
          rationale: rationale,
          data: updateData
        });
      }

    } catch (err) {
      console.error("Chat Logic Error:", err);
    } finally {
      setIsProcessing(false);
    }
  };

  const approveProposal = async () => {
    if (!proposal || !trialId) return;
    try {
      await updateDoc(doc(db, "trials", trialId), proposal.data);
      setProposal(null);
    } catch (err) { console.error(err); }
  };

  const rejectProposal = () => setProposal(null);

  return { manifest, proposal, isProcessing, sendAnswer, approveProposal, rejectProposal };
}
