"use client";

import React, { useState, useEffect, useRef } from "react";
import { db } from "../../../lib/firebase";
import { doc, getDoc, updateDoc, arrayUnion } from "firebase/firestore";
import Navigation from "../../../components/Navigation";
import ChatInterface from "../../../components/ChatInterface";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Brain, Calendar, Save, Plus, Sun, Moon, 
  MessageSquare, UserPlus, Share2, Activity, 
  Sparkles, TrendingUp, Users, Lock, Clock, Paperclip, Send
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

  useEffect(() => {
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
      } catch (err) { console.error(err); }
      setLoading(false);
    };
    fetchDoc();
  }, [params.trialId]);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle("dark");
  };

  const handleVerify = () => {
    if (inputCode === businessData?.accessCode) {
      setIsAuthorized(true);
      typeToCanvas(`מערכת SabanOS Studio פועלת. שלום עמאר, המוח מאזין. הקלד את ההנחיות החדשות שלך בקנבס האימון.`);
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

    setBusinessData({
      ...businessData,
      trainingHistory: [...(businessData.trainingHistory || []), { text: extraContext, date: timestamp }]
    });

    setIsSaving(false);
    typeToCanvas(`הבנתי עמאר! המוח של "${businessData.businessName}" עודכן בנתונים החדשים. שמרתי את זה גם בטבלת הזיכרון.`);
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-[#020617] text-green-600 font-black animate-pulse">SabanOS Studio AI...</div>;

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-[#020617] flex items-center justify-center p-4 transition-colors">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 p-12 rounded-[4rem] max-w-md w-full text-center shadow-2xl backdrop-blur-xl">
          <div className="w-24 h-24 bg-green-500 rounded-[2.5rem] mx-auto mb-8 flex items-center justify-center shadow-xl text-white"><Lock size={40} /></div>
          <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-6 italic tracking-tighter uppercase">Enter Studio</h2>
          <input type="password" maxLength={4} value={inputCode} onChange={(e) => setInputCode(e.target.value)} className="w-full bg-slate-100 dark:bg-black/40 border-2 border-slate-200 dark:border-white/10 rounded-3xl p-6 text-center text-4xl tracking-[15px] text-green-600 outline-none focus:border-green-500 mb-8" placeholder="****" />
          <button onClick={handleVerify} className="w-full bg-green-600 text-white font-black py-5 rounded-3xl text-xl uppercase tracking-widest">Login</button>
        </motion.div>
      </div>
    );
  }

  return (
    <main className={`min-h-screen ${isDarkMode ? 'bg-[#020617] text-white' : 'bg-[#F8FAFC] text-slate-900'} transition-colors duration-500 font-sans selection:bg-green-500/30 overflow-x-hidden`} dir="rtl">
      <Navigation />
      
      <div className="pt-28 px-8 max-w-[1750px] mx-auto pb-20">
        
        {/* HEADER */}
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 mb-10">
          <div className="xl:col-span-2 bg-white dark:bg-white/5 p-8 rounded-[3.5rem] border border-slate-200 dark:border-white/10 shadow-sm flex items-center gap-6">
            <div className="w-20 h-20 rounded-[2.5rem] bg-green-500/10 border-2 border-green-500/20 flex items-center justify-center">
              {businessData?.logoUrl ? <img src={businessData.logoUrl} className="w-full h-full object-cover" /> : <span className="text-4xl font-black italic text-green-600">{businessData?.businessName?.[0]}</span>}
            </div>
            <div>
              <h1 className="text-4xl font-black italic tracking-tighter uppercase">{businessData?.businessName} STUDIO</h1>
              <div className="flex items-center gap-2 text-green-600 font-bold text-xs uppercase"><span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" /> AI Online</div>
            </div>
          </div>
          <div className="bg-white dark:bg-white/5 p-8 rounded-[3rem] border border-slate-200 dark:border-white/10 flex items-center justify-between shadow-sm">
            <div><p className="text-[10px] font-black uppercase text-slate-400 mb-1">לקוחות</p><h3 className="text-3xl font-black italic">{businessData?.customers?.length || 0}</h3></div>
            <Users className="text-green-500 opacity-20" size={40} />
          </div>
          <div className="bg-white dark:bg-white/5 p-8 rounded-[3rem] border border-slate-200 dark:border-white/10 flex items-center justify-between shadow-sm">
            <div><p className="text-[10px] font-black uppercase text-slate-400 mb-1">עדכוני מוח</p><h3 className="text-3xl font-black italic">{businessData?.trainingHistory?.length || 0}</h3></div>
            <Activity className="text-blue-500 opacity-20" size={40} />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* ניהול לקוחות ויומן (שמאל) */}
          <div className="lg:col-span-4 space-y-10">
            <div className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-[3.5rem] p-10 shadow-sm h-full">
              <div className="flex items-center justify-between mb-10 italic">
                <h2 className="text-2xl font-black flex items-center gap-3"><Calendar className="text-green-600" /> יומן סטודיו</h2>
              </div>
              <div className="grid grid-cols-7 gap-3 mb-10">
                {Array.from({ length: 28 }, (_, i) => i + 1).map(day => (
                  <button key={day} onClick={() => typeToCanvas(`מנתח יומן ל-${day} בחודש... עמאר, היום הזה פנוי ב-SabanOS לתיאום תורים חדשים.`)} className="aspect-square rounded-2xl bg-slate-100 dark:bg-white/5 flex items-center justify-center font-black text-xl hover:bg-green-600 hover:text-white transition-all shadow-inner">
                    {day}
                  </button>
                ))}
              </div>
              <button onClick={toggleTheme} className="flex items-center gap-3 text-xs font-black uppercase text-slate-400 hover:text-green-600 transition-all">{isDarkMode ? <Sun size={18} /> : <Moon size={18} />} Switch Theme</button>
            </div>
          </div>

          {/* הנה זה רמי: אזור הקלדת הנתונים והאימון (מרכז) */}
          <div className="lg:col-span-4 space-y-10">
            <div className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-[3.5rem] p-10 shadow-sm">
              <h2 className="text-xl font-black mb-8 flex items-center gap-3 italic uppercase"><Brain className="text-green-600" /> אימון המוח של עמאר</h2>
              <div className="space-y-6">
                <div className="relative">
                  <textarea 
                    value={extraContext} 
                    onChange={(e) => setExtraContext(e.target.value)} 
                    placeholder="הקלד כאן מחירים, שעות וכללי עסק..."
                    className="w-full h-64 bg-slate-50 dark:bg-black/20 border-none rounded-[2rem] p-8 outline-none focus:ring-2 ring-green-500 transition-all font-medium text-lg shadow-inner resize-none"
                  />
                  <div className="absolute bottom-6 left-6 opacity-20"><Sparkles size={40} /></div>
                </div>
                <button 
                  onClick={saveBrainUpdate} 
                  disabled={isSaving}
                  className="w-full bg-green-600 text-white font-black py-5 rounded-[2rem] hover:shadow-2xl transition-all flex items-center justify-center gap-3 uppercase tracking-tighter"
                >
                  {isSaving ? "מסנכרן נתונים..." : "עדכן מוח וזיכרון"} <Send size={20} />
                </button>
              </div>
            </div>

            {/* טבלת היסטוריית למידה */}
            <div className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-[3.5rem] p-10 shadow-sm overflow-hidden h-[450px] flex flex-col">
              <h3 className="text-lg font-black mb-6 opacity-40 uppercase italic tracking-widest">Memory Feed</h3>
              <div className="space-y-4 overflow-y-auto flex-1 pr-2 custom-scrollbar">
                {businessData?.trainingHistory?.slice().reverse().map((update: any, i: number) => (
                  <div key={i} className="p-6 bg-slate-50 dark:bg-white/5 rounded-[2.5rem] border border-slate-100 dark:border-white/5 flex flex-col group transition-all hover:bg-green-500/5">
                    <p className="text-sm font-bold opacity-80 mb-2 leading-relaxed">"{update.text}"</p>
                    <span className="text-[10px] font-mono uppercase opacity-30 italic">{update.date}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* AI LIVE CANVAS (ימין) */}
          <div className="lg:col-span-4 h-full min-h-[850px]">
            <div className="bg-white dark:bg-[#0b141a] border-4 border-slate-200 dark:border-white/10 rounded-[5rem] h-full shadow-2xl flex flex-col relative overflow-hidden">
              <div className="bg-slate-50 dark:bg-[#1f2c34] p-10 flex items-center gap-5 border-b border-slate-200 dark:border-white/5">
                <div className="w-16 h-16 rounded-[2rem] bg-green-600 flex items-center justify-center font-black text-white text-3xl italic">AI</div>
                <div><h3 className="font-black text-2xl italic tracking-tighter uppercase leading-none mb-1">Studio AI Core</h3><div className="flex items-center gap-2"><div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" /><p className="text-[10px] text-green-600 font-black uppercase tracking-widest">Live Thinking</p></div></div>
              </div>
              <div className="flex-1 p-12 overflow-y-auto">
                <AnimatePresence>
                  {aiCanvasText && (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="p-10 bg-green-600/5 dark:bg-green-600/10 border-r-4 border-green-600 rounded-l-[3rem] shadow-inner">
                      <p className="text-2xl font-bold leading-snug text-green-700 dark:text-green-400 font-mono italic tracking-tight">{aiCanvasText}<span className="inline-block w-2.5 h-8 bg-green-600 animate-pulse ml-3 align-middle" /></p>
                    </motion.div>
                  )}
                </AnimatePresence>
                <div className="mt-12 opacity-20"><ChatInterface trialId={params.trialId} /></div>
              </div>
              <div className="p-10 bg-slate-50 dark:bg-white/5 border-t border-slate-200 dark:border-white/5"><div className="flex gap-4"><div className="flex-1 bg-white dark:bg-black/40 border border-slate-200 dark:border-white/10 rounded-[2rem] p-5 text-xs font-black opacity-20 uppercase tracking-widest italic">AI Sync Processing...</div><div className="bg-green-600 p-5 rounded-[2rem] text-white"><MessageSquare size={24} /></div></div></div>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}
