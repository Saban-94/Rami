"use client";
import React from "react";
import { Truck } from "lucide-react";

export default function LiveFleetMap({ focusedLeadId }: { focusedLeadId?: string }) {
  return (
    <div className="w-full h-full min-h-[300px] bg-slate-800 rounded-[2rem] relative flex items-center justify-center overflow-hidden border border-white/5">
      <div className="absolute inset-0 opacity-20 bg-[url('https://www.google.com/maps/vt/pb=!1m4!1m3!1i12!2i2448!3i1612!2m3!1e0!2sm!3i407105169!3m8!2she!3sis!5e1105!12m4!1e68!2m2!1sset!2sRoadmap!4e0!5m1!1f2!2m3!1e0!2sm!3i407105169')] bg-cover" />
      <div className="relative z-10 flex flex-col items-center gap-2">
        <Truck className="text-blue-500 animate-pulse" size={40} />
        <span className="text-[10px] font-black text-white/50 tracking-widest uppercase">GPS Live Signal</span>
      </div>
    </div>
  );
}
