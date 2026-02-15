/* app/studio/chat-agent/[trialId]/page.tsx */
"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useChatLogic } from "../../../lib/chat-logic";
import { Sparkles, Send, BrainCircuit, Check, X, Smartphone } from "lucide-react";

export default function NielappChatStudio() {
  const { trialId } = useParams();
  const { manifest, proposal, isProcessing, sendAnswer, approveProposal, rejectProposal } = useChatLogic(trialId as string);
  const [input, setInput] = useState("");

  if (!manifest) return <div className="h-screen bg-[#020617] flex items-center justify-center text-blue-500 font-black animate-pulse">LOADING NIELAPP...</div>;

  return (
    <div className="h-screen bg-[#020617] text-white flex overflow-hidden font-sans" dir="rtl">
      {/* שמאל: Brain Console */}
      <div className="w-1/3 border-l border-white/10 bg-black/20 backdrop-blur-xl p-8 overflow-y-auto">
        <div className="flex items-center gap-3 mb-10 text-blue-400 font-black uppercase italic tracking-tighter">
          <BrainCircuit size={28}/> <span>Brain Console</span>
        </div>
        <pre className="text-[10px] font-mono text-emerald-400 bg-black/40 p-6 rounded-3xl border border-white/5">
          {JSON.stringify(manifest, null, 2)}
        </pre>
      </div>

      {/* ימין: Simulator & Proposals */}
      <div className="flex-1 flex flex-col items-center justify-center relative bg-slate-900/30">
        <div className="w-[320px] h-[650px] bg-black rounded-[3.5rem] border-[10px] border-slate-800 shadow-2xl relative overflow-hidden ring-4 ring-white/5 flex flex-col">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-slate-800 rounded-b-3xl z-30" />
          <div className="flex-1 p-6 bg-white text-black flex flex-col pt-12">
            <div className="flex-1 flex flex-col justify-center items-center text-center">
              <Sparkles size={32} className="text-blue-600 mb-4 animate-bounce" />
              <h3 className="font-black text-lg mb-2">{manifest.questions.find(q => !(q.field in manifest.data))?.text || "הסתיימה הגדרת המוח!"}</h3>
            </div>
            <div className="space-y-3">
              <input value={input} onChange={e => setInput(e.target.value)} className="w-full bg-slate-100 border-none rounded-2xl p-4 text-sm" placeholder="הקלד/י כאן..." />
              <button onClick={() => { sendAnswer(input); setInput(""); }} disabled={isProcessing} className="w-full bg-blue-600 text-white p-4 rounded-2xl font-black text-xs uppercase flex items-center justify-center gap-2">
                {isProcessing ? "מעבד..." : "שלח/י"} <Send size={14}/>
              </button>
            </div>
          </div>
        </div>

        {/* AI Proposal Overlay */}
        <AnimatePresence>
          {proposal && (
            <motion.div initial={{ y: 100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 100, opacity: 0 }} className="absolute bottom-10 bg-white text-black p-8 rounded-[3rem] w-[450px] shadow-2xl z-50 border border-blue-500/20">
              <div className="flex items-center gap-3 mb-4 text-blue-600 font-black uppercase text-xs tracking-widest"><Sparkles size={20}/> הצעת AI אוטונומית</div>
              <p className="text-sm font-bold mb-8 leading-relaxed opacity-80">{proposal.rationale}</p>
              <div className="flex gap-3">
                <button onClick={approveProposal} className="flex-1 bg-blue-600 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-700 transition-all">אישור ✨</button>
                <button onClick={rejectProposal} className="flex-1 bg-slate-100 text-slate-400 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-200 transition-all">ביטול</button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
