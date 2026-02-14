"use client";

import React, { useState, useEffect, useRef } from "react";
import { db } from "../../../lib/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import Navigation from "../../../components/Navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Smartphone, Layout, Palette, Sparkles, Rocket, Lock, Sun, Moon, Send } from "lucide-react";
import AvailabilityCalendarBlock from "@/components/blocks/AvailabilityCalendarBlock";
import LaboratoryFormBlock from "@/components/blocks/LaboratoryFormBlock";
import VaccineRecordBlock from "@/components/blocks/VaccineRecordBlock";

export default function SabanOSStudioV2({ params }: { params: { trialId: string } }) {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [inputCode, setInputCode] = useState("");
  const [businessData, setBusinessData] = useState<any>(null);
  const [appConfig, setAppConfig] = useState<any>(null);
  const [aiCanvasText, setAiCanvasText] = useState("");
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDoc = async () => {
      const snap = await getDoc(doc(db, "trials", params.trialId));
      if (snap.exists()) {
        const d = snap.data();
        setBusinessData(d);
        setAppConfig(d.appConfig || { theme: { primaryColor: "#22c55e" }, blocks: [] });
      }
      setLoading(false);
    };
    fetchDoc();
  }, [params.trialId]);

  const handleVerify = () => {
    if (inputCode === businessData?.accessCode) {
      setIsAuthorized(true);
      typeToCanvas(`ברוך הבא ל-SabanOS Studio. המוח מוכן להזרקת חבילות תוכן.`);
    }
  };

  const typeToCanvas = (text: string) => {
    setAiCanvasText("");
    let i = 0;
    const interval = setInterval(() => {
      setAiCanvasText((p) => p + text.charAt(i));
      if (++i >= text.length) clearInterval(interval);
    }, 30);
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center dark:bg-black text-green-500 font-black italic animate-pulse">SabanOS v2.0...</div>;

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-[#020617] flex items-center justify-center">
        <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="bg-white dark:bg-white/5 p-12 rounded-[4rem] border border-white/10 shadow-2xl text-center max-w-md w-full">
          <div className="w-20 h-20 bg-green-500 rounded-[2rem] mx-auto mb-8 flex items-center justify-center text-white shadow-xl"><Lock size={32}/></div>
          <h2 className="text-3xl font-black mb-8 italic">Studio Login</h2>
          <input type="password" maxLength={4} value={inputCode} onChange={(e) => setInputCode(e.target.value)} className="w-full bg-slate-100 dark:bg-black/40 border-2 border-white/10 rounded-3xl p-6 text-center text-4xl tracking-[15px] text-green-500 outline-none focus:border-green-500 mb-8" placeholder="****" />
          <button onClick={handleVerify} className="w-full bg-green-600 text-white font-black py-5 rounded-3xl text-xl shadow-lg">START SESSION</button>
        </motion.div>
      </div>
    );
  }

  return (
    <main className={`min-h-screen ${isDarkMode ? 'bg-[#020617] text-white' : 'bg-[#F8FAFC] text-slate-900'} transition-colors duration-500`}>
      <Navigation />
      <div className="pt-28 px-8 max-w-[1800px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 h-[calc(100vh-120px)]">
        
        {/* Sidebar */}
        <div className="lg:col-span-3 space-y-6 overflow-y-auto pr-2">
          <div className="bg-white dark:bg-white/5 border border-white/10 rounded-[3.5rem] p-8 shadow-sm">
            <h2 className="text-xl font-black italic mb-6 flex items-center gap-2"><Layout size={20} className="text-green-500" /> עץ דפים</h2>
            <div className="space-y-3 opacity-50">
               <div className="p-4 bg-slate-50 dark:bg-white/5 rounded-2xl border border-white/10 flex justify-between items-center"><span>דף הבית</span><CheckCircle2 size={14}/></div>
               <div className="p-4 bg-slate-50 dark:bg-white/5 rounded-2xl border border-white/10 flex justify-between items-center"><span>קטלוג</span><CheckCircle2 size={14}/></div>
            </div>
          </div>
          <button onClick={() => setIsDarkMode(!isDarkMode)} className="w-full py-4 bg-white dark:bg-white/5 border border-white/10 rounded-2xl font-black text-xs flex items-center justify-center gap-2 italic">
            {isDarkMode ? <Sun size={14}/> : <Moon size={14}/>} {isDarkMode ? 'Light Mode' : 'Dark Mode'}
          </button>
        </div>

        {/* iPhone Preview */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center relative bg-white/5 dark:bg-black/20 rounded-[5rem] border border-dashed border-white/10">
          <div className="w-[320px] h-[640px] bg-black rounded-[4rem] border-[12px] border-slate-800 shadow-2xl relative overflow-hidden ring-4 ring-black/10">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-7 bg-slate-800 rounded-b-3xl z-30" />
            <div className={`w-full h-full p-6 pt-14 overflow-y-auto space-y-6 ${isDarkMode ? 'bg-[#0b141a]' : 'bg-white'}`}>
              <AvailabilityCalendarBlock content={{title: "התור הבא שלך", subtitle: "בחר זמן פנוי"}} />
              <LaboratoryFormBlock content={{title: "מעבדת עמאר", subtitle: "תיקון מהיר"}} />
            </div>
          </div>
        </div>

        {/* AI Orchestrator */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <div className="bg-white dark:bg-[#0b141a] border border-white/10 rounded-[4rem] p-10 flex-1 flex flex-col shadow-2xl relative overflow-hidden">
            <div className="flex items-center gap-4 mb-10">
              <div className="w-14 h-14 bg-green-500 rounded-2xl flex items-center justify-center text-white shadow-lg"><Sparkles size={24} /></div>
              <div><h2 className="text-2xl font-black italic uppercase leading-none">AI Designer</h2><p className="text-[10px] text-green-500 font-black uppercase mt-1">Listening Mode</p></div>
            </div>
            <div className="flex-1 overflow-y-auto mb-8">
              <AnimatePresence mode="wait">
                {aiCanvasText && (
                  <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="p-8 bg-green-500/5 border-r-4 border-green-500 rounded-l-[3rem]">
                    <p className="text-xl font-bold leading-relaxed text-green-700 dark:text-green-400 font-mono italic">
                      {aiCanvasText}<span className="inline-block w-2.5 h-6 bg-green-600 animate-pulse ml-2" />
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <div className="relative">
              <textarea placeholder="תגיד ל-AI מה להוסיף..." className="w-full h-32 bg-slate-50 dark:bg-black/60 border border-white/10 rounded-[2.5rem] p-6 text-sm outline-none focus:ring-2 ring-green-500 transition-all resize-none shadow-inner" />
              <button className="absolute bottom-4 left-4 p-4 bg-green-600 text-white rounded-2xl shadow-xl hover:scale-110 transition-all"><Send size={18}/></button>
            </div>
          </div>
        </div>

      </div>
    </main>
  );
}
