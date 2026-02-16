"use client";

import React, { useState, useEffect, useRef } from "react";
import { db } from "@/lib/firebase";
import { doc, onSnapshot, updateDoc } from "firebase/firestore";
import Navigation from "@/components/Navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Palette, Users, BarChart3, Moon, Sun, Send, Sparkles, 
  Paperclip, Image as ImageIcon, Zap, ChevronDown, ShoppingBag, Megaphone
} from "lucide-react";
import MobilePreview from "@/components/studio/MobilePreview";
import CRMManager from "@/components/studio/CRMManager";
import { useToast } from "@/components/ui/ToastProvider";
import { suggestDesignFromPrompt } from "@/app/actions/gemini-brain";
import { uploadProfileImage } from "@/app/actions/drive-actions";

// קטלוג פקודות
const COMMAND_CATALOG = {
  "עיצוב ואווירה": [
    { label: "✨ מראה יוקרתי", prompt: "תהפוך את האפליקציה ליוקרתית, זהב ושחור, פונט Serif" },
    { label: "🚀 הייטק מודרני", prompt: "עיצוב זכוכית שקופה, כחול ניאון, פינות מעוגלות" },
    { label: "🌸 נקי ורך", prompt: "עיצוב פסטלי, לבן נקי, פונט Assistant קליל" }
  ],
  "מכירות ומוצרים": [
    { label: "💰 צור מבצע", prompt: "הוסף הנחה של 20% על כל המוצרים בקטלוג וסמן אותם במבצע" },
    { label: "⭐ מוצרים נבחרים", prompt: "סמן את 3 המוצרים היקרים ביותר כמוצרים נבחרים בראש הדף" },
    { label: "📦 רענן קטלוג", prompt: "הצע שמות ותיאורים שיווקיים חדשים לכל המוצרים שלי" }
  ],
  "שיווק ופוסטים": [
    { label: "📱 ייעוץ לפוסט", prompt: "תמליץ לי על פוסט לאינסטגרם שיקדם את המבצע הנוכחי ותן הנחיות לעיצובו" },
    { label: "✍️ סלוגן חדש", prompt: "כתוב סלוגן שיווקי חזק לעסק שלי שמתמקד בשירות מהיר" }
  ]
};

export default function SabanOSStudioPro({ params }: { params: { trialId: string } }) {
  const [activeTab, setActiveTab] = useState<"design" | "crm" | "catalog">("design");
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [manifest, setManifest] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [prompt, setPrompt] = useState("");
  const [aiAdvice, setAiAdvice] = useState("");
  const [isCommandMenuOpen, setIsCommandMenuOpen] = useState(false);
  const { addToast } = useToast();

  const themeClass = isDarkMode ? "bg-[#020617] text-slate-100" : "bg-[#F8FAFC] text-slate-900";
  const panelClass = isDarkMode ? "bg-white/5 border-white/10" : "bg-white border-slate-200 shadow-sm";

  useEffect(() => {
    const unsubscribe = onSnapshot(doc(db, "trials", params.trialId), (snap) => {
      if (snap.exists()) setManifest(snap.data());
      setLoading(false);
    });
    return () => unsubscribe();
  }, [params.trialId]);

  const handleAiAction = async (p: string) => {
    setPrompt(p);
    addToast("SabanOS AI מנתח ומבצע...", "success");
    const patch = await suggestDesignFromPrompt({ prompt: p });
    
    if (patch.marketingAdvice) setAiAdvice(patch.marketingAdvice);
    
    await updateDoc(doc(db, "trials", params.trialId), patch);
    setPrompt("");
    setIsCommandMenuOpen(false);
  };

  if (loading) return <div className="h-screen bg-[#020617] flex items-center justify-center text-green-500 font-black">SabanOS Pro...</div>;

  return (
    <main className={`h-screen overflow-hidden flex flex-col transition-all duration-500 ${themeClass}`} dir="rtl">
      <Navigation />
      
      <div className="flex-1 grid grid-cols-12 gap-0 pt-16">
        {/* Sidebar */}
        <aside className={`col-span-2 border-l p-6 flex flex-col gap-4 ${isDarkMode ? 'bg-black/20 border-white/5' : 'bg-slate-50 border-slate-200'}`}>
          <div className="space-y-2">
            <button onClick={() => setActiveTab('design')} className={`w-full p-4 rounded-2xl flex items-center gap-3 transition-all ${activeTab === 'design' ? 'bg-green-600 text-white' : 'opacity-50'}`}>
              <Palette size={18}/> <span className="font-bold">סטודיו</span>
            </button>
            <button onClick={() => setActiveTab('catalog')} className={`w-full p-4 rounded-2xl flex items-center gap-3 transition-all ${activeTab === 'catalog' ? 'bg-green-600 text-white' : 'opacity-50'}`}>
              <ShoppingBag size={18}/> <span className="font-bold">מוצרים</span>
            </button>
            <button onClick={() => setActiveTab('crm')} className={`w-full p-4 rounded-2xl flex items-center gap-3 transition-all ${activeTab === 'crm' ? 'bg-green-600 text-white' : 'opacity-50'}`}>
              <Users size={18}/> <span className="font-bold">CRM</span>
            </button>
          </div>
        </aside>

        {/* Main Workspace */}
        <section className="col-span-6 p-10 overflow-y-auto custom-scrollbar">
          <header className="mb-8">
            <h1 className="text-5xl font-black italic uppercase tracking-tighter">SabanOS Studio</h1>
            <p className="opacity-50 font-bold">Smart Management: {manifest?.businessName}</p>
          </header>

          <div className="space-y-8">
            {/* AI Command Center */}
            <div className={`p-8 rounded-[3.5rem] border ${panelClass} relative`}>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-black italic flex items-center gap-2 uppercase tracking-tight"><Sparkles className="text-green-500"/> AI Business Command</h2>
                <div className="relative">
                  <button 
                    onClick={() => setIsCommandMenuOpen(!isCommandMenuOpen)}
                    className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-xl text-xs font-bold border border-white/10"
                  >
                    קטלוג פקודות <ChevronDown size={14} />
                  </button>
                  
                  <AnimatePresence>
                    {isCommandMenuOpen && (
                      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="absolute left-0 mt-2 w-64 bg-[#1e293b] border border-white/10 rounded-2xl shadow-2xl z-50 p-4 space-y-4">
                        {Object.entries(COMMAND_CATALOG).map(([category, cmds]) => (
                          <div key={category}>
                            <h4 className="text-[10px] font-black uppercase text-green-500 mb-2">{category}</h4>
                            <div className="grid gap-1">
                              {cmds.map((cmd) => (
                                <button key={cmd.label} onClick={() => handleAiAction(cmd.prompt)} className="text-right text-xs p-2 hover:bg-white/5 rounded-lg transition-colors w-full">
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

              <div className="flex gap-4">
                <input 
                  type="text" 
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="כתוב פקודה או בחר מהקטלוג..."
                  className={`flex-1 rounded-3xl p-6 text-sm outline-none border focus:border-green-500 ${isDarkMode ? 'bg-black/40 border-white/10' : 'bg-slate-100 border-slate-200'}`}
                />
                <button onClick={() => handleAiAction(prompt)} className="bg-green-600 p-6 rounded-3xl text-white shadow-xl hover:scale-105 transition-transform">
                  <Send size={20} />
                </button>
              </div>

              {/* AI Advice Box - הדיאלוג הדו כיווני */}
              <AnimatePresence>
                {aiAdvice && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} className="mt-6 p-6 bg-green-500/10 border border-green-500/20 rounded-3xl relative overflow-hidden">
                    <Megaphone className="absolute -left-2 -bottom-2 opacity-10 rotate-12" size={60} />
                    <h4 className="text-xs font-black uppercase text-green-500 mb-2 flex items-center gap-2"><Zap size={14}/> הנחיה שיווקית מ-Gemini:</h4>
                    <p className="text-sm font-medium leading-relaxed italic">{aiAdvice}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Catalog Manager (שנבנה בטאב מוצרים) */}
            {activeTab === 'catalog' && (
              <div className={`p-8 rounded-[3rem] border ${panelClass}`}>
                <h3 className="text-2xl font-black italic mb-6 uppercase tracking-tighter">Product Catalog</h3>
                <div className="grid grid-cols-2 gap-6">
                   {manifest?.catalog?.products?.map((prod: any, i: number) => (
                     <div key={i} className="p-6 bg-white/5 border border-white/10 rounded-[2rem] relative group">
                        {prod.isSale && <span className="absolute -top-2 -right-2 bg-red-600 text-white text-[10px] font-black px-3 py-1 rounded-full shadow-lg animate-bounce">SALE</span>}
                        <h4 className="font-bold">{prod.name}</h4>
                        <p className="text-xs opacity-50 mb-4">{prod.description}</p>
                        <div className="flex items-center gap-3">
                           <span className={prod.isSale ? 'line-through opacity-30 text-xs' : 'font-black'}>₪{prod.price}</span>
                           {prod.isSale && <span className="text-green-500 font-black italic">₪{prod.salePrice}</span>}
                        </div>
                     </div>
                   ))}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Mobile Preview (30%) */}
        <aside className={`col-span-4 flex items-center justify-center relative border-r ${isDarkMode ? 'bg-black/10' : 'bg-slate-100'}`}>
           <div className="sticky top-0 h-full w-full flex items-center justify-center p-12">
              <MobilePreview manifest={manifest} />
           </div>
        </aside>
      </div>
    </main>
  );
}
