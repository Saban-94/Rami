"use client";
import { motion } from "framer-motion";
import { useState, useMemo } from "react";
import { Smartphone, Wrench, CheckCircle2 } from "lucide-react";

export default function LaboratoryFormBlock({ content, data, layout }: any) {
  const [form, setForm] = useState({ brand: "", model: "", issue: "מסך שבור" });
  const [status, setStatus] = useState("idle");

  const safeContent = {
    title: content?.title || "מעבדת תיקונים",
    subtitle: content?.subtitle || "אבחון והערכת מחיר מהירה",
    submitLabel: content?.submitLabel || "שלח בקשת תיקון"
  };

  const estimate = useMemo(() => {
    if (!form.brand || !form.model) return null;
    return "₪150 - ₪450"; // כאן תבוא לוגיקה מול data.matrix
  }, [form.brand, form.model]);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      className="bg-white/70 dark:bg-black/40 backdrop-blur-2xl border border-white/40 dark:border-white/10 p-6 shadow-2xl"
      style={{ borderRadius: layout?.radius || 28 }}
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-blue-500/10 rounded-2xl text-blue-600"><Wrench size={20}/></div>
        <div>
          <h3 className="text-xl font-black italic">{safeContent.title}</h3>
          <p className="text-[10px] opacity-40 uppercase font-bold">{safeContent.subtitle}</p>
        </div>
      </div>

      <div className="space-y-4">
        <input 
          placeholder="מותג (למשל Apple)"
          onChange={(e) => setForm({...form, brand: e.target.value})}
          className="w-full p-4 rounded-2xl bg-white/50 dark:bg-white/5 border border-white/20 outline-none focus:ring-2 ring-blue-500/30 transition-all"
        />
        <input 
          placeholder="דגם (למשל iPhone 13)"
          onChange={(e) => setForm({...form, model: e.target.value})}
          className="w-full p-4 rounded-2xl bg-white/50 dark:bg-white/5 border border-white/20 outline-none focus:ring-2 ring-blue-500/30 transition-all"
        />
        
        {estimate && (
          <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-2xl text-center">
            <p className="text-xs font-bold opacity-60">הערכת מחיר משוערת</p>
            <p className="text-2xl font-black text-blue-600 italic">{estimate}</p>
          </motion.div>
        )}

        <button className="w-full py-5 bg-slate-900 dark:bg-white text-white dark:text-black rounded-[2rem] font-black shadow-xl hover:scale-[1.02] transition-all">
          {safeContent.submitLabel}
        </button>
      </div>
    </motion.div>
  );
}
