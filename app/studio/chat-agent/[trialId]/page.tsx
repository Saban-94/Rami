"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useChatLogic } from "@/lib/chat-logic";
import { motion, AnimatePresence } from "framer-motion";
import { 
  BrainCircuit, 
  LayoutDashboard, 
  Moon, 
  Sun, 
  ChevronDown, 
  ChevronUp, 
  Clock, 
  User, 
  Palette, 
  Eye, 
  Send, 
  Sparkles, 
  X, 
  Activity,
  Database // הוספנו את הייבוא החסר שגרם לשגיאה
} from "lucide-react";

export default function NielappStudioPage() {
  const params = useParams();
  const trialId = params?.trialId as string;
  const { manifest, proposal, isProcessing, sendAnswer, approveProposal, rejectProposal } = useChatLogic(trialId);
  const [isClient, setIsClient] = useState(false);
  const [input, setInput] = useState("");

  // מבטיח שהקומפוננטה תתרנדר רק בצד הלקוח למניעת שגיאות SSR
  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient || !manifest) return <LoadingScreen />;

  return (
    <div className="h-screen bg-[#020617] text-white flex overflow-hidden font-sans" dir="rtl">
      
      {/* --- SIDEBAR: BRAIN CONSOLE --- */}
      <div className="w-1/3 border-l border-white/10 hidden md:block overflow-y-auto bg-black/20">
        <BrainConsole manifest={manifest} proposal={proposal} approve={approveProposal} reject={rejectProposal} />
      </div>

      {/* --- MAIN: IPHONE SIMULATOR --- */}
      <div className="flex-1 bg-[#0f172a] relative flex items-center justify-center">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-transparent opacity-50" />
        
        <div className="w-[340px] h-[680px] bg-white rounded-[3.5rem] border-[12px] border-slate-800 shadow-2xl relative overflow-hidden flex flex-col">
          <div className="h-8 bg-white flex items-center justify-center pt-2">
            <div className="w-16 h-5 bg-slate-800 rounded-b-2xl" />
          </div>

          <div className="flex-1 flex flex-col bg-slate-50 overflow-hidden">
            <div className="flex-1 p-8 flex flex-col items-center justify-center text-center">
              <div 
                style={{ backgroundColor: manifest?.theme?.primaryColor || "#3b82f6" }}
                className="w-16 h-16 rounded-2xl mb-6 flex items-center justify-center text-white shadow-xl"
              >
                <Sparkles size={32} />
              </div>
              <h3 className="text-xl font-black text-slate-900 mb-2 leading-tight">
                {manifest?.questions?.[0]?.text || "איך אוכל לעזור לעסק שלך היום?"}
              </h3>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Nielapp AI Agent</p>
            </div>

            <div className="p-6 bg-white border-t border-slate-100">
              <input 
                value={input} 
                onChange={e => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && !isProcessing && input && (sendAnswer(input), setInput(""))}
                className="w-full bg-slate-100 rounded-2xl p-4 text-sm text-slate-900 outline-none focus:ring-2 ring-blue-500 transition-all"
                placeholder="הקלד/י כאן..."
              />
              <button 
                onClick={() => { sendAnswer(input); setInput(""); }}
                disabled={isProcessing || !input}
                style={{ backgroundColor: manifest?.theme?.primaryColor || "#3b82f6" }}
                className="w-full mt-3 text-white p-4 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 active:scale-95 transition-all disabled:opacity-50"
              >
                {isProcessing ? "Analyzing..." : "Send Message"}
                {!isProcessing && <Send size={14} />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* --- תתי-קומפוננטות באותו קובץ למניעת שגיאות Import --- */

function BrainConsole({ manifest, proposal, approve, reject }: any) {
  const [viewMode, setViewMode] = useState<'visual' | 'raw'>('visual');

  return (
    <div className="h-full flex flex-col bg-[#020617]">
      <div className="p-6 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-600 rounded-lg"><LayoutDashboard size={18} /></div>
          <h2 className="font-black text-xs uppercase tracking-widest text-white">Intelligence</h2>
        </div>
        <div className="flex bg-white/5 p-1 rounded-lg border border-white/10">
          <button 
            onClick={() => setViewMode('visual')} 
            className={`p-2 rounded-md transition-all ${viewMode === 'visual' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'}`}
          >
            <Database size={14}/>
          </button>
          <button 
            onClick={() => setViewMode('raw')} 
            className={`p-2 rounded-md transition-all ${viewMode === 'raw' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'}`}
          >
            <Eye size={14}/>
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {viewMode === 'raw' ? (
          <div className="p-4 bg-black/40 rounded-2xl border border-white/5 font-mono text-[10px] text-blue-300 overflow-auto h-full">
            <pre>{JSON.stringify(manifest, null, 2)}</pre>
          </div>
        ) : (
          <div className="space-y-3">
             {/* AI PROPOSAL */}
             <AnimatePresence mode="wait">
               {proposal && (
                 <motion.div 
                   initial={{ scale: 0.9, opacity: 0, y: 10 }} 
                   animate={{ scale: 1, opacity: 1, y: 0 }} 
                   exit={{ scale: 0.9, opacity: 0 }}
                   className="p-5 bg-blue-600 rounded-[2rem] border border-white/20 shadow-xl"
                 >
                   <div className="flex items-center gap-2 mb-3 text-white/70 text-[10px] font-bold uppercase tracking-widest">
                     <Sparkles size={12} /> AI Insight
                   </div>
                   <p className="text-xs font-bold text-white mb-4 leading-relaxed">{proposal.rationale}</p>
                   <div className="flex gap-2">
                     <button onClick={approve} className="flex-1 bg-white text-blue-600 py-3 rounded-xl font-black text-[10px] uppercase hover:bg-blue-50 transition-colors">Approve</button>
                     <button onClick={reject} className="p-3 bg-black/20 text-white rounded-xl hover:bg-black/30 transition-colors"><X size={14}/></button>
                   </div>
                 </motion.div>
               )}
             </AnimatePresence>

             {/* Customers Table */}
             <div className="p-5 bg-white/5 rounded-[2rem] border border-white/5">
                <h4 className="text-[10px] font-bold text-slate-500 uppercase mb-4 flex items-center gap-2 tracking-widest">
                  <User size={12}/> Active Customers
                </h4>
                <div className="space-y-2">
                  {manifest.customers?.length > 0 ? (
                    manifest.customers.map((c: any, i: number) => (
                      <div key={i} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 transition-colors">
                        <div className="flex flex-col">
                          <span className="font-bold text-sm text-white">{c.name}</span>
                          <span className="text-[10px] text-slate-500">{c.phone}</span>
                        </div>
                        <span className="px-2 py-1 bg-blue-500/10 text-blue-400 rounded-lg text-[10px] font-bold uppercase">{c.service}</span>
                      </div>
                    ))
                  ) : (
                    <div className="p-4 text-center text-slate-600 text-[10px] italic">No active customers found</div>
                  )}
                </div>
             </div>
          </div>
        )}
      </div>
    </div>
  );
}

function LoadingScreen() {
  return (
    <div className="h-screen bg-[#020617] flex flex-col items-center justify-center gap-6">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-blue-500/20 rounded-full" />
        <div className="absolute top-0 left-0 w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
      <p className="text-blue-500 font-black text-[10px] tracking-[0.4em] uppercase animate-pulse">Initializing Nielapp Brain...</p>
    </div>
  );
}
