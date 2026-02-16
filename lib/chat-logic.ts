import { useState, useEffect } from 'react';
import { db } from './firebase';
import { doc, onSnapshot, updateDoc, arrayUnion } from 'firebase/firestore';

export function useChatLogic(trialId: string) {
  const [manifest, setManifest] = useState<any>(null);
  const [proposal, setProposal] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // 1. סנכרון נתונים מול Firestore בזמן אמת
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

  // 2. פונקציית שליחת הודעה וניתוח כוונות (Intent Detection)
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

      // לוגיקת סיווג עסק ו-SEO
      if (isBeauty) {
        updateData = {
          businessType: 'beauty',
          "appConfig.theme.primaryColor": "#1a1a1a",
          "seo.title": `${manifest?.businessName || 'מספרה'} | עיצוב שיער מקצועי`,
          "seo.description": `חווית טיפוח ועיצוב שיער ב${manifest?.businessName || 'מספרה'}.`
        };
        rationale = "זיהיתי שמדובר במספרה. הגדרתי עיצוב מודרני ו-SEO מותאם.";
      } 
      else if (isMedical) {
        updateData = {
          businessType: 'medical',
          "appConfig.theme.primaryColor": "#0ea5e9",
          "seo.title": `${manifest?.businessName || 'מרפאה'} | טיפול מומחים`,
          "seo.description": `מרפאת מומחים המעניקה טיפול אישי וקביעת תורים מהירה.`
        };
        rationale = "זיהיתי כוונה רפואית. הפעלתי הגדרות קליניקה ו-SEO אמין.";
      }

      // זיהוי שם עסק
      const nameMatch = text.match(/(?:קוראים ל|שם העסק הוא|השם הוא)\s+([א-תa-zA-Z0-9\s]+)/);
      if (nameMatch && nameMatch[1]) {
        const newName = nameMatch[1].trim();
        updateData.businessName = newName;
        updateData["seo.title"] = `${newName} | האפליקציה הרשמית`;
        rationale += ` עדכנתי את שם העסק ל-"${newName}".`;
      }

      // זיהוי לוגו מקישור
      const urlMatch = text.match(/https?:\/\/[^\s]+(?:\.png|\.jpg|\.jpeg|\.webp)/i);
      if (urlMatch) {
        updateData["appConfig.theme.logo"] = urlMatch[0];
        rationale += " זיהיתי לוגו חדש, אשמור אותו בתיקייה המאובטחת.";
      }

      // שדרוג ל-Luxury
      if (isLuxury) {
        updateData.activeTemplate = 'luxury';
        rationale += " הפעלתי את תבנית ה-Luxury Gold היוקרתית.";
      }

      // בדיקת צורך בתשתית (Drive/Calendar)
      if (!manifest?.driveFolderId && (updateData.businessName || manifest?.businessName)) {
        updateData.needsInfrastructure = true;
        rationale += " אני מכין עבורך תיקייה בדרייב ויומן עסקי ייחודי.";
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

  // 3. אישור הצעה - כולל ייבוא דינמי למניעת שגיאות Build
  const approveProposal = async () => {
    if (!proposal || !trialId) return;

    try {
      const docRef = doc(db, "trials", trialId);
      await updateDoc(docRef, proposal.data);

      // אם נדרשת הקמת תשתית פיזית (Drive/Calendar)
      if (proposal.data.needsInfrastructure) {
        // ייבוא דינמי של ה-Action רק בצד השרת בזמן ריצה
        const { setupBusinessInfrastructure } = await import("@/app/actions/setup-infrastructure");
        const businessName = manifest?.businessName || proposal.data.businessName;
        
        await setupBusinessInfrastructure(trialId, businessName);
      }

      setProposal(null);
    } catch (err) {
      console.error("Approval Failed:", err);
    }
  };

  const rejectProposal = () => setProposal(null);

  return { manifest, proposal, isProcessing, sendAnswer, approveProposal, rejectProposal };
}
