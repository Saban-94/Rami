import { useState, useEffect } from 'react';
import { db } from './firebase';
import { doc, onSnapshot, updateDoc, arrayUnion } from 'firebase/firestore';

export function useChatLogic(trialId: string) {
  const [manifest, setManifest] = useState<any>(null);
  const [proposal, setProposal] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // 1. האזנה לשינויים ב-Manifest בזמן אמת
  useEffect(() => {
    if (!trialId) return;
    const docRef = doc(db, "trials", trialId);
    const unsubscribe = onSnapshot(docRef, (snap) => {
      if (snap.exists()) setManifest(snap.data());
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

      // תיעוד ההודעה בצ'אט
      await updateDoc(docRef, {
        messages: arrayUnion({
          role: 'user',
          text,
          timestamp: new Date().toISOString()
        })
      });

      // --- הגדרת קטגוריות וזיהוי (NER) ---
      const beautyKeys = ['תספורת', 'זקן', 'שיער', 'פן', 'ספר', 'מספרה', 'barber', 'hair'];
      const medicalKeys = ['רופא', 'מרפאה', 'שיניים', 'כואב', 'קליניקה', 'dentist', 'clinic'];
      const buildKeys = ['חומרי בניין', 'ברזל', 'בטון', 'שיפוץ', 'קבלן', 'בלוקים', 'אספקה', 'מלט', 'גבס', 'בנייה'];
      const luxuryKeys = ['יוקרה', 'יוקרתי', 'vip', 'פרימיום', 'זהב', 'luxury', 'אלגנטי'];

      const isBeauty = beautyKeys.some(key => lowerText.includes(key));
      const isMedical = medicalKeys.some(key => lowerText.includes(key));
      const isBuild = buildKeys.some(key => lowerText.includes(key));
      const isLuxury = luxuryKeys.some(key => lowerText.includes(key));

      let updateData: any = {};
      let rationale = "";

      // א. זיהוי ענף עסקי וקביעת SEO
      if (isBeauty) {
        updateData = {
          businessType: 'beauty',
          "appConfig.theme.primaryColor": "#1a1a1a",
          "seo.title": `${manifest?.businessName || 'מספרה'} | עיצוב שיער מקצועי`,
          "seo.description": `המספרה המובילה לעיצוב שיער וזקן. חוויית VIP ב${manifest?.businessName || 'מספרה'}.`
        };
        rationale = "זיהיתי שמדובר במספרה. הגדרתי עיצוב מודרני ו-SEO מותאם לעולם הטיפוח.";
      } 
      else if (isMedical) {
        updateData = {
          businessType: 'medical',
          "appConfig.theme.primaryColor": "#0ea5e9",
          "seo.title": `${manifest?.businessName || 'מרפאה'} | טיפול מומחים`,
          "seo.description": `מרפאת מומחים המעניקה טיפול אישי וקביעת תורים מהירה.`
        };
        rationale = "זיהיתי תחום רפואי. הפעלתי הגדרות קליניקה ו-SEO מבוסס אמינות.";
      }
      else if (isBuild) {
        updateData = {
          businessType: 'industrial',
          "appConfig.theme.primaryColor": "#ea580c", // כתום תעשייתי
          "seo.title": `${manifest?.businessName || 'חומרי בניין'} | אספקה טכנית`,
          "seo.description": `המקום המוביל לחומרי בניין, ברזל ותשתיות. אספקה מהירה לקבלנים.`
        };
        rationale = "זיהיתי עסק לחומרי בניין. התאמתי את הממשק לאספקה טכנית ותעשייה.";
      }

      // ב. זיהוי שם עסק דינמי
      const nameMatch = text.match(/(?:קוראים ל|שם העסק הוא|השם הוא)\s+([א-תa-zA-Z0-9\s]+)/);
      if (nameMatch && nameMatch[1]) {
        const newName = nameMatch[1].trim();
        updateData.businessName = newName;
        updateData["seo.title"] = `${newName} | האפליקציה הרשמית`;
        rationale += ` עדכנתי את שם העסק ל-"${newName}".`;
      }

      // ג. זיהוי לוגו (דינמי מקישור)
      const urlMatch = text.match(/https?:\/\/[^\s]+(?:\.png|\.jpg|\.jpeg|\.webp)/i);
      if (urlMatch) {
        updateData["appConfig.theme.logo"] = urlMatch[0];
        updateData.pendingLogoSync = true;
        rationale += " זיהיתי לוגו חדש, אשמור אותו בתיקיית הדרייב המאובטחת.";
      }

      // ד. שדרוג ל-Luxury
      if (isLuxury && manifest?.activeTemplate !== 'luxury') {
        updateData.activeTemplate = 'luxury';
        rationale += " הפעלתי את תבנית ה-Luxury Gold היוקרתית.";
      }

      // ה. בדיקת Setup ראשוני (תיקייה ויומן תחת ramims2026@gmail.com)
      if (!manifest?.driveFolderId && (updateData.businessName || manifest?.businessName)) {
        updateData.needsInfrastructure = true;
        rationale += " אני מכין עבורך תיקייה ייחודית בדרייב ויומן נפרד במערכת.";
      }

      // ו. הזרקת המידע ל-Proposal
      if (Object.keys(updateData).length > 0) {
        setProposal({
          type: 'smart_update',
          rationale: rationale,
          data: updateData
        });
      }

    } catch (err) {
      console.error("Critical AI Error:", err);
    } finally {
      setIsProcessing(false);
    }
  };

  const approveProposal = async () => {
    if (!proposal || !trialId) return;
    try {
      await updateDoc(doc(db, "trials", trialId), proposal.data);
      setProposal(null);
      // כאן ניתן להפעיל Server Action ל-Setup פיזי של דרייב ויומן אם needsInfrastructure הוא true
    } catch (err) {
      console.error("Approval Error:", err);
    }
  };

  const rejectProposal = () => setProposal(null);

  return { manifest, proposal, isProcessing, sendAnswer, approveProposal, rejectProposal };
}
