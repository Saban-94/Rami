"use client";
import { motion } from "framer-motion";
import { Syringe, Bell, Check } from "lucide-react";

export default function VaccineRecordBlock({ content, data, layout }: any) {
  const safeContent = {
    title: content?.title || "פנקס חיסונים דיגיטלי",
    subtitle: content?.subtitle || "מעקב ותזכורות לחיסונים"
  };

  const records = data?.records || [
    { id: 1, name: "חיסון כלבת", date: "2026-03-12", status: "upcoming" },
    { id: 2, name: "משושה", date: "2025-12-01", status: "done" }
  ];

  return (
    <div 
      className="bg-white/70 dark:bg-black/40 backdrop-blur-2xl border border-white/40 dark:border-white/10 p-6 shadow-2xl"
      style={{ borderRadius: layout?.radius || 28 }}
    >
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-xl font-black italic">{safeContent.title}</h3>
        <Bell className="text-amber-500 animate-bounce" size={18} />
      </div>

      <div className="space-y-3">
        {records.map((r: any) => (
          <div key={r.id} className="flex items-center justify-between p-4 bg-white/40 dark:bg-white/5 rounded-2xl border border-white/20">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${r.status === 'done' ? 'bg-green-500/10 text-green-500' : 'bg-amber-500/10 text-amber-500'}`}>
                {r.status === 'done' ? <Check size={16}/> : <Syringe size={16}/>}
              </div>
              <span className="font-bold text-sm">{r.name}</span>
            </div>
            <span className="text-[10px] font-mono opacity-50">{r.date}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
