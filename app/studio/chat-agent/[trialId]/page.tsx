/* app/studio/chat-agent/[trialId]/page.tsx */
"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useChatLogic } from "../../../lib/chat-logic";
import { Sparkles, Send, Layout, BrainCircuit, Check, X } from "lucide-react";

export default function NielappChatStudio() {
  const { trialId } = useParams();
  const { manifest, proposal, isProcessing, sendAnswer, approveProposal, rejectProposal } = useChatLogic(trialId as string);
  const [input, setInput] = useState("");

  if (!manifest) return (
    <div className="h-screen bg-[#020617] flex items-center justify-center text-blue-500 font-black animate-pulse uppercase tracking-widest">
      Nielapp Brain Loading...
    </div>
  );

  return (
    <div className="h-screen bg-[#020617] text-white flex overflow-hidden font-sans" dir="rtl">
      {/* Brain Console Panel */}
      <div className="w-1/3 border-l border-white/10 bg-black/20 backdrop-blur-xl p-8 overflow-y-auto">
        <div className="flex items-center gap-3 mb-10">
          <div className="p-3 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl shadow-lg shadow-blue-500/20">
            <BrainCircuit size={24}/>
          </div>
          <div>
            <h2 className="text-xl font-black italic uppercase leading-none">Brain Console</h2>
            <p className="text-[10px] text-blue-400 font-bold tracking-widest mt-1 uppercase">Smart AI Router Active</p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white/5 rounded-[2rem] p-6 border border-white/5">
             <h3 className="text-xs font-bold opacity-30 uppercase mb-4 tracking-widest">Current Logic Flow</h3>
             <pre className="text-[10px] font-mono text-emerald-400 overflow-x-auto">
               {JSON.stringify(manifest, null, 2)}
             </pre>
          </div>
        </div>
      </div>

      {/* Simulator Panel */}
      <div className="flex-1 flex flex-col items-center justify-center relative bg-gradient-to-b from-slate-900 to-[#020617]">
        {/* iPhone Frame */}
        <div className="w-[320px] h-[650px] bg-black rounded-[3.5rem] border-[10px] border-slate-800 shadow-2xl relative overflow-hidden ring-4 ring-white/5">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-slate-800 rounded-b-3xl z-30" />
          
          <div className="p-6 h-full flex flex-col bg-white text-black">
             <div className="flex-1 flex flex-col justify-center items-center text-center">
                <div className="w-12 h-12 bg-blue-600 rounded-2xl mb-4 flex items-center justify-center text-white shadow-xl">
                  <Sparkles size={24}/>
                </div>
                <h3 className="text-lg font-black leading-tight mb-2">
                  {manifest.questions.find(q => !(q.field in manifest.data))?.text || "הצ'אט הושלם!"}
                </h3>
                <p className="text-[10px] opacity-40 font-bold uppercase tracking-tighter italic">Nielapp Autonomous Agent</p>
             </div>

             <div className="pb-4">
                <input 
                  value={input} 
                  onChange={e => setInput(e.target.value)}
                  className="w-full bg-slate-100 border-none rounded-2xl p-4 text-sm outline-none focus:ring-2 ring-blue-500 transition-all"
                  placeholder="הקלד/י כאן..."
                />
                <button 
                  onClick={() => { sendAnswer(input); setInput(""); }}
                  disabled={isProcessing}
                  className="w-full mt-3 bg-blue-600 text-white p-4 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20"
                >
                  {isProcessing ? "Processing..." : <>SEND <Send size={14}/></>}
                </button>
             </div>
          </div>
        </div>

        {/* AI Proposal Overlay (Readdy.ai Style) */}
        <AnimatePresence>
          {proposal && (
            <motion.div 
              initial={{ opacity: 0, y: 100, scale: 0.9 }} 
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 100, scale: 0.9 }}
              className="absolute bottom-10 bg-white/95 backdrop-blur-2xl text-black p-8 rounded-[3rem] w-[450px] shadow-[0_30px_100px_rgba(0,0,0,0.5)] border border-blue-500/20 z-50"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-blue-600 rounded-xl text-white animate-pulse"><Sparkles size={20}/></div>
                <div>
                  <h4 className="font-black text-sm uppercase italic tracking-widest text-blue-600">AI Logic Proposal</h4>
                  <p className="text-[10px] opacity-50 font-bold uppercase">Manual Confirmation Required</p>
                </div>
              </div>
              <p className="text-sm font-bold mb-8 leading-relaxed opacity-80">{proposal.rationale}</p>
              <div className="flex gap-3">
                <button onClick={approveProposal} className="flex-1 bg-black text-white py-4 rounded-[1.5rem] font-black text-xs uppercase tracking-widest hover:bg-slate-800 transition-all">
                   Approve & Commit <Check size={16} className="inline ml-1"/>
                </button>
                <button onClick={rejectProposal} className="flex-[0.5] bg-slate-100 text-slate-400 py-4 rounded-[1.5rem] font-black text-xs uppercase tracking-widest hover:bg-slate-200 transition-all">
                   <X size={16} className="inline mr-1"/> Skip
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
