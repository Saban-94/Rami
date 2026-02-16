/* lib/chat-logic.ts */
import { useState, useEffect } from 'react';
import { db } from './firebase';
import { doc, onSnapshot, updateDoc, arrayUnion, getDoc } from 'firebase/firestore';

export function useChatLogic(trialId: string) {
  const [manifest, setManifest] = useState<any>(null);
  const [proposal, setProposal] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // 1. חיבור ל-Firestore עם Real-time Sync
  useEffect(() => {
    if (!trialId) return;
    const docRef = doc(db, "trials", trialId);

    const unsubscribe = onSnapshot(docRef, (snap) => {
      if (snap.exists()) {
        setManifest(snap.data());
      }
    }, (err) => console.error("Firebase Error:", err));

    return () => unsubscribe();
  }, [trialId]);

  // 2. פונקציית שליחת הודעה עם ניתוח מחוזק
  const sendAnswer = async (text: string) => {
    if (!text || isProcessing || !trialId) return;
    setIsProcessing(true);

    try {
      const docRef = doc(db, "trials", trialId);
      const lowerText = text.toLowerCase();

      // עדכון הצא'ט וההיסטוריה
      await updateDoc(docRef, {
        messages: arrayUnion({
          role: 'user',
          text,
          timestamp: new Date().toISOString()
        })
      });

      // --- מנוע זיהוי כוונות (NER - Logic Engine) ---

      // א. זיהוי עולם היופי (Barber / Beauty)
      const beautyKeywords = ['תספורת', 'זקן', 'שיער', 'פן', 'ספר', 'צבע', 'לק', 'גבות', 'מספרה', 'עיצוב שיער', 'hair', 'barber'];
      if (beautyKeywords.some(key => lowerText.includes(key))) {
        setProposal({
          type: 'industry_update',
          rationale: 'זיהיתי שמדובר בתחום היופי והטיפוח. האם להגדיר תבנית מספרה/סטודיו עם גלריית עבודות?',
          data: { 
            businessType: 'beauty',
            "appConfig.theme.primaryColor": "#111827", // צבע פחם מודרני
            activeTemplate: 'modern'
          }
        });
      }

      // ב. זיהוי עולם הרפואה (Medical / Health)
      const medicalKeywords = ['רופא', 'מרפאה', 'שיניים', 'כואב', 'דחוף', 'בדיקה', 'קליניקה', 'טיפול', 'אבחון', 'dentist', 'clinic'];
      if (medicalKeywords.some(key => lowerText.includes(key))) {
        setProposal({
          type: 'industry_update',
          rationale: 'זיהיתי כוונה רפואית/טיפולית. האם להפעיל תבנית קליניקה עם ניהול תורים מבוסס דחיפות?',
          data: { 
            businessType: 'medical',
            "appConfig.theme.primaryColor": "#0ea5e9" // כחול רפואי
          }
        });
      }

      // ג. זיהוי עולם הבנייה והחומרים (Building Materials - Saban 1994)
      const buildKeywords = ['חומרי בניין', 'ברזל', 'בטון', 'שיפוץ', 'קבלן', 'בלוקים', 'אספקה', 'מלט', 'גבס', 'בנייה'];
      if (buildKeywords.some(key => lowerText.includes(key))) {
        setProposal({
          type: 'industry_update',
          rationale: 'זיהיתי תחום של חומרי בניין ותשתיות. האם להגדיר קטלוג מוצרים כבדים ומערכת הצעות מחיר?',
          data: { 
            businessType: 'industrial',
            "appConfig.theme.primaryColor": "#ea580c" // כתום תעשייתי
          }
        });
      }

      // ד. זיהוי דרישת יוקרה (Luxury / VIP)
      const luxuryKeywords = ['יוקרה', 'יוקרתי', 'vip', 'פרימיום', 'זהב', 'רמה גבוהה', 'luxury', 'premium', 'אלגנטי'];
      if (luxuryKeywords.some(key => lowerText.includes(key)) && manifest?.activeTemplate !== 'luxury') {
        setProposal({
          type: 'tier_upgrade',
          rationale: 'המילים שבהן השתמשת מעידות על מיתוג VIP. האם לשדרג את האפליקציה לתבנית ה-Luxury Gold שלנו?',
          data: { activeTemplate: 'luxury' }
        });
      }

      // ה. זיהוי שעות/מחירים (Update Context)
      if (lowerText.includes('עולה') || lowerText.includes('מחיר') || lowerText.includes('שעות') || lowerText.includes('פתוח')) {
        await updateDoc(docRef, {
          trainingHistory: arrayUnion({
            date: new Date().toLocaleString('he-IL'),
            text: `מידע עסקי חדש: ${text}`
          })
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
      await updateDoc(doc(db, "trials", trialId), proposal.data);
      setProposal(null);
    } catch (err) { console.error(err); }
  };

  const rejectProposal = () => setProposal(null);

  return { manifest, proposal, isProcessing, sendAnswer, approveProposal, rejectProposal };
}
