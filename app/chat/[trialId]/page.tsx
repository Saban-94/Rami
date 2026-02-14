"use client";

import React, { useState, useEffect, useRef } from "react";
import { db } from "../../../lib/firebase";
import { doc, getDoc, updateDoc, arrayUnion } from "firebase/firestore";
import ChatInterface from "../../../components/ChatInterface";
import Navigation from "../../../components/Navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Brain, Sparkles, Lock, Calendar, 
  Clock, Paperclip, ChevronRight, 
  ChevronLeft, Plus, Settings, Activity
} from "lucide-react";

export default function ProfessionalAdminPage({ params }: { params: { trialId: string } }) {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [inputCode, setInputCode] = useState("");
  const [businessData, setBusinessData] = useState<any>(null);
  const [extraContext, setExtraContext] = useState("");
  const [aiCanvasText, setAiCanvasText] = useState("");
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchDoc = async () => {
      const docRef = doc(db, "trials", params.trialId);
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        const data = snap.data();
        setBusinessData(data);
        setExtraContext(data.businessContext || "");
      }
      setLoading(false);
    };
    fetchDoc();
  }, [params.trialId]);

  const handleVerify = () => {
    if (inputCode === businessData?.accessCode) {
      setIsAuthorized(true);
      typeToCanvas(`מערכת SabanOS Smart AI הופעלה. שלום עמאר, המוח מאזין ומסונכרן ליומן של ${businessData?.businessName}.`);
    }
  };

  const typeToCanvas = (text: string) => {
    setAiCanvasText("");
    let i = 0;
    const interval = setInterval(() => {
      setAiCanvasText((prev) => prev + text.charAt(i));
      i++;
      if (i >= text.length) clearInterval(interval);
    }, 25);
  };

  const saveBrainUpdate = async () => {
    const docRef = doc(db, "trials", params.trialId);
    await updateDoc(docRef, { businessContext: extraContext });
    typeToCanvas(`העדכון התקבל. המוח למד את הנתונים החדשים: "${extraContext}". אני מעדכן את זמינות התורים בהתאם.`);
  };

  // לוגיקת יומן
  const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();
  const calendarDays = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  if (loading) return <div className="min-h-screen bg-[#020617] flex items-center justify-center text-green-500 font-black italic">LOADING SabanOS...</div>;

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center p-4" dir="rtl">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-white/5 border border-white/10 p-12 rounded-[3.5rem] max-w-md w-full text-center backdrop-blur-3xl shadow-2xl">
          <div className="w-24 h-24 bg-green-500 rounded-[2.5rem] mx-auto mb-8 flex items-center justify-center shadow-2xl">
            <Lock className="text-black" size={40} />
          </div>
          <h2 className="text-3xl font-black text-white italic mb-8">SabanOS Access</h2>
          <input 
            type="password" maxLength={4} value={inputCode}
            onChange={(e) => setInputCode(e.target.value)}
            className="w-full bg-black/40 border-2 border-white/10 rounded-2xl p-6 text-center text-4xl tracking-[15px] text-green-500 outline-none focus:border-green-500 mb-8"
            placeholder="****"
          />
          <button onClick={handleVerify} className="w-full bg-green-500 text-black font-black py-5 rounded-2xl text-xl hover:bg-green-400 transition-all uppercase tracking-tighter">Enter Brain</button>
        </motion.div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#020617] text-white font-sans selection:bg-green-500/30" dir="rtl">
      <Navigation />
      
      <div className="pt-28 px-8 max-w-[1600px] mx-auto pb-20">
        
        {/* TOP INTERFACE */}
        <div className="flex items-center justify-between mb-12 bg-white/5 p-10 rounded-[4rem] border border-white/10 backdrop-blur-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10"><Activity size={120} /></div>
          <div className="flex items-center gap-8 relative z-10">
            <div className="relative group">
              <div className="w-28 h-28 rounded-[2.5rem] bg-black/60 border-2 border-green-500/30 overflow-hidden flex items-center justify-center">
                {businessData?.logoUrl ? <img src={businessData.logoUrl} className="w-full h-full object-cover" /> : <span className="text-5xl font-black italic text-green-500">{businessData?.businessName?.[0]}</span>}
              </div>
              <button onClick={() => fileInputRef.current?.click()} className="absolute -bottom-2 -right-2 bg-white text-black p-2.5 rounded-full hover:bg-green-500 transition-colors shadow-xl">
                <Paperclip size={18} />
              </button>
              <input type="file" ref={fileInputRef} onChange={(e) => {/* לוגיקת העלאה */}} className="hidden" />
            </div>
            <div>
              <h1 className="text-5xl font-black italic tracking-tighter mb-2">מספרת {businessData?.businessName}</h1>
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse shadow-[0_0_15px_rgba(34,197,94,1)]" />
                <p className="text-green-500 font-bold uppercase tracking-widest text-sm">Smart AI Brain: Active & Listening</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* LEFT: CALENDAR & TRAINING */}
          <div className="lg:col-span-8 space-y-10">
            
            {/* BRAIN TRAINING CANVAS */}
            <div className="bg-white/5 border border-white/10 rounded-[3.5rem] p-10 backdrop-blur-xl">
              <div className="flex items-center gap-4 mb-8">
                <Settings className="text-green-500" size={28} />
                <h2 className="text-2xl font-black italic">עריכת זיכרון המוח</h2>
              </div>
              <textarea 
                value={extraContext}
                onChange={(e) => setExtraContext(e.target.value)}
                className="w-full h-40 bg-black/40 border border-white/10 rounded-[2.5rem] p-8 text-xl text-white/80 outline-none focus:border-green-500 mb-8 transition-all resize-none shadow-inner"
                placeholder="הזן עדכונים כאן... (למשל: תספורת עולה 60 ש''ח)"
              />
              <button onClick={saveBrainUpdate} className="w-full bg-white/10 border border-white/10 text-white font-black py-6 rounded-3xl flex items-center justify-center gap-4 hover:bg-green-500 hover:text-black transition-all group">
                <Brain className="group-hover:rotate-12 transition-transform" />
                שמור וסנכרן למוח
              </button>
            </div>

            {/* MONTHLY CALENDAR */}
            <div className="bg-white/5 border border-white/10 rounded-[3.5rem] p-10 backdrop-blur-xl">
              <div className="flex items-center justify-between mb-10">
                <div className="flex items-center gap-4">
                  <Calendar className="text-green-500" size={28} />
                  <h2 className="text-2xl font-black italic text-white">לוח תורים חודשי</h2>
                </div>
                <div className="flex items-center gap-4 bg-black/40 p-2 rounded-2xl border border-white/5">
                  <button className="p-2 hover:text-green-500"><ChevronRight /></button>
                  <span className="font-bold px-4">{currentMonth.toLocaleString('he-IL', { month: 'long', year: 'numeric' })}</span>
                  <button className="p-2 hover:text-green-500"><ChevronLeft /></button>
                </div>
              </div>
              
              <div className="grid grid-cols-7 gap-4">
                {['א','ב','ג','ד','ה','ו','ש'].map(day => (
                  <div key={day} className="text-center text-white/30 font-black text-sm mb-4">{day}</div>
                ))}
                {calendarDays.map(day => (
                  <motion.button 
                    key={day} 
                    whileHover={{ scale: 1.05 }}
                    onClick={() => typeToCanvas(`עמאר, בחרת את ה-${day} לחודש. אילו שעות תרצה לפתוח לקביעת תורים?`)}
                    className="aspect-square bg-white/5 border border-white/5 rounded-2xl flex flex-col items-center justify-center gap-1 hover:bg-green-500 hover:text-black transition-all relative group"
                  >
                    <span className="text-lg font-black">{day}</span>
                    <div className="w-1 h-1 bg-green-500 rounded-full group-hover:bg-black opacity-40" />
                  </motion.button>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT: THE LIVE AI CANVAS SIMULATOR */}
          <div className="lg:col-span-4">
            <div className="sticky top-28 bg-[#0b141a] border-[14px] border-slate-900 rounded-[4rem] h-[850px] shadow-2xl flex flex-col overflow-hidden">
              <div className="bg-[#1f2c34] p-8 flex items-center gap-4 border-b border-white/5">
                <div className="w-14 h-14 rounded-full bg-green-500 flex items-center justify-center font-black text-black text-2xl italic shadow-2xl">AI</div>
                <div>
                  <h3 className="text-white font-black text-xl">SabanOS Core</h3>
                  <p className="text-xs text-green-500 font-bold tracking-widest uppercase">Live Thinking Mode</p>
                </div>
              </div>

              <div className="flex-1 p-8 bg-black/20 relative">
                <div className="space-y-6">
                   {/* הודעת הקנבס של ה-AI - טקסט נקי ומקצועי */}
                   <AnimatePresence>
                     {aiCanvasText && (
                       <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-8 bg-green-500/10 border-l-4 border-green-500 rounded-r-3xl">
                         <p className="text-xl font-medium leading-relaxed text-green-500 font-mono">
                           {aiCanvasText}
                           <span className="inline-block w-2 h-5 bg-green-500 animate-pulse ml-1" />
                         </p>
                       </motion.div>
                     )}
                   </AnimatePresence>

                   <div className="pt-10 opacity-30">
                      <ChatInterface trialId={params.trialId} />
                   </div>
                </div>

                {/* QUICK ACTIONS */}
                <div className="absolute bottom-8 left-8 right-8 grid grid-cols-2 gap-4">
                  <button onClick={() => typeToCanvas("מנתח נתוני יומן... יש לך 3 תורים פנויים מחר בבוקר. להציע אותם ללקוחות בוואטסאפ?")} className="bg-white/5 border border-white/10 p-4 rounded-2xl text-[10px] font-black uppercase tracking-tighter hover:bg-white/10">סטטוס יומן</button>
                  <button onClick={() => typeToCanvas("סיכום יום: 12 לקוחות טופלו, הכנסה משוערת 1,450 ש''ח. המוח מסונכרן.")} className="bg-white/5 border border-white/10 p-4 rounded-2xl text-[10px] font-black uppercase tracking-tighter hover:bg-white/10">ביצועי AI</button>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}
