"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, Clock, Check, ChevronLeft, Sparkles } from "lucide-react";
import { format, addDays, isSameDay, startOfDay } from "date-fns";
import { he } from "date-fns/locale";

export default function AvailabilityCalendarBlock({ content, layout, data }: any) {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const weekDays = useMemo(() => {
    return Array.from({ length: 7 }).map((_, i) => addDays(startOfDay(new Date()), i));
  }, []);

  const availableSlots = ["09:00", "10:00", "11:00", "12:00", "14:00", "15:00", "16:00"];

  const handleDateChange = (date: Date) => {
    setLoading(true);
    setSelectedDate(date);
    setSelectedSlot(null);
    setTimeout(() => setLoading(false), 600);
  };

  return (
    <div 
      className="relative overflow-hidden bg-white/80 dark:bg-black/40 backdrop-blur-3xl border border-white/40 dark:border-white/10 shadow-2xl p-6"
      style={{ borderRadius: layout?.radius || 28 }}
    >
      {/* --- 1. Luxury Shimmer Layer --- */}
      <motion.div
        initial={{ x: "-150%" }}
        animate={{ x: "150%" }}
        transition={{ duration: 4, repeat: Infinity, ease: "linear", repeatDelay: 2 }}
        className="absolute inset-0 pointer-events-none z-0 bg-gradient-to-r from-transparent via-white/10 dark:via-white/5 to-transparent -skew-x-12"
      />

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h3 className="text-xl font-black italic tracking-tighter">{content.title}</h3>
            <div className="flex items-center gap-2">
              <motion.div 
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-2 h-2 bg-green-500 rounded-full"
              />
              <p className="text-[10px] opacity-50 uppercase font-bold tracking-widest">
                {content.subtitle}
              </p>
            </div>
          </div>
          <div className="p-3 bg-green-500/10 rounded-2xl text-green-600">
            <Calendar size={20} />
          </div>
        </div>

        {/* Date Picker */}
        <div className="flex gap-3 overflow-x-auto pb-4 mb-6 no-scrollbar">
          {weekDays.map((date) => {
            const isSelected = isSameDay(date, selectedDate);
            return (
              <motion.button
                key={date.toISOString()}
                whileTap={{ scale: 0.9 }}
                onClick={() => handleDateChange(date)}
                className={`flex flex-col items-center min-w-[65px] py-4 rounded-3xl border transition-all duration-500 ${
                  isSelected 
                  ? "bg-green-600 border-green-500 text-white shadow-xl" 
                  : "bg-white/50 dark:bg-white/5 border-white/20 text-slate-400"
                }`}
              >
                <span className="text-[10px] font-bold uppercase mb-1">{format(date, "EEE", { locale: he })}</span>
                <span className="text-lg font-black italic">{format(date, "d")}</span>
              </motion.button>
            );
          })}
        </div>

        {/* Slots Grid */}
        <div className="min-h-[220px]">
          <AnimatePresence mode="wait">
            {loading ? (
              <div className="h-[200px] flex items-center justify-center">
                <div className="w-10 h-10 border-4 border-green-500 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : (
              <motion.div 
                initial="hidden" animate="visible"
                variants={{
                  visible: { transition: { staggerChildren: 0.05 } }
                }}
                className="grid grid-cols-3 gap-3"
              >
                {availableSlots.map((slot, index) => (
                  <motion.button
                    key={slot}
                    variants={{
                      hidden: { opacity: 0, y: 10 },
                      visible: { opacity: 1, y: 0 }
                    }}
                    whileHover={{ y: -3 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => setSelectedSlot(slot)}
                    className={`py-4 rounded-2xl font-black text-sm relative transition-all ${
                      selectedSlot === slot 
                      ? "bg-slate-900 dark:bg-white text-white dark:text-black shadow-2xl" 
                      : "bg-white/50 dark:bg-white/10 border border-black/5 dark:border-white/5"
                    }`}
                  >
                    {slot}
                    
                    {/* --- 2. Pulse for Recommendation (First Slot) --- */}
                    {index === 0 && !selectedSlot && (
                      <motion.div 
                        animate={{ scale: [1, 1.1, 1], opacity: [0, 0.5, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                        className="absolute inset-0 bg-green-500 rounded-2xl"
                      />
                    )}

                    {selectedSlot === slot && (
                      <motion.div layoutId="check" className="absolute -top-1 -right-1 bg-green-500 text-white p-1 rounded-full shadow-lg">
                        <Check size={10} strokeWidth={4} />
                      </motion.div>
                    )}
                  </motion.button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Action Button with Oscillation */}
        <motion.button
          animate={selectedSlot ? { y: [0, -4, 0] } : {}}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className={`w-full mt-8 py-5 rounded-3xl font-black text-lg flex items-center justify-center gap-3 transition-all ${
            selectedSlot ? "bg-green-600 text-white shadow-2xl shadow-green-500/30" : "bg-slate-200 dark:bg-white/5 text-slate-400"
          }`}
        >
          <span>שריין תור {selectedSlot && `ל-${selectedSlot}`}</span>
          <ChevronLeft size={20} />
        </motion.button>
      </div>
    </div>
  );
}
