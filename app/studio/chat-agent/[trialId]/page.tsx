"use client";

import React, { useState, useEffect, useRef } from "react";
import { db } from "@/lib/firebase";
import { doc, onSnapshot, updateDoc } from "firebase/firestore";
import Navigation from "@/components/Navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Palette, Users, BarChart3, Moon, Sun, Send, Sparkles, 
  Paperclip, Image as ImageIcon, Zap, ChevronDown, 
  ShoppingBag, Megaphone, Calendar as CalendarIcon, Layout as LayoutIcon,
  Search, Terminal, CheckCircle2, AlertCircle
} from "lucide-react";

// רכיבים
import MobilePreview from "@/components/studio/MobilePreview";
import CRMManager from "@/components/studio/CRMManager";
import CalendarManager from "@/components/studio/CalendarManager";
import { useToast } from "@/components/ui/ToastProvider";
import { suggestDesignFromPrompt } from "@/app/actions/gemini-brain";
import { uploadProfileImage } from "@/app/actions/drive-actions";

const COMMAND_CATALOG = {
  "עיצוב פרימיום": [
    { label: "✨ מראה יוקרתי", prompt: "תהפוך את האפליקציה ליוקרתית עם זהב ושחור" },
    { label: "🚀 הייטק מודרני", prompt: "עיצוב Glassmorphism וכחול ניאון" }
  ],
  "חנות ומבצעים": [
    { label: "💰 סייל 20%", prompt: "צור מבצע 20% הנחה על כל הקטלוג" },
    { label: "⭐ מוצרים נבחרים", prompt: "קדם מוצרים נבחרים לראש הדף" }
  ]
};

export default function SabanOSStudioMaster({ params }: { params: { trialId: string } }) {
  const [activeTab, setActiveTab] = useState<"design" | "crm" | "calendar" | "catalog">("design");
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [manifest, setManifest] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [prompt, setPrompt] = useState("");
  const [aiAdvice, setAiAdvice] = useState("");
  const [debugLog, setDebugLog] = useState<string[]>([]); // "המלשינון"
  const [isCommandMenuOpen, setIsCommandMenuOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { addToast } = useToast();

  const themeClass = isDarkMode ? "bg-[#020617] text-slate-100" : "bg-[#F8FAFC] text-slate-900";
  const panelClass = isDarkMode ? "bg-white/5 border-white/10" : "bg-white border-slate-200 shadow-sm";

  useEffect(() => {
    if (!params.trialId) return;
    const unsubscribe = onSnapshot(doc(db, "trials", params.trialId), (snap) => {
      if (snap.exists()) setManifest(snap.data());
      setLoading(false);
    });
    return () => unsubscribe();
  }, [params.trialId]);

  // פונקציית המלשינון
  const logAction = (msg: string) => {
    setDebugLog(prev => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev].slice(0, 5));
  };

  const handleAiAction = async (p: string) => {
    const finalPrompt = p || prompt;
    if (!finalPrompt.trim()) return;

    logAction(`שולח בקשה ל-AI: ${finalPrompt.substring(0, 20)}...`);
    addToast("ה-AI מעבד נתונים...", "success");

    try {
      const patch = await suggestDesignFromPrompt({ prompt: finalPrompt });
      logAction(`התקבל Patch: ${JSON.stringify(patch).substring(0, 30)}...`);
      
      if (patch.marketingAdvice) setAiAdvice(patch.marketingAdvice);
      
      const docRef = doc(db, "trials", params.trialId);
      await updateDoc(docRef, patch);
      logAction("Firestore עודכן בהצלחה!");
      
      setPrompt("");
      setIsCommandMenuOpen(false);
    } catch (err) {
      logAction(`שגיאה: ${err}`);
      addToast("כשל בביצוע הפקודה", "error");
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    logAction(`מעלה קובץ: ${file.name}`);
    const formData = new FormData();
    formData.append("file", file);
    const result = await uploadProfileImage(params.trialId, formData);
    if (result.success) {
      logAction("קובץ עלה ועודכן ב-DB");
      addToast("הקובץ עודכן", "success");
    }
  };

  if (loading) return <div className="h-screen bg-[#020617] flex items-center justify-center text-green-500 font-black italic">SabanOS Engine Loading...</div>;

  return (
    <main className={`h-screen overflow-hidden flex flex-col transition-all duration-500 ${themeClass}`} dir="rtl">
      <Navigation />
      
      <div className="flex-1 grid grid-cols-12 gap-0 pt-16">
        
        {/* --- Sidebar (15%) --- */}
        <aside className={`col-span-2 border-l p-6 flex flex-col gap-2 ${isDarkMode ? 'bg-black/20 border-white/5' : 'bg-slate-50 border-slate-200'}`}>
          <div className="space-y-1">
            {[
              { id: 'design', icon: <Palette size={18}/>, label: 'סטודיו עריכה' },
              { id: 'crm', icon: <Users size={18}/>, label: 'לקוחות ולידים' },
              { id: 'calendar', icon: <CalendarIcon size={18}/>, label: 'ניהול תורים' },
              { id: 'catalog', icon: <ShoppingBag size={18}/>, label: 'קטלוג מוצרים' },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as any)}
                className={`w-full p-4 rounded-2xl flex items-center gap-3 transition-all font-bold ${
                  activeTab === item.id ? 'bg-green-600 text-white' : 'opacity-40 hover:opacity-100'
                }`}
              >
                {item.icon} <span className="text-sm italic">{item.label}</span>
              </button>
            ))}
          </div>

          {/* המלשינון (Debug Console) */}
          <div className="mt-auto bg-black/40 rounded-2xl p-4 border border-white/5 font-mono text-[10px] space-y-2">
            <div className="flex items-center gap-2 text-green-500 border-b border-white/5 pb-1 uppercase font-black">
              <Terminal size={12} /> System Logs
            </div>
            {debugLog.map((log, i) => (
              <div key={i} className="opacity-70 truncate">{log}</div>
            ))}
          </div>
        </aside>

        {/* --- Main Workspace (55%) --- */}
        <section className="col-span-6 p-10 overflow-y-auto custom-scrollbar">
          <AnimatePresence mode="wait">
            {activeTab === 'design' && (
              <motion.div key="design" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                <header>
                  <h1 className="text-5xl font-black italic uppercase tracking-tighter">Command Studio</h1>
                  <p className="opacity-50 font-bold uppercase">Dynamic Control: {manifest?.businessName}</p>
                </header>

                {/* AI Box with PIN & COMMANDS */}
                <div className={`p-8 rounded-[3.5rem] border ${panelClass} relative`}>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-black italic uppercase flex items-center gap-2">
                      <Sparkles className="text-green-500"/> AI Generator
                    </h2>
                    <button 
                      onClick={() => setIsCommandMenuOpen(!isCommandMenuOpen)}
                      className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-xl text-xs font-bold border border-white/10"
                    >
                      פקודות מהירות <ChevronDown size={14} />
                    </button>
                  </div>

                  <div className="relative flex items-center gap-3 mb-4">
                    <div className="relative flex-1">
                      <input 
                        type="text" 
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder="שאל את ה-AI לבצע שינוי..."
                        className={`w-full rounded-3xl p-6 pr-14 text-sm outline-none border focus:border-green-500 transition-all ${isDarkMode ? 'bg-black/40 border-white/10 text-white' : 'bg-slate-100 border-slate-200'}`}
                      />
                      {/* כפתור הסיכה - מוודא שהוא כאן ולא נדרס */}
                      <button 
                        onClick={() => fileInputRef.current?.click()}
                        className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-green-500 transition-colors"
                        title="העלאת לוגו או תמונה"
                      >
                        <Paperclip size={22} />
                      </button>
                      <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" accept="image/*" />
                    </div>
                    <button onClick={() => handleAiAction(prompt)} className="bg-green-600 p-6 rounded-3xl text-white shadow-xl hover:scale-105 transition-all">
                      <Send size={20} />
                    </button>
                  </div>

                  <AnimatePresence>
                    {isCommandMenuOpen && (
                      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-wrap gap-2 mt-2">
                        {Object.values(COMMAND_CATALOG).flat().map((cmd, i) => (
                          <button key={i} onClick={() => handleAiAction(cmd.prompt)} className="bg-white/5 border border-white/10 px-4 py-2 rounded-full text-[10px] font-black uppercase hover:border-green-500 transition-all">
                            {cmd.label}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            )}

            {activeTab === 'crm' && <CRMManager trialId={params.trialId} />}
            {activeTab === 'calendar' && <CalendarManager trialId={params.trialId} />}
            {activeTab === 'catalog' && (
              <div className="grid grid-cols-2 gap-6 p-4">
                {manifest?.catalog?.products?.map((p: any, i: number) => (
                  <div key={i} className={`p-6 rounded-[2.5rem] border ${panelClass}`}>
                    <h4 className="font-black italic underline decoration-green-500">{p.name}</h4>
                    <p className="text-xs opacity-50 mt-2">{p.description}</p>
                    <div className="mt-4 font-black">₪{p.price}</div>
                  </div>
                ))}
              </div>
            )}
          </AnimatePresence>
        </section>

        {/* --- Mobile Preview (30%) --- */}
        <aside className={`col-span-4 flex items-center justify-center relative border-r ${isDarkMode ? 'bg-black/10 border-white/5' : 'bg-slate-100 border-slate-200'}`}>
           <div className="sticky top-0 h-full w-full flex items-center justify-center p-12">
              <MobilePreview manifest={manifest} />
           </div>
        </aside>
      </div>
    </main>
  );
}
