/* app/studio/chat-agent/[trialId]/page.tsx */
"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import { useChatLogic } from "@/lib/chat-logic";
import { motion, AnimatePresence } from "framer-motion";
import { BrainCircuit, Sparkles, Send, Check, X, Activity } from "lucide-react";

export default function NielappStudio() {
  const { trialId } = useParams();
  const { manifest, proposal, isProcessing, sendAnswer, approveProposal, rejectProposal } = useChatLogic(trialId as string);
  const [input, setInput] = useState("");

  if (!manifest) return <LoadingScreen />;

  const primaryColor = manifest.theme?.primaryColor || "#3b82f6";

  return (
    <div className="h-screen bg-[#020617] text-white flex overflow-hidden font-sans" dir="rtl">
      
      {/* --- SIDEBAR: BRAIN CONSOLE --- */}
      <div className="w-1/3 border-l border-white/10 bg-black/40 backdrop-blur-3xl p-8 flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-600/20 rounded-2xl border border-blue-500/30">
              <BrainCircuit className="text-blue-400" size={24}/>
            </div>
            <h2 className="text-xl font-black italic uppercase tracking-tighter">Brain Console</h2>
          </div>
          <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            <span className="text-[10px] font-bold text-emerald-500 uppercase">Live Sync</span>
          </div>
        </div>

        {/* JSON Viewer */}
        <div className="flex-1 bg-black/60 rounded-[2.5rem] border border-white/5 p-6 font-mono text-[11px] text-blue-300/80 overflow-auto shadow-inner">
          <div className="flex items-center gap-2 mb-4 text-white/40 border-b border-white/5 pb-2">
            <Activity size={12} /> <span>CURRENT_MANIFEST_STATE</span>
          </div>
          <pre>{JSON.stringify(manifest, null, 2)}</pre>
        </div>

        {/* AI PROPOSALS PANEL */}
        <AnimatePresence>
          {proposal && (
            <motion.div 
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="p-6 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[2.5rem] shadow-2xl shadow-blue-900/40 border border-white/20"
            >
              <div className="flex items-center gap-2 mb-3 text-white/80 font-bold text-[10px] uppercase tracking-widest">
                <Sparkles size={14} className="animate-spin-slow" /> AI Insight Detected
              </div>
              <p className="text-sm font-bold text-white mb-6 leading-relaxed">{proposal.rationale}</p>
              <div className="flex gap-2">
                <button onClick={approveProposal} className="flex-1 bg-white text-blue-700 py-4 rounded-2xl font-black text-[10px] uppercase hover:bg-blue-50 transition-all shadow-lg">
                  Approve Patch
                </button>
                <button onClick={rejectProposal} className="p-4 bg-black/20 text-white rounded-2xl hover:bg-black/30 transition-all">
                  <X size={18} />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* --- MAIN: IPHONE SIMULATOR --- */}
      <div className="flex-1 flex flex-col items-center justify-center bg-[#0f172a] relative">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-transparent opacity-50" />
        
        <div className="w-[340px] h-[680px] bg-white rounded-[3.5rem] border-[12px] border-slate-800 shadow-[0_0_100px_-20px_rgba(0,0,0,0.8)] relative overflow-hidden flex flex-col transition-all duration-500">
          <div className="h-8 bg-white flex items-center justify-center pt-2">
            <div className="w-16 h-5 bg-slate-800 rounded-b-2xl" />
          </div>

          <div className="flex-1 flex flex-col bg-slate-50 relative">
            <div className="flex-1 p-8 flex flex-col items-center justify-center text-center">
              <motion.div 
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ repeat: Infinity, duration: 3 }}
                style={{ backgroundColor: primaryColor }}
                className="w-20 h-20 rounded-3xl mb-8 flex items-center justify-center text-white shadow-2xl"
              >
                <Sparkles size={40} />
              </motion.div>
              <h3 className="text-2xl font-black text-slate-900 mb-3 tracking-tight">
                {manifest.questions?.[0]?.text || "איך אוכל לעזור לעסק שלך היום?"}
              </h3>
              <p className="text-[11px] text-slate-400 font-bold uppercase tracking-[0.2em]">Nielapp AI Agent</p>
            </div>

            <div className="p-8 bg-white border-t border-slate-100 shadow-[0_-20px_40px_-20px_rgba(0,0,0,0.05)]">
              <input 
                value={input} 
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && (sendAnswer(input), setInput(""))}
                className="w-full bg-slate-100 border-2 border-transparent rounded-2xl p-5 text-sm text-slate-900 outline-none focus:border-blue-500 transition-all"
                placeholder="הקלד/י תשובה..."
              />
              <button 
                onClick={() => { sendAnswer(input); setInput(""); }}
                disabled={isProcessing || !input}
                style={{ backgroundColor: isProcessing ? '#94a3b8' : primaryColor }}
                className="w-full mt-4 text-white p-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-3 active:scale-95 transition-all shadow-xl shadow-blue-500/10"
              >
                {isProcessing ? "Analyzing..." : "Send Message"}
                {!isProcessing && <Send size={16} />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function LoadingScreen() {
  return (
    <div className="h-screen bg-[#020617] flex flex-col items-center justify-center gap-6">
      <div className="relative w-24 h-24">
        <div className="absolute inset-0 border-4 border-blue-500/20 rounded-full" />
        <div className="absolute inset-0 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
      <p className="text-blue-500 font-black text-xs uppercase tracking-[0.4em] animate-pulse">Initializing Nielapp Brain</p>
    </div>
  );
}
