"use client";

import React from "react";
import { motion } from "framer-motion";

export default function MobilePreview({ manifest }: { manifest: any }) {
  // חילוץ צבע הגדרות או ברירת מחדל ירוקה
  const primaryColor = manifest?.appConfig?.theme?.primaryColor || "#10b981";
  const businessName = manifest?.businessName || "העסק שלך";

  return (
    <div className="relative group scale-90 lg:scale-100 transition-transform">
      {/* מסגרת המכשיר החכמה */}
      <div className="w-[300px] h-[600px] bg-[#0f172a] rounded-[3rem] border-[8px] border-[#1e293b] shadow-[0_0_50px_rgba(0,0,0,0.3)] overflow-hidden relative ring-1 ring-white/10">
        
        {/* Notch - האי הדינמי */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-6 bg-[#1e293b] rounded-b-2xl z-50" />
        
        {/* מסך האפליקציה */}
        <div className="h-full w-full bg-white flex flex-col overflow-hidden">
          
          {/* Header דינמי */}
          <div 
            className="pt-12 pb-6 px-6 text-white transition-colors duration-500"
            style={{ backgroundColor: primaryColor }}
          >
            <div className="w-10 h-10 bg-white/20 rounded-xl mb-3 backdrop-blur-md" />
            <h4 className="text-lg font-black italic leading-tight uppercase tracking-tighter">
              {businessName}
            </h4>
          </div>

          {/* גוף האפליקציה - סימולציה של Wix */}
          <div className="flex-1 p-5 space-y-4 overflow-y-auto">
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="h-32 rounded-2xl bg-slate-50 border-2 border-dashed border-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-400 uppercase italic text-center px-4"
            >
              Hero Section - באנר ראשי
            </motion.div>
            
            <div className="grid grid-cols-2 gap-3">
              <div className="h-20 rounded-xl bg-slate-50 border border-slate-100" />
              <div className="h-20 rounded-xl bg-slate-50 border border-slate-100" />
            </div>

            <div className="h-40 rounded-2xl bg-slate-50 border border-slate-100 p-4 space-y-2">
               <div className="h-2 w-20 bg-slate-200 rounded" />
               <div className="h-2 w-full bg-slate-100 rounded" />
               <div className="h-2 w-full bg-slate-100 rounded" />
            </div>
          </div>

          {/* Bottom Navigation */}
          <div className="h-20 border-t border-slate-100 flex justify-around items-center px-6 bg-white/90 backdrop-blur-sm">
            <div className="w-5 h-5 rounded-full bg-slate-200" />
            <div 
               className="w-12 h-12 rounded-2xl shadow-lg -mt-10 flex items-center justify-center transition-transform hover:scale-110"
               style={{ backgroundColor: primaryColor }}
            >
              <div className="w-5 h-5 bg-white/30 rounded-lg" />
            </div>
            <div className="w-5 h-5 rounded-full bg-slate-200" />
          </div>
        </div>
      </div>

      {/* תגית סטטוס */}
      <div className="absolute -top-4 -right-4 bg-emerald-500 text-white text-[10px] font-black px-3 py-1 rounded-full shadow-xl animate-pulse border-2 border-white dark:border-slate-900">
        LIVE SYNC
      </div>
    </div>
  );
}
