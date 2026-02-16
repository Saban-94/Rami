"use client";

import React from "react";
import { motion } from "framer-motion";

export default function MobilePreview({ manifest }: { manifest: any }) {
  const primaryColor = manifest?.appConfig?.theme?.primaryColor || "#10b981";

  return (
    <div className="relative group">
      {/* מסגרת האייפון */}
      <div className="w-[300px] h-[620px] bg-slate-900 rounded-[3.5rem] border-[10px] border-slate-800 shadow-[0_0_80px_rgba(0,0,0,0.5)] overflow-hidden relative ring-4 ring-white/5">
        
        {/* ה-Notch */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-7 bg-slate-800 rounded-b-3xl z-40" />
        
        {/* תוכן האפליקציה */}
        <div className="h-full w-full bg-white overflow-y-auto flex flex-col" style={{ fontFamily: 'Assistant, sans-serif' }}>
          
          {/* Header */}
          <div className="pt-12 pb-6 px-6" style={{ backgroundColor: primaryColor }}>
            <div className="w-12 h-12 bg-white/20 rounded-2xl mb-4 backdrop-blur-md" />
            <h4 className="text-white text-xl font-black italic uppercase leading-tight">{manifest?.businessName || "Your Business"}</h4>
          </div>

          {/* Dynamic Content Sections */}
          <div className="p-6 space-y-6">
            <div className="h-32 rounded-3xl bg-slate-100 flex items-center justify-center italic text-slate-300 font-bold border-2 border-dashed border-slate-200 uppercase text-[10px]">
              Hero Banner Section
            </div>
            <div className="grid grid-cols-2 gap-4">
               <div className="h-24 rounded-2xl bg-slate-50 border border-slate-100" />
               <div className="h-24 rounded-2xl bg-slate-50 border border-slate-100" />
            </div>
          </div>
          
          {/* Bottom Nav */}
          <div className="mt-auto border-t border-slate-100 p-6 flex justify-between items-center bg-white/80 backdrop-blur-md">
             <div className="w-6 h-6 rounded-full bg-slate-200" />
             <div className="w-6 h-6 rounded-full bg-slate-200" />
             <div className="w-10 h-10 rounded-2xl shadow-lg" style={{ backgroundColor: primaryColor }} />
          </div>
        </div>
      </div>
      
      {/* תגית מצב LIVE */}
      <div className="absolute -top-6 -right-6 bg-red-600 text-white px-4 py-1 rounded-full text-[10px] font-black uppercase animate-pulse shadow-xl">
        Live Sync
      </div>
    </div>
  );
}
