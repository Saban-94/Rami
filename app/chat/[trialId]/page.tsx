"use client";

import React, { useState, useEffect, useRef } from "react";
import { db } from "../../../lib/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import Navigation from "../../../components/Navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Smartphone, Layout, Palette, Sparkles, 
  Plus, Save, Rocket, Monitor, Smartphone as MobileIcon,
  Type, Image as ImageIcon, List, Calendar, Lock, Sun, Moon, Send
} from "lucide-react";

const initialAppConfig = {
  theme: {
    primaryColor: "#22c55e",
    borderRadius: "24px",
    fontFamily: "Inter",
    glassBlur: "20px"
  },
  blocks: [
    { id: "hero", type: "hero", title: "ברוכים הבאים", subtitle: "המספרה המובילה בטייבה" },
    { id: "cta", type: "button", label: "קבע תור עכשיו", action: "booking" }
  ]
};

export default function VisualAppBuilder({ params }: { params: { trialId: string } }) {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [inputCode, setInputCode] = useState("");
  const [businessData, setBusinessData] = useState<any>(null);
  const [appConfig, setAppConfig] = useState(initialAppConfig);
  const [aiInput, setAiInput] = useState("");
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [aiCanvasText, setAiCanvasText] = useState("");

  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      audioRef.current = new Audio("/sounds/whatsapp.mp3");
    }

    const fetchAppData = async () => {
      try {
        const docRef = doc(db, "trials", params.trialId);
        const snap = await getDoc(docRef);
        if (snap.exists()) {
          const data = snap.data();
          setBusinessData(data);
          if (data.appConfig) setAppConfig(data.appConfig);
        }
      } catch (err) { console.error(err); }
      setLoading(false);
    };
    fetchAppData();
  }, [params.trialId]);

  const handleVerify = () => {
    if (inputCode === businessData?.accessCode) {
      setIsAuthorized(true);
      typeToCanvas(`מערכת SabanOS Visual Builder מוכנה. שלום עמאר, בוא נבנה את האפליקציה שלך.`);
    } else {
      alert("קוד שגוי");
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

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle("dark");
  };

  const applyAiDesign = (style: 'luxury' | 'urban' | 'minimal') => {
    const themes = {
      luxury: { primaryColor: "#d4af37", borderRadius: "12px", glassBlur: "40px" },
      urban: { primaryColor: "#00ff00", borderRadius: "0px", glassBlur: "10px" },
      minimal: { primaryColor: "#3b82f6", borderRadius: "40px", glassBlur: "20px" }
    };
    setAppConfig({ ...appConfig, theme: { ...appConfig.theme, ...themes[style] } });
    typeToCanvas(`החלפתי את העיצוב לסטייל ${style}. איך זה נראה לך ב-Preview?`);
  };

  const saveConfig = async () => {
    setIsSaving(true);
    const docRef = doc(db, "trials", params.trialId);
    await updateDoc(docRef, { appConfig });
    setIsSaving(false);
    typeToCanvas("האפליקציה פורסמה! הלקוחות שלך יכולים לראות את העיצוב החדש.");
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-[#020617] text-green-600 font-black animate-pulse text-2xl">SabanOS Builder...</div>;

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-[#020617] flex items-center justify-center p-4">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 p-12 rounded-[4rem] max-w-md w-full text-center shadow-2xl backdrop-blur-xl">
          <div className="w-24 h-24 bg-green-500 rounded-[2.5rem] mx-auto mb-8 flex items-center justify-center shadow-xl text-white shadow-green-500/20"><Lock size={40} /></div>
          <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-6 italic tracking-tighter">BUILDER LOGIN</h2>
          <input type="password" maxLength={4} value={inputCode} onChange={(e) => setInputCode(e.target.value)} className="w-full bg-slate-100 dark:bg-black/40 border-2 border-slate-200 dark:border-white/10 rounded-3xl p-6 text-center text-4xl tracking-[15px] text-green-600 outline-none focus:border-green-500 mb-8" placeholder="****" />
          <button onClick={handleVerify} className="w-full bg-green-600 text-white font-black py-5 rounded-3xl text-xl hover:bg-green-700 transition-all shadow-lg">OPEN CANVAS</button>
        </motion.div>
      </div>
    );
  }

  return (
    <main className={`min-h-screen ${isDarkMode ? 'bg-[#020617] text-white' : 'bg-[#F8FAFC] text-slate-900'} transition-colors duration-500 font-sans selection:bg-green-500/30 overflow-x-hidden`} dir="rtl">
      <Navigation />
      
      <div className="pt-28 px-8 max-w-[1750px] mx-auto pb-10 grid grid-cols-1 lg:grid-cols-12 gap-8 h-[calc(100vh-120px)]">
        
        {/* שכבות וכלים (שמאל) */}
        <div className="lg:col-span-3 space-y-6 overflow-y-auto custom-scrollbar">
          <div className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-[3rem] p-8 shadow-sm">
            <h2 className="text-xl font-black italic mb-6 flex items-center gap-2">
              <Layout size={20} className="text-green-500" />
              שכבות האפליקציה
            </h2>
            <div className="space-y-3">
              {appConfig.blocks.map((block) => (
                <div key={block.id} className="p-4 bg-slate-50 dark:bg-black/20 rounded-2xl border border-slate-100 dark:border-white/5 flex items-center justify-between group cursor-move">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white dark:bg-white/5 rounded-lg">
                      {block.type === 'hero' ? <ImageIcon size={16}/> : <List size={16}/>}
                    </div>
                    <span className="text-sm font-bold opacity-80">{block.title || block.label}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-[3rem] p-8 shadow-sm">
            <h2 className="text-xl font-black italic mb-6 flex items-center gap-2">
              <Palette size={20} className="text-blue-500" />
              ערכות עיצוב AI
            </h2>
            <div className="grid grid-cols-3 gap-2">
              {['luxury', 'urban', 'minimal'].map((s) => (
                <button key={s} onClick={() => applyAiDesign(s as any)} className="py-3 rounded-xl bg-slate-100 dark:bg-white/5 text-[10px] font-black uppercase hover:bg-green-500 hover:text-black transition-all">
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* הקנבס המרכזי - ה-iPhone */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center relative bg-white/5 dark:bg-black/20 rounded-[4rem] border border-dashed border-slate-200 dark:border-white/10">
          <div className="absolute top-6 flex gap-4 p-2 bg-white dark:bg-white/10 rounded-full border border-slate-200 dark:border-white/10 backdrop-blur-md shadow-sm">
            <button onClick={toggleTheme} className="p-2 hover:text-green-500 transition-all">
              {isDarkMode ? <Sun size={20}/> : <Moon size={20}/>}
            </button>
            <div className="w-px h-5 bg-slate-200 dark:bg-white/10 mx-1 self-center" />
            <button className="p-2 text-green-500"><MobileIcon size={20}/></button>
          </div>

          {/* iPhone Shell */}
          <div className="w-[310px] h-[630px] bg-black rounded-[3.5rem] border-[10px] border-slate-800 shadow-2xl relative overflow-hidden transition-all duration-700 ring-4 ring-slate-900/50">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-6 bg-slate-800 rounded-b-2xl z-20" />
            
            <div 
              className="w-full h-full overflow-y-auto p-6 pt-12 transition-colors duration-700"
              style={{ 
                fontFamily: appConfig.theme.fontFamily, 
                backgroundColor: isDarkMode ? '#0b141a' : '#ffffff',
                color: isDarkMode ? '#ffffff' : '#0f172a'
              }}
            >
              {appConfig.blocks.map((block) => (
                <motion.div layout key={block.id} className="mb-8">
                  {block.type === 'hero' && (
                    <div className="text-center py-10">
                      <div className="w-20 h-20 bg-slate-100 dark:bg-white/5 rounded-3xl mx-auto mb-6 flex items-center justify-center shadow-inner">
                        <ImageIcon className="opacity-20" size={32}/>
                      </div>
                      <h3 className="text-2xl font-black italic mb-2" style={{ color: appConfig.theme.primaryColor }}>{block.title}</h3>
                      <p className="text-[10px] opacity-40 uppercase tracking-widest">{block.subtitle}</p>
                    </div>
                  )}
                  {block.type === 'button' && (
                    <button 
                      className="w-full py-5 font-black text-white shadow-xl shadow-current/10 active:scale-95 transition-all uppercase tracking-tighter"
                      style={{ 
                        backgroundColor: appConfig.theme.primaryColor, 
                        borderRadius: appConfig.theme.borderRadius 
                      }}
                    >
                      {block.label}
                    </button>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* AI Control & Publish (ימין) */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <div className="bg-white dark:bg-[#0b141a] border border-slate-200 dark:border-white/10 rounded-[3.5rem] p-10 flex-1 flex flex-col shadow-2xl relative overflow-hidden">
            <div className="flex items-center gap-3 mb-8 text-green-500">
              <Sparkles size={24} />
              <h2 className="text-2xl font-black italic tracking-tighter uppercase">AI Studio Live</h2>
            </div>
            
            <div className="flex-1 overflow-y-auto mb-8">
              <AnimatePresence mode="wait">
                {aiCanvasText && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-8 bg-green-500/5 border-r-4 border-green-500 rounded-l-3xl">
                    <p className="text-xl font-bold leading-relaxed text-green-600 font-mono italic">
                      {aiCanvasText}
                      <span className="inline-block w-2 h-6 bg-green-500 animate-pulse ml-2" />
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="space-y-4">
              <textarea 
                value={aiInput}
                onChange={(e) => setAiInput(e.target.value)}
                placeholder="תגיד ל-AI מה לעשות..."
                className="w-full h-32 bg-slate-50 dark:bg-black/40 border border-slate-200 dark:border-white/10 rounded-[2.5rem] p-6 text-sm outline-none focus:ring-2 ring-green-500 transition-all resize-none shadow-inner"
              />
              <button 
                onClick={saveConfig}
                disabled={isSaving}
                className="w-full bg-green-600 text-white font-black py-5 rounded-[2rem] flex items-center justify-center gap-3 hover:shadow-[0_0_30px_rgba(34,197,94,0.3)] transition-all disabled:opacity-50"
              >
                {isSaving ? "מפרסם..." : "פרסם אפליקציה"} <Rocket size={20} />
              </button>
            </div>
          </div>
        </div>

      </div>
    </main>
  );
}
