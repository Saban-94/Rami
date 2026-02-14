"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
// שימוש בנתיבים יחסיים למניעת שגיאות Module Not Found ב-Vercel
import { db } from "../../../lib/firebase";
import { doc, onSnapshot, updateDoc } from "firebase/firestore";
import { motion, AnimatePresence } from "framer-motion";
import { Operation } from "fast-json-patch";

// ייבוא רכיבים חיוניים
import { ManifestRenderer } from "../../../components/Renderer";
import { aiOrchestrator } from "../../../lib/orchestrator";
import { validatePatchSafety, previewWithPatch } from "../../../lib/patch";
import { NileBus } from "../../../lib/bus";
import { useToast } from "../../../components/ui/ToastProvider";
import { useI18n } from "../../../components/I18nProvider";

// Icons
import { Sparkles, Send, Layout, MessageSquare, Rocket, Globe, AlertCircle } from "lucide-react";

export default function NileStudio({ params }: { params: { trialId: string } }) {
  const [manifest, setManifest] = useState<any>(null);
  const [stagedPatch, setStagedPatch] = useState<Operation[] | null>(null);
  const [prompt, setPrompt] = useState("");
  const [isAiProcessing, setIsAiProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { showToast } = useToast();
  const { locale, setLocale } = useI18n();
  const busRef = useRef<NileBus | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // חישוב תצוגה מקדימה עם הגנה מפני קריסה (Null Safety)
  const previewManifest = useMemo(() => {
    if (!manifest) return null;
    if (!stagedPatch || stagedPatch.length === 0) return manifest;
    try {
      const patched = previewWithPatch(manifest, stagedPatch);
      // וודא שה-patch לא השחית את המבנה הבסיסי
      if (!patched || !patched.app) return manifest;
      return patched;
    } catch (e) {
      console.error("Patch Error:", e);
      return manifest;
    }
  }, [manifest, stagedPatch]);

  useEffect(() => {
    if (!params.trialId) return;

    const docRef = doc(db, "trials", params.trialId);
    const unsub = onSnapshot(docRef, (snap) => {
      if (snap.exists()) {
        setManifest(snap.data().manifest);
        setError(null);
      } else {
        setError("הפרויקט לא נמצא במערכת (Trial ID Invalid)");
      }
    }, (err) => {
      console.error("Firestore Error:", err);
      setError("שגיאת חיבור לבסיס הנתונים");
    });

    const bus = new NileBus("nile-bus");
    busRef.current = bus;
    bus.on((e: any) => {
      if (e.type === "STAGED_PATCH_SET") setStagedPatch(e.patch);
      if (e.type === "STAGED_PATCH_CLEAR") setStagedPatch(null);
    });

    return () => { unsub(); bus.close(); };
  }, [params.trialId]);

  const handleAiCommand = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!prompt.trim() || isAiProcessing) return;

    setIsAiProcessing(true);
    try {
      const delta = await aiOrchestrator.generatePatch(prompt, manifest);
      if (delta && delta.length > 0) {
        const safety = validatePatchSafety(delta);
        if (safety.ok) {
          setStagedPatch(delta);
          busRef.current?.post({ type: "STAGED_PATCH_SET", patch: delta });
          showToast("ניל-App", "הצעה חדשה מוכנה באייפון", "ai");
        } else {
          showToast("אבטחה", safety.reason || "פעולה חסומה", "error");
        }
      }
    } catch (err) {
      showToast("שגיאה", "נכשלתי בעיבוד הפקודה", "error");
    } finally {
      setIsAiProcessing(false);
      setPrompt("");
    }
  };

  const approveChange = async () => {
    if (!stagedPatch || !manifest) return;
    try {
      const finalManifest = previewWithPatch(manifest, stagedPatch);
      await updateDoc(doc(db, "trials", params.trialId), { 
        manifest: finalManifest, 
        updatedAt: new Date().toISOString() 
      });
      setStagedPatch(null);
      busRef.current?.post({ type: "STAGED_PATCH_CLEAR" });
      showToast("ניל-App", "השינוי עודכן בהצלחה", "success");
    } catch (err) {
      showToast("שגיאה", "עדכון ה-Cloud נכשל", "error");
    }
  };

  if (error) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-[#020617] text-white p-6 text-center">
        <AlertCircle size={48} className="text-red-500 mb-4" />
        <h1 className="text-2xl font-bold mb-2">אופס, משהו השתבש</h1>
        <p className="opacity-60">{error}</p>
      </div>
    );
  }

  if (!manifest) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#020617] text-white">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <p className="font-black italic uppercase tracking-tighter animate-pulse">Initializing Studio...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#F8FAFC] dark:bg-[#020617]" dir="rtl">
      {/* Top Navigation */}
      <nav className="h-20 border-b border-slate-200 dark:border-white/10 bg-white/80 dark:bg-black/40 backdrop-blur-xl flex items-center justify-between px-8 fixed top-0 w-full z-50">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
            <Globe size={24} />
          </div>
          <h1 className="text-xl font-black italic tracking-tighter text-slate-900 dark:text-white uppercase leading-none">Nile‑pwa</h1>
        </div>
        <div className="flex items-center gap-4">
          <select 
            value={locale} 
            onChange={(e) => setLocale(e.target.value as any)}
            className="bg-slate-100 dark:bg-white/5 border-none rounded-full px-4 py-2 text-xs font-bold outline-none cursor-pointer dark:text-white"
          >
            <option value="he">עברית</option>
            <option value="en">English</option>
            <option value="ar">العربية</option>
          </select>
          <button className="bg-slate-900 dark:bg-white text-white dark:text-black px-6 py-2 rounded-full font-black text-xs hover:scale-105 transition-all">
            PUBLISH
          </button>
        </div>
      </nav>

      <div className="pt-24 px-8 h-screen grid grid-cols-1 lg:grid-cols-12 gap-8 pb-8">
        
        {/* Left: Sitemap */}
        <div className="lg:col-span-3 flex flex-col gap-6">
          <div className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-[2.5rem] p-6 shadow-sm overflow-hidden">
            <h2 className="text-sm font-black uppercase opacity-30 mb-6 flex items-center gap-2 italic">
              <Layout size={16}/> Sitemap
            </h2>
            <div className="space-y-2 max-h-[400px] overflow-y-auto no-scrollbar">
               {manifest.pages && Object.values(manifest.pages).map((p: any) => (
                 <div key={p.id} className="p-4 bg-slate-50 dark:bg-white/5 rounded-2xl flex items-center justify-between">
                   <span className="text-sm font-bold opacity-70">{p.route}</span>
                   <span className="text-[10px] bg-blue-500/10 text-blue-500 px-2 py-1 rounded-lg font-black italic">
                     {(p.blocks || []).length} BLOCKS
                   </span>
                 </div>
               ))}
            </div>
          </div>
        </div>

        {/* Center: iPhone Frame */}
        <div className="lg:col-span-4 flex items-center justify-center relative bg-slate-100 dark:bg-black/20 rounded-[4rem] border border-dashed border-slate-300 dark:border-white/5">
          <div className="relative scale-[0.85] xl:scale-95 transition-all">
             <div className="w-[320px] h-[650px] bg-black rounded-[4rem] border-[10px] border-slate-800 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-slate-800 rounded-b-3xl z-30" />
                <div className="h-full w-full bg-white overflow-hidden">
                  <ManifestRenderer manifest={previewManifest} />
                </div>
             </div>

             <AnimatePresence>
               {stagedPatch && (
                 <motion.div 
                   initial={{ y: 60, opacity: 0 }} 
                   animate={{ y: 0, opacity: 1 }} 
                   exit={{ y: 60, opacity: 0 }}
                   className="absolute bottom-4 left-4 right-4 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl p-6 rounded-[2.5rem] shadow-2xl border border-blue-500/30 z-50"
                 >
                    <div className="flex items-center gap-2 mb-4 justify-center text-blue-500">
                       <Sparkles size={16} className="animate-pulse" />
                       <span className="text-[10px] font-black uppercase italic">הצעה לשינוי מבנה</span>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={approveChange} className="flex-1 bg-blue-600 text-white py-4 rounded-2xl font-black text-xs shadow-lg shadow-blue-500/20">אשר ✨</button>
                      <button onClick={() => setStagedPatch(null)} className="flex-1 bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-white py-4 rounded-2xl font-black text-xs">בטל</button>
                    </div>
                 </motion.div>
               )}
             </AnimatePresence>
          </div>
        </div>

        {/* Right: AI Chat */}
        <div className="lg:col-span-5 flex flex-col h-full overflow-hidden">
          <div className="bg-white dark:bg-[#0b141a] border border-slate-200 dark:border-white/10 rounded-[3rem] flex-1 flex flex-col shadow-2xl overflow-hidden relative">
            <div className="p-6 border-b border-slate-100 dark:border-white/5 flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg"><MessageSquare size={22} /></div>
              <div>
                <h2 className="text-lg font-black italic dark:text-white uppercase leading-none">NILE AI BRAIN</h2>
                <div className="flex items-center gap-1.5 mt-1">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-[10px] text-green-500 font-bold uppercase">Online</span>
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-8 space-y-4 no-scrollbar">
               <div className="bg-slate-50 dark:bg-white/5 p-5 rounded-[1.5rem] rounded-tr-none max-w-[90%] text-sm font-medium italic">
                 אהלן! אני המוח של ניל-App. איך לעזור לך לעצב את האפליקציה היום?
               </div>
               <div ref={scrollRef} />
            </div>

            <div className="p-6 border-t border-slate-100 dark:border-white/5">
              <form onSubmit={handleAiCommand} className="relative">
                <input 
                  type="text" 
                  value={prompt} 
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="למשל: 'הוסף טופס הרשמה כחול'..."
                  className="w-full bg-white dark:bg-black/40 border border-slate-200 dark:border-white/10 rounded-full p-6 text-sm outline-none focus:ring-2 ring-blue-500 dark:text-white shadow-inner"
                />
                <button 
                  type="submit" 
                  disabled={isAiProcessing || !prompt.trim()} 
                  className="absolute left-3 top-1/2 -translate-y-1/2 p-4 bg-blue-600 text-white rounded-full shadow-lg disabled:opacity-50"
                >
                  {isAiProcessing ? <div className="w-5 h-5 border-2 border-t-white rounded-full animate-spin" /> : <Send size={20} />}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
