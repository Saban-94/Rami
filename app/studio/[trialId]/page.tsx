"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { db } from "@/lib/firebase";
import { doc, onSnapshot, updateDoc } from "firebase/firestore";
import { motion, AnimatePresence } from "framer-motion";
import { applyPatch, Operation } from "fast-json-patch";

// Components & Libs
import { ManifestRenderer } from "@/components/Renderer";
import { aiOrchestrator } from "@/lib/orchestrator";
import { validatePatchSafety, previewWithPatch } from "@/lib/patch";
import { NileBus } from "@/lib/bus";
import { useToast } from "@/components/ui/ToastProvider";
import { useI18n } from "@/components/I18nProvider";

// Icons
import { 
  Sparkles, Send, Check, X, Smartphone, 
  Layout, Palette, MessageSquare, Rocket, Globe 
} from "lucide-react";

export default function NileStudio({ params }: { params: { trialId: string } }) {
  // --- Core State ---
  const [manifest, setManifest] = useState<any>(null);
  const [stagedPatch, setStagedPatch] = useState<Operation[] | null>(null);
  const [prompt, setPrompt] = useState("");
  const [isAiProcessing, setIsAiProcessing] = useState(false);
  const { showToast } = useToast();
  const { locale, setLocale, dir } = useI18n();
  const busRef = useRef<NileBus | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // --- Derived State for Preview ---
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

  // --- 1. Listen to Firestore & Initialize Bus ---
  useEffect(() => {
    const docRef = doc(db, "trials", params.trialId);
    const unsub = onSnapshot(docRef, (snap) => {
      if (snap.exists()) {
        const data = snap.data();
        setManifest(data.manifest);
      }
    });

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
  }, [params.trialId]);

  // --- 2. AI Orchestration (The Readdy.ai Engine) ---
  const handleAiCommand = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!prompt.trim() || isAiProcessing) return;

    setIsAiProcessing(true);
    try {
      // המוח מנתח את הפקודה ומייצר Patch
      const delta = await aiOrchestrator.generatePatch(prompt, manifest);
      
      if (!delta || delta.length === 0) {
        showToast("ניל-App", "לא זיהיתי פקודה מוכרת. נסה 'הוסף מחירון' או 'שנה למיתוג כחול'", "ai");
      } else {
        const safety = validatePatchSafety(delta);
        if (safety.ok) {
          setStagedPatch(delta);
          busRef.current?.post({ type: "STAGED_PATCH_SET", patch: delta });
          showToast("ניל-App", "הכנתי הצעה לשינוי. בדוק את האייפון!", "ai");
        } else {
          showToast("אבטחה", safety.reason || "השינוי נחסם", "error");
        }
      }
    } catch (err) {
      showToast("שגיאה", "נכשלתי בעיבוד הפקודה", "error");
    } finally {
      setIsAiProcessing(false);
      setPrompt("");
    }
  };

  // --- 3. Approval Flow ---
  const approveChange = async () => {
    if (!stagedPatch || !manifest) return;
    
    const finalManifest = previewWithPatch(manifest, stagedPatch);
    setManifest(finalManifest);
    setStagedPatch(null);
    busRef.current?.post({ type: "STAGED_PATCH_CLEAR" });

    // Commit to Firestore
    try {
      const docRef = doc(db, "trials", params.trialId);
      await updateDoc(docRef, { manifest: finalManifest, updatedAt: new Date().toISOString() });
      showToast("ניל-App", "השינוי הוחל ונשמר בבסיס הנתונים ✨", "success");
    } catch (err) {
      showToast("שגיאה", "השינוי הוחל מקומית אך השמירה נכשלה", "error");
    }
  };

  if (!manifest) return <div className="h-screen flex items-center justify-center bg-[#020617] text-white font-black animate-pulse">NILE STUDIO LOADING...</div>;

  return (
    <main className="min-h-screen bg-[#F8FAFC] dark:bg-[#020617] transition-colors duration-500 overflow-hidden" dir="rtl">
      
      {/* Top Header - Branding */}
      <nav className="h-20 border-b border-slate-200 dark:border-white/10 bg-white/50 dark:bg-black/20 backdrop-blur-xl flex items-center justify-between px-8 fixed top-0 w-full z-50">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center text-white shadow-lg">
            <Globe size={24} />
          </div>
          <div>
            <h1 className="text-xl font-black italic tracking-tighter text-slate-900 dark:text-white uppercase">Nile‑pwa</h1>
            <p className="text-[10px] font-bold text-blue-500 uppercase tracking-widest leading-none">Autonomous Studio</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <select 
            value={locale} 
            onChange={(e) => setLocale(e.target.value as any)}
            className="bg-slate-100 dark:bg-white/5 border-none rounded-full px-4 py-2 text-xs font-bold outline-none"
          >
            <option value="he">עברית</option>
            <option value="en">English</option>
            <option value="ar">العربية</option>
          </select>
          <div className="h-8 w-[1px] bg-slate-200 dark:bg-white/10 mx-2" />
          <button className="bg-slate-900 dark:bg-white text-white dark:text-black px-6 py-2.5 rounded-full font-black text-xs flex items-center gap-2 shadow-xl hover:scale-105 transition-all uppercase">
            <Rocket size={14}/> Publish
          </button>
        </div>
      </nav>

      <div className="pt-24 px-8 h-screen grid grid-cols-1 lg:grid-cols-12 gap-8 pb-8">
        
        {/* LEFT: Dashboard & Activity (3 cols) */}
        <div className="lg:col-span-3 flex flex-col gap-6 overflow-y-auto custom-scrollbar pr-2">
          <div className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-[3rem] p-8 shadow-sm">
            <h2 className="text-sm font-black uppercase opacity-30 mb-6 flex items-center gap-2 italic">
              <Layout size={16}/> Project Structure
            </h2>
            <div className="space-y-3">
               {Object.values(manifest.pages).map((p: any) => (
                 <div key={p.id} className="p-4 bg-slate-50 dark:bg-white/5 rounded-2xl border border-transparent hover:border-blue-500/30 transition-all flex items-center justify-between">
                   <span className="text-sm font-bold">{p.route}</span>
                   <span className="text-[10px] opacity-40 font-black">{p.blocks.length} Blocks</span>
                 </div>
               ))}
            </div>
          </div>

          <div className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-[3rem] p-8 shadow-sm">
             <h2 className="text-sm font-black uppercase opacity-30 mb-4 italic">Quick Hints</h2>
             <p className="text-xs font-medium leading-relaxed opacity-60 italic">
               "הוסף טופס צור קשר בערבית"<br/>
               "שנה את המיתוג לכחול עמוק"<br/>
               "שים את הניווט למטה"
             </p>
          </div>
        </div>

        {/* CENTER: The iPhone Canvas (4 cols) */}
        <div className="lg:col-span-4 flex items-center justify-center relative bg-slate-200/20 dark:bg-black/40 rounded-[5rem] border border-dashed border-slate-300 dark:border-white/5 overflow-hidden">
          <div className="relative scale-[0.95] xl:scale-100 transition-transform duration-500">
             {/* iPhone Frame */}
             <div className="w-[340px] h-[680px] bg-black rounded-[4.5rem] border-[12px] border-slate-800 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] relative overflow-hidden ring-8 ring-black/5">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-36 h-7 bg-slate-800 rounded-b-3xl z-30" />
                
                {/* App Content Renderer */}
                <div className="h-full w-full bg-white transition-opacity duration-300">
                  <ManifestRenderer manifest={previewManifest} />
                </div>
             </div>

             {/* Approval Overlay - Floating Portal Style */}
             <AnimatePresence>
               {stagedPatch && (
                 <motion.div 
                   initial={{ y: 50, opacity: 0, scale: 0.9 }}
                   animate={{ y: 0, opacity: 1, scale: 1 }}
                   exit={{ y: 50, opacity: 0, scale: 0.9 }}
                   className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-[90%] bg-white/90 dark:bg-slate-900/90 backdrop-blur-2xl p-6 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-blue-500/30 z-50 flex flex-col gap-4"
                 >
                    <div className="flex items-center gap-3 px-2">
                       <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white animate-pulse">
                         <Sparkles size={16} />
                       </div>
                       <p className="text-xs font-black italic dark:text-white uppercase tracking-tighter">Review Proposal</p>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={approveChange} className="flex-1 bg-blue-600 text-white py-4 rounded-2xl font-black text-xs shadow-lg shadow-blue-500/20 hover:bg-blue-700 transition-all">
                        אשר שינוי ✨
                      </button>
                      <button onClick={() => { setStagedPatch(null); busRef.current?.post({type:"STAGED_PATCH_CLEAR"}); }} className="flex-1 bg-slate-200 dark:bg-white/10 text-slate-800 dark:text-white py-4 rounded-2xl font-black text-xs">
                        בטל
                      </button>
                    </div>
                 </motion.div>
               )}
             </AnimatePresence>
          </div>
        </div>

        {/* RIGHT: Autonomous AI Chat (5 cols) */}
        <div className="lg:col-span-5 flex flex-col h-full overflow-hidden">
          <div className="bg-white dark:bg-[#0b141a] border border-slate-200 dark:border-white/10 rounded-[3.5rem] flex-1 flex flex-col shadow-2xl relative overflow-hidden">
            
            {/* Chat Header */}
            <div className="p-8 border-b border-slate-100 dark:border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-blue-600 rounded-[1.5rem] flex items-center justify-center text-white shadow-xl shadow-blue-600/20">
                  <MessageSquare size={28} />
                </div>
                <div>
                  <h2 className="text-2xl font-black italic tracking-tighter uppercase leading-none dark:text-white">Nile AI</h2>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                    <p className="text-[10px] text-blue-500 font-black uppercase tracking-widest">Autonomous Agent Active</p>
                  </div>
                </div>
              </div>
            </div>

            {/* AI Console / Chat Log */}
            <div className="flex-1 overflow-y-auto p-8 custom-scrollbar space-y-6">
              <div className="flex flex-col gap-4">
                <div className="max-w-[85%] bg-slate-100 dark:bg-white/5 p-6 rounded-[2.5rem] rounded-tr-none text-sm font-medium leading-relaxed italic">
                  אהלן! אני המוח של <strong>ניל‑App</strong>. אני שולט על המניפסט של האפליקציה שלך. מה תרצה שאצור עכשיו?
                </div>
              </div>
              <div ref={scrollRef} />
            </div>

            {/* Input Box */}
            <div className="p-8 bg-slate-50/50 dark:bg-black/20 border-t border-slate-100 dark:border-white/5">
              <form onSubmit={handleAiCommand} className="relative group">
                <input 
                  type="text"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="כתוב פקודה (למשל: 'הוסף מחירון'..)"
                  className="w-full bg-white dark:bg-black/60 border border-slate-200 dark:border-white/10 rounded-[2.5rem] p-6 pr-8 pl-20 text-sm outline-none focus:ring-2 ring-blue-500 transition-all shadow-inner dark:text-white"
                />
                <button 
                  type="submit"
                  disabled={isAiProcessing}
                  className="absolute left-3 top-1/2 -translate-y-1/2 p-4 bg-blue-600 text-white rounded-[1.5rem] shadow-xl hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
                >
                  {isAiProcessing ? (
                    <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <Send size={20} />
                  )}
                </button>
              </form>
              <div className="mt-4 px-4 flex items-center justify-between opacity-30">
                <span className="text-[10px] font-black uppercase tracking-tighter italic">Nile Engine v2.5</span>
                <span className="text-[10px] font-black uppercase tracking-tighter italic">Zero-Touch UI</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </main>
  );
}
