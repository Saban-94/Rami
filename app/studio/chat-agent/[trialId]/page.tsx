/* app/studio/chat-agent/[trialId]/page.tsx */
"use client";

import React from "react";
import { useParams } from "next/navigation";
import { useChatLogic } from "@/lib/chat-logic";
import { BrainCircuit, Sparkles } from "lucide-react";

export default function StudioPage() {
  const params = useParams();
  const trialId = params.trialId as string;
  const { manifest } = useChatLogic(trialId);

  if (!manifest) {
    return (
      <div className="h-screen bg-[#020617] flex flex-col items-center justify-center gap-4 text-blue-500 font-bold">
        <div className="w-10 h-10 border-4 border-current border-t-transparent rounded-full animate-spin" />
        <p className="animate-pulse">INITIALIZING NIELAPP BRAIN...</p>
      </div>
    );
  }

  return (
    <div className="h-screen bg-[#020617] text-white flex overflow-hidden" dir="rtl">
      {/* Sidebar: Console */}
      <div className="w-1/3 border-l border-white/10 bg-black/40 p-8 hidden md:flex flex-col">
        <div className="flex items-center gap-3 mb-8">
          <BrainCircuit className="text-blue-400" />
          <h2 className="font-black uppercase tracking-widest">Brain Console</h2>
        </div>
        <div className="flex-1 bg-black/50 rounded-2xl p-4 font-mono text-[10px] text-emerald-400 overflow-auto border border-white/5">
          <pre>{JSON.stringify(manifest, null, 2)}</pre>
        </div>
      </div>

      {/* Main Area: iPhone */}
      <div className="flex-1 flex items-center justify-center bg-slate-900/50">
        <div className="w-[320px] h-[640px] bg-white rounded-[3rem] border-[10px] border-slate-800 shadow-2xl overflow-hidden flex flex-col relative">
          <div className="h-6 bg-white flex justify-center items-end">
            <div className="w-20 h-4 bg-slate-800 rounded-b-xl" />
          </div>
          <div className="flex-1 bg-slate-50 flex flex-col p-6 items-center justify-center text-center">
            <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg mb-6">
              <Sparkles className="text-white" />
            </div>
            <h3 className="text-slate-900 font-black text-xl mb-2">
              {manifest.businessName || "העסק שלך"}
            </h3>
            <p className="text-slate-500 text-sm">המערכת מוכנה להתאמה אישית</p>
          </div>
          <div className="p-4 bg-white border-t border-slate-100">
            <div className="h-12 bg-slate-100 rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  );
}
