/* app/studio/chat-agent/[trialId]/page.tsx */
"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  useChatLogic, 
  generateWebsiteAsset, 
  publishManifestToProduction 
} from "@/lib/chat-logic";
import { 
  Sparkles, 
  Send, 
  BrainCircuit, 
  Check, 
  X, 
  Rocket, 
  Smartphone, 
  ExternalLink, 
  PartyPopper,
  ShieldCheck,
  Activity
} from "lucide-react";

// רכיב ה-Renderer שלך להצגת האתר שנוצר בתוך הסימולטור
import Renderer from "@/components/Renderer";

export default function NielappChatStudio() {
  const { trialId } = useParams();
  const { 
    manifest, 
    proposal, 
    isProcessing, 
    sendAnswer, 
    approveProposal, 
    rejectProposal 
  } = useChatLogic(trialId as string);

  const [input, setInput] = useState("");
  const [showWebsitePreview, setShowWebsitePreview] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [isLive, setIsLive] = useState(false);

  // פונקציית יצירת אתר (Asset Generation)
  const handleGenerateWebsite = async () => {
    if (!manifest) return;
    const website = generateWebsiteAsset(manifest);
    // עדכון המניפסט ב-Firestore עם הנכס החדש
    const { doc, updateDoc, db } = await import("firebase/firestore");
    await updateDoc(doc(db, "chatManifests", trialId as string), {
      "assets.website": website,
      aiConfidence: 1.0
    });
    setShowWebsitePreview(true);
  };

  // פונקציית שיגור (Omega Mode)
  const handlePublish = async () => {
    if (!manifest) return;
    setIsPublishing(true);
    try {
      await publishManifestToProduction(trialId as string, manifest);
      setIsLive(true);
    } catch (err) {
      console.error("Publishing failed:", err);
    } finally {
      setIsPublishing(false);
    }
  };

  if (!manifest) return (
    <div className="h-screen bg-[#020617] flex flex-col items-center justify-center gap-4">
      <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      <div className="text-blue-500 font-black uppercase tracking-[0.3em] text-xs">Initializing Nielapp Brain...</div>
    </div>
  );

  return (
    <div className="h-screen bg-[#020617] text-white flex overflow-hidden font-sans" dir="rtl">
      
      {/* --- SIDEBAR: BRAIN CONSOLE --- */}
      <div className="w-1/3 border-l border-white/10 bg-black/40 backdrop-blur-2xl p-8 overflow-y-auto flex flex-col">
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-600/20 rounded-2xl border border-blue-500/30">
              <BrainCircuit className="text-blue-400" size={24}/>
            </div>
            <div>
              <h2 className="text-xl font-black italic uppercase leading-none">Brain Console</h2>
              <p className="text-[10px] text-blue-400 font-bold tracking-widest mt-1 uppercase">Autonomous Logic Sync</p>
            </div>
          </div>
          <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
            <Activity size={12} className="text-emerald-500 animate-pulse" />
            <span className="text-[10px] font-bold text-emerald-500 uppercase">Live</span>
          </div>
        </div>

        {/* Intelligence Metrics */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-white/5 p-4 rounded-3xl border border-white/5">
            <p className="text-[10px] uppercase opacity-40 font-bold mb-1">Confidence</p>
            <p className="text-2xl font-black text-blue-400">{(manifest.aiConfidence * 100).toFixed(0)}%</p>
          </div>
          <div className="bg-white/5 p-4 rounded-3xl border border-white/5">
            <p className="text-[10px] uppercase opacity-40 font-bold mb-1">Status</p>
            <p className="text-sm font-black uppercase tracking-tighter">{manifest.industry || "Learning..."}</p>
          </div>
        </div>

        {/* JSON Schema Preview */}
        <div className="flex-1 bg-black/40 rounded-[2rem] p-6 border border-white/5 overflow-hidden flex flex-col">
           <div className="flex items-center justify-between mb-4">
             <h3 className="text-xs font-bold opacity-30 uppercase tracking-widest">Active Manifest</h3>
             <ShieldCheck size={14} className="opacity-30" />
           </div>
           <pre className="text-[10px] font-mono text-emerald-400/80 overflow-y-auto custom-scrollbar leading-relaxed">
             {JSON.stringify(manifest, null, 2)}
           </pre>
        </div>
      </div>

      {/* --- MAIN: SIMULATOR & OVERLAYS --- */}
      <div className="flex-1 flex flex-col items-center justify-center relative bg-gradient-to-br from-slate-900 via-[#020617] to-black">
        
        {/* iPhone Frame */}
        <div className="w-[340px] h-[680px] bg-[#0f172a] rounded-[3.5rem] border-[12px] border-slate-800 shadow-[0_50px_100px_-20px_rgba(0,0,0,1)] relative overflow-hidden ring-1 ring-white/10">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-36 h-7 bg-slate-800 rounded-b-[2rem] z-50 flex items-center justify-center">
            <div className="w-10 h-1 bg-black/20 rounded-full" />
          </div>
          
          <div className="h-full w-full bg-white relative flex flex-col overflow-hidden">
             {isLive ? (
               <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex-1 p-8 flex flex-col items-center justify-center text-center text-black">
                 <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-6">
                   <PartyPopper size={40} />
                 </div>
                 <h2 className="text-2xl font-black mb-2">Live!</h2>
                 <p className="text-sm opacity-60 mb-8">האפליקציה שלך באוויר ומוכנה לעבודה.</p>
                 <a href={`/chat/${trialId}`} target="_blank" className="w-full bg-black text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-xl">
                   פתח אפליקציה <ExternalLink size={16}/>
                 </a>
               </motion.div>
             ) : showWebsitePreview && manifest.assets?.website ? (
               <div className="flex-1 overflow-y-auto no-scrollbar pt-10">
                 <Renderer manifest={{ blocks: manifest.assets.website.blocks }} />
               </div>
             ) : (
               <div className="flex-1 flex flex-col bg-slate-50">
                  <div className="flex-1 p-8 flex flex-col items-center justify-center text-center">
                    <div className="w-16 h-16 bg-blue-600 rounded-3xl mb-6 flex items-center justify-center text-white shadow-2xl shadow-blue-500/40">
                      <Sparkles size={32} className="animate-pulse" />
                    </div>
                    <h3 className="text-xl font-black text-slate-900 leading-tight mb-3">
                      {manifest.questions.find(q => !(q.field in manifest.data))?.text || "הסתיימה הגדרת המוח!"}
                    </h3>
                    <p className="text-[10px] text-blue-600 font-black uppercase tracking-widest opacity-60">Nielapp AI Agent</p>
                  </div>

                  <div className="p-6 bg-white border-t border-slate-100">
                    <input 
                      value={input} 
                      onChange={e => setInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && sendAnswer(input)}
                      className="w-full bg-slate-100 border-none rounded-2xl p-5 text-sm text-slate-900 placeholder:text-slate-400 focus:ring-2 ring-blue-500 transition-all outline-none"
                      placeholder="הקלד/י כאן..."
                    />
                    <button 
                      onClick={() => { sendAnswer(input); setInput(""); }}
                      disabled={isProcessing || !input}
                      className="w-full mt-3 bg-blue-600 text-white p-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-3 active:scale-95 transition-all shadow-lg shadow-blue-500/20 disabled:opacity-50"
                    >
                      {isProcessing ? "Analyzing..." : <>Send Message <Send size={14}/></>}
                    </button>
                  </div>
               </div>
             )}
          </div>
        </div>

        {/* --- DYNAMIC OVERLAYS --- */}

        {/* 1. Generate Asset Button */}
        {manifest.aiConfidence >= 0.8 && !showWebsitePreview && !isLive && (
          <motion.button 
            initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
            onClick={handleGenerateWebsite}
            className="absolute top-10 bg-emerald-500 text-white px-8 py-4 rounded-full font-black shadow-2xl shadow-emerald-500/30 flex items-center gap-3 hover:scale-105 transition-all z-20"
          >
            <Smartphone size={20}/> בנה לי את האתר עכשיו ✨
          </motion.button>
        )}

        {/* 2. AI Proposal Confirmation (The Readdy.ai Style) */}
        <AnimatePresence>
          {proposal && !showWebsitePreview && (
            <motion.div 
              initial={{ y: 100, opacity: 0, scale: 0.9 }} 
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 100, opacity: 0, scale: 0.9 }}
              className="absolute bottom-10 bg-white/95 backdrop-blur-3xl text-black p-8 rounded-[3rem] w-[460px] shadow-[0_40px_100px_rgba(0,0,0,0.6)] border border-blue-500/10 z-50"
            >
              <div className="flex items-center gap-3 mb-5">
                <div className="p-3 bg-blue-600 rounded-2xl text-white shadow-lg"><Sparkles size={20}/></div>
                <div>
                  <h4 className="font-black text-sm uppercase italic tracking-widest text-blue-600">AI Logic Proposal</h4>
                  <p className="text-[10px] opacity-40 font-bold uppercase tracking-tighter">Autonomous Adjustment Detected</p>
                </div>
              </div>
              <p className="text-md font-bold mb-8 leading-relaxed text-slate-700">{proposal.rationale}</p>
              <div className="flex gap-4">
                <button onClick={approveProposal} className="flex-1 bg-black text-white py-5 rounded-[1.8rem] font-black text-xs uppercase tracking-widest hover:bg-slate-800 transition-all shadow-xl">
                   Approve & Commit <Check size={16} className="inline ml-1"/>
                </button>
                <button onClick={rejectProposal} className="flex-[0.4] bg-slate-100 text-slate-400 py-5 rounded-[1.8rem] font-black text-xs uppercase tracking-widest hover:bg-slate-200 transition-all">
                   <X size={16}/>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 3. Omega Mode: Final Publish Button */}
        {showWebsitePreview && !isLive && (
          <motion.div 
            initial={{ y: 100, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
            className="absolute bottom-10 flex flex-col items-center gap-4"
          >
            <button 
              onClick={handlePublish}
              disabled={isPublishing}
              className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white px-12 py-6 rounded-[2.5rem] font-black text-sm uppercase tracking-[0.3em] shadow-[0_20px_50px_rgba(37,99,235,0.4)] hover:scale-105 active:scale-95 transition-all flex items-center gap-3"
            >
              {isPublishing ? "Launching..." : <><Rocket size={20} className="animate-bounce"/> OMEGA PUBLISH</>}
            </button>
            <button onClick={() => setShowWebsitePreview(false)} className="text-white/40 text-[10px] font-black uppercase tracking-widest hover:text-white transition-all">
              Back to logic tuning
            </button>
          </motion.div>
        )}

      </div>
    </div>
  );
}
