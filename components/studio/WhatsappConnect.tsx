'use client';

import React, { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react'; // ספריה לרינדור QR
import { motion } from 'framer-motion';
import { db } from '@/lib/firebase';
import { doc, onSnapshot } from 'firebase/firestore';
import { CheckCircle2, Loader2, RefreshCw } from 'lucide-react';

export default function WhatsappConnect({ trialId }: { trialId: string }) {
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [status, setStatus] = useState<'loading' | 'qr_ready' | 'connected'>('loading');

  useEffect(() => {
    if (!trialId) return;

    // האזנה למסמך ה-Agent ב-Firebase לקבלת ה-QR מהשרת
    const unsub = onSnapshot(doc(db, "trials", trialId, "whatsapp_agent", "status"), (snap) => {
      const data = snap.data();
      if (data?.qr) {
        setQrCode(data.qr); // ה-String שהשרת שלח
        setStatus('qr_ready');
      }
      if (data?.connected) {
        setStatus('connected');
      }
    });

    return () => unsub();
  }, [trialId]);

  return (
    <div className="flex flex-col items-center justify-center space-y-6 p-10 bg-white/5 border border-white/10 rounded-[3rem] backdrop-blur-xl">
      
      <div className="relative">
        {/* מסגרת ה-QR המעוצבת */}
        <div className="w-64 h-64 bg-white p-4 rounded-[2.5rem] shadow-2xl flex items-center justify-center relative overflow-hidden">
          
          {status === 'loading' && (
            <div className="flex flex-col items-center gap-2 text-slate-900">
              <Loader2 className="animate-spin text-green-600" size={40} />
              <span className="text-[10px] font-black uppercase italic">מייצר חיבור...</span>
            </div>
          )}

          {status === 'qr_ready' && qrCode && (
            <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}>
              <QRCodeSVG value={qrCode} size={220} level="H" includeMargin={true} />
            </motion.div>
          )}

          {status === 'connected' && (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              className="absolute inset-0 bg-green-500 flex flex-col items-center justify-center text-white"
            >
              <CheckCircle2 size={60} className="mb-2" />
              <span className="font-black italic uppercase tracking-widest text-lg">המכשיר מחובר</span>
            </motion.div>
          )}
        </div>

        {/* אנימציית סריקה (Scanner Line) */}
        {status === 'qr_ready' && (
          <motion.div 
            animate={{ top: ['10%', '90%', '10%'] }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            className="absolute left-4 right-4 h-0.5 bg-green-500 shadow-[0_0_15px_rgba(34,197,94,0.8)] z-10 pointer-events-none"
          />
        )}
      </div>

      <div className="text-center space-y-2">
        <h3 className="text-xl font-black italic uppercase tracking-tighter">חיבור WhatsApp Agent</h3>
        <p className="text-xs opacity-50 font-bold max-w-[250px] mx-auto">
          {status === 'connected' 
            ? 'הסוכן שלך פעיל כעת ומשיב ללקוחות' 
            : 'סרוק את הקוד כדי להעניק ל-AI גישה להשיב ללקוחות שלך'}
        </p>
      </div>

      {status === 'qr_ready' && (
        <button className="flex items-center gap-2 text-[10px] font-black uppercase opacity-40 hover:opacity-100 transition-all">
          <RefreshCw size={12} /> רענן קוד QR
        </button>
      )}
    </div>
  );
}
