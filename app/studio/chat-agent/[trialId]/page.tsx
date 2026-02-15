/* app/studio/chat-agent/[trialId]/page.tsx */
"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import { useChatLogic } from "@/lib/chat-logic";
import { BrainCircuit, Activity, Sparkles, Send } from "lucide-react";

export default function NielappChatStudio() {
  const { trialId } = useParams();
  const { manifest, isProcessing, sendAnswer } = useChatLogic(trialId as string);
  const [input, setInput] = useState("");

  // הגנה: אם אין מניפסט או שהוא בתהליך יצירה ראשוני
  if (!manifest) return (
    <div className="h-screen bg-[#020617] flex flex-col items-center justify-center gap-4">
      <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      <div className="text-blue-500 font-black uppercase tracking-[0.3em] text-xs">Initializing Brain...</div>
    </div>
  );

  // חילוץ השאלה הבאה בצורה בטוחה
  const currentQuestion = manifest.questions?.[0]?.text || "איך אוכל לעזור לעסק שלך היום?";

  return (
    <div className="h-screen bg-[#020617] text-white flex overflow-hidden font-sans" dir="rtl">
      
      {/* --- SIDEBAR: BRAIN CONSOLE --- */}
      <div className="w-1/3 border-l border-white/10 bg-black/40 backdrop-blur-2xl p-8 overflow-y-auto flex flex-col">
        <div className="flex items-center gap-3 mb-10">
          <div className="p-3 bg-blue-600/20 rounded-2xl border border-blue-500/30">
            <BrainCircuit className="text-blue-400" size={24}/>
          </div>
          <h2 className="text-xl font-black italic uppercase">Brain Console</h2>
        </div>

        <div className="bg-white/5 p-6 rounded-[2rem] border border-white/5 overflow-hidden flex flex-col flex-1">
           <pre className="text-[10px] font-mono text-emerald-400/80 overflow-y-auto">
             {JSON.stringify(manifest, null, 2)}
           </pre>
        </div>
      </div>

      {/* --- MAIN: IPHONE SIMULATOR --- */}
      <div className="flex-1 flex flex-col items-center justify-center relative bg-slate-900">
        <div className="w-[340px] h-[680px] bg-white rounded-[3rem] border-[12px] border-slate-800 shadow-2xl relative overflow-hidden flex flex-col">
          
          {/* Top Notch */}
          <div className="h-8 bg-white flex items-center justify-center pt-2">
            <div className="w-16 h-5 bg-slate-800 rounded-b-2xl" />
          </div>

          <div className="flex-1 flex flex-col bg-slate-50">
             <div className="flex-1 p-8 flex flex-col items-center justify-center text-center">
               <div className="w-16 h-16 bg-blue-600 rounded-3xl mb-6 flex items-center justify-center text-white shadow-2xl">
                 <Sparkles size={32} className="animate-pulse" />
               </div>
               <h3 className="text-xl font-black text-slate-900 mb-2">
                 {currentQuestion}
               </h3>
               <p className="text-[10px] text-blue-600 font-bold uppercase tracking-widest opacity-60">Nielapp AI Agent</p>
             </div>

             <div className="p-6 bg-white border-t border-slate-100">
               <input 
                 value={input} 
                 onChange={e => setInput(e.target.value)}
                 className="w-full bg-slate-100 border-none rounded-2xl p-5 text-sm text-slate-900 outline-none focus:ring-2 ring-blue-500 transition-all"
                 placeholder="הקלד/י כאן..."
               />
               <button 
                 onClick={() => { sendAnswer(input); setInput(""); }}
                 disabled={isProcessing || !input}
                 className="w-full mt-3 bg-blue-600 text-white p-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-3 active:scale-95 transition-all disabled:opacity-50"
               >
                 {isProcessing ? "Analyzing..." : "Send Message"}
               </button>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
