"use client";

import React, { useState, useEffect, useRef } from "react";
import { db } from "@/lib/firebase";
import { doc, onSnapshot, updateDoc } from "firebase/firestore";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Palette, Users, BarChart3, Moon, Sun, Send, Sparkles, 
  Paperclip, Zap, ChevronDown, ShoppingBag, Calendar as CalendarIcon, Terminal
} from "lucide-react";

// רכיבי מערכת
import MobilePreview from "@/components/studio/MobilePreview";
import CRMManager from "@/components/studio/CRMManager";
import CalendarManager from "@/components/studio/CalendarManager";
import { useToast } from "@/components/ui/ToastProvider";
import { suggestDesignFromPrompt } from "@/app/actions/gemini-brain";
import { uploadProfileImage } from "@/app/actions/drive-actions";

export default function SabanOSStudioMaster({ params }: { params: { trialId: string } }) {
  const [activeTab, setActiveTab] = useState<"design" | "crm" | "calendar" | "catalog">("design");
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [manifest, setManifest] = useState<any>(null);
  const [prompt, setPrompt] = useState("");
  const [debugLog, setDebugLog] = useState<string[]>([]); 
  const [isCommandMenuOpen, setIsCommandMenuOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { addToast } = useToast();

  const themeClass = isDarkMode ? "bg-[#020617] text-slate-100" : "bg-[#F8FAFC] text-slate-900";

  useEffect(() => {
    const unsubscribe = onSnapshot(doc(db, "trials", params.trialId), (snap) => {
      if (snap.exists()) setManifest(snap.data());
    });
    return () => unsubscribe();
  }, [params.trialId]);

  // לוגיקת המלשינון
  const log = (msg: string) => setDebugLog(prev => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev].slice(0, 5));

  const handleAiAction = async () => {
    if (!prompt.trim()) return;
    log(`שולח פקודה: ${prompt}`);
    try {
      const patch = await suggestDesignFromPrompt({ prompt });
      log(`התקבל Patch מה-AI`);
      await updateDoc(doc(db, "trials", params.trialId), patch);
      log(`Firestore עודכן בהצלחה`);
      setPrompt("");
    } catch (err) {
      log(`שגיאה: ${err}`);
    }
  };

  return (
    <main className={`h-screen flex flex-col ${themeClass}`} dir="rtl">
      <div className="flex-1 grid grid-cols-12 overflow-hidden pt-16">
        
        {/* Sidebar + המלשינון */}
        <aside className="col-span-2 p-6 flex flex-col gap-4 border-l border-white/5 bg-black/10">
          <div className="space-y-2">
            <button onClick={() => setActiveTab('design')} className={`w-full p-4 rounded-xl flex items-center gap-3 ${activeTab === 'design' ? 'bg-green-600' : 'opacity-40'}`}>
              <Palette size={18}/> סטודיו
            </button>
            <button onClick={() => setActiveTab('crm')} className={`w-full p-4 rounded-xl flex items-center gap-3 ${activeTab === 'crm' ? 'bg-green-600' : 'opacity-40'}`}>
              <Users size={18}/> CRM
            </button>
            <button onClick={() => setActiveTab('calendar')} className={`w-full p-4 rounded-xl flex items-center gap-3 ${activeTab === 'calendar' ? 'bg-green-600' : 'opacity-40'}`}>
              <CalendarIcon size={18}/> יומן
            </button>
          </div>

          {/* המלשינון בתחתית ה-Sidebar */}
          <div className="mt-auto p-4 bg-black/40 rounded-2xl border border-white/5 font-mono text-[9px] text-green-400">
            <div className="flex items-center gap-2 mb-2 border-b border-white/10 pb-1 uppercase"><Terminal size={10}/> Debug Console</div>
            {debugLog.map((l, i) => <div key={i} className="truncate">{l}</div>)}
          </div>
        </aside>

        {/* מרכז העבודה */}
        <section className="col-span-6 p-10 overflow-y-auto">
          {activeTab === 'design' && (
            <div className="space-y-8">
              <h1 className="text-4xl font-black italic italic">STUDIO CORE</h1>
              
              <div className="p-8 bg-white/5 rounded-[3rem] border border-white/10 relative">
                <div className="flex items-center gap-3 mb-4 relative">
                  <div className="relative flex-1">
                    <input 
                      type="text" 
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      className="w-full bg-black/40 border border-white/10 rounded-2xl p-5 pr-14 outline-none focus:border-green-500"
                      placeholder="שלח פקודה ל-AI..."
                    />
                    {/* הסיכה כאן! */}
                    <button 
                      onClick={() => fileInputRef.current?.click()}
                      className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-green-500 z-10"
                    >
                      <Paperclip size={20} />
                    </button>
                    <input type="file" ref={fileInputRef} className="hidden" onChange={(e) => log("העלאת קובץ הופעלה")} />
                  </div>
                  <button onClick={handleAiAction} className="bg-green-600 p-5 rounded-2xl"><Send size={20}/></button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'crm' && <CRMManager trialId={params.trialId} />}
          {activeTab === 'calendar' && <CalendarManager trialId={params.trialId} />}
        </section>

        {/* האייפון בצד */}
        <aside className="col-span-4 flex items-center justify-center bg-black/5">
           <MobilePreview manifest={manifest} />
        </aside>
      </div>
    </main>
  );
}
