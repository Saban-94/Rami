/* lib/chat-logic.ts */
import { useState, useEffect } from 'react';
import { db } from './firebase';
import { doc, onSnapshot, updateDoc, arrayUnion } from 'firebase/firestore';
import { setupBusinessInfrastructure } from "@/app/actions/setup-infrastructure";

export function useChatLogic(trialId: string) {
  const [manifest, setManifest] = useState<any>(null);
  const [proposal, setProposal] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // 1. האזנה לשינויים ב-Manifest בזמן אמת (Real-time Sync)
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

  // 2. פונקציית שליחת הודעה עם ניתוח AI משולב
  const sendAnswer = async (text: string) => {
    if (!text || isProcessing || !trialId) return;
    setIsProcessing(true);

    try {
      const docRef = doc(db, "trials", trialId);
      const lowerText = text.toLowerCase();

      // תיעוד ההודעה בצ'אט ב-Firebase
      await updateDoc(docRef, {
        messages: arrayUnion({
          role: 'user',
          text,
          timestamp: new Date().toISOString()
        })
      });

      // --- הגדרת קטגוריות וזיהוי (NER - Logic Engine) ---
      const beautyKeys = ['תספורת', 'זקן', 'שיער', 'פן', 'ספר', 'מספרה', 'עיצוב שיער', 'barber', 'hair'];
      const medicalKeys = ['רופא', 'מרפאה', 'שיניים', 'כואב', 'קליניקה', 'בדיקה', 'אבחון', 'dentist', 'clinic'];
      const buildKeys = ['חומרי בניין', 'ברזל', 'בטון', 'שיפוץ', 'קבלן', 'בלוקים', 'אספקה', 'מלט', 'גבס', 'בנייה'];
      const luxuryKeys = ['יוקרה', 'יוקרתי', 'vip', 'פרימיום', 'זהב', 'luxury', 'אלגנטי', 'רמה גבוהה'];

      const isBeauty = beautyKeys.some(key => lowerText.includes(key));
      const isMedical = medicalKeys.some(key => lowerText.includes(key));
      const isBuild = buildKeys.some(key => lowerText.includes(key));
      const isLuxury = luxuryKeys.some(key => lowerText.includes(key));

      let updateData: any = {};
      let rationale = "";

      // א. זיהוי ענף עסקי וקביעת SEO ראשוני
      if (isBeauty) {
        updateData = {
          businessType: 'beauty',
          "appConfig.theme.primaryColor": "#1a1a1a", // שחור פחם מודרני
          "seo.title": `${manifest?.businessName || 'מספרה'} | עיצוב שיער מקצועי`,
          "seo.description": `חווית טיפוח ועיצוב שיער ב${manifest?.businessName || 'מספרה'}. הזמן תור עכשיו.`
        };
        rationale = "זיהיתי עסק בתחום היופי. הגדרתי עיצוב מודרני ו-SEO מותאם למספרות.";
      } 
      else if (isMedical) {
        updateData = {
          businessType: 'medical',
          "appConfig.theme.primaryColor": "#0ea5e9", // כחול רפואי
          "seo.title": `${manifest?.businessName || 'מרפאה'} | טיפול מומחים`,
          "seo.description": `מרפאת מומחים המעניקה טיפול אישי וניהול תורים חכם.`
        };
        rationale = "זיהיתי כוונה רפואית. הפעלתי הגדרות קליניקה ו-SEO מבוסס אמינות.";
      }
      else if (isBuild) {
        updateData = {
          businessType: 'industrial',
          "appConfig.theme.primaryColor": "#ea580c", // כתום תעשייתי
          "seo.title": `${manifest?.businessName || 'חומרי בניין'} | אספקה טכנית`,
          "seo.description": `המקום המוביל לחומרי בניין ותשתיות. אספקה מהירה לקבלנים ושיפוצניקים.`
        };
        rationale = "זיהיתי תחום תעשייה/בנייה. התאמתי את הממשק לאספקה טכנית.";
      }

      // ב. זיהוי שם עסק דינמי מתוך הטקסט
      const nameMatch = text.match(/(?:קוראים ל|שם העסק הוא|השם הוא)\s+([א-תa-zA-Z0-9\s]+)/);
      if (nameMatch && nameMatch[1]) {
        const newName = nameMatch[1].trim();
        updateData.businessName = newName;
        updateData["seo.title"] = `${newName} | האפליקציה הרשמית`;
        rationale += ` עדכנתי את שם העסק ל-"${newName}".`;
      }

      // ג. זיהוי לוגו מקישור (URL)
      const urlMatch = text.match(/https?:\/\/[^\s]+(?:\.png|\.jpg|\.jpeg|\.webp)/i);
      if (urlMatch) {
        updateData["appConfig.theme.logo"] = urlMatch[0];
        updateData.pendingLogoSync = true;
        rationale += " זיהיתי לוגו חדש, אשמור אותו בתיקיית הדרייב הייעודית.";
      }

      // ד. שדרוג ל-Luxury Gold
      if (isLuxury && manifest?.activeTemplate !== 'luxury') {
        updateData.activeTemplate = 'luxury';
        rationale += " הפעלתי את תבנית ה-Luxury Gold היוקרתית.";
      }

      // ה. בדיקת תשתית (Drive & Calendar Setup) תחת ramims2026@gmail.com
      if (!manifest?.driveFolderId && (updateData.businessName || manifest?.businessName)) {
        updateData.needsInfrastructure = true;
        rationale += " אני מכין עבורך תיקייה מאובטחת בדרייב ויומן עסקי נפרד.";
      }

      // ו. הזרקת המידע ל-Proposal (הצעה ב-Console)
      if (Object.keys(updateData).length > 0) {
        setProposal({
          type: 'smart_update',
          rationale: rationale,
          data: updateData
        });
      }

    } catch (err) {
      console.error("Critical AI Analysis Error:", err);
    } finally {
      setIsProcessing(false);
    }
  };

  // 3. פונקציית אישור הצעה - כולל הפעלת Setup פיזי בשרת
const approveProposal = async () => {
  if (!proposal || !trialId) return;
  try {
    const { doc, updateDoc } = await import('firebase/firestore');
    const docRef = doc(db, "trials", trialId);
    await updateDoc(docRef, proposal.data);

    if (proposal.data.needsInfrastructure) {
      // כאן הקסם: הייבוא קורה רק בשרת בזמן אמת
      const { setupBusinessInfrastructure } = await import("@/app/actions/setup-infrastructure");
      await setupBusinessInfrastructure(trialId, manifest?.businessName || proposal.data.businessName);
    }
    setProposal(null);
  } catch (err) {
    console.error(err);
  }
};

  const rejectProposal = () => setProposal(null);

  return { manifest, proposal, isProcessing, sendAnswer, approveProposal, rejectProposal };
}
