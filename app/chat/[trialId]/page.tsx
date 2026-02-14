"use client";

import React, { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import { Calendar, Clock, Check, ChevronLeft, User, Sparkles } from "lucide-react";
import { format, addDays, isSameDay, startOfDay } from "date-fns";
import { he } from "date-fns/locale";

// --- Animation Variants ---
const containerVariants = {
  hidden: { opacity: 0, height: 0 },
  visible: { 
    opacity: 1, 
    height: "auto",
    transition: { 
      duration: 0.5, 
      ease: [0.16, 1, 0.3, 1], // Custom Apple-style ease
      staggerChildren: 0.04,
      delayChildren: 0.1
    } 
  },
  exit: { opacity: 0, height: 0, transition: { duration: 0.3 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 15, scale: 0.9 },
  visible: { opacity: 1, y: 0, scale: 1 },
};

export default function AvailabilityCalendarBlock({ content, layout, data }: any) {
  const [selectedStaff, setSelectedStaff] = useState(data?.staff?.[0]?.id || "ammar");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const weekDays = useMemo(() => {
    return Array.from({ length: 7 }).map((_, i) => addDays(startOfDay(new Date()), i));
  }, []);

  // דוגמת דאטה מורחבת לתמיכה בצוות
  const staffMembers = [
    { id: "ammar", name: "עמאר", role: "Master Barber", img: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ammar" },
    { id: "itay", name: "איתי", role: "Stylist", img: "https://api.dicebear.com/7.x/avataaars/svg?seed=Itay" },
  ];

  const availableSlots = ["09:00", "10:00", "11:00", "12:00", "14:00", "15:00", "16:00", "17:00"];

  const handleDateChange = (date: Date) => {
    setLoading(true);
    setSelectedDate(date);
    setSelectedSlot(null);
    setTimeout(() => setLoading(false), 600); // סימולציה של Firestore
  };

  return (
    <div 
      className="bg-white/80 dark:bg-black/40 backdrop-blur-3xl border border-white/40 dark:border-white/10 shadow-2xl overflow-hidden"
      style={{ borderRadius: layout?.radius || 28 }}
    >
      {/* 1. Top Section - Staff Picker (Multi-staff support) */}
      <div className="p-6 border-b border-black/5 dark:border-white/5">
        <h3 className="text-xs font-black uppercase tracking-widest opacity-40 mb-4 italic flex items-center gap-2">
          <Sparkles size={12} /> בחרו סטייליסט
        </h3>
        <div className="flex gap-4">
          {staffMembers.map((member) => (
            <button 
              key={member.id}
              onClick={() => setSelectedStaff(member.id)}
              className="relative flex items-center gap-3 p-2 pr-4 rounded-2xl transition-all"
            >
              <div className={`w-12 h-12 rounded-xl overflow-hidden border-2 transition-all ${selectedStaff === member.id ? 'border-green-500 scale-110 shadow-lg' : 'border-transparent opacity-50'}`}>
                <img src={member.img} alt={member.name} className="w-full h-full object-cover" />
              </div>
              <div className="text-right">
                <p className={`text-sm font-black italic ${selectedStaff === member.id ? 'text-green-600' : 'opacity-40'}`}>{member.name}</p>
                <p className="text-[10px] opacity-30 font-bold">{member.role}</p>
              </div>
              {selectedStaff === member.id && (
                <motion.div layoutId="staffActive" className="absolute inset-0 bg-green-500/5 rounded-2xl -z-10" />
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="p-6">
        {/* 2. Date Picker */}
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

        {/* 3. Animated Time Grid (The Reveal) */}
        <div className="min-h-[220px]">
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div 
                key="loading"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="h-[200px] flex items-center justify-center"
              >
                <div className="w-10 h-10 border-4 border-green-500 border-t-transparent rounded-full animate-spin" />
              </motion.div>
            ) : (
              <motion.div 
                key={`${selectedDate.toISOString()}-${selectedStaff}`}
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="grid grid-cols-3 gap-3"
              >
                {availableSlots.map((slot) => (
                  <motion.button
                    key={slot}
                    variants={itemVariants}
                    whileHover={{ y: -3, scale: 1.02 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => setSelectedSlot(slot)}
                    className={`py-4 rounded-2xl font-black text-sm relative transition-all ${
                      selectedSlot === slot 
                      ? "bg-slate-900 dark:bg-white text-white dark:text-black shadow-2xl scale-105" 
                      : "bg-white/50 dark:bg-white/10 border border-black/5 dark:border-white/5"
                    }`}
                  >
                    {slot}
                    {selectedSlot === slot && (
                      <motion.div layoutId="slotCheck" className="absolute -top-1 -right-1 bg-green-500 text-white p-1 rounded-full shadow-lg">
                        <Check size={10} strokeWidth={4} />
                      </motion.div>
                    )}
                  </motion.button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* 4. Action Button */}
        <motion.button
          animate={{ 
            scale: selectedSlot ? 1 : 0.98,
            opacity: selectedSlot ? 1 : 0.6 
          }}
          whileHover={selectedSlot ? { scale: 1.02 } : {}}
          className={`w-full mt-8 py-5 rounded-3xl font-black text-lg flex items-center justify-center gap-3 transition-all ${
            selectedSlot ? "bg-green-600 text-white shadow-2xl shadow-green-500/30" : "bg-slate-200 dark:bg-white/5 text-slate-400"
          }`}
        >
          <span>שריינו תור אצל {staffMembers.find(s => s.id === selectedStaff)?.name}</span>
          <ChevronLeft size={20} />
        </motion.button>
      </div>
    </div>
  );
}
