"use client";

import React, { useState, useEffect, useRef } from "react";
import { db } from "@/lib/firebase";
import { doc, onSnapshot, updateDoc } from "firebase/firestore";
import Navigation from "@/components/Navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Palette, Layout as LayoutIcon, BarChart3, 
  Smartphone, Bell, Moon, Sun, Send, Sparkles 
} from "lucide-react";
import MobilePreview from "@/components/studio/MobilePreview";
import { useToast } from "@/components/ui/ToastProvider";
import { suggestDesignFromPrompt } from "@/app/actions/gemini-brain";

export default function SabanOSStudio({ params }: { params: { trialId: string } }) {
  const [activeTab, setActiveTab] = useState<"content" | "design" | "analytics">("design");
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [manifest, setManifest] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [prompt, setPrompt] = useState("");
  const { addToast } = useToast();

  // סנכרון נתונים בזמן אמת מול Firebase
  useEffect(() => {
    const docRef = doc(db, "trials", params.trialId);
    const unsubscribe = onSnapshot(docRef, (snap) => {
      if (snap.exists()) setManifest(snap.data());
      setLoading(false);
    });
    return () => unsubscribe();
  }, [params.trialId]);

  // פונקציית ה-Patch החכמה (Wix Style)
  const applyPatch = async (patch: any) => {
    try {
      const docRef = doc(db, "trials", params.trialId);
      // מיזוג חכם של ה-State החדש לתוך הקיים
      const updatedManifest = { ...manifest, ...patch };
      await updateDoc(docRef, updatedManifest);
      addToast("העיצוב עודכן בהצלחה", "success");
    } catch (err) {
      addToast("שגיאה בעדכון", "error");
    }
  };

  const handleAiDesign = async () => {
    if (!prompt) return;
    addToast("הבינה המלאכותית מעצבת עבורך...", "success");
    const patch = await suggestDesignFromPrompt({ prompt });
    await applyPatch(patch);
    setPrompt("");
  };

  if (loading) return <div className="h-screen bg-[#020617] flex items-center justify-center text-green-500 font-black animate-pulse uppercase">SabanOS Studio Loading...</div>;

  return (
    <main className={`h-screen overflow-hidden flex flex-col ${isDarkMode ? 'bg-[#020617] text-white' : 'bg-[#F8FAFC] text-slate-900'}`}>
      <Navigation />
      
      {/* 3 עמודות המערכת */}
      <div className="flex-1 grid grid-cols-12 gap-0 pt-16">
        
        {/* עמודה 1: ניווט (15%) */}
        <aside className="col-span-2 border-l border-white/5 bg-black/20 p-6 flex flex-col gap-4">
          <div className="space-y-2">
            {[
              { id: 'design', icon: <Palette size={18}/>, label: 'עורך ויזואלי' },
              { id: 'content', icon: <LayoutIcon size={18}/>, label: 'ניהול תוכן' },
              { id: 'analytics', icon: <BarChart3 size={18}/>, label: 'ביצועים' },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as any)}
                className={`w-full p-4 rounded-2xl flex items-center gap-3 transition-all ${activeTab === item.id ? 'bg-green-600 text-white shadow-lg' : 'hover:bg-white/5'}`}
              >
                {item.icon} <span className="text-sm font-bold">{item.label}</span>
              </button>
            ))}
          </div>

          <div className="mt-auto pt-6 border-t border-white/5 space-y-4">
            <button onClick={() => setIsDarkMode(!isDarkMode)} className="w-full p-4 bg-white/5 rounded-2xl flex items-center justify-between">
              <span className="text-xs font-bold uppercase">Mode</span>
              {isDarkMode ? <Moon size={16} /> : <Sun size={16} />}
            </button>
            <div className="p-4 bg-green-500/10 rounded-2xl border border-green-500/20 text-center">
              <p className="text-[10px] font-black uppercase text-green-500 tracking-tighter">SabanOS Pro v2.6</p>
            </div>
          </div>
        </aside>

        {/* עמודה 2: לוח בקרה ו-CRM (55%) */}
        <section className="col-span-6 p-8 overflow-y-auto custom-scrollbar">
          <header className="mb-10">
            <h1 className="text-4xl font-black italic uppercase tracking-tighter">Studio Workspace</h1>
            <p className="opacity-50 text-sm">עריכה וניהול של {manifest?.businessName}</p>
          </header>

          <div className="grid gap-8">
            {/* AI Designer Tool */}
            <div className="p-8 bg-white/5 rounded-[3rem] border border-white/10 backdrop-blur-xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity"><Sparkles size={60} /></div>
              <h2 className="text-xl font-black mb-4 flex items-center gap-2 italic underline decoration-green-500">AI GEN DESIGNER</h2>
              <div className="flex gap-4">
                <input 
                  type="text" 
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="לדוגמה: תהפוך את האפליקציה ליוקרתית עם צבעי זהב ושחור..."
                  className="flex-1 bg-black/40 border border-white/10 rounded-2xl p-5 text-sm outline-none focus:border-green-500 transition-all"
                />
                <button onClick={handleAiDesign} className="bg-green-600 hover:bg-green-500 p-5 rounded-2xl text-white transition-all shadow-xl">
                  <Send size={20} />
                </button>
              </div>
            </div>

            {/* Content Editor Panel */}
            <div className="bg-white/5 rounded-[3.5rem] p-8 border border-white/10">
               {activeTab === 'design' && (
                 <div className="space-y-6">
                    <h3 className="font-bold text-lg italic uppercase tracking-widest text-green-500">Theme Settings</h3>
                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold opacity-40 uppercase">Primary Color</label>
                        <input 
                          type="color" 
                          value={manifest?.appConfig?.theme?.primaryColor || "#10b981"}
                          onChange={(e) => applyPatch({ "appConfig.theme.primaryColor": e.target.value })}
                          className="w-full h-12 rounded-xl bg-transparent cursor-pointer"
                        />
                      </div>
                      {/* עוד פקדים... */}
                    </div>
                 </div>
               )}
            </div>
          </div>
        </section>

        {/* עמודה 3: סימולטור דביק (30%) */}
        <aside className="col-span-4 bg-black/10 flex flex-col items-center justify-center relative border-r border-white/5">
           <div className="sticky top-0 h-full w-full flex items-center justify-center p-12">
              <MobilePreview manifest={manifest} />
           </div>
        </aside>

      </div>
    </main>
  );
}
