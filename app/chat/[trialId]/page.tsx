"use client";

import React, { useState, useEffect, useRef } from "react";
import { db } from "../../../lib/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import Navigation from "../../../components/Navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Smartphone, Layout, Palette, Sparkles, 
  Plus, Save, Rocket, Monitor, Smartphone as MobileIcon,
  Type, Image as ImageIcon, List, Calendar
} from "lucide-react";

// מבנה ראשוני של האפליקציה (ה-JSON Schema)
const initialAppConfig = {
  theme: {
    primaryColor: "#22c55e", // ירוק SabanOS
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
  const [appConfig, setAppConfig] = useState(initialAppConfig);
  const [activeTab, setActiveTab] = useState<'editor' | 'ai'>('editor');
  const [aiInput, setAiInput] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApp = async () => {
      const docRef = doc(db, "trials", params.trialId);
      const snap = await getDoc(docRef);
      if (snap.exists() && snap.data().appConfig) {
        setAppConfig(snap.data().appConfig);
      }
      setLoading(false);
    };
    fetchApp();
  }, [params.trialId]);

  // פונקציה שה-AI משתמש בה כדי לעדכן את העיצוב
  const applyAiDesign = (style: 'luxury' | 'urban' | 'minimal') => {
    const themes = {
      luxury: { primaryColor: "#d4af37", borderRadius: "12px", glassBlur: "40px" },
      urban: { primaryColor: "#00ff00", borderRadius: "0px", glassBlur: "10px" },
      minimal: { primaryColor: "#3b82f6", borderRadius: "40px", glassBlur: "20px" }
    };
    setAppConfig({ ...appConfig, theme: { ...appConfig.theme, ...themes[style] } });
  };

  const saveConfig = async () => {
    setIsSaving(true);
    const docRef = doc(db, "trials", params.trialId);
    await updateDoc(docRef, { appConfig });
    setIsSaving(false);
    alert("האפליקציה פורסמה בהצלחה!");
  };

  return (
    <main className="min-h-screen bg-[#F8FAFC] dark:bg-[#020617] text-slate-900 dark:text-white" dir="rtl">
      <Navigation />
      
      <div className="pt-24 px-6 max-w-[1800px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 pb-10 h-[calc(100vh-100px)]">
        
        {/* סרגל כלים שמאלי - השכבות והבלוקים */}
        <div className="lg:col-span-3 space-y-6 overflow-y-auto pr-2">
          <div className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-[2.5rem] p-6 shadow-sm">
            <h2 className="text-xl font-black italic mb-6 flex items-center gap-2">
              <Layout size={20} className="text-green-500" />
              מבנה האפליקציה
            </h2>
            
            <div className="space-y-3">
              {appConfig.blocks.map((block) => (
                <div key={block.id} className="p-4 bg-slate-50 dark:bg-black/20 rounded-2xl border border-slate-100 dark:border-white/5 flex items-center justify-between group">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white dark:bg-white/5 rounded-lg">
                      {block.type === 'hero' ? <ImageIcon size={16}/> : <List size={16}/>}
                    </div>
                    <span className="text-sm font-bold opacity-80">{block.title || block.label}</span>
                  </div>
                  <Plus size={14} className="opacity-0 group-hover:opacity-100 cursor-pointer" />
                </div>
              ))}
              <button className="w-full py-4 border-2 border-dashed border-slate-200 dark:border-white/10 rounded-2xl text-xs font-black opacity-40 hover:opacity-100 hover:border-green-500 transition-all flex items-center justify-center gap-2 mt-4">
                <Plus size={16} /> הוסף בלוק חדש
              </button>
            </div>
          </div>

          <div className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-[2.5rem] p-6 shadow-sm">
            <h2 className="text-xl font-black italic mb-6 flex items-center gap-2">
              <Palette size={20} className="text-blue-500" />
              עיצוב מותג (AI)
            </h2>
            <div className="grid grid-cols-3 gap-2">
              {['luxury', 'urban', 'minimal'].map((s) => (
                <button key={s} onClick={() => applyAiDesign(s as any)} className="py-3 px-1 rounded-xl bg-slate-100 dark:bg-white/5 text-[10px] font-black uppercase hover:bg-green-500 hover:text-black transition-all">
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* מרכז - הקנבס החי (iPhone Preview) */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center relative">
          <div className="absolute top-0 flex gap-4 p-2 bg-white/50 dark:bg-white/5 rounded-full backdrop-blur-md mb-8 border border-white/10">
            <button className="p-2 text-green-500"><MobileIcon size={20}/></button>
            <button className="p-2 opacity-30"><Monitor size={20}/></button>
          </div>

          {/* iPhone Shell */}
          <div className="w-[320px] h-[650px] bg-black rounded-[3.5rem] border-[8px] border-slate-800 shadow-[0_0_100px_rgba(0,0,0,0.2)] overflow-hidden relative">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-slate-800 rounded-b-2xl z-20" /> {/* Notch */}
            
            {/* תוכן האפליקציה המרונדר מה-JSON */}
            <div 
              className="w-full h-full overflow-y-auto p-6 pt-12 transition-all duration-700"
              style={{ fontFamily: appConfig.theme.fontFamily, backgroundColor: isDarkMode ? '#000' : '#fff' }}
            >
              {appConfig.blocks.map((block) => (
                <motion.div 
                  layout
                  key={block.id} 
                  className="mb-6"
                >
                  {block.type === 'hero' && (
                    <div className="text-center py-10">
                      <div className="w-16 h-16 bg-slate-200 rounded-2xl mx-auto mb-4" />
                      <h3 className="text-2xl font-black italic" style={{ color: appConfig.theme.primaryColor }}>{block.title}</h3>
                      <p className="text-xs opacity-50 mt-1">{block.subtitle}</p>
                    </div>
                  )}
                  {block.type === 'button' && (
                    <button 
                      className="w-full py-4 font-black text-white shadow-lg shadow-green-500/20"
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

        {/* צד ימין - AI Control Center */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <div className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-[3rem] p-8 flex-1 flex flex-col shadow-sm backdrop-blur-xl">
            <div className="flex items-center gap-3 mb-8 text-green-500">
              <Sparkles size={24} />
              <h2 className="text-2xl font-black italic tracking-tighter">AI DESIGNER</h2>
            </div>
            
            <div className="flex-1 overflow-y-auto mb-6 p-4 bg-slate-50 dark:bg-black/40 rounded-3xl border border-slate-100 dark:border-white/5">
              <p className="text-sm font-medium leading-relaxed italic opacity-60">
                היי עמאר, אני מוכן לעצב. פשוט תגיד לי מה לשנות באפליקציה... לדוגמה: "תעשה את האפליקציה בסטייל יוקרתי עם פינות מעוגלות".
              </p>
            </div>

            <div className="relative">
              <textarea 
                value={aiInput}
                onChange={(e) => setAiInput(e.target.value)}
                placeholder="כתוב הוראה ל-AI..."
                className="w-full h-32 bg-white dark:bg-black/60 border border-slate-200 dark:border-white/10 rounded-[2rem] p-6 text-sm outline-none focus:ring-2 ring-green-500 transition-all resize-none shadow-inner"
              />
              <button className="absolute bottom-4 left-4 p-3 bg-green-500 text-black rounded-2xl shadow-lg hover:scale-105 transition-all">
                <Sparkles size={18} />
              </button>
            </div>

            <button 
              onClick={saveConfig}
              disabled={isSaving}
              className="w-full bg-slate-900 dark:bg-white text-white dark:text-black font-black py-5 rounded-[2rem] mt-6 flex items-center justify-center gap-3 hover:shadow-2xl transition-all"
            >
              {isSaving ? "מפרסם..." : "פרסם אפליקציה ללקוחות"} <Rocket size={20} />
            </button>
          </div>
        </div>

      </div>
    </main>
  );
}
