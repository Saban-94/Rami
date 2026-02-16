'use client';

import { useEffect, useState } from 'react';
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

  const docRef = trialId ? doc(db, "trials", trialId, "whatsapp_agent", "status") : null;
  const [statusDoc, loading, error] = useDocumentData(docRef);

  // 1. ניסיון יצירה/תיקון אוטומטי של המסמך
  useEffect(() => {
    async function initDoc() {
      if (!loading && !statusDoc && docRef) {
        addLog("🛠️ מסמך חסר - מנסה ליצור...");
        try {
          await setDoc(docRef, {
            status: 'initializing',
            qr: '',
            lastServerPulse: null, // שדה לבדיקת דופק השרת
            updatedAt: serverTimestamp()
          }, { merge: true });
          addLog("✅ מסמך נוצר בהצלחה.");
        } catch (e: any) {
          addLog(`❌ שגיאת הרשאות: ${e.message}`);
        }
      }
    }
    initDoc();
  }, [loading, statusDoc, docRef]);

  if (!trialId) return <div className="p-10 text-red-500 font-bold">🚨 שגיאה: חסר Trial ID</div>;

  return (
    <div className="min-h-screen bg-[#0f172a] p-4 flex flex-col items-center justify-center font-sans text-white">
      <div className="bg-[#1e293b] p-8 rounded-[2.5rem] shadow-2xl border border-white/10 max-w-md w-full">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-black italic tracking-tighter">SabanOS <span className="text-green-500">WA</span></h2>
          <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${statusDoc?.qr ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
            {statusDoc?.status || 'Offline'}
          </div>
        </div>

        <div className="flex flex-col items-center justify-center min-h-[250px]">
          {error && (
            <div className="bg-red-500/20 p-4 rounded-2xl text-red-400 text-xs mb-4 w-full">
              <strong>שגיאת Firebase:</strong> {error.message}
            </div>
          )}

          {statusDoc?.qr ? (
            <div className="space-y-6 text-center">
              <div className="p-4 bg-white rounded-[2rem] inline-block shadow-[0_0_50px_rgba(34,197,94,0.3)]">
                <QRCodeSVG value={statusDoc.qr} size={200} />
              </div>
              <p className="text-green-400 font-bold animate-pulse">קוד QR זוהה! סרוק עכשיו</p>
            </div>
          ) : statusDoc?.status === 'authenticated' ? (
            <div className="text-center space-y-4">
              <div className="text-6xl text-green-500">✅</div>
              <h3 className="text-xl font-bold">סוכן מחובר לעבודה</h3>
            </div>
          ) : (
            <div className="text-center space-y-6 w-full">
              <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
              <div className="space-y-2">
                <p className="text-slate-400 font-medium">ממתין לשרת WhatsApp...</p>
                
                {/* מלשינון דופק שרת */}
                <div className="bg-black/20 p-3 rounded-xl text-[10px] text-left">
                   <p className="text-slate-500 mb-1 font-bold">Server Health Check:</p>
                   <p>• Firestore Connection: <span className="text-green-500">OK</span></p>
                   <p>• Server Pulse: {statusDoc?.lastServerPulse ? 
                     <span className="text-green-500">Active</span> : 
                     <span className="text-red-500">No Pulse (השרת לא מגיב)</span>}
                   </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* לוג פעולות בזמן אמת */}
        <div className="mt-8 pt-6 border-t border-white/5">
          <p className="text-[10px] font-bold text-slate-500 uppercase mb-3 tracking-widest">Live Debug Log:</p>
          <div className="space-y-1">
            {debugLog.map((log, i) => (
              <p key={i} className="text-[9px] font-mono text-slate-400 border-l border-green-500/30 pl-2">{log}</p>
            ))}
            {loading && <p className="text-[9px] font-mono text-blue-400 animate-pulse">טוען נתונים מ-Firebase...</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
