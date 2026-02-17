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
      // יצירת נתיב ישיר למסמך הסטטוס
      return doc(db, "trials", trialId, "whatsapp_agent", "status");
    } catch (e) {
      console.error("Firebase Path Error:", e);
      return null;
    }
  }, [trialId]);

  // שימוש ב-Hook להאזנה בזמן אמת
  const [statusDoc, loading, error] = useDocumentData(docRef);

  // אפקט לאתחול המסמך במידה והוא חסר ב-Firestore
  useEffect(() => {
    async function initDoc() {
      if (loading || !docRef || statusDoc) return;

      addLog("🛠️ בודק סנכרון מול Firestore...");
      try {
        await setDoc(docRef, {
          status: 'initializing',
          updatedAt: serverTimestamp()
        }, { merge: true });
        addLog("✅ סנכרון ראשוני הושלם.");
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
            {statusDoc?.status || (loading ? 'טוען...' : 'ממתין')}
          </div>
        </div>

        {/* Main Interface */}
        <div className="flex flex-col items-center justify-center min-h-[280px]">
          
          {error && (
            <div className="bg-red-500/20 p-4 rounded-2xl text-red-400 text-[10px] mb-4 w-full">
              <strong>שגיאת חיבור:</strong> {error.message}
              <p className="mt-1 opacity-70">בדוק שמשתני NEXT_PUBLIC ב-Vercel מוגדרים.</p>
            </div>
          )}

          {statusDoc?.qr ? (
            <div className="space-y-6 text-center animate-in fade-in zoom-in duration-500">
              <div className="p-5 bg-white rounded-[2.5rem] inline-block shadow-[0_0_60px_rgba(34,197,94,0.4)]">
                <QRCodeSVG value={statusDoc.qr} size={220} />
              </div>
              <div className="space-y-2">
                <p className="text-green-400 font-black text-lg animate-pulse">קוד QR מוכן!</p>
                <p className="text-slate-400 text-xs">פתח וואטסאפ {'>'} מכשירים מקושרים {'>'} קשר מכשיר</p>
              </div>
            </div>
          ) : statusDoc?.status === 'authenticated' ? (
            <div className="text-center space-y-4">
              <div className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center mx-auto border border-green-500/50">
                <span className="text-5xl">✅</span>
              </div>
              <h3 className="text-xl font-bold text-green-400">הסוכן מחובר ופעיל</h3>
              <p className="text-slate-400 text-sm">המערכת מאזינה להודעות כעת</p>
            </div>
          ) : (
            <div className="text-center space-y-6 w-full">
              <div className="relative">
                <div className="w-20 h-20 border-4 border-green-500/20 border-t-green-500 rounded-full animate-spin mx-auto"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-12 h-12 bg-green-500/10 rounded-full animate-ping"></div>
                </div>
              </div>
              
              <div className="space-y-4">
                <p className="text-slate-400 font-medium">ממתין לסיגנל מהשרת ב-Replit...</p>
                
                {/* Server Health Monitor */}
                <div className="bg-black/30 p-4 rounded-2xl text-[11px] text-left border border-white/5">
                   <p className="text-slate-500 mb-2 font-bold flex items-center">
                     <span className="w-2 h-2 bg-blue-500 rounded-full mr-2 animate-pulse"></span>
                     SERVER MONITOR
                   </p>
                   <div className="space-y-1.5">
                     <p className="flex justify-between">
                       <span>Firestore:</span> 
                       <span className={db ? "text-green-500" : "text-red-500"}>{db ? "מחובר" : "שגיאת מפתחות"}</span>
                     </p>
                     <p className="flex justify-between">
                       <span>Server Pulse:</span> 
                       {statusDoc?.lastServerPulse ? 
                         <span className="text-green-400 font-bold">LIVE (שרת פעיל)</span> : 
                         <span className="text-yellow-500">WAITING (ממתין לדופק)</span>}
                     </p>
                   </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Live Debug Log */}
        <div className="mt-8 pt-6 border-t border-white/5">
          <div className="flex items-center justify-between mb-3">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Live Activity Log</p>
            {loading && <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-ping"></div>}
          </div>
          <div className="space-y-1.5 bg-black/20 p-3 rounded-xl min-h-[60px]">
            {debugLog.length > 0 ? debugLog.map((log, i) => (
              <p key={i} className="text-[9px] font-mono text-slate-400 border-l-2 border-green-500/30 pl-2 leading-relaxed">{log}</p>
            )) : (
              <p className="text-[9px] font-mono text-slate-600 italic">ממתין לפעילות שרת...</p>
            )}
          </div>
        </div>

      </div>
      <p className="mt-6 text-slate-600 text-[10px] font-medium tracking-widest uppercase">Powered by SabanOS Infrastructure</p>
    </div>
  );
}
