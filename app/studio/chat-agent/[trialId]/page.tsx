"use client";

import React, { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { doc, onSnapshot, updateDoc } from "firebase/firestore";
import Navigation from "@/components/Navigation";
import { 
  Palette, Layout as LayoutIcon, BarChart3, 
  Moon, Sun, Send, Sparkles 
} from "lucide-react";
import { useToast } from "@/components/ui/ToastProvider";

// ייבוא אבסולוטי משורש הפרויקט
import MobilePreview from "@/components/studio/MobilePreview";

export default function SabanOSStudio({ params }: { params: { trialId: string } }) {
  const [activeTab, setActiveTab] = useState<"content" | "design" | "analytics">("design");
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [manifest, setManifest] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [prompt, setPrompt] = useState("");
  const { addToast } = useToast();

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
      addToast("שגיאה בעדכון", "error");
    }
  };

  if (loading) return (
    <div className="h-screen bg-[#020617] flex items-center justify-center text-green-500 font-black animate-pulse">
      SabanOS Studio Loading...
    </div>
  );

  return (
    <main className={`h-screen overflow-hidden flex flex-col ${isDarkMode ? 'bg-[#020617] text-white' : 'bg-[#F8FAFC] text-slate-900'}`}>
      <Navigation />
      <div className="flex-1 grid grid-cols-12 gap-0 pt-16">
        
        {/* Sidebar */}
        <aside className="col-span-2 border-l border-white/5 bg-black/20 p-6 flex flex-col gap-4">
          <div className="space-y-2">
            <button onClick={() => setActiveTab('design')} className={`w-full p-4 rounded-2xl flex items-center gap-3 transition-all ${activeTab === 'design' ? 'bg-green-600 text-white shadow-lg' : 'hover:bg-white/5'}`}>
              <Palette size={18}/> <span className="text-sm font-bold">עורך ויזואלי</span>
            </button>
            <button onClick={() => setActiveTab('analytics')} className={`w-full p-4 rounded-2xl flex items-center gap-3 transition-all ${activeTab === 'analytics' ? 'bg-green-600 text-white shadow-lg' : 'hover:bg-white/5'}`}>
              <BarChart3 size={18}/> <span className="text-sm font-bold">ביצועים</span>
            </button>
          </div>
          <button onClick={() => setIsDarkMode(!isDarkMode)} className="mt-auto w-full p-4 bg-white/5 rounded-2xl flex items-center justify-between transition-all hover:bg-white/10">
            <span className="text-xs font-bold uppercase">Mode</span>
            {isDarkMode ? <Moon size={16} /> : <Sun size={16} />}
          </button>
        </aside>

        {/* Main Workspace */}
        <section className="col-span-6 p-8 overflow-y-auto custom-scrollbar">
          <header className="mb-10">
            <h1 className="text-4xl font-black italic uppercase tracking-tighter">Studio Workspace</h1>
            <p className="opacity-50 text-sm">ניהול קריאייטיב: {manifest?.businessName}</p>
          </header>

          <div className="p-8 bg-white/5 rounded-[3rem] border border-white/10 backdrop-blur-xl mb-8 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-6 opacity-5"><Sparkles size={60} /></div>
            <h2 className="text-xl font-black mb-4 flex items-center gap-2 italic uppercase">AI GEN DESIGNER</h2>
            <div className="flex gap-4">
              <input 
                type="text" 
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="תאר את השינוי (למשל: תעשה את האפליקציה בזהב)..."
                className="flex-1 bg-black/40 border border-white/10 rounded-2xl p-5 text-sm outline-none focus:border-green-500 transition-all"
              />
              <button className="bg-green-600 hover:bg-green-500 p-5 rounded-2xl text-white transition-all shadow-xl">
                <Send size={20} />
              </button>
            </div>
          </div>
        </section>

        {/* Mobile Column */}
        <aside className="col-span-4 bg-black/10 flex items-center justify-center relative border-r border-white/5">
           <div className="sticky top-0 h-full w-full flex items-center justify-center p-12">
              <MobilePreview manifest={manifest} />
           </div>
        </aside>

      </div>
    </main>
  );
}
