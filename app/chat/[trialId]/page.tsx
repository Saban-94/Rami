"use client";

import React, { useState, useMemo, useEffect, useRef } from "react";
import { db } from "../../../lib/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import Navigation from "../../../components/Navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Calendar, Clock, Check, ChevronLeft, Sparkles, 
  Layout, Palette, Rocket, Lock, Sun, Moon, Send
} from "lucide-react";

// --- Native Helpers (במקום date-fns) ---
const getWeekDays = () => {
  const days = [];
  const now = new Date();
  for (let i = 0; i < 7; i++) {
    const d = new Date(now);
    d.setDate(now.getDate() + i);
    d.setHours(0, 0, 0, 0);
    days.push(d);
  }
  return days;
};

const formatDayHe = (date: Date) => {
  const names = ['א\'', 'ב\'', 'ג\'', 'ד\'', 'ה\'', 'ו\'', 'ש\''];
  return names[date.getDay()];
};

// --- Animation Variants ---
const containerVariants = {
  hidden: { opacity: 0, height: 0 },
  visible: { 
    opacity: 1, height: "auto",
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1], staggerChildren: 0.04 } 
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0 }
};

export default function SabanOSStudioV2({ params }: { params: { trialId: string } }) {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [inputCode, setInputCode] = useState("");
  const [businessData, setBusinessData] = useState<any>(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [aiCanvasText, setAiCanvasText] = useState("");

  const weekDays = useMemo(() => getWeekDays(), []);
  const availableSlots = ["09:00", "10:00", "11:00", "12:00", "14:00", "15:00", "16:00", "17:00"];

  useEffect(() => {
    const fetchDoc = async () => {
      try {
        const docRef = doc(db, "trials", params.trialId);
        const snap = await getDoc(docRef);
        if (snap.exists()) setBusinessData(snap.data());
      } catch (err) { console.error(err); }
      setLoading(false);
    };
    fetchDoc();
  }, [params.trialId]);

  const handleVerify = () => {
    if (inputCode === businessData?.accessCode) {
      setIsAuthorized(true);
      typeToCanvas(`ברוך הבא לסטודיו v2.0. המוח של ${businessData?.businessName} מוכן לעבודה.`);
    } else { alert("קוד שגוי"); }
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

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-[#020617] text-green-600 font-black animate-pulse">SabanOS Loading...</div>;

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-slate-100 dark:bg-[#020617] flex items-center justify-center p-4">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 p-12 rounded-[4rem] max-w-md w-full text-center shadow-2xl backdrop-blur-xl">
          <div className="w-20 h-20 bg-green-500 rounded-[2.5rem] mx-auto mb-8 flex items-center justify-center text-white shadow-xl shadow-green-500/20"><Lock size={32} /></div>
          <h2 className="text-3xl font-black mb-6 italic">Enter Studio V2</h2>
          <input type="password" maxLength={4} value={inputCode} onChange={(e) => setInputCode(e.target.value)} className="w-full bg-slate-50 dark:bg-black/40 border-2 border-slate-200 dark:border-white/10 rounded-3xl p-6 text-center text-4xl tracking-[15px] text-green-600 outline-none focus:border-green-500 mb-8" placeholder="****" />
          <button onClick={handleVerify} className="w-full bg-green-600 text-white font-black py-5 rounded-3xl text-xl shadow-lg uppercase">Unlock</button>
        </motion.div>
      </div>
    );
  }

  return (
    <main className={`min-h-screen ${isDarkMode ? 'bg-[#020617] text-white' : 'bg-[#F8FAFC] text-slate-900'} transition-colors duration-500 font-sans`} dir="rtl">
      <Navigation />
      
      <div className="pt-28 px-8 max-w-[1800px] mx-auto pb-10 grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* יומן חכם (שמאל) */}
        <div className="lg:col-span-4 space-y-8">
          <div className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-[3.5rem] p-8 shadow-sm">
            <h2 className="text-xl font-black italic mb-8 flex items-center gap-2">
              <Calendar size={22} className="text-green-600" /> יומן זמינות
            </h2>
            
            <div className="flex gap-3 overflow-x-auto pb-4 mb-8 no-scrollbar">
              {weekDays.map((date) => {
                const isSelected = date.getDate() === selectedDate.getDate();
                return (
                  <button
                    key={date.toISOString()}
                    onClick={() => setSelectedDate(date)}
                    className={`flex flex-col items-center min-w-[65px] py-4 rounded-3xl border transition-all duration-300 ${
                      isSelected ? "bg-green-600 border-green-500 text-white shadow-xl" : "bg-slate-50 dark:bg-white/5 border-transparent text-slate-400"
                    }`}
                  >
                    <span className="text-[10px] font-bold uppercase mb-1">{formatDayHe(date)}</span>
                    <span className="text-lg font-black">{date.getDate()}</span>
                  </button>
                );
              })}
            </div>

            <motion.div variants={containerVariants} initial="hidden" animate="visible" className="grid grid-cols-3 gap-3">
              {availableSlots.map((slot) => (
                <motion.button
                  key={slot}
                  variants={itemVariants}
                  onClick={() => setSelectedSlot(slot)}
                  className={`py-4 rounded-2xl font-black text-sm relative transition-all ${
                    selectedSlot === slot ? "bg-slate-900 dark:bg-white text-white dark:text-black shadow-xl scale-105" : "bg-slate-50 dark:bg-white/10 border border-black/5 dark:border-white/5"
                  }`}
                >
                  {slot}
                  {selectedSlot === slot && <Check size={10} className="absolute top-1 right-1 text-green-500" strokeWidth={4} />}
                </motion.button>
              ))}
            </motion.div>
          </div>
        </div>

        {/* קנבס ה-AI (מרכז) */}
        <div className="lg:col-span-4">
           <div className="bg-white dark:bg-[#0b141a] border-4 border-slate-200 dark:border-white/10 rounded-[4rem] h-[600px] shadow-2xl flex flex-col relative overflow-hidden">
              <div className="bg-slate-50 dark:bg-[#1f2c34] p-10 flex items-center gap-5 border-b border-slate-200 dark:border-white/5">
                <div className="w-14 h-14 rounded-2xl bg-green-600 flex items-center justify-center font-black text-white text-2xl italic shadow-lg">AI</div>
                <h3 className="font-black text-xl italic uppercase tracking-tighter">Studio Core</h3>
              </div>
              <div className="flex-1 p-10 overflow-y-auto">
                <AnimatePresence>
                  {aiCanvasText && (
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="p-8 bg-green-500/5 dark:bg-green-600/10 border-r-4 border-green-600 rounded-l-[2rem] shadow-inner relative">
                      <Sparkles className="absolute top-4 left-4 text-green-500 opacity-20" size={24} />
                      <p className="text-xl font-bold leading-relaxed text-green-700 dark:text-green-400 font-mono italic">{aiCanvasText}<span className="inline-block w-2 h-6 bg-green-600 animate-pulse ml-2" /></p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              <div className="p-8 bg-slate-50 dark:bg-white/5 border-t border-slate-200 dark:border-white/5 flex gap-4">
                <div className="flex-1 bg-white dark:bg-black/40 border border-slate-200 dark:border-white/10 rounded-[2rem] p-4 text-[10px] font-black opacity-20 uppercase tracking-[4px] italic">AI Sync Processing...</div>
                <button onClick={() => setIsDarkMode(!isDarkMode)} className="p-4 bg-slate-200 dark:bg-white/10 rounded-2xl">{isDarkMode ? <Sun size={18}/> : <Moon size={18}/>}</button>
              </div>
           </div>
        </div>

        {/* כלי עריכה (ימין) */}
        <div className="lg:col-span-4 space-y-8">
          <div className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-[3.5rem] p-10 shadow-sm">
            <h2 className="text-xl font-black italic mb-8 flex items-center gap-3 uppercase"><Palette className="text-blue-500" /> עיצוב מותג</h2>
            <textarea placeholder="הקלד כאן עדכונים למוח..." className="w-full h-40 bg-slate-50 dark:bg-black/20 border-none rounded-[2rem] p-6 text-sm outline-none focus:ring-2 ring-green-500 transition-all resize-none shadow-inner mb-6" />
            <button className="w-full bg-slate-900 dark:bg-white text-white dark:text-black font-black py-5 rounded-3xl flex items-center justify-center gap-3 hover:scale-[1.02] transition-all uppercase tracking-widest"><Rocket size={20} /> Publish</button>
          </div>
        </div>

      </div>
    </main>
  );
}
