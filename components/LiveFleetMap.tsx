"use client";
import React from "react";
import { Truck } from "lucide-react";

export default function LiveFleetMap({ focusedLeadId }: { focusedLeadId?: string }) {
  return (
    <div className="w-full h-full min-h-[300px] rounded-[2rem] relative flex items-center justify-center overflow-hidden border border-white/5 map-placeholder">
      <div className="relative z-10 flex flex-col items-center gap-2">
        <div className="bg-blue-600/20 p-4 rounded-full animate-pulse">
          <Truck className="text-blue-500" size={40} />
        </div>
        <span className="text-[10px] font-black text-white/30 tracking-widest uppercase italic">
          GPS Signal: Active
        </span>
      </div>
    </div>
  );
}
