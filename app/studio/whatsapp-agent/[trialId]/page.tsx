'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  QrCode, MessageSquare, BrainCircuit, Users, 
  Flame, Thermometer, CheckCircle2, Send, Zap, Clock 
} from 'lucide-react';
import { db } from '@/lib/firebase';
import { doc, onSnapshot, updateDoc } from 'firebase/firestore';

export default function WhatsAppAgentPage({ params }: { params: { trialId: string } }) {
  const [activeStep, setActiveStep] = useState(1);
  const [qrStatus, setQrStatus] = useState<'idle' | 'scanning' | 'connected'>('idle');
  const [agentConfig, setAgentConfig] = useState({
    businessDesc: '',
    welcomeMsg: 'שלום! אני הבוט של SabanOS, איך אוכל לעזור?',
    faqs: [{ q: '', a: '' }]
  });

  // סנכרון הגדרות הבוט מה-DB
  useEffect(() => {
    if (!params.trialId) return;
    const unsub = onSnapshot(doc(db, "trials", params.trialId), (snap) => {
      if (snap.exists() && snap.data().agentConfig) {
        setAgentConfig(snap.data().agentConfig);
      }
    });
    return () => unsub();
  }, [params.trialId]);

  return (
    <main className="min-h-screen bg-[#020617] text-white p-8 font-sans" dir="rtl">
      {/* Header */}
      <div className="max-w-5xl mx-auto mb-12 flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-black italic tracking-tighter uppercase">WhatsApp AI Agent</h1>
          <p className="opacity-50 text-sm font-bold mt-2 italic">חבר את העסק שלך לאוטומציה מלאה תוך דקות</p>
        </div>
        <div className="flex gap-4">
          {[1, 2, 3].map(step => (
            <div key={step} className={`w-8 h-8 rounded-full flex items-center justify-center font-black transition-all ${activeStep >= step ? 'bg-green-500 text-black shadow-lg shadow-green-500/20' : 'bg-white/10 opacity-30'}`}>
              {step}
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-5xl mx-auto grid grid-cols-12 gap-8">
        
        {/* עמודה שמאלית: הגדרות (Workspace) */}
        <div className="col-span-8 space-y-6">
          
          {/* שלב 1: חיבור QR (כמו בסרטון) */}
          {activeStep === 1 && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="p-10 bg-white/5 border border-white/10 rounded-[3rem] text-center space-y-6">
              <div className="w-48 h-48 bg-white p-4 mx-auto rounded-3xl shadow-2xl relative overflow-hidden group">
                {qrStatus === 'connected' ? (
                  <div className="absolute inset-0 bg-green-500 flex flex-col items-center justify-center text-black font-black">
                    <CheckCircle2 size={48} />
                    <span>מחובר!</span>
                  </div>
                ) : (
                  <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=SabanOS-Connect" alt="QR" className="w-full h-full opacity-80" />
                )}
              </div>
              <h2 className="text-2xl font-black italic">סרוק קוד QR לחיבור הוואטסאפ</h2>
              <p className="opacity-50 text-sm max-w-sm mx-auto font-bold italic">פתחו את הווטסאפ בנייד, היכנסו להגדרות {'>'} מכשירים מקושרים וסרקו את הקוד.</p>
              <button 
                onClick={() => { setQrStatus('connected'); setTimeout(() => setActiveStep(2), 1500); }}
                className="px-10 py-4 bg-green-600 rounded-2xl font-black uppercase italic shadow-xl hover:scale-105 transition-all"
              >
                סרקתי, המשך לשלב הבא
              </button>
            </motion.div>
          )}

          {/* שלב 2: הגדרת "אישיות" הבוט (FAQ) */}
          {activeStep === 2 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
              <div className="p-8 bg-white/5 border border-white/10 rounded-[3rem] space-y-4">
                <h3 className="text-xl font-black italic flex items-center gap-2 text-green-500"><BrainCircuit size={20}/> אישיות ה-AI</h3>
                <textarea 
                  placeholder="ספר ל-AI על העסק שלך (שעות פעילות, שירותים, מחירים)..."
                  className="w-full bg-black/20 border border-white/5 rounded-2xl p-6 text-sm outline-none focus:border-green-500 h-32 transition-all italic"
                />
              </div>

              <div className="p-8 bg-white/5 border border-white/10 rounded-[3rem] space-y-4">
                <h3 className="text-xl font-black italic flex items-center gap-2 text-blue-400"><MessageSquare size={20}/> שאלות ותשובות נפוצות</h3>
                <div className="space-y-3">
                  <input type="text" placeholder="שאלה (למשל: כמה עולה תספורת?)" className="w-full bg-black/20 border border-white/5 rounded-2xl p-4 text-xs outline-none" />
                  <input type="text" placeholder="תשובה" className="w-full bg-black/20 border border-white/5 rounded-2xl p-4 text-xs outline-none focus:border-blue-400" />
                </div>
              </div>
              
              <button onClick={() => setActiveStep(3)} className="w-full py-5 bg-green-600 rounded-3xl font-black italic uppercase shadow-2xl">שמור והפעל בוט</button>
            </motion.div>
          )}

          {/* שלב 3: מדחום לידים (CRM Analytics) */}
          {activeStep === 3 && (
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="p-8 bg-green-500/10 border border-green-500/20 rounded-[3rem] text-center">
                  <Flame className="text-green-500 mx-auto mb-2" size={32} />
                  <p className="text-4xl font-black italic">14</p>
                  <p className="text-[10px] font-black uppercase opacity-60">לידים חמים היום</p>
                </div>
                <div className="p-8 bg-blue-500/10 border border-blue-500/20 rounded-[3rem] text-center">
                  <Zap className="text-blue-500 mx-auto mb-2" size={32} />
                  <p className="text-4xl font-black italic">85%</p>
                  <p className="text-[10px] font-black uppercase opacity-60">אחוזי סגירה אוטומטיים</p>
                </div>
              </div>

              <div className="p-8 bg-white/5 border border-white/10 rounded-[3rem]">
                <h3 className="text-xl font-black italic mb-6">צ'אטים פעילים כעת</h3>
                <div className="space-y-4">
                  {[
                    { name: 'ראמי', status: 'חם מאוד', temp: 95 },
                    { name: 'ד״ר שן', status: 'מתעניין', temp: 60 }
                  ].map((lead, i) => (
                    <div key={i} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
                      <div className="flex items-center gap-3">
                         <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center font-black">R</div>
                         <div>
                           <p className="text-xs font-bold">{lead.name}</p>
                           <p className="text-[8px] font-black uppercase text-green-500">{lead.status}</p>
                         </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Thermometer size={14} className="text-red-500" />
                        <div className="w-24 h-1.5 bg-white/10 rounded-full overflow-hidden">
                          <div className="h-full bg-red-500" style={{ width: `${lead.temp}%` }} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* עמודה ימנית: סימולטור ווטסאפ חי */}
        <div className="col-span-4 flex flex-col items-center">
          <div className="sticky top-10">
            <div className="relative border-[10px] border-slate-900 rounded-[3.5rem] h-[600px] w-[300px] bg-[#0b141a] shadow-2xl overflow-hidden">
               <div className="bg-[#1f2c34] p-4 pt-8 flex items-center gap-3 border-b border-white/5">
                 <div className="w-8 h-8 rounded-full bg-green-500" />
                 <span className="text-[10px] font-bold">SabanOS Agent</span>
               </div>
               <div className="p-4 space-y-4">
                 <div className="bg-[#1f2c34] p-3 rounded-2xl rounded-tr-none text-[10px] max-w-[80%]">שלום! ראיתי שאתה מתעניין בטיפול 10K. מתי נוח לך להגיע?</div>
                 <div className="bg-[#005c4b] p-3 rounded-2xl rounded-tl-none text-[10px] max-w-[80%] mr-auto italic font-bold tracking-tight">ביום ראשון בבוקר אם אפשר.</div>
                 <div className="bg-[#1f2c34] p-3 rounded-2xl rounded-tr-none text-[10px] max-w-[80%] border border-green-500/30">מעולה! רשמתי אותך ליום ראשון ה-22.02 ב-09:00. תגיע? ✅</div>
               </div>
            </div>
            <p className="text-center mt-4 text-[10px] font-black uppercase opacity-20 tracking-widest">Preview Mode</p>
          </div>
        </div>

      </div>
    </main>
  );
}
