"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { db } from "../../../lib/firebase";
import { doc, getDoc, updateDoc, arrayUnion } from "firebase/firestore";
import Navigation from "../../../components/Navigation";
import ChatInterface from "../../../components/ChatInterface";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Brain, Calendar, Save, Plus, Sun, Moon, 
  MessageSquare, UserPlus, Share2, Activity, 
  Sparkles, TrendingUp, Users, Lock, Clock, Send 
} from "lucide-react";

export default function SabanOSStudio({ params }: { params: { trialId: string } }) {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [inputCode, setInputCode] = useState("");
  const [businessData, setBusinessData] = useState<any>(null);
  const [extraContext, setExtraContext] = useState("");
  const [aiCanvasText, setAiCanvasText] = useState("");
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [newCustomer, setNewCustomer] = useState({ name: "", phone: "" });
  const [isSaving, setIsSaving] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // אתחול בטוח של המערכת
  useEffect(() => {
    // מניעת שגיאת Illegal constructor - יצירת אודיו רק בדפדפן
    if (typeof window !== "undefined") {
      audioRef.current = new Audio("/sounds/whatsapp.mp3");
    }

    const fetchDoc = async () => {
      try {
        const docRef = doc(db, "trials", params.trialId);
        const snap = await getDoc(docRef);
        if (snap.exists()) {
          const data = snap.data();
          setBusinessData(data);
          setExtraContext(data.businessContext || "");
        }
      } catch (err) { console.error("Firebase Error:", err); }
      setLoading(false);
    };
    fetchDoc();

    // טיפול בטוח ב-OneSignal למניעת שגיאת .on של undefined
    if (typeof window !== "undefined") {
        const win = window as any;
        const initOneSignal = () => {
            if (win.OneSignal && win.OneSignal.Notifications) {
                console.log("OneSignal Studio Ready");
            }
        };
        if (win.OneSignal) {
            win.OneSignal.push(initOneSignal);
        }
    }
  }, [params.trialId]);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle("dark");
  };

  const handleVerify = () => {
    if (inputCode === businessData?.accessCode) {
      setIsAuthorized(true);
      if (audioRef.current) audioRef.current.play().catch(() => {});
      typeToCanvas(`מערכת SabanOS Studio הופעלה. שלום עמאר, המוח מאזין. בוא נעצב את העסק שלך.`);
    } else {
      alert("קוד גישה שגוי");
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
    if (!extraContext) return;
    setIsSaving(true);
    const docRef = doc(db, "trials", params.trialId);
    const timestamp = new Date().toLocaleString('he-IL');
    await updateDoc(docRef, { 
      businessContext: extraContext,
      trainingHistory: arrayUnion({ text: extraContext, date: timestamp })
    });
    setBusinessData((prev: any) => ({
      ...prev,
      trainingHistory: [...(prev.trainingHistory || []), { text: extraContext, date: timestamp }]
    }));
    setIsSaving(false);
    typeToCanvas(`עודכן! המוח של "${businessData.businessName}" למד את ההנחיות החדשות.`);
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-[#020617] text-green-600 font-black animate-pulse text-2xl tracking-tighter italic">SabanOS Studio AI...</div>;

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-slate-100 dark:bg-[#020617] flex items-center justify-center p-4">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 p-12 rounded-[4rem] max-w-md w-full text-center shadow-2xl backdrop-blur-xl">
          <div className="w-24 h-24 bg-green-500 rounded-[2.5rem] mx-auto mb-8 flex items-center justify-center text-white shadow-xl shadow-green-500/20"><Lock size={40} /></div>
          <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-6 italic tracking-tighter uppercase">Enter Studio</h2>
          <input type="password" maxLength={4} value={inputCode} onChange={(e) => setInputCode(e.target.value)} className="w-full bg-slate-50 dark:bg-black/40 border-2 border-slate-200 dark:border-white/10 rounded-3xl p-6 text-center text-4xl tracking-[15px] text-green-600 outline-none focus:border-green-500 mb-8" placeholder="****" />
          <button onClick={handleVerify} className="w-full bg-green-600 text-white font-black py-5 rounded-3xl text-xl hover:bg-green-700 transition-all shadow-lg uppercase tracking-widest">START SESSION</button>
        </motion.div>
      </div>
    );
  }

  return (
    <main className={`min-h-screen ${isDarkMode ? 'bg-[#020617] text-white' : 'bg-[#F8FAFC] text-slate-900'} transition-colors duration-500 font-sans`} dir="rtl">
      <Navigation />
      
      <div className="pt-28 px-8 max-w-[1750px] mx-auto pb-20">
        
        {/* STATS HEADER */}
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 mb-10">
          <div className="xl:col-span-2 bg-white dark:bg-white/5 p-8 rounded-[3.5rem] border border-slate-200 dark:border-white/10 shadow-sm flex items-center gap-6">
            <div className="w-20 h-20 rounded-[2.5rem] bg-green-500/10 border-2 border-green-500/20 flex items-center justify-center">
              <span className="text-4xl font-black italic text-green-600">{businessData?.businessName?.[0]}</span>
            </div>
            <div>
              <h1 className="text-4xl font-black italic tracking-tighter uppercase leading-none">{businessData?.businessName} STUDIO</h1>
              <div className="flex items-center gap-2 text-green-600 font-bold text-xs uppercase mt-2"><span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" /> AI Core: Active</div>
            </div>
          </div>
          <div className="bg-white dark:bg-white/5 p-8 rounded-[3rem] border border-slate-200 dark:border-white/10 flex items-center justify-between shadow-sm group hover:border-green-500/40 transition-all">
            <div><p className="text-[10px] font-black uppercase text-slate-400 group-hover:text-green-500 transition-colors">לקוחות</p><h3 className="text-3xl font-black italic">{businessData?.customers?.length || 0}</h3></div>
            <Users className="text-green-500 opacity-20" size={40} />
          </div>
          <div className="bg-white dark:bg-white/5 p-8 rounded-[3rem] border border-slate-200 dark:border-white/10 flex items-center justify-between shadow-sm group hover:border-blue-500/40 transition-all">
            <div><p className="text-[10px] font-black uppercase text-slate-400 group-hover:text-blue-500 transition-colors">פעולות AI</p><h3 className="text-3xl font-black italic">{(businessData?.trainingHistory?.length || 0) + 12}</h3></div>
            <Activity className="text-blue-500 opacity-20" size={40} />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* ניהול לקוחות ויומן (ימין) */}
          <div className="lg:col-span-4 space-y-10">
            <div className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-[3.5rem] p-10 shadow-sm">
              <h2 className="text-xl font-black mb-8 flex items-center gap-3 italic uppercase"><Calendar className="text-green-600" /> יומן וסטטיסטיקה</h2>
              <div className="grid grid-cols-7 gap-3 mb-10">
                {Array.from({ length: 28 }, (_, i) => i + 1).map(day => (
                  <button key={day} onClick={() => typeToCanvas(`ניתוח יומן ל-${day} בחודש... עמאר, היום הזה מוכן לקבלת לקוחות.`)} className="aspect-square rounded-2xl bg-slate-100 dark:bg-white/5 flex items-center justify-center font-black text-xl hover:bg-green-600 hover:text-white transition-all shadow-inner">
                    {day}
                  </button>
                ))}
              </div>
              <button onClick={toggleTheme} className="flex items-center gap-3 text-xs font-black uppercase text-slate-400 hover:text-green-600 transition-all">{isDarkMode ? <Sun size={18} /> : <Moon size={18} />} Switch Theme</button>
            </div>
          </div>

          {/* עריכת מוח (מרכז) */}
          <div className="lg:col-span-4 space-y-10">
            <div className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-[3.5rem] p-10 shadow-sm">
              <h2 className="text-xl font-black mb-8 flex items-center gap-3 italic uppercase"><Brain className="text-green-600" /> עריכת זיכרון המוח</h2>
              <div className="space-y-6">
                <textarea 
                  value={extraContext} 
                  onChange={(e) => setExtraContext(e.target.value)} 
                  placeholder="הקלד כאן מחירים, שעות וכללי עסק..."
                  className="w-full h-64 bg-slate-50 dark:bg-black/20 border-none rounded-[2rem] p-8 outline-none focus:ring-2 ring-green-500 transition-all font-medium text-lg shadow-inner resize-none"
                />
                <button 
                  onClick={saveBrainUpdate} 
                  disabled={isSaving}
                  className="w-full bg-green-600 text-white font-black py-5 rounded-[2.5rem] hover:shadow-2xl transition-all flex items-center justify-center gap-3 shadow-lg shadow-green-500/20"
                >
                  {isSaving ? "מסנכרן נתונים..." : "עדכן מוח וזיכרון"} <Send size={20} />
                </button>
              </div>
            </div>
          </div>

          {/* AI LIVE CANVAS (שמאל) */}
          <div className="lg:col-span-4 h-full min-h-[850px]">
            <div className="bg-white dark:bg-[#0b141a] border-4 border-slate-200 dark:border-white/10 rounded-[5rem] h-full shadow-2xl flex flex-col relative overflow-hidden">
              <div className="bg-slate-50 dark:bg-[#1f2c34] p-10 flex items-center gap-5 border-b border-slate-200 dark:border-white/5">
                <div className="w-16 h-16 rounded-[2rem] bg-green-600 flex items-center justify-center font-black text-white text-3xl italic shadow-2xl">AI</div>
                <div><h3 className="font-black text-2xl italic tracking-tighter uppercase leading-none mb-1">Studio AI Core</h3><div className="flex items-center gap-2 italic"><div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" /><p className="text-[10px] text-green-600 font-black uppercase tracking-widest">Listening</p></div></div>
              </div>
              <div className="flex-1 p-12 overflow-y-auto">
                <AnimatePresence>
                  {aiCanvasText && (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="p-10 bg-green-600/5 dark:bg-green-600/10 border-r-4 border-green-600 rounded-l-[3rem] shadow-inner relative">
                      <Sparkles className="absolute top-4 left-4 text-green-500 opacity-20" size={24} />
                      <p className="text-2xl font-bold leading-snug text-green-700 dark:text-green-400 font-mono italic tracking-tight">{aiCanvasText}<span className="inline-block w-2.5 h-8 bg-green-600 animate-pulse ml-3 align-middle" /></p>
                    </motion.div>
                  )}
                </AnimatePresence>
                <div className="mt-12 opacity-20"><ChatInterface trialId={params.trialId} /></div>
              </div>
              <div className="p-10 bg-slate-50 dark:bg-white/5 border-t border-slate-200 dark:border-white/5 flex gap-4">
                <div className="flex-1 bg-white dark:bg-black/40 border border-slate-200 dark:border-white/10 rounded-[2rem] p-5 text-[10px] font-black opacity-20 uppercase tracking-[4px] italic">AI Sync Processing...</div>
                <div className="bg-green-600 p-5 rounded-[2rem] text-white shadow-xl shadow-green-600/20"><MessageSquare size={24} /></div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}
