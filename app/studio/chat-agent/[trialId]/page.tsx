"use client";

import React, { useState, useEffect, useRef } from "react";
import { db } from "@/lib/firebase";
import { doc, onSnapshot, updateDoc } from "firebase/firestore";
import Navigation from "@/components/Navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Palette, Users, BarChart3, Moon, Sun, Send, Sparkles, 
  Paperclip, Image as ImageIcon, Zap, ChevronDown, 
  ShoppingBag, Megaphone, Calendar as CalendarIcon, Layout as LayoutIcon
} from "lucide-react";

// רכיבים פנימיים
import MobilePreview from "@/components/studio/MobilePreview";
import CRMManager from "@/components/studio/CRMManager";
import CalendarManager from "@/components/studio/CalendarManager";
import { useToast } from "@/components/ui/ToastProvider";
import { suggestDesignFromPrompt } from "@/app/actions/gemini-brain";
import { uploadProfileImage } from "@/app/actions/drive-actions";

// קטלוג פקודות AI מקוטלג
const COMMAND_CATALOG = {
  "עיצוב ואווירה": [
    { label: "✨ מראה יוקרתי", prompt: "תהפוך את האפליקציה ליוקרתית עם צבעי זהב ושחור ופונט Serif" },
    { label: "🚀 הייטק מודרני", prompt: "עיצוב Glassmorphism, כחול ניאון ופינות מעוגלות מאוד" },
    { label: "🌸 נקי ורך", prompt: "עיצוב פסטלי מינימליסטי, רקע לבן ופונט Assistant" }
  ],
  "מכירות ומוצרים": [
    { label: "💰 צור מבצע", prompt: "הוסף הנחה של 20% על כל המוצרים וסמן אותם ב-Sale" },
    { label: "⭐ מוצרים נבחרים", prompt: "הצג את המוצרים הכי נמכרים בראש הקטלוג" },
    { label: "📦 רענן קטלוג", prompt: "כתוב תיאורים שיווקיים חדשים לכל המוצרים שלי" }
  ],
  "שיווק וייעוץ": [
    { label: "📱 רעיון לפוסט", prompt: "תן לי הנחיות לעיצוב פוסט אינסטגרם שיקדם את העסק שלי" },
    { label: "✍️ סלוגן חדש", prompt: "כתוב סלוגן שיווקי קליט שמתמקד בשירות אישי" }
  ]
};

export default function SabanOSStudioPro({ params }: { params: { trialId: string } }) {
  const [activeTab, setActiveTab] = useState<"design" | "crm" | "calendar" | "catalog">("design");
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [manifest, setManifest] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [prompt, setPrompt] = useState("");
  const [aiAdvice, setAiAdvice] = useState("");
  const [isCommandMenuOpen, setIsCommandMenuOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { addToast } = useToast();

  // הגדרות עיצוב למניעת טקסט שקוף
  const themeClass = isDarkMode ? "bg-[#020617] text-slate-100" : "bg-[#F8FAFC] text-slate-900";
  const panelClass = isDarkMode ? "bg-white/5 border-white/10" : "bg-white border-slate-200 shadow-sm";
  const inputClass = isDarkMode ? "bg-black/40 border-white/10 text-white" : "bg-slate-100 border-slate-200 text-slate-900";

  useEffect(() => {
    if (!params.trialId) return;
    const unsubscribe = onSnapshot(doc(db, "trials", params.trialId), (snap) => {
      if (snap.exists()) setManifest(snap.data());
      setLoading(false);
    });
    return () => unsubscribe();
  }, [params.trialId]);

  const handleAiAction = async (p: string) => {
    const finalPrompt = p || prompt;
    if (!finalPrompt.trim()) return;

    addToast("SabanOS AI מנתח ומבצע...", "success");
    try {
      const patch = await suggestDesignFromPrompt({ prompt: finalPrompt });
      if (patch.marketingAdvice) setAiAdvice(patch.marketingAdvice);
      await updateDoc(doc(db, "trials", params.trialId), patch);
      setPrompt("");
      setIsCommandMenuOpen(false);
    } catch (err) {
      addToast("ה-AI נתקל בקשיים, נסה שוב", "error");
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    addToast("מעלה קובץ לתשתית הדרייב...", "success");
    const formData = new FormData();
    formData.append("file", file);
    const result = await uploadProfileImage(params.trialId, formData);
    if (result.success) addToast("הלוגו עודכן בהצלחה", "success");
  };

  if (loading) return (
    <div className="h-screen bg-[#020617] flex items-center justify-center text-green-500 font-black animate-pulse tracking-tighter uppercase">
      SabanOS Studio Pro Core Loading...
    </div>
  );

  return (
    <main className={`h-screen overflow-hidden flex flex-col transition-all duration-500 ${themeClass}`} dir="rtl">
      <Navigation />
      
      <div className="flex-1 grid grid-cols-12 gap-0 pt-16">
        
        {/* --- עמודה 1: Sidebar (15%) --- */}
        <aside className={`col-span-2 border-l p-6 flex flex-col gap-2 transition-colors ${isDarkMode ? 'border-white/5 bg-black/20' : 'border-slate-200 bg-slate-50'}`}>
          <div className="space-y-1">
            {[
              { id: 'design', icon: <Palette size={18}/>, label: 'סטודיו עיצוב' },
              { id: 'crm', icon: <Users size={18}/>, label: 'ניהול לקוחות' },
              { id: 'calendar', icon: <CalendarIcon size={18}/>, label: 'יומן תורים' },
              { id: 'catalog', icon: <ShoppingBag size={18}/>, label: 'חנות ומוצרים' },
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

          <button 
            onClick={() => setIsDarkMode(!isDarkMode)} 
            className={`mt-auto w-full p-4 rounded-2xl flex items-center justify-between transition-all ${isDarkMode ? 'bg-white/5 hover:bg-white/10 text-white' : 'bg-slate-200 hover:bg-slate-300 text-slate-900'}`}
          >
            <span className="text-[10px] font-black uppercase tracking-widest">{isDarkMode ? 'מצב בהיר' : 'מצב כהה'}</span>
            {isDarkMode ? <Sun size={16} className="text-yellow-500" /> : <Moon size={16} />}
          </button>
        </aside>

        {/* --- עמודה 2: Main Workspace (55%) --- */}
        <section className="col-span-6 p-10 overflow-y-auto custom-scrollbar">
          <AnimatePresence mode="wait">
            {activeTab === 'design' && (
              <motion.div key="design" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-8">
                <header>
                  <h1 className="text-5xl font-black italic uppercase tracking-tighter">Design Studio</h1>
                  <p className="opacity-50 text-sm font-bold uppercase">Creative Control: {manifest?.businessName}</p>
                </header>

                {/* AI Command Center */}
                <div className={`p-8 rounded-[3.5rem] border backdrop-blur-xl relative overflow-hidden group transition-all ${panelClass}`}>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-black italic flex items-center gap-2 uppercase tracking-tight"><Sparkles className="text-green-500"/> AI Designer</h2>
                    <div className="relative">
                      <button 
                        onClick={() => setIsCommandMenuOpen(!isCommandMenuOpen)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold border ${isDarkMode ? 'bg-white/5 border-white/10 text-white' : 'bg-slate-100 border-slate-300 text-slate-800'}`}
                      >
                        קטלוג פקודות <ChevronDown size={14} />
                      </button>
                      <AnimatePresence>
                        {isCommandMenuOpen && (
                          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="absolute left-0 mt-2 w-64 bg-[#1e293b] border border-white/10 rounded-2xl shadow-2xl z-50 p-4 space-y-4 shadow-black">
                            {Object.entries(COMMAND_CATALOG).map(([category, cmds]) => (
                              <div key={category}>
                                <h4 className="text-[10px] font-black uppercase text-green-500 mb-2">{category}</h4>
                                <div className="grid gap-1">
                                  {cmds.map((cmd) => (
                                    <button key={cmd.label} onClick={() => handleAiAction(cmd.prompt)} className="text-right text-xs p-2 hover:bg-white/5 text-slate-200 rounded-lg transition-colors w-full">
                                      {cmd.label}
                                    </button>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>

                  <div className="flex gap-4 mb-4">
                    <div className="relative flex-1">
                      <input 
                        type="text" 
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder="כתוב פקודה או בחר מהקטלוג..."
                        className={`w-full rounded-3xl p-6 pr-14 text-sm outline-none border focus:border-green-500 transition-all ${inputClass}`}
                      />
                      <button 
                        onClick={() => fileInputRef.current?.click()}
                        className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-green-500"
                      >
                        <Paperclip size={20} />
                      </button>
                      <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" accept="image/*" />
                    </div>
                    <button onClick={() => handleAiAction(prompt)} className="bg-green-600 hover:bg-green-500 p-6 rounded-3xl text-white shadow-xl">
                      <Send size={20} />
                    </button>
                  </div>

                  <AnimatePresence>
                    {aiAdvice && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} className="mt-4 p-6 bg-green-500/10 border border-green-500/20 rounded-3xl relative overflow-hidden">
                        <h4 className="text-xs font-black uppercase text-green-500 mb-2 flex items-center gap-2"><Megaphone size={14}/> ייעוץ שיווקי:</h4>
                        <p className="text-sm font-medium leading-relaxed italic">{aiAdvice}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div className={`p-8 rounded-[3rem] border ${panelClass} grid grid-cols-2 gap-8`}>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase opacity-40">צבע מותג ראשי</label>
                    <input 
                      type="color" 
                      value={manifest?.appConfig?.theme?.primaryColor || "#10b981"}
                      onChange={(e) => updateDoc(doc(db, "trials", params.trialId), { "appConfig.theme.primaryColor": e.target.value })}
                      className="w-full h-14 rounded-2xl bg-transparent border-2 border-white/5 cursor-pointer"
                    />
                  </div>
                  <div className="flex flex-col justify-center text-center space-y-2">
                    <button className={`p-4 rounded-2xl border flex items-center justify-center gap-2 font-bold italic text-sm ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200'}`}>
                      <ImageIcon size={18} /> ניהול גלריית תמונות
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'crm' && (
              <motion.div key="crm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
                <header><h1 className="text-5xl font-black italic uppercase text-green-500 tracking-tighter">CRM Center</h1></header>
                <CRMManager trialId={params.trialId} />
              </motion.div>
            )}

            {activeTab === 'calendar' && (
              <motion.div key="calendar" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
                <header><h1 className="text-5xl font-black italic uppercase text-green-500 tracking-tighter">Scheduler</h1></header>
                <CalendarManager trialId={params.trialId} />
              </motion.div>
            )}

            {activeTab === 'catalog' && (
              <motion.div key="catalog" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
                <header><h1 className="text-5xl font-black italic uppercase text-green-500 tracking-tighter">Catalog</h1></header>
                <div className="grid grid-cols-2 gap-6">
                   {manifest?.catalog?.products?.map((prod: any, i: number) => (
                     <div key={i} className={`p-6 rounded-[2.5rem] border relative ${panelClass}`}>
                        {prod.isSale && <span className="absolute -top-2 -right-2 bg-red-600 text-white text-[10px] font-black px-3 py-1 rounded-full shadow-lg">SALE</span>}
                        <h4 className="font-bold">{prod.name}</h4>
                        <div className="flex items-center gap-2 mt-2">
                           <span className={prod.isSale ? 'line-through opacity-30 text-xs' : 'font-black'}>₪{prod.price}</span>
                           {prod.isSale && <span className="text-green-500 font-black">₪{prod.salePrice}</span>}
                        </div>
                     </div>
                   ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </section>

        {/* --- עמודה 3: Mobile Preview (30%) --- */}
        <aside className={`col-span-4 flex items-center justify-center relative border-r ${isDarkMode ? 'bg-black/10 border-white/5' : 'bg-slate-100 border-slate-200'}`}>
           <div className="sticky top-0 h-full w-full flex items-center justify-center p-12">
              <MobilePreview manifest={manifest} />
           </div>
        </aside>

      </div>
    </main>
  );
}
