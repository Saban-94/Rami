'use client';

import { useDocumentData } from 'react-firebase-hooks/firestore';
import { db } from '@/lib/firebase';
import { doc } from 'firebase/firestore';
import { useParams } from 'next/navigation';
import { QRCodeSVG } from 'qrcode.react'; // וודא שהתקנת: npm install qrcode.react

export default function WhatsAppAgentPage() {
  const params = useParams();
  const trialId = params?.trialId as string;

  // ה"מלשינון": בדיקת תקינות הנתיב ב-Console
  console.log("🔍 SabanOS Debug:", { trialId, path: `trials/${trialId}/whatsapp_agent/status` });

  const docRef = trialId ? doc(db, "trials", trialId, "whatsapp_agent", "status") : null;
  const [statusDoc, loading, error] = useDocumentData(docRef);

  // 1. בדיקת מזהה
  if (!trialId) {
    return (
      <div className="p-8 bg-red-50 text-red-600 border-2 border-red-200 rounded-3xl">
        <h1 className="font-black">🚨 מלשינון: חסר Trial ID</h1>
        <p>הכתובת בדפדפן לא מכילה מזהה תקין.</p>
      </div>
    );
  }

  // 2. מצב טעינה
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 text-green-500 font-mono">
        <div className="animate-pulse">⏳ מתחבר לליבת WhatsApp... (בודק Firestore)</div>
      </div>
    );
  }

  // 3. בדיקת שגיאות Firebase
  if (error) {
    return (
      <div className="p-8 bg-orange-50 text-orange-700 border-2 border-orange-200 rounded-3xl">
        <h1 className="font-black">❌ מלשינון: שגיאת תקשורת</h1>
        <pre className="text-xs mt-2">{JSON.stringify(error, null, 2)}</pre>
      </div>
    );
  }

  // 4. בדיקה אם המסמך בכלל קיים
  if (!statusDoc) {
    return (
      <div className="p-8 bg-yellow-50 text-yellow-800 border-2 border-yellow-200 rounded-3xl">
        <h1 className="font-black">⚠️ מלשינון: המסמך לא נמצא!</h1>
        <p>הנתיב ב-Firestore ריק. וודא שקיים מסמך בכתובת:</p>
        <code className="block bg-white p-2 mt-2 rounded border text-xs">
          trials/{trialId}/whatsapp_agent/status
        </code>
      </div>
    );
  }

  // 5. אם הכל תקין אבל אין QR
  return (
    <div className="min-h-screen bg-slate-50 p-8 flex flex-col items-center">
      <div className="bg-white p-8 rounded-[3rem] shadow-2xl border border-slate-100 max-w-md w-full text-center">
        <h2 className="text-2xl font-black italic mb-6">WhatsApp Sync</h2>
        
        {statusDoc.qr ? (
          <div className="flex flex-col items-center gap-4">
            <div className="p-4 bg-white border-8 border-slate-900 rounded-[2rem]">
              <QRCodeSVG value={statusDoc.qr} size={200} />
            </div>
            <p className="text-sm font-bold text-green-600 animate-bounce">סרוק עכשיו להתחברות</p>
          </div>
        ) : (
          <div className="text-slate-400 italic">
            {statusDoc.status === 'authenticated' ? 
              "✅ מחובר בהצלחה!" : 
              "ממתין ליצירת קוד QR מהשרת..."}
          </div>
        )}

        {/* פאנל נתונים חי - "מלשינון נתונים" */}
        <div className="mt-8 pt-6 border-t border-slate-100 text-right">
          <p className="text-[10px] font-black opacity-30 uppercase mb-2">Debug Info:</p>
          <pre className="text-[10px] bg-slate-50 p-3 rounded-xl overflow-auto max-h-32">
            {JSON.stringify(statusDoc, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
}
