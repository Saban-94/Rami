/* lib/chat-logic.ts */
import { useState, useEffect } from 'react';
import { db } from './firebase';
import { doc, onSnapshot, updateDoc, arrayUnion, getDoc } from 'firebase/firestore';

export function useChatLogic(trialId: string) {
  const [manifest, setManifest] = useState<any>(null);
  const [proposal, setProposal] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // 1. חיבור ל-Firestore עם מנגנון הגנה מתקיעות
  useEffect(() => {
    if (!trialId) return;

    const docRef = doc(db, "trials", trialId);
    console.log("📡 Connecting to Trial:", trialId);

    // מנגנון Force Fetch - אם ה-Snapshot לא מגיב תוך 3 שניות
    const forceFetch = async () => {
      try {
        const snap = await getDoc(docRef);
        if (snap.exists() && !manifest) {
          console.log("⚡ Force Fetch Success:", snap.data());
          setManifest(snap.data());
        }
      } catch (e) {
        console.error("Force fetch failed", e);
      }
    };

    const timeout = setTimeout(forceFetch, 3000);

    const unsubscribe = onSnapshot(docRef, (snap) => {
      clearTimeout(timeout);
      if (snap.exists()) {
        console.log("✅ Live Data Received:", snap.data());
        setManifest(snap.data());
      } else {
        console.warn("❓ Document missing in 'trials' collection");
      }
    }, (err) => {
      console.error("🔥 Firebase Connection Error:", err);
      clearTimeout(timeout);
    });

    return () => {
      unsubscribe();
      clearTimeout(timeout);
    };
  }, [trialId]);

  // 2. פונקציית שליחת הודעה וניתוח AI (Upsell & Context)
  const sendAnswer = async (text: string) => {
    if (!text || isProcessing || !trialId) return;
    setIsProcessing(true);

    try {
      const docRef = doc(db, "trials", trialId);

      // עדכון היסטוריית הצ'אט ב-Firebase
      await updateDoc(docRef, {
        messages: arrayUnion({
          role: 'user',
          text,
          timestamp: new Date().toISOString()
        }),
        // שמירת המידע ב-Context של המערכת לצורך למידה
        businessContext: text 
      });

      // --- מנוע הניתוח של SabanOS (The AI Brain) ---

      // א. זיהוי צורך ביוקרה (Luxury/Pro Upsell)
      const luxuryKeywords = ['יוקרה', 'יוקרתי', 'vip', 'פרימיום', 'זהב', 'רמה גבוהה', 'luxury', 'premium'];
      const needsLuxury = luxuryKeywords.some(keyword => text.toLowerCase().includes(keyword));

      if (needsLuxury && manifest?.activeTemplate !== 'luxury') {
        setProposal({
          type: 'tier_upgrade',
          rationale: `זיהיתי שהלקוח מחפש מיתוג ברמה גבוהה (VIP). האם להפעיל את תבנית ה-Premium Dark Mode?`,
          data: { activeTemplate: 'luxury' }
        });
      }

      // ב. זיהוי תחום רפואי (ד"ר משה / שיניים)
      const medicalKeywords = ['שיניים', 'רופא', 'מרפאה', 'קליניקה', 'תור', 'בדיקה'];
      const isMedical = medicalKeywords.some(keyword => text.includes(keyword));

      if (isMedical && manifest?.businessType !== 'medical') {
        setProposal({
          type: 'industry_update',
          rationale: 'זיהיתי תחום רפואי. האם להתאים את התבנית לסטנדרט קליני ולהוסיף ניהול תורים?',
          data: { 
            businessType: 'medical',
            "appConfig.theme.primaryColor": "#0ea5e9" // כחול רפואי נקי
          }
        });
      }

      // ג. חילוץ שירותים (Training extraction)
      if (text.includes('עולה') || text.includes('מחיר')) {
        await updateDoc(docRef, {
          trainingHistory: arrayUnion({
            date: new Date().toLocaleString('he-IL'),
            text: `עדכון שירות/מחיר: ${text}`
          })
        });
      }

    } catch (err) {
      console.error("AI Analysis Error:", err);
    } finally {
      setIsProcessing(false);
    }
  };

  // 3. אישור הצעה (Approve Proposal)
  const approveProposal = async () => {
    if (!proposal || !trialId) return;

    try {
      const docRef = doc(db, "trials", trialId);
      await updateDoc(docRef, proposal.data);
      console.log("✅ Proposal Approved & Applied");
      setProposal(null);
    } catch (err) {
      console.error("Failed to approve proposal:", err);
    }
  };

  // 4. דחיית הצעה
  const rejectProposal = () => {
    setProposal(null);
  };

  return { 
    manifest, 
    proposal, 
    isProcessing, 
    sendAnswer, 
    approveProposal, 
    rejectProposal 
  };
}
