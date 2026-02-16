'use client';

import { useEffect } from 'react';
import { useDocumentData } from 'react-firebase-hooks/firestore';
import { db } from '@/lib/firebase';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { useParams } from 'next/navigation';
import { QRCodeSVG } from 'qrcode.react';

export default function WhatsAppAgentPage() {
  const params = useParams();
  const trialId = params?.trialId as string;

  // הגדרת רפרנס למסמך הסטטוס
  const docRef = trialId ? doc(db, "trials", trialId, "whatsapp_agent", "status") : null;
  const [statusDoc, loading, error] = useDocumentData(docRef);

  // --- מנגנון יצירה אוטומטית (המערכת יוצרת בעצמה) ---
  useEffect(() => {
    async function initDoc() {
      // אם סיימנו לטעון, ואין מסמך, ויש לנו מזהה תקין
      if (!loading && !statusDoc && docRef) {
        console.log("🛠️ מלשינון: מסמך חסר - יוצר מסמך סטטוס אוטומטי...");
        try {
          await setDoc(docRef, {
            status: 'initializing',
            qr: '', // יתמלא על ידי השרת בהמשך
            createdAt: serverTimestamp(),
            lastUpdate: serverTimestamp()
          }, { merge: true });
        } catch (e) {
          console.error("❌ שגיאה ביצירת מסמך אוטומטי:", e);
        }
      }
    }
    initDoc();
  }, [loading, statusDoc, docRef]);

  // מצבי תצוגה
  if (!trialId) return <div className="p-10 text-center font-bold text-red-500">🚨 שגיאה: חסר Trial ID בכתובת</div>;
  
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900">
      <div className="text-green-500 font-mono animate-pulse">⏳ בודק חיבור למערכת SabanOS...</div>
    </div>
  );

  // אם עדיין אין מסמך (בזמן שה-useEffect עובד)
  if (!statusDoc) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900">
      <div className="text-blue-400 font-mono italic">🛠️ מקים תשתית וואטסאפ ראשונית...</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 p-8 flex flex-col items-center justify-center">
      <div className="bg-white p-10 rounded-[3rem] shadow-2xl border border-slate-100 max-w-md w-full text-center">
        <h2 className="text-3xl font-black italic mb-2">SabanOS</h2>
        <p className="text-slate-500 mb-8 font-medium">חיבור סוכן WhatsApp</p>
        
        <div className="flex flex-col items-center gap-6">
          {statusDoc.qr ? (
            <>
              <div className="p-6 bg-white border-[12px] border-slate-900 rounded-[2.5rem] shadow-inner">
                <QRCodeSVG value={statusDoc.qr} size={220} />
              </div>
              <div className="space-y-2">
                <p className="text-lg font-black text-green-600 animate-bounce">הקוד מוכן לסריקה!</p>
                <p className="text-xs text-slate-400">פתח וואטסאפ &gt; מכשירים מקושרים &gt; קשר מכשיר</p>
              </div>
            </>
          ) : (
            <div className="py-12 px-6">
              {statusDoc.status === 'authenticated' ? (
                <div className="space-y-4">
                  <div className="text-5xl">✅</div>
                  <p className="text-xl font-bold text-slate-800">המערכת מחוברת!</p>
                  <p className="text-sm text-slate-500">הסוכן מוכן לקבל הודעות ולהפעיל את ה-AI</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="w-12 h-12 border-4 border-t-blue-600 border-slate-200 rounded-full animate-spin mx-auto"></div>
                  <p className="text-slate-600 font-medium">ממתין לשרת שינפיק קוד QR...</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* לוג נתונים טכני קטן למטה */}
        <div className="mt-10 pt-6 border-t border-slate-50">
          <p className="text-[9px] text-slate-300 font-mono">STATUS: {statusDoc.status || 'unknown'}</p>
        </div>
      </div>
    </div>
  );
}
