/* app/studio/chat-agent/[trialId]/page.tsx */
"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useChatLogic } from "@/lib/chat-logic";
import dynamic from "next/dynamic";
import { LayoutDashboard, Database, Eye, Send, Sparkles, X, BrainCircuit } from "lucide-react";

const TemplateEngine = dynamic(() => import("./TemplateEngine"), { ssr: false });

export default function NielappStudioPage() {
  const { trialId } = useParams();
  const { manifest, proposal, isProcessing, sendAnswer, approveProposal, rejectProposal } = useChatLogic(trialId as string);
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
        <div className="w-[340px] h-[680px] bg-white rounded-[3.5rem] border-[12px] border-slate-800 shadow-2xl relative overflow-hidden flex flex-col">
          <div className="h-8 bg-white flex items-center justify-center pt-2 relative z-10">
            <div className="w-16 h-5 bg-slate-800 rounded-b-2xl" />
          </div>

          <TemplateEngine manifest={manifest} trialId={trialId as string} />

          <div className="p-4 bg-white/80 backdrop-blur-md border-t border-slate-100 relative z-20">
            <div className="flex gap-2">
              <input value={input} onChange={e => setInput(e.target.value)} className="flex-1 bg-slate-100 rounded-xl p-3 text-xs text-slate-900 outline-none" placeholder="שאל את ה-AI..." />
              <button onClick={() => { sendAnswer(input); setInput(""); }} style={{ backgroundColor: manifest.appConfig?.theme?.primaryColor || "#3b82f6" }} className="p-3 text-white rounded-xl"><Send size={14} /></button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ... (קומפוננטות ה-BrainConsole וה-LoadingScreen נשארות כפי שהיו קודם)
