"use client";

import React, { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { doc, onSnapshot, updateDoc } from "firebase/firestore";
import Navigation from "@/components/Navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Palette, Users, BarChart3, 
  Moon, Sun, Send, Sparkles, 
  Layout as LayoutIcon, Settings
} from "lucide-react";
import MobilePreview from "@/components/studio/MobilePreview";
import CRMManager from "@/components/studio/CRMManager";
import { useToast } from "@/components/ui/ToastProvider";
import { suggestDesignFromPrompt } from "@/app/actions/gemini-brain";

export default function SabanOSStudioPro({ params }: { params: { trialId: string } }) {
  const [activeTab, setActiveTab] = useState<"design" | "crm" | "analytics">("design");
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [manifest, setManifest] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [prompt, setPrompt] = useState("");
  const { addToast } = useToast();

  // צבעי טקסט ורקע מותאמים למניעת שקיפות
  const themeClass = isDarkMode 
    ? "bg-[#020617] text-slate-100" 
    : "bg-[#F8FAFC] text-slate-900";

  const panelClass = isDarkMode
    ? "bg-white/5 border-white/10"
    : "bg-white border-slate-200 shadow-sm";

  useEffect(() => {
    if (!params.trialId) return;
    const docRef = doc(db, "trials", params.trialId);
    const unsubscribe = onSnapshot(docRef, (snap) => {
      if (snap.exists()) setManifest(snap.data());
      setLoading(false);
    }, (error) => {
      console.error("Firestore Error:", error);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [params.trialId]);

  const applyPatch = async (patch: any) => {
    try {
      const docRef = doc(db, "trials", params.trialId);
      await updateDoc(docRef, patch);
      addToast("העיצוב עודכן בהצלחה", "success");
    } catch (err) {
      addToast("שגיאה בעדכון המסמך", "error");
    }
  };

  const handleAiDesign = async () => {
    if (!prompt.trim()) return;
    addToast("SabanOS AI מנתח את הבקשה...", "success");
    try {
      const patch = await suggestDesignFromPrompt({ prompt });
      await applyPatch(patch);
      setPrompt("");
    } catch (err) {
      addToast("ה-AI נתקל בקשיים, נסה שוב", "error");
    }
  };

  if (loading) return (
    <div className="h-screen bg-[#020617] flex items-center justify-center text-green-500 font-black animate-pulse tracking-tighter uppercase">
      SabanOS Studio Pro Core Loading...
    </div>
  );

  return (
    <main className={`h-screen overflow-hidden flex flex-col transition-colors duration-500 ${themeClass}`} dir="rtl">
      <Navigation />
      
      <div className="flex-1 grid grid-cols-12 gap-0 pt-16">
        
        {/* --- עמודה 1: Sidebar (15%) --- */}
        <aside className={`col-span-2 border-l p-6 flex flex-col gap-4 transition-colors ${isDarkMode ? 'border-white/5 bg-black/20' : 'border-slate-200 bg-slate-50'}`}>
          <div className="space-y-2">
            {[
              { id: 'design', icon: <Palette size={18}/>, label: 'סטודיו עיצוב' },
              { id: 'crm', icon: <Users size={18}/>, label: 'ניהול לקוחות' },
              { id: 'analytics', icon: <BarChart3 size={18}/>, label: 'סטטיסטיקה' },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as any)}
                className={`w-full p-4 rounded-2xl flex items-center gap-3 transition-all font-bold ${
                  activeTab === item.id 
                    ? 'bg-green-600 text-white shadow-lg' 
                    : isDarkMode ? 'hover:bg-white/5 text-slate-400' : 'hover:bg-slate-200 text-slate-600'
                }`}
              >
                {item.icon} <span className="text-sm italic">{item.label}</span>
              </button>
            ))}
          </div>

          <div className="mt-auto pt-6 border-t border-white/10 space-y-4">
            <button 
              onClick={() => setIsDarkMode(!isDarkMode)} 
              className={`w-full p-4 rounded-2xl flex items-center justify-between transition-all ${isDarkMode ? 'bg-white/5 hover:bg-white/10' : 'bg-slate-200 hover:bg-slate-300'}`}
            >
              <span className="text-[10px] font-black uppercase tracking-widest">
                {isDarkMode ? 'מצב בהיר יוקרתי' : 'מצב כהה עדין'}
              </span>
              {isDarkMode ? <Sun size={16} className="text-yellow-500" /> : <Moon size={16} className="text-slate-700" />}
            </button>
            <div className={`p-4 rounded-2xl border text-center ${isDarkMode ? 'bg-green-500/5 border-green-500/20' : 'bg-green-50 border-green-200'}`}>
              <p className="text-[9px] font-black uppercase text-green-600 tracking-tighter">SabanOS Studio v2.8</p>
            </div>
          </div>
        </aside>

        {/* --- עמודה 2: Main Workspace (55%) --- */}
        <section className="col-span-6 p-10 overflow-y-auto custom-scrollbar">
          <AnimatePresence mode="wait">
            {activeTab === 'design' && (
              <motion.div 
                key="design-tab"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <header>
                  <h1 className="text-5xl font-black italic uppercase tracking-tighter mb-2">Design Studio</h1>
                  <p className={`text-sm font-bold opacity-60 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                    עורך ויזואלי עבור {manifest?.businessName}
                  </p>
                </header>

                {/* AI Prompt Box */}
                <div className={`p-8 rounded-[3rem] border backdrop-blur-xl relative overflow-hidden group transition-all ${panelClass}`}>
                  <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity"><Sparkles size={80} /></div>
                  <h2 className="text-xl font-black mb-4 flex items-center gap-2 italic uppercase tracking-tight">AI Generation</h2>
                  <div className="flex gap-4">
                    <input 
                      type="text" 
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      placeholder="לדוגמה: תהפוך את הכותרת לזהב ותשנה לרקע יוקרתי..."
                      className={`flex-1 border rounded-2xl p-5 text-sm outline-none focus:border-green-500 transition-all ${
                        isDarkMode ? 'bg-black/40 border-white/10 text-white' : 'bg-slate-100 border-slate-200 text-slate-900'
                      }`}
                    />
                    <button 
                      onClick={handleAiDesign}
                      className="bg-green-600 hover:bg-green-500 p-5 rounded-2xl text-white transition-all shadow-[0_10px_30px_rgba(22,163,74,0.3)]"
                    >
                      <Send size={20} />
                    </button>
                  </div>
                </div>

                {/* Quick Tools */}
                <div className={`p-8 rounded-[3rem] border ${panelClass}`}>
                  <h3 className="font-black text-sm uppercase mb-6 tracking-widest text-green-500">Quick Configuration</h3>
                  <div className="grid grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <label className="text-[10px] font-black uppercase opacity-40">Primary Brand Color</label>
                      <input 
                        type="color" 
                        value={manifest?.appConfig?.theme?.primaryColor || "#10b981"}
                        onChange={(e) => applyPatch({ "appConfig.theme.primaryColor": e.target.value })}
                        className="w-full h-14 rounded-2xl bg-transparent cursor-pointer border-2 border-white/5"
                      />
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] font-black uppercase opacity-40">Business Name</label>
                      <input 
                        type="text" 
                        value={manifest?.businessName || ""}
                        onChange={(e) => applyPatch({ "businessName": e.target.value })}
                        className={`w-full p-4 rounded-2xl border outline-none focus:border-green-500 ${
                          isDarkMode ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200'
                        }`}
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'crm' && (
              <motion.div 
                key="crm-tab"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <header>
                  <h1 className="text-5xl font-black italic uppercase tracking-tighter mb-2 text-green-500">CRM Manager</h1>
                  <p className="opacity-50 text-sm font-bold uppercase tracking-widest">ניהול לידים ולקוחות בזמן אמת</p>
                </header>
                <CRMManager trialId={params.trialId} />
              </motion.div>
            )}
          </AnimatePresence>
        </section>

        {/* --- עמודה 3: Mobile Preview (30%) --- */}
        <aside className={`col-span-4 flex items-center justify-center relative border-r transition-colors ${
          isDarkMode ? 'bg-black/10 border-white/5' : 'bg-slate-100 border-slate-200'
        }`}>
           <div className="sticky top-0 h-full w-full flex items-center justify-center p-12">
              <MobilePreview manifest={manifest} />
           </div>
        </aside>

      </div>
    </main>
  );
}
