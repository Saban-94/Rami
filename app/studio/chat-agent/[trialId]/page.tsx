"use client";

import React, { useState, useEffect, useRef } from "react";
import { db } from "@/lib/firebase";
import { doc, onSnapshot, updateDoc } from "firebase/firestore";
import Navigation from "@/components/Navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Palette, Users, BarChart3, 
  Moon, Sun, Send, Sparkles, 
  Paperclip, Image as ImageIcon, Zap
} from "lucide-react";
import MobilePreview from "@/components/studio/MobilePreview";
import CRMManager from "@/components/studio/CRMManager";
import { useToast } from "@/components/ui/ToastProvider";
import { suggestDesignFromPrompt } from "@/app/actions/gemini-brain";
import { uploadProfileImage } from "@/app/actions/drive-actions";

const QUICK_COMMANDS = [
  { label: "✨ מראה יוקרתי", prompt: "תהפוך את האפליקציה ליוקרתית עם צבעי זהב ושחור" },
  { label: "🌑 מצב לילה", prompt: "עבור למצב כהה עם גוונים של אפור עמוק וירוק אזמרגד" },
  { label: "💎 מינימליזם", prompt: "שנה לעיצוב נקי מאוד, רקע לבן ופונט דק" },
  { label: "🎨 צבע מותג", prompt: "שנה את צבע המותג לכחול רויאל עוצמתי" },
  { label: "🚀 סגנון הייטק", prompt: "עיצוב מודרני עם פינות מעוגלות ואפקט זכוכית" },
];

export default function SabanOSStudioPro({ params }: { params: { trialId: string } }) {
  const [activeTab, setActiveTab] = useState<"design" | "crm" | "analytics">("design");
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [manifest, setManifest] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [prompt, setPrompt] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { addToast } = useToast();

  const themeClass = isDarkMode ? "bg-[#020617] text-slate-100" : "bg-[#F8FAFC] text-slate-900";
  const panelClass = isDarkMode ? "bg-white/5 border-white/10" : "bg-white border-slate-200 shadow-sm";

  useEffect(() => {
    if (!params.trialId) return;
    const docRef = doc(db, "trials", params.trialId);
    const unsubscribe = onSnapshot(docRef, (snap) => {
      if (snap.exists()) setManifest(snap.data());
      setLoading(false);
    });
    return () => unsubscribe();
  }, [params.trialId]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !params.trialId) return;
    
    addToast("מעלה לוגו ומסנכרן תשתית...", "success");
    const formData = new FormData();
    formData.append("file", file);
    
    try {
      const result = await uploadProfileImage(params.trialId, formData);
      if (result.success) {
        addToast("הלוגו עודכן בהצלחה!", "success");
      } else {
        addToast(`שגיאה: ${result.error}`, "error");
      }
    } catch (err) {
      addToast("תקלה בתקשורת עם השרת", "error");
    }
  };

  const handleAiDesign = async (overridePrompt?: string) => {
    const finalPrompt = overridePrompt || prompt;
    if (!finalPrompt.trim()) return;
    
    addToast("SabanOS AI מעבד את העיצוב...", "success");
    try {
      const patch = await suggestDesignFromPrompt({ prompt: finalPrompt });
      const docRef = doc(db, "trials", params.trialId);
      await updateDoc(docRef, patch);
      setPrompt("");
    } catch (err) {
      addToast("ה-AI נתקל בקשיים, נסה שוב", "error");
    }
  };

  if (loading) return <div className="h-screen bg-[#020617] flex items-center justify-center text-green-500 font-black animate-pulse">SabanOS Studio Pro...</div>;

  return (
    <main className={`h-screen overflow-hidden flex flex-col transition-colors duration-500 ${themeClass}`} dir="rtl">
      <Navigation />
      
      <div className="flex-1 grid grid-cols-12 gap-0 pt-16">
        {/* Sidebar */}
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
                  activeTab === item.id ? 'bg-green-600 text-white shadow-lg' : 'hover:bg-white/5'
                }`}
              >
                {item.icon} <span className="text-sm italic">{item.label}</span>
              </button>
            ))}
          </div>
          
          <button onClick={() => setIsDarkMode(!isDarkMode)} className={`mt-auto w-full p-4 rounded-2xl flex items-center justify-between ${isDarkMode ? 'bg-white/5' : 'bg-slate-200'}`}>
            <span className="text-[10px] font-black uppercase">{isDarkMode ? 'מצב בהיר' : 'מצב כהה'}</span>
            {isDarkMode ? <Sun size={16} /> : <Moon size={16} />}
          </button>
        </aside>

        {/* Main Workspace */}
        <section className="col-span-6 p-10 overflow-y-auto custom-scrollbar">
          <AnimatePresence mode="wait">
            {activeTab === 'design' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                <header>
                  <h1 className="text-5xl font-black italic uppercase tracking-tighter">Studio Editor</h1>
                  <p className="opacity-50 text-sm font-bold uppercase">Creative Control for {manifest?.businessName}</p>
                </header>

                <div className={`p-8 rounded-[3.5rem] border backdrop-blur-xl ${panelClass} relative group`}>
                  <h2 className="text-xl font-black mb-6 flex items-center gap-2 italic uppercase">AI Generative Designer</h2>
                  
                  <div className="relative flex items-center gap-3 mb-6">
                    <div className="relative flex-1">
                      <input 
                        type="text" 
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder="שאל את SabanOS לעצב משהו..."
                        className={`w-full border rounded-3xl p-6 pr-14 text-sm outline-none focus:border-green-500 transition-all ${
                          isDarkMode ? 'bg-black/40 border-white/10 text-white' : 'bg-slate-100 border-slate-200'
                        }`}
                      />
                      <button 
                        onClick={() => fileInputRef.current?.click()}
                        className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-green-500 transition-colors"
                      >
                        <Paperclip size={20} />
                      </button>
                      <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" accept="image/*" />
                    </div>
                    <button onClick={() => handleAiDesign()} className="bg-green-600 hover:bg-green-500 p-6 rounded-3xl text-white shadow-xl">
                      <Send size={20} />
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {QUICK_COMMANDS.map((cmd, idx) => (
                      <button
                        key={idx}
                        onClick={() => setPrompt(cmd.prompt)}
                        className={`px-4 py-2 rounded-full text-[10px] font-black uppercase transition-all border ${
                          isDarkMode ? 'bg-white/5 border-white/10 hover:border-green-500/50 text-slate-300' : 'bg-slate-100 border-slate-200 hover:bg-slate-200'
                        }`}
                      >
                        {cmd.label}
                      </button>
                    ))}
                    <button
                      onClick={() => handleAiDesign("תפתיע אותי עם עיצוב מטורף וחדשני")}
                      className="px-4 py-2 rounded-full text-[10px] font-black uppercase bg-amber-500/10 border border-amber-500/30 text-amber-500 hover:bg-amber-500 hover:text-white transition-all flex items-center gap-1"
                    >
                      <Zap size={12} /> הפתע אותי
                    </button>
                  </div>
                </div>

                <div className={`p-8 rounded-[3rem] border ${panelClass} grid grid-cols-2 gap-8`}>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase opacity-40">צבע מותג</label>
                    <input 
                      type="color" 
                      value={manifest?.appConfig?.theme?.primaryColor || "#10b981"}
                      onChange={(e) => updateDoc(doc(db, "trials", params.trialId), { "appConfig.theme.primaryColor": e.target.value })}
                      className="w-full h-12 rounded-xl bg-transparent border-2 border-white/5 cursor-pointer"
                    />
                  </div>
                  <div className="space-y-2 text-center flex flex-col justify-center">
                    <button className="flex items-center justify-center gap-2 p-4 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 transition-all font-bold italic text-sm">
                      <ImageIcon size={18} /> ניהול גלריית תמונות
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'crm' && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
                <header>
                  <h1 className="text-5xl font-black italic uppercase tracking-tighter text-green-500">Business CRM</h1>
                  <p className="opacity-50 text-sm font-bold uppercase">ניהול לידים מ-SabanOS Chat</p>
                </header>
                <CRMManager trialId={params.trialId} />
              </motion.div>
            )}
          </AnimatePresence>
        </section>

        {/* Mobile Preview */}
        <aside className={`col-span-4 flex items-center justify-center relative border-r ${isDarkMode ? 'bg-black/10 border-white/5' : 'bg-slate-100 border-slate-200'}`}>
           <div className="sticky top-0 h-full w-full flex items-center justify-center p-12">
              <MobilePreview manifest={manifest} />
           </div>
        </aside>
      </div>
    </main>
  );
}
