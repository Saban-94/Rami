"use client";

import React, { Suspense } from "react";
import dynamic from "next/dynamic";
import { useParams } from "next/navigation";

// ייבוא דינמי של הקומפוננטות כדי למנוע שגיאות Server-Side ב-Vercel
const BrainConsole = dynamic(() => import("./BrainConsoleComponent"), { 
  ssr: false,
  loading: () => <div className="p-8 animate-pulse text-blue-500">Loading Console...</div>
});

const iPhoneSimulator = dynamic(() => import("./iPhoneSimulatorComponent"), { 
  ssr: false 
});

// שימוש ב-Hook של הנתונים
import { useChatLogic } from "@/lib/chat-logic";

export default function NielappStudioPage() {
  const params = useParams();
  const trialId = params?.trialId as string;
  const { manifest, proposal, isProcessing, sendAnswer, approveProposal, rejectProposal } = useChatLogic(trialId);

  if (!manifest) {
    return (
      <div className="h-screen bg-[#020617] flex flex-col items-center justify-center gap-6">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-blue-500 font-black text-xs uppercase tracking-[0.4em] animate-pulse">
          Initializing Nielapp Brain...
        </p>
      </div>
    );
  }

  return (
    <div className="h-screen bg-[#020617] text-white flex overflow-hidden font-sans" dir="rtl">
      
      {/* SIDEBAR - BRAIN CONSOLE */}
      <div className="w-1/3 border-l border-white/10 hidden md:block">
        <BrainConsole manifest={manifest} proposal={proposal} approve={approveProposal} reject={rejectProposal} />
      </div>

      {/* MAIN - IPHONE SIMULATOR */}
      <div className="flex-1 bg-[#0f172a] relative flex items-center justify-center">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-transparent opacity-50" />
        <iPhoneSimulator 
          manifest={manifest} 
          isProcessing={isProcessing} 
          sendAnswer={sendAnswer} 
        />
      </div>

    </div>
  );
}
