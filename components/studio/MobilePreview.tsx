"use client";

import React from "react";
import { motion } from "framer-motion";

export default function MobilePreview({ manifest }: { manifest: any }) {
  const primaryColor = manifest?.appConfig?.theme?.primaryColor || "#10b981";
  const businessName = manifest?.businessName || "Your Brand";

  return (
    <div className="relative group scale-90 lg:scale-100 transition-all duration-700">
      {/* Device Frame */}
      <div className="w-[300px] h-[600px] bg-[#0f172a] rounded-[3.5rem] border-[10px] border-[#1e293b] shadow-[0_0_80px_rgba(0,0,0,0.5)] overflow-hidden relative ring-1 ring-white/10">
        
        {/* Dynamic Island / Notch */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-7 bg-[#1e293b] rounded-b-3xl z-50" />
        
        {/* App Content */}
        <div className="h-full w-full bg-white flex flex-col overflow-hidden">
          
          {/* Brand Header */}
          <div 
            className="pt-14 pb-8 px-6 text-white transition-colors duration-1000 shadow-lg"
            style={{ backgroundColor: primaryColor }}
          >
            <div className="w-12 h-12 bg-white/20 rounded-2xl mb-4 backdrop-blur-md border border-white/10" />
            <h4 className="text-xl font-black italic leading-none uppercase tracking-tighter">
              {businessName}
            </h4>
            <p className="text-[8px] opacity-60 mt-1 uppercase font-bold tracking-widest">Official Application</p>
          </div>

          {/* Canvas Simulation */}
          <div className="flex-1 p-6 space-y-5 overflow-y-auto">
            <motion.div 
              layout
              className="h-32 rounded-[2rem] bg-slate-50 border-2 border-dashed border-slate-200 flex items-center justify-center text-[10px] font-black text-slate-300 uppercase italic px-6 text-center"
            >
              Main Content Area
            </motion.div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="h-24 rounded-2xl bg-slate-50 border border-slate-100 shadow-sm" />
              <div className="h-24 rounded-2xl bg-slate-50 border border-slate-100 shadow-sm" />
            </div>
          </div>

          {/* Navigation Bar */}
          <div className="h-24 border-t border-slate-100 flex justify-around items-center px-8 bg-white/90 backdrop-blur-xl">
            <div className="w-6 h-6 rounded-full bg-slate-100" />
            <motion.div 
               whileHover={{ scale: 1.1 }}
               className="w-14 h-14 rounded-2xl shadow-2xl -mt-12 flex items-center justify-center border-4 border-white transition-transform"
               style={{ backgroundColor: primaryColor }}
            >
              <div className="w-6 h-6 bg-white/30 rounded-lg" />
            </motion.div>
            <div className="w-6 h-6 rounded-full bg-slate-100" />
          </div>
        </div>
      </div>

      {/* Status Badge */}
      <div className="absolute -top-4 -right-4 bg-emerald-500 text-white text-[10px] font-black px-4 py-1.5 rounded-full shadow-2xl animate-pulse border-2 border-white dark:border-slate-900">
        SYNCING...
      </div>
    </div>
  );
}
