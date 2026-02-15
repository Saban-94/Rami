"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useChatLogic } from "@/lib/chat-logic";
import { motion, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";
import { 
  BrainCircuit, LayoutDashboard, Moon, Sun, ChevronDown, 
  ChevronUp, Clock, User, Palette, Eye, Send, Sparkles, X, Activity, Database
} from "lucide-react";

// ייבוא דינמי של מנוע התבניות
const TemplateEngine = dynamic(() => import("./TemplateEngine"), { ssr: false });

export default function NielappStudioPage() {
  const params = useParams();
  const trialId = params?.trialId as string;
  const { manifest, proposal, isProcessing, sendAnswer, approveProposal, rejectProposal } = useChatLogic(trialId);
  const [isClient, setIsClient] = useState(false);
  const [input, setInput] = useState("");

  useEffect(() => { setIsClient(true); }, []);

  if (!isClient || !manifest) return <LoadingScreen />;

  return (
    <div className="h-screen bg-[#020617] text-white flex overflow-hidden font-sans" dir="rtl">
      
      {/* SIDEBAR: BRAIN CONSOLE */}
      <div className="w-1/3 border-l border-white/10 hidden md:block overflow-y-auto bg-black/20">
        <BrainConsole manifest={manifest} proposal={proposal} approve={approveProposal} reject={rejectProposal} />
      </div>

      {/* MAIN: IPHONE SIMULATOR */}
      <div className="flex-1 bg-[#0f172a] relative flex items-center justify-center">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-transparent opacity-50" />
        
        <div className="w-[340px] h-[680px] bg-white rounded-[3.5rem] border-[12px] border-slate-800 shadow-2xl relative overflow-hidden flex flex-col">
          <div className="h-8 bg-white flex items-center justify-center pt-2 relative z-10">
            <div className="w-16 h-5 bg-slate-800 rounded-b-2xl" />
          </div>

          {/* מנוע התבניות רץ כאן */}
          <TemplateEngine manifest={manifest} />

          {/* צ'אט צף בתחתית הסימולטור */}
          <div className="p-4 bg-white/80 backdrop-blur-md border-t border-slate-100 relative z-20">
            <div className="flex gap-2">
              <input 
                value={input} 
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && (sendAnswer(input), setInput(""))}
                className="flex-1 bg-slate-100 rounded-xl p-3 text-xs text-slate-900 outline-none focus:ring-2 ring-blue-500"
                placeholder="שאל את ה-AI..."
              />
              <button 
                onClick={() => { sendAnswer(input); setInput(""); }}
                disabled={isProcessing}
                style={{ backgroundColor: manifest.appConfig?.theme?.primaryColor || "#3b82f6" }}
                className="p-3 text-white rounded-xl shadow-lg active:scale-95 transition-all disabled:opacity-50"
              >
                <Send size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function BrainConsole({ manifest, proposal, approve, reject }: any) {
  const [viewMode, setViewMode] = useState<'visual' | 'raw'>('visual');

  return (
    <div className="h-full flex flex-col">
      <div className="p-6 border-b border-white/10 flex items-center justify-between sticky top-0 bg-[#020617] z-10">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-600 rounded-lg"><LayoutDashboard size={18} /></div>
          <h2 className="font-black text-xs uppercase tracking-widest">Intelligence</h2>
        </div>
        <div className="flex bg-white/5 p-1 rounded-lg border border-white/10">
          <button onClick={() => setViewMode('visual')} className={`p-2 rounded-md ${viewMode === 'visual' ? 'bg-blue-600 text-white' : 'text-slate-400'}`}><Database size={14}/></button>
          <button onClick={() => setViewMode('raw')} className={`p-2 rounded-md ${viewMode === 'raw' ? 'bg-blue-600 text-white' : 'text-slate-400'}`}><Eye size={14}/></button>
        </div>
      </div>

      <div className="flex-1 p-4 space-y-4">
        {viewMode === 'raw' ? (
          <pre className="p-4 bg-black/40 rounded-2xl text-[10px] text-blue-300 font-mono overflow-auto h-[500px]">
            {JSON.stringify(manifest, null, 2)}
          </pre>
        ) : (
          <div className="space-y-4">
             <AnimatePresence>
               {proposal && (
                 <motion.div initial={{scale:0.9, opacity:0}} animate={{scale:1, opacity:1}} className="p-5 bg-blue-600 rounded-[2rem] border border-white/20 shadow-xl">
                   <p className="text-xs font-bold mb-4 leading-relaxed">{proposal.rationale}</p>
                   <div className="flex gap-2">
                     <button onClick={approve} className="flex-1 bg-white text-blue-600 py-3 rounded-xl font-black text-[10px] uppercase">Approve Patch</button>
                     <button onClick={reject} className="p-3 bg-black/20 rounded-xl"><X size={14}/></button>
                   </div>
                 </motion.div>
               )}
             </AnimatePresence>

             <div className="p-5 bg-white/5 rounded-[2rem] border border-white/5">
                <h4 className="text-[10px] font-bold text-slate-500 uppercase mb-4 flex items-center gap-2"><User size={12}/> Business Customers</h4>
                <div className="space-y-2">
                  {manifest.customers?.map((c: any, i: number) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-white/5 rounded-xl text-[11px]">
                      <span className="font-bold text-white">{c.name}</span>
                      <span className="text-blue-400 font-mono">{c.phone}</span>
                    </div>
                  ))}
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
      <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      <p className="text-blue-500 font-black text-[10px] tracking-[0.3em] uppercase">Initializing SabanOS Brain...</p>
    </div>
  );
}
