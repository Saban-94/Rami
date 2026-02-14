"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, Clock, Check, ChevronLeft, Sparkles } from "lucide-react";
import { format, addDays, isSameDay, startOfDay } from "date-fns";
import { he } from "date-fns/locale";

// --- רכיב חלקיק קונפטי בודד ---
const Particle = ({ color, x, y, delay }: any) => (
  <motion.div
    initial={{ x: 0, y: 0, scale: 0, rotate: 0 }}
    animate={{ 
      x: x, 
      y: y, 
      scale: [0, 1, 0.4], 
      rotate: Math.random() * 360 
    }}
    transition={{ duration: 0.9, delay: delay, ease: [0.23, 1, 0.32, 1] }}
    className="absolute w-2 h-2 rounded-sm backdrop-blur-md border border-white/30 z-50"
    style={{ backgroundColor: color }}
  />
);

export default function AvailabilityCalendarBlock({ content, layout }: any) {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");
  const [particles, setParticles] = useState<any[]>([]);

  const weekDays = useMemo(() => {
    return Array.from({ length: 7 }).map((_, i) => addDays(startOfDay(new Date()), i));
  }, []);

  const availableSlots = ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00"];

  const handleBooking = () => {
    setStatus("loading");
    
    // סימולציה של סגירת תור מול ה-Firestore
    setTimeout(() => {
      setStatus("success");
      
      // יצירת פיצוץ קונפטי של 25 חלקיקים
      const newParticles = Array.from({ length: 25 }).map((_, i) => ({
        id: i,
        color: ["#22c55e", "#ffffff", "#4ade80"][Math.floor(Math.random() * 3)],
        x: (Math.random() - 0.5) * 250,
        y: (Math.random() - 0.5) * 250 - 50,
        delay: Math.random() * 0.1
      }));
      setParticles(newParticles);

      // איפוס אחרי חגיגה
      setTimeout(() => {
        setStatus("idle");
        setParticles([]);
        setSelectedSlot(null);
      }, 4000);
    }, 1500);
  };

  return (
    <motion.div 
      animate={{ y: [0, -3, 0] }}
      transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      className="relative overflow-hidden bg-white/80 dark:bg-black/40 backdrop-blur-3xl border border-white/40 dark:border-white/10 shadow-2xl p-6"
      style={{ borderRadius: layout?.radius || 28 }}
    >
      {/* 1. Shimmer Layer */}
      <motion.div
        className="absolute inset-0 z-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
        animate={{ x: ["-150%", "150%"] }}
        transition={{ duration: 5, repeat: Infinity, ease: "linear", repeatDelay: 2 }}
      />

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-xl font-black italic tracking-tighter">{content.title}</h3>
          <motion.div 
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-[10px] bg-green-500/10 text-green-600 px-3 py-1 rounded-full font-black uppercase italic"
          >
            Live Sync
          </motion.div>
        </div>

        {/* Date Picker */}
        <div className="flex gap-3 overflow-x-auto pb-4 mb-6 no-scrollbar">
          {weekDays.map((date) => {
            const isSelected = isSameDay(date, selectedDate);
            return (
              <button
                key={date.toISOString()}
                onClick={() => setSelectedDate(date)}
                className={`flex flex-col items-center min-w-[60px] py-4 rounded-3xl border transition-all duration-500 ${
                  isSelected ? "bg-green-600 border-green-500 text-white shadow-xl" : "bg-white/50 border-white/20 text-slate-400"
                }`}
              >
                <span className="text-[10px] font-bold uppercase mb-1">{format(date, "EEE", { locale: he })}</span>
                <span className="text-lg font-black italic">{format(date, "d")}</span>
              </button>
            );
          })}
        </div>

        {/* Slots Grid */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          {availableSlots.map((slot, idx) => (
            <motion.button
              key={slot}
              onClick={() => setSelectedSlot(slot)}
              animate={idx === 0 && !selectedSlot ? { scale: [1, 1.03, 1], borderColor: ["rgba(34,197,94,0.1)", "rgba(34,197,94,0.5)", "rgba(34,197,94,0.1)"] } : {}}
              transition={{ duration: 2, repeat: Infinity }}
              className={`py-4 rounded-2xl font-black text-sm transition-all border ${
                selectedSlot === slot ? "bg-slate-900 text-white border-slate-900" : "bg-white/40 border-black/5"
              }`}
            >
              {slot}
            </motion.button>
          ))}
        </div>

        {/* 2. Success Confetti Particles */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
          <AnimatePresence>
            {status === "success" && particles.map(p => (
              <Particle key={p.id} {...p} />
            ))}
          </AnimatePresence>
        </div>

        {/* Action Button */}
        <motion.button
          onClick={handleBooking}
          disabled={!selectedSlot || status !== "idle"}
          className={`w-full py-5 rounded-3xl font-black text-lg flex items-center justify-center gap-3 transition-all relative overflow-hidden ${
            status === "success" ? "bg-emerald-500 text-white" : 
            selectedSlot ? "bg-green-600 text-white shadow-2xl shadow-green-500/30" : "bg-slate-200 text-slate-400"
          }`}
        >
          <AnimatePresence mode="wait">
            {status === "loading" ? (
              <motion.div key="l" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin" />
            ) : status === "success" ? (
              <motion.div key="s" initial={{ scale: 0.5 }} animate={{ scale: 1 }} className="flex items-center gap-2">
                <Check size={22} strokeWidth={4} /> <span>התור נקבע!</span>
              </motion.div>
            ) : (
              <motion.div key="i" className="flex items-center gap-2">
                <span>שריין ל-{selectedSlot || "..."}</span> <ChevronLeft size={20} />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>
      </div>
    </motion.div>
  );
}
