"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
// שימוש בנתיבים יחסיים כדי למנוע שגיאות Module not found ב-Vercel
import { db } from "../../../lib/firebase";
import { doc, onSnapshot, updateDoc } from "firebase/firestore";
import { motion, AnimatePresence } from "framer-motion";
import { applyPatch, Operation } from "fast-json-patch";

// ייבוא קומפוננטות וספריות מהתיקיות המקבילות
import { ManifestRenderer } from "../../../components/Renderer";
import { aiOrchestrator } from "../../../lib/orchestrator";
import { validatePatchSafety, previewWithPatch } from "../../../lib/patch";
import { NileBus } from "../../../lib/bus";
import { useToast } from "../../../components/ui/ToastProvider";
import { useI18n } from "../../../components/I18nProvider";

// Icons
import { 
  Sparkles, Send, Check, X, Smartphone, 
  Layout, Palette, MessageSquare, Rocket, Globe 
} from "lucide-react";

export default function NileStudio({ params }: { params: { trialId: string } }) {
  // --- States ---
  const [manifest, setManifest] = useState<any>(null);
  const [stagedPatch, setStagedPatch] = useState<Operation[] | null>(null);
  const [prompt, setPrompt] = useState("");
  const [isAiProcessing, setIsAiProcessing] = useState(false);
  
  const { showToast } = useToast();
  const { locale, setLocale } = useI18n();
  const busRef = useRef<NileBus | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // --- Preview Manifest Logic ---
  const previewManifest = useMemo(() => {
    if (!manifest) return null;
    if (!stagedPatch || stagedPatch.length === 0) return manifest;
    try {
      return previewWithPatch(manifest, stagedPatch);
    } catch (e) {
      console.error("Patch Preview Error:", e);
      return manifest;
    }
  }, [manifest, stagedPatch]);

  // --- Real-time Listeners ---
  useEffect(() => {
    // מאזין ל-Firestore לשינויים במניפסט
    const docRef = doc(db, "trials", params.trialId);
    const unsub = onSnapshot(docRef, (snap) => {
      if (snap.exists()) {
        const data = snap.data();
        setManifest(data.manifest);
      } else {
        showToast("שגיאה", "הפרויקט לא נמצא במערכת", "error");
      }
    });

    // אתחול ערוץ סנכרון מקומי
    const bus = new NileBus("nile-bus");
    busRef.current = bus;
    bus.on((e: any) => {
      if (e.type === "STAGED_PATCH_SET") setStagedPatch(e.patch);
      if (e.type === "STAGED_PATCH_CLEAR") setStagedPatch(null);
    });

    return () => {
      unsub();
      bus.close();
    };
  }, [params.trialId, showToast]);

  // --- AI Command Execution ---
  const handleAiCommand = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!prompt.trim() || isAiProcessing) return;

    setIsAiProcessing(true);
    try {
      // המוח האוטונומי מנתח את הפקודה ומייצר Patch מוצע
      const delta = await aiOrchestrator.generatePatch(prompt, manifest);
      
      if (!delta || delta.length === 0) {
        showToast("ניל-App", "לא זיהיתי פקודה לביצוע. נסה 'הוסף מחירון' או 'שנה למיתוג כחול'", "ai");
      } else {
        const safety = validatePatchSafety(delta);
        if (safety.ok) {
          setStagedPatch(delta);
          busRef.current?.post({ type: "STAGED_PATCH_SET", patch: delta });
          showToast("ניל-App", "הכנתי הצעה לשינוי. בדוק את האייפון!", "ai");
        } else {
          showToast("אבטחה", safety.reason || "השינוי נחסם מטעמי אבטחה", "error");
        }
      }
    } catch (err) {
      showToast("שגיאה", "נכשלתי בעיבוד הפקודה בשרת", "error");
    } finally {
      setIsAiProcessing(false);
      setPrompt("");
    }
  };

  // --- Approve / Reject Changes ---
  const approveChange = async () => {
    if (!stagedPatch || !manifest) return;
    
    try {
      const finalManifest = previewWithPatch(manifest, stagedPatch);
      const docRef = doc(db, "trials", params.trialId);
      
      await updateDoc(docRef, { 
        manifest: finalManifest, 
        updatedAt: new Date().toISOString() 
      });

      setManifest(finalManifest);
      setStagedPatch(null);
      busRef.current?.post({ type: "STAGED_PATCH_CLEAR" });
      showToast("ניל-App", "השינוי נשמר בהצלחה ✨", "success");
    } catch (err) {
      showToast("שגיאה", "השמירה ל-Cloud נכשלה", "error");
    }
  };

  if (!manifest) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-[#020617] text-white">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4" />
        <h1 className="font-black italic text-xl uppercase tracking-tighter">Nile Studio Loading...</h1>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#F8FAFC] dark:bg-[#020617] transition-colors duration-500" dir="rtl">
      {/* --- Top Bar --- */}
      <nav className="h-20 border-b border-slate-200 dark:border-white/10 bg-white/80 dark:bg-black/40 backdrop-blur-xl flex items-center justify-between px-8 fixed top-0 w-full z-50">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
            <Globe size={24} />
          </div>
          <div>
            <h1 className="text-xl font-black italic tracking-tighter text-slate-900 dark:text-white uppercase leading-none">Nile‑pwa</h1>
            <p className="text-[10px] font-bold text-blue-500 uppercase tracking-widest mt-1">Autonomous AI Studio</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <select 
            value={locale} 
            onChange={(e) => setLocale(e.target.value as any)}
            className="bg-slate-100 dark:bg-white/5 border-none rounded-full px-4 py-2 text-xs font-bold outline-none cursor-pointer"
          >
            <option value="he">עברית</option>
            <option value="en">English</option>
            <option value="ar">العربية</option>
          </select>
          <button className="bg-slate-900 dark:bg-white text-white dark:text-black px-6 py-2.5 rounded-full font-black text-xs flex items-center gap-2 shadow-xl hover:scale-105 transition-all">
            <Rocket size={14}/> PUBLISH
          </button>
        </div>
      </nav>

      <div className="pt-24 px-8 h-screen grid grid-cols-1 lg:grid-cols-12 gap-8 pb-8">
        
        {/* --- LEFT: Project Dashboard (3 cols) --- */}
        <div className="lg:col-span-3 flex flex-col gap-6 overflow-y-auto no-scrollbar">
          <div className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-[3rem] p-8 shadow-sm">
            <h2 className="text-sm font-black uppercase opacity-30 mb-6 flex items-center gap-2 italic">
              <Layout size={16}/> Sitemap
            </h2>
            <div className="space-y-2">
               {Object.values(manifest.pages).map((p: any) => (
                 <div key={p.id} className="p-4 bg-slate-50 dark:bg-white/5 rounded-2xl flex items-center justify-between group cursor-default">
                   <span className="text-sm font-bold opacity-70">{p.route}</span>
                   <span className="text-[10px] bg-blue-500/10 text-blue-500 px-2 py-1 rounded-lg font-black">{p.blocks.length} BLOCKS</span>
                 </div>
               ))}
            </div>
          </div>

          <div className="bg-blue-600/5 border border-blue-500/20 rounded-[3rem] p-8">
             <h2 className="text-sm font-black text-blue-500 uppercase mb-4 italic">AI Shortcuts</h2>
             <div className="space-y-3 text-[11px] font-bold opacity-60 italic leading-relaxed">
               <p>"הוסף מחירון חדר כושר"</p>
               <p>"שנה למיתוג זכוכית כחול עמוק"</p>
               <p>"أضف نموذج اتصال بالعربية"</p>
             </div>
          </div>
        </div>

        {/* --- CENTER: iPhone Preview (4 cols) --- */}
        <div className="lg:col-span-4 flex items-center justify-center relative bg-slate-100 dark:bg-black/20 rounded-[5rem] border border-dashed border-slate-300 dark:border-white/5">
          <div className="relative scale-[0.9] xl:scale-100 transition-all duration-500">
             {/* iPhone Hardware Frame */}
             <div className="w-[320px] h-[650px] bg-black rounded-[4rem] border-[10px] border-slate-800 shadow-2xl relative overflow-hidden ring-4 ring-black/10">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-slate-800 rounded-b-3xl z-30" />
                
                {/* Live App Renderer */}
                <div className="h-full w-full bg-white overflow-hidden">
                  <ManifestRenderer manifest={previewManifest} />
                </div>
             </div>

             {/* Readdy.ai Style Approval Portal */}
             <AnimatePresence>
               {stagedPatch && (
                 <motion.div 
                   initial={{ y: 60, opacity: 0 }}
                   animate={{ y: 0, opacity: 1 }}
                   exit={{ y: 60, opacity: 0 }}
                   className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-[110%] bg-white/90 dark:bg-slate-900/90 backdrop-blur-2xl p-6 rounded-[2.5rem] shadow-2xl border border-blue-500/30 z-50"
                 >
                    <div className="flex items-center gap-3 mb-4 justify-center">
                       <Sparkles className="text-blue-500 animate-pulse" size={18} />
                       <span className="text-xs font-black uppercase italic tracking-widest">הצעה לשינוי מבנה</span>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={approveChange} className="flex-1 bg-blue-600 text-white py-4 rounded-2xl font-black text-xs hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20">
                        אשר שינוי ✨
                      </button>
                      <button onClick={() => setStagedPatch(null)} className="flex-1 bg-slate-200 dark:bg-white/10 text-slate-800 dark:text-white py-4 rounded-2xl font-black text-xs">
                        בטל
                      </button>
                    </div>
                 </motion.div>
               )}
             </AnimatePresence>
          </div>
        </div>

        {/* --- RIGHT: AI Autonomous Chat (5 cols) --- */}
        <div className="lg:col-span-5 flex flex-col h-full overflow-hidden">
          <div className="bg-white dark:bg-[#0b141a] border border-slate-200 dark:border-white/10 rounded-[3.5rem] flex-1 flex flex-col shadow-2xl overflow-hidden relative">
            
            {/* Header */}
            <div className="p-8 border-b border-slate-100 dark:border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg"><MessageSquare size={24} /></div>
                <div>
                  <h2 className="text-xl font-black italic uppercase leading-none dark:text-white">NILE AI</h2>
                  <p className="text-[10px] text-green-500 font-bold uppercase mt-1 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"/> המוח מחובר
                  </p>
                </div>
              </div>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-8 space-y-4 no-scrollbar">
               <div className="bg-slate-50 dark:bg-white/5 p-6 rounded-[2rem] rounded-tr-none max-w-[90%]">
                 <p className="text-sm font-medium leading-relaxed italic">אהלן רמי! אני המוח של ניל‑App. תגיד לי מה להוסיף או לשנות באפליקציה, ואני אכין לך הצעה תוך שניות.</p>
               </div>
               <div ref={scrollRef} />
            </div>

            {/* AI Input Form */}
            <div className="p-8 border-t border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-black/20">
              <form onSubmit={handleAiCommand} className="relative">
                <input 
                  type="text"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="דבר עם המוח... (למשל: 'הוסף טופס צור קשר')"
                  className="w-full bg-white dark:bg-black/40 border border-slate-200 dark:border-white/10 rounded-[2rem] p-6 pl-20 text-sm outline-none focus:ring-2 ring-blue-500 transition-all shadow-inner dark:text-white"
                />
                <button 
                  type="submit"
                  disabled={isAiProcessing || !prompt.trim()}
                  className="absolute left-3 top-1/2 -translate-y-1/2 p-4 bg-blue-600 text-white rounded-[1.5rem] shadow-xl hover:scale-105 transition-all disabled:opacity-50"
                >
                  {isAiProcessing ? <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" /> : <Send size={20} />}
                </button>
              </form>
            </div>
          </div>
        </div>

      </div>
    </main>
  );
}
