'use client';

import { useEffect, useState, useMemo } from 'react';
import { useDocumentData } from 'react-firebase-hooks/firestore';
import { db } from '@/lib/firebase';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { useParams } from 'next/navigation';
import { QRCodeSVG } from 'qrcode.react';

export default function WhatsAppAgentPage() {
  const params = useParams();
  const trialId = params?.trialId as string;
  const [debugLog, setDebugLog] = useState<string[]>([]);

  const addLog = (msg: string) => {
    setDebugLog(prev => [`${new Date().toLocaleTimeString()}: ${msg}`, ...prev].slice(0, 5));
  };

  // מניעת קריסה: יצירת Reference למסמך רק אם db ו-trialId קיימים
  const docRef = useMemo(() => {
    if (!db || !trialId) return null;
    try {
      return doc(db, "trials", trialId, "whatsapp_agent", "status");
    } catch (e) {
      console.error("Firebase Path Error:", e);
      return null;
    }
  }, [trialId]);

  // האזנה לנתונים בזמן אמת מה-Firestore
  const [statusDoc, loading, error] = useDocumentData(docRef);

  // אפקט לאתחול המסמך במידה והוא חסר
  useEffect(() => {
    async function initDoc() {
      if (loading || !docRef || statusDoc) return;

      addLog("🛠️ מסנכרן מול ה-Database...");
      try {
        await setDoc(docRef, {
          status: 'initializing',
          updatedAt: serverTimestamp()
        }, { merge: true });
        addLog("✅ סנכרון ראשוני הצליח.");
      } catch (e: any) {
        addLog(`❌ שגיאת חיבור: ${e.message}`);
      }
    }
    initDoc();
  }, [loading, statusDoc, docRef]);

  if (!trialId) return <div className="p-10 text-red-500 font-bold text-center">🚨 שגיאה: חסר Trial ID בכתובת</div>;

  return (
    <div className="min-h-screen bg-[#0f172a] p-4 flex flex-col items-center justify-center font-sans text-white">
      <div className="bg-[#1e293b] p-8 rounded-[2.5rem] shadow-2xl border border-white/10 max-w-md w-full">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-black italic tracking-tighter">SabanOS <span className="text-green-500">WA</span></h2>
          <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${statusDoc?.qr ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
            {statusDoc?.status || (loading ? 'טוען...' : 'OFFLINE')}
          </div>
        </div>

        {/* Main Interface */}
        <div className="flex flex-col items-center justify-center min-h-[300px]">
          
          {error && (
            <div className="bg-red-500/20 p-4 rounded-2xl text-red-400 text-[10px] mb-4 w-full">
              <strong>שגיאת Firebase:</strong> {error.message}
            </div>
          )}

          {statusDoc?.qr ? (
            <div className="space-y-6 text-center animate-in fade-in zoom-in duration-500">
              <div className="p-5 bg-white rounded-[2.5rem] inline-block shadow-[0_0_60px_rgba(34,197,94,0.4)]">
                <QRCodeSVG value={statusDoc.qr} size={220} />
              </div>
              <div className="space-y-2">
                <p className="text-green-400 font-black text-lg animate-pulse">קוד QR מוכן לסריקה!</p>
                <p className="text-slate-400 text-xs">פתח וואטסאפ במכשיר וסרוק את הקוד</p>
              </div>
            </div>
          ) : statusDoc?.status === 'authenticated' ? (
            <div className="text-center space-y-4">
              <div className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center mx-auto border border-green-500/50">
                <span className="text-5xl">✅</span>
              </div>
              <h3 className="text-xl font-bold text-green-400">הסוכן מחובר ופעיל</h3>
              <p className="text-slate-400 text-sm">המערכת עובדת כעת ב-Replit</p>
            </div>
          ) : (
            <div className="text-center space-y-6 w-full">
              <div className="relative">
                <div className="w-20 h-20 border-4 border-green-500/20 border-t-green-500 rounded-full animate-spin mx-auto"></div>
              </div>
              <div className="space-y-4">
                <p className="text-slate-400 font-medium">ממתין לסיגנל מ-Replit...</p>
                
                {/* המלשינון המשודרג - Server Health Monitor */}
                <div className="bg-black/30 p-4 rounded-2xl text-[11px] text-left border border-white/5 shadow-inner">
                   <p className="text-slate-500 mb-2 font-bold flex items-center">
                     <span className={`w-2 h-2 rounded-full mr-2 ${statusDoc?.lastServerPulse ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></span>
                     SERVER MONITOR
                   </p>
                   <div className="space-y-1.5">
                     <p className="flex justify-between">
                       <span>חיבור נתונים:</span> 
                       <span className={db ? "text-green-500" : "text-red-500"}>{db ? "תקין ✅" : "שגיאה ❌"}</span>
                     </p>
                     <p className="flex justify-between">
                       <span>סטטוס שרת:</span> 
                       <span className="text-blue-400">{statusDoc?.status || 'מאתחל...'}</span>
                     </p>
                     <p className="flex justify-between border-t border-white/5 pt-1.5 mt-1.5">
                       <span>דופק אחרון:</span> 
                       {statusDoc?.lastServerPulse ? (
                         <span className="text-green-400 font-mono">
                           {new Date(statusDoc.lastServerPulse.toDate()).toLocaleTimeString()}
                         </span>
                       ) : (
                         <span className="text-yellow-500 italic">מחכה ל-Replit...</span>
                       )}
                     </p>
                   </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Live Debug Log */}
        <div className="mt-8 pt-6 border-t border-white/5">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">Activity Log</p>
          <div className="space-y-1.5 bg-black/20 p-3 rounded-xl min-h-[60px]">
            {debugLog.length > 0 ? debugLog.map((log, i) => (
              <p key={i} className="text-[9px] font-mono text-slate-400 border-l-2 border-green-500/30 pl-2">{log}</p>
            )) : (
              <p className="text-[9px] font-mono text-slate-600 italic">אין פעילות בדף כרגע</p>
            )}
          </div>
        </div>

      </div>
      <p className="mt-6 text-slate-600 text-[10px] font-medium tracking-widest uppercase italic">SabanOS Control Studio</p>
    </div>
  );
}
