"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { db } from "../../../lib/firebase";
import { doc, onSnapshot, updateDoc } from "firebase/firestore";
import { motion, AnimatePresence } from "framer-motion";
import { Operation } from "fast-json-patch";

// ייבוא בנתיבים יחסיים למניעת שגיאות ב-Vercel
import { ManifestRenderer } from "../../../components/Renderer";
import { aiOrchestrator } from "../../../lib/orchestrator";
import { validatePatchSafety, previewWithPatch } from "../../../lib/patch";
import { NileBus } from "../../../lib/bus";
import { useToast } from "../../../components/ui/ToastProvider";
import { useI18n } from "../../../components/I18nProvider";

import { Sparkles, Send, Layout, MessageSquare, Rocket, Globe } from "lucide-react";

export default function NileStudio({ params }: { params: { trialId: string } }) {
  const [manifest, setManifest] = useState<any>(null);
  const [stagedPatch, setStagedPatch] = useState<Operation[] | null>(null);
  const [prompt, setPrompt] = useState("");
  const [isAiProcessing, setIsAiProcessing] = useState(false);
  
  const { showToast } = useToast();
  const { locale, setLocale } = useI18n();
  const busRef = useRef<NileBus | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const previewManifest = useMemo(() => {
    if (!manifest) return null;
    if (!stagedPatch) return manifest;
    try { return previewWithPatch(manifest, stagedPatch); } 
    catch (e) { return manifest; }
  }, [manifest, stagedPatch]);

  useEffect(() => {
    const docRef = doc(db, "trials", params.trialId);
    const unsub = onSnapshot(docRef, (snap) => {
      if (snap.exists()) setManifest(snap.data().manifest);
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
      if (delta && delta.length > 0 && validatePatchSafety(delta).ok) {
        setStagedPatch(delta);
        busRef.current?.post({ type: "STAGED_PATCH_SET", patch: delta });
        showToast("ניל-App", "הכנתי הצעה, בדוק את האייפון", "ai");
      }
    } finally {
      setIsAiProcessing(false);
      setPrompt("");
    }
  };

  const approveChange = async () => {
    if (!stagedPatch || !manifest) return;
    const finalManifest = previewWithPatch(manifest, stagedPatch);
    try {
      await updateDoc(doc(db, "trials", params.trialId), { 
        manifest: finalManifest, 
        updatedAt: new Date().toISOString() 
      });
      setStagedPatch(null);
      busRef.current?.post({ type: "STAGED_PATCH_CLEAR" });
      showToast("ניל-App", "השינוי נשמר ✨", "success");
    } catch (err) { showToast("שגיאה", "השמירה נכשלה", "error"); }
  };

  if (!manifest) return <div className="h-screen flex items-center justify-center bg-[#020617] text-white animate-pulse font-black">טוען את ניל-App...</div>;

  return (
    <main className="min-h-screen bg-[#F8FAFC] dark:bg-[#020617]" dir="rtl">
      <nav className="h-20 border-b border-slate-200 dark:border-white/10 bg-white/80 dark:bg-black/40 backdrop-blur-xl flex items-center justify-between px-8 fixed top-0 w-full z-50">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white"><Globe size={24} /></div>
          <h1 className="text-xl font-black italic text-slate-900 dark:text-white uppercase">Nile‑pwa</h1>
        </div>
        <div className="flex gap-4">
          <select value={locale} onChange={(e) => setLocale(e.target.value as any)} className="bg-slate-100 dark:bg-white/5 rounded-full px-4 py-2 text-xs font-bold outline-none">
            <option value="he">עברית</option>
            <option value="en">English</option>
            <option value="ar">العربية</option>
          </select>
          <button className="bg-slate-900 dark:bg-white text-white dark:text-black px-6 py-2 rounded-full font-black text-xs"><Rocket size={14}/> PUBLISH</button>
        </div>
      </nav>

      <div className="pt-24 px-8 h-screen grid grid-cols-1 lg:grid-cols-12 gap-8 pb-8">
        <div className="lg:col-span-3">
          <div className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-[3rem] p-8 shadow-sm">
            <h2 className="text-sm font-black uppercase opacity-30 mb-6 flex items-center gap-2 italic"><Layout size={16}/> Sitemap</h2>
            <div className="space-y-2">
               {Object.values(manifest.pages).map((p: any) => (
                 <div key={p.id} className="p-4 bg-slate-50 dark:bg-white/5 rounded-2xl flex justify-between">
                   <span className="text-sm font-bold opacity-70">{p.route}</span>
                   <span className="text-[10px] text-blue-500 font-black">{p.blocks.length} BLOCKS</span>
                 </div>
               ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-4 flex items-center justify-center relative">
          <div className="w-[320px] h-[650px] bg-black rounded-[4rem] border-[10px] border-slate-800 shadow-2xl relative overflow-hidden">
             <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-slate-800 rounded-b-3xl z-30" />
             <div className="h-full w-full bg-white"><ManifestRenderer manifest={previewManifest} /></div>
             <AnimatePresence>
               {stagedPatch && (
                 <motion.div initial={{ y: 60, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 60, opacity: 0 }} className="absolute bottom-4 left-4 right-4 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl p-6 rounded-[2.5rem] shadow-2xl border border-blue-500/30 z-50">
                    <div className="flex gap-2">
                      <button onClick={approveChange} className="flex-1 bg-blue-600 text-white py-4 rounded-2xl font-black text-xs">אשר שינוי ✨</button>
                      <button onClick={() => setStagedPatch(null)} className="flex-1 bg-slate-200 dark:bg-white/10 py-4 rounded-2xl font-black text-xs">בטל</button>
                    </div>
                 </motion.div>
               )}
             </AnimatePresence>
          </div>
        </div>

        <div className="lg:col-span-5 flex flex-col h-full">
          <div className="bg-white dark:bg-[#0b141a] border border-slate-200 dark:border-white/10 rounded-[3.5rem] flex-1 flex flex-col shadow-2xl overflow-hidden relative">
            <div className="p-8 border-b border-slate-100 dark:border-white/5 flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white"><MessageSquare size={24} /></div>
              <h2 className="text-xl font-black italic dark:text-white uppercase">NILE AI</h2>
            </div>
            <div className="flex-1 overflow-y-auto p-8 space-y-4">
               <div className="bg-slate-50 dark:bg-white/5 p-6 rounded-[2rem] rounded-tr-none max-w-[90%] text-sm italic">אהלן! אני המוח של ניל‑App. מה תרצה שאצור עכשיו?</div>
            </div>
            <div className="p-8 border-t border-slate-100 dark:border-white/5">
              <form onSubmit={handleAiCommand} className="relative">
                <input type="text" value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder="דבר עם המוח... (למשל: 'הוסף טופס צור קשר')" className="w-full bg-white dark:bg-black/40 border border-slate-200 dark:border-white/10 rounded-[2rem] p-6 text-sm outline-none focus:ring-2 ring-blue-500 dark:text-white" />
                <button type="submit" disabled={isAiProcessing} className="absolute left-3 top-1/2 -translate-y-1/2 p-4 bg-blue-600 text-white rounded-[1.5rem] shadow-xl">{isAiProcessing ? <div className="w-5 h-5 border-2 border-t-white rounded-full animate-spin" /> : <Send size={20} />}</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
