/* components/ClientHome.tsx */
"use client";

import React from "react";
import { motion } from "framer-motion";
import { Sparkles, ArrowLeft, ArrowRight } from "lucide-react";

interface ClientHomeProps {
  dict: any;
  lang: string;
  initialManifest: any;
}

export default function ClientHome({ dict, lang, initialManifest }: ClientHomeProps) {
  const isRtl = lang === "he";

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-white text-center">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl p-10 bg-white/5 border border-white/10 rounded-[3rem] backdrop-blur-3xl shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)]"
      >
        <div className="w-20 h-20 bg-blue-600 rounded-3xl mx-auto mb-8 flex items-center justify-center shadow-2xl shadow-blue-500/20">
          <Sparkles size={40} className="text-white animate-pulse" />
        </div>

        <h1 className="text-5xl font-black mb-4 tracking-tighter bg-gradient-to-r from-blue-400 via-indigo-400 to-emerald-400 bg-clip-text text-transparent">
          {initialManifest?.brandTag || dict.welcome}
        </h1>

        <p className="text-slate-400 text-lg font-medium mb-10 max-w-md mx-auto leading-relaxed">
          {initialManifest?.description || "מערכת ההפעלה העסקית שלך מבוססת בינה מלאכותית"}
        </p>

        <div className="flex flex-col gap-4">
          <button className="w-full bg-blue-600 hover:bg-blue-500 text-white py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all active:scale-95 shadow-xl shadow-blue-600/20">
            {dict.setup_complete}
          </button>
          
          <div className="flex items-center justify-center gap-2 text-slate-500 text-[10px] font-bold uppercase tracking-widest mt-4">
            <div className="w-8 h-[1px] bg-white/10" />
            POWERED BY NIELAPP ENGINE
            <div className="w-8 h-[1px] bg-white/10" />
          </div>
        </div>
      </motion.div>

      {/* רקע דקורטיבי */}
      <div className="fixed top-0 left-0 w-full h-full -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-600/10 blur-[120px] rounded-full" />
      </div>
    </div>
  );
}
