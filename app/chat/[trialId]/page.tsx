"use client";

import React, { useState, useEffect, useRef } from "react";
import { db } from "../../../lib/firebase";
import { doc, getDoc, updateDoc, arrayUnion } from "firebase/firestore";
import Navigation from "../../../components/Navigation";
import ChatInterface from "../../../components/ChatInterface";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Brain, Calendar, Clock, Edit3, Save, 
  Plus, Trash2, Sun, Moon, CheckCircle2, 
  MessageSquare, User, Activity
} from "lucide-react";

export default function SabanOSStudio({ params }: { params: { trialId: string } }) {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [inputCode, setInputCode] = useState("");
  const [businessData, setBusinessData] = useState<any>(null);
  const [extraContext, setExtraContext] = useState("");
  const [aiCanvasText, setAiCanvasText] = useState("");
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<number | null>(null);

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

  // לוגיקת שינוי ערכת נושא
  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle("dark");
  };

  const handleVerify = () => {
    if (inputCode === businessData?.accessCode) {
      setIsAuthorized(true);
      typeToCanvas(`מערכת SabanOS Studio הופעלה במצב ${isDarkMode ? 'Dark' : 'Light'}. שלום עמאר, אני מאזין ומוכן לעדכונים.`);
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

  const saveBrainUpdate = async (textToSave: string) => {
    const docRef = doc(db, "trials", params.trialId);
    const timestamp = new Date().toLocaleString('he-IL');
    const updateObj = { text: textToSave, date: timestamp };
    
    await updateDoc(docRef, { 
      businessContext: textToSave,
      trainingHistory: arrayUnion(updateObj)
    });
    
    setBusinessData({
      ...businessData,
      trainingHistory: [...(businessData.trainingHistory || []), updateObj]
    });
    
    typeToCanvas(`המידע סונכרן בהצלחה לטבלת הזיכרון. המוח מעודכן.`);
  };

  const daysInMonth = Array.from({ length: 30 }, (_, i) => i + 1);

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-[#020617] text-green-600 font-black italic animate-pulse">SabanOS Studio Loading...</div>;

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-[#020617] flex items-center justify-center p-4 transition-colors duration-500">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 p-12 rounded-[3.5rem] max-w-md w-full text-center shadow-2xl backdrop-blur-xl">
          <div className="w-20 h-20 bg-green-500 rounded-[2rem] mx-auto mb-8 flex items-center justify-center shadow-xl">
            <Brain className="text-white" size={32} />
          </div>
          <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-6 italic">SabanOS Studio</h2>
          <input 
            type="password" maxLength={4} value={inputCode}
            onChange={(e) => setInputCode(e.target.value)}
            className="w-full bg-slate-100 dark:bg-black/40 border-2 border-slate-200 dark:border-white/10 rounded-2xl p-6 text-center text-4xl tracking-[15px] text-green-600 outline-none focus:border-green-500 mb-8 transition-all"
            placeholder="****"
          />
          <button onClick={handleVerify} className="w-full bg-green-600 text-white font-black py-5 rounded-2xl text-xl hover:shadow-lg transition-all">ENTER STUDIO</button>
        </motion.div>
      </div>
    );
  }

  return (
    <main className={`min-h-screen ${isDarkMode ? 'bg-[#020617] text-white' : 'bg-[#F8FAFC] text-slate-900'} transition-colors duration-500 font-sans`} dir="rtl">
      <Navigation />
      
      <div className="pt-28 px-8 max-w-[1650px] mx-auto pb-20">
        
        {/* TOP STUDIO BAR */}
        <div className="flex items-center justify-between mb-10 bg-white dark:bg-white/5 p-8 rounded-[3rem] border border-slate-200 dark:border-white/10 shadow-sm backdrop-blur-md">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 rounded-[2rem] bg-green-500/10 border-2 border-green-500/20 overflow-hidden flex items-center justify-center shadow-inner">
              {businessData?.logoUrl ? <img src={businessData.logoUrl} className="w-full h-full object-cover" /> : <span className="text-4xl font-black italic text-green-600">{businessData?.businessName?.[0]}</span>}
            </div>
            <div>
              <h1 className="text-4xl font-black italic tracking-tighter">מספרת {businessData?.businessName}</h1>
              <p className="text-green-600 font-bold flex items-center gap-2 text-sm uppercase tracking-widest">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" /> SabanOS Smart AI Online
              </p>
            </div>
          </div>
          
          <button onClick={toggleTheme} className="p-4 rounded-3xl bg-slate-100 dark:bg-white/10 border border-slate-200 dark:border-white/10 hover:scale-110 transition-all">
            {isDarkMode ? <Sun className="text-yellow-400" /> : <Moon className="text-blue-600" />}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* LEFT COLUMN: TRAINING & MEMORY */}
          <div className="lg:col-span-4 space-y-8">
            <div className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-[3rem] p-8 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <Brain className="text-green-600" size={24} />
                <h2 className="text-xl font-black italic">עריכת מוח</h2>
              </div>
              <textarea 
                value={extraContext}
                onChange={(e) => setExtraContext(e.target.value)}
                className="w-full h-40 bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-3xl p-6 outline-none focus:border-green-500 mb-6 transition-all"
                placeholder="הזן הנחיות ל-AI..."
              />
              <button onClick={() => saveBrainUpdate(extraContext)} className="w-full bg-green-600 text-white font-black py-4 rounded-2xl flex items-center justify-center gap-3 shadow-lg hover:bg-green-700 transition-all">
                <Save size={20} /> סנכרן נתונים
              </button>
            </div>

            {/* MEMORY TABLE */}
            <div className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-[3rem] p-8 shadow-sm overflow-hidden">
              <h3 className="text-lg font-black italic mb-6 flex items-center gap-2 opacity-50"><Activity size={18}/> טבלת עדכוני מוח</h3>
              <div className="max-h-[350px] overflow-y-auto space-y-3 pr-2">
                {businessData?.trainingHistory?.map((update: any, i: number) => (
                  <div key={i} className="p-4 bg-slate-50 dark:bg-white/5 rounded-2xl border border-slate-100 dark:border-white/5 flex justify-between items-start group">
                    <div className="flex-1">
                      <p className="text-sm font-medium opacity-80 mb-1">{update.text}</p>
                      <span className="text-[10px] uppercase font-bold opacity-30">{update.date}</span>
                    </div>
                    <button onClick={() => setExtraContext(update.text)} className="p-2 text-green-600 opacity-0 group-hover:opacity-100 transition-all">
                      <Edit3 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* MIDDLE COLUMN: SMART CALENDAR */}
          <div className="lg:col-span-4">
            <div className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-[3.5rem] p-10 shadow-sm h-full">
              <div className="flex items-center justify-between mb-10">
                <h2 className="text-2xl font-black italic flex items-center gap-3"><Calendar className="text-green-600" /> יומן תורים</h2>
                <Plus className="text-green-600 cursor-pointer" />
              </div>
              <div className="grid grid-cols-7 gap-3">
                {daysInMonth.map(day => (
                  <button 
                    key={day} 
                    onClick={() => {
                      setSelectedDate(day);
                      typeToCanvas(`עמאר, פתחתי את היומן ל-${day} בחודש. אילו שעות לסמן כפנויות?`);
                    }}
                    className={`aspect-square rounded-2xl flex items-center justify-center font-black text-lg transition-all ${selectedDate === day ? 'bg-green-600 text-white shadow-lg' : 'bg-slate-50 dark:bg-white/5 hover:bg-green-100 dark:hover:bg-green-900/30'}`}
                  >
                    {day}
                  </button>
                ))}
              </div>
              {selectedDate && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-8 p-6 bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-900/30 rounded-[2rem]">
                  <p className="text-sm font-bold text-green-700 dark:text-green-400">הגדרת יום: {selectedDate} לחודש</p>
                  <div className="flex gap-2 mt-4">
                    {['10:00', '14:00', '19:00'].map(t => (
                      <button key={t} className="px-4 py-2 bg-white dark:bg-black/40 border border-green-200 dark:border-green-900/50 rounded-xl text-xs font-black">
                        {t}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>
          </div>

          {/* RIGHT COLUMN: THE LIVE CANVAS (WhatsApp Simulation) */}
          <div className="lg:col-span-4 h-full min-h-[750px]">
            <div className="bg-white dark:bg-[#0b141a] border-4 border-slate-200 dark:border-white/10 rounded-[4rem] h-full shadow-2xl overflow-hidden flex flex-col relative">
              <div className="bg-slate-100 dark:bg-[#1f2c34] p-8 flex items-center gap-4 border-b border-slate-200 dark:border-white/5">
                <div className="w-14 h-14 rounded-full bg-green-600 flex items-center justify-center font-black text-white text-2xl italic shadow-lg">AI</div>
                <div>
                  <h3 className="font-black text-xl">WhatsApp AI Simulator</h3>
                  <p className="text-[10px] text-green-600 font-bold tracking-widest uppercase">Live Interactive Canvas</p>
                </div>
              </div>

              <div className="flex-1 p-8 overflow-y-auto space-y-6">
                <AnimatePresence>
                  {aiCanvasText && (
                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="p-8 bg-green-600/5 dark:bg-green-600/10 border-r-4 border-green-600 rounded-l-[2rem]">
                      <p className="text-xl font-bold leading-relaxed text-green-700 dark:text-green-400 font-mono italic">
                        {aiCanvasText}
                        <span className="inline-block w-2 h-6 bg-green-600 animate-pulse ml-2 align-middle" />
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
                
                {/* דמה לשיחת וואטסאפ */}
                <div className="space-y-4 opacity-40 select-none pointer-events-none">
                  <div className="bg-slate-200 dark:bg-[#1f2c34] p-3 rounded-2xl rounded-tr-none text-xs max-w-[80%] mr-auto">היי, אני רוצה לקבוע תור לתספורת מחר</div>
                  <div className="bg-green-600 p-3 rounded-2xl rounded-tl-none text-white text-xs max-w-[80%] ml-auto">שלום! מחר בשעה 10:00 פנוי לי. לרשום אותך?</div>
                </div>
              </div>
              
              <div className="p-8 bg-slate-50 dark:bg-white/5 border-t border-slate-200 dark:border-white/5">
                <div className="flex gap-4">
                  <div className="flex-1 bg-white dark:bg-black/40 border border-slate-200 dark:border-white/10 rounded-2xl p-4 text-sm text-slate-400">
                    סימולציה פעילה...
                  </div>
                  <div className="bg-green-600 p-4 rounded-2xl text-white">
                    <MessageSquare size={20} />
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}
