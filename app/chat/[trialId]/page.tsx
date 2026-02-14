"use client";

import React, { useState, useEffect } from "react";
import { motion, useAnimationControls } from "framer-motion";
import confetti from "canvas-confetti"; // תתקין: npm install canvas-confetti
import { Check, ChevronLeft, Sparkles } from "lucide-react";

export default function AvailabilityCalendarBlock({ content, layout, data }: any) {
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const badgeControls = useAnimationControls();

  // פונקציית ההצלחה המטורפת
  const triggerSuccess = () => {
    setIsSuccess(true);
    
    // 1. פולסBadge חזק לפני עצירה
    badgeControls.start({
      scale: [1, 1.4, 1],
      backgroundColor: ["rgba(34,197,94,0.1)", "rgba(34,197,94,0.8)", "rgba(34,197,94,0.1)"],
      transition: { duration: 0.4 }
    });

    // 2. קונפטי פרימיום - חלקיקים קטנים ויוקרתיים
    const count = 200;
    const defaults = { origin: { y: 0.7 }, zIndex: 1000 };

    function fire(particleRatio: number, opts: any) {
      confetti({
        ...defaults,
        ...opts,
        particleCount: Math.floor(count * particleRatio),
        colors: ['#22c55e', '#ffffff', '#fbbf24'] // ירוק, לבן, זהב
      });
    }

    fire(0.25, { spread: 26, startVelocity: 55 });
    fire(0.2, { spread: 60 });
    fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
    fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
    fire(0.1, { spread: 120, startVelocity: 45 });

    // 3. עדכון ה-AI בקנבס (לוגיקה חיצונית)
    console.log("AI: תור שוריין בהצלחה! שולח הודעת אישור לעמאר...");
  };

  return (
    <div className="relative overflow-hidden bg-white/80 dark:bg-black/40 backdrop-blur-3xl p-8 rounded-[28px] shadow-2xl border border-white/20">
      
      {/* Header עם ה-Badge המושבת */}
      <div className="flex items-center justify-between mb-10">
        <h3 className="text-2xl font-black italic tracking-tighter">{content.title}</h3>
        <motion.div
          animate={badgeControls}
          className="px-4 py-1.5 rounded-full bg-green-500/10 border border-green-500/20 text-green-600 text-[10px] font-black uppercase tracking-widest shadow-inner"
        >
          {isSuccess ? "שוריין!" : "זמן אמת"}
        </motion.div>
      </div>

      {/* אזור הבחירה - מטושטש אחרי הצלחה */}
      <motion.div animate={{ opacity: isSuccess ? 0.3 : 1, filter: isSuccess ? "blur(4px)" : "blur(0px)" }}>
        {/* ... כאן גריד השעות שלך ... */}
        <div className="grid grid-cols-3 gap-4 mb-10">
           {["09:00", "10:00", "11:00"].map(t => (
             <button key={t} onClick={() => setSelectedSlot(t)} className={`py-4 rounded-2xl font-bold border transition-all ${selectedSlot === t ? 'bg-slate-900 text-white border-slate-900 shadow-xl' : 'bg-white/40 border-white/20'}`}>
                {t}
             </button>
           ))}
        </div>
      </motion.div>

      {/* כפתור הפעולה הראשי */}
      <AnimatePresence mode="wait">
        {!isSuccess ? (
          <motion.button
            key="action-btn"
            disabled={!selectedSlot}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={triggerSuccess}
            className={`w-full py-6 rounded-[2rem] font-black text-xl flex items-center justify-center gap-3 shadow-2xl transition-all ${
              selectedSlot ? "bg-green-600 text-white" : "bg-slate-200 text-slate-400"
            }`}
          >
            <span>שריינו תור ל-{selectedSlot || "..."}</span>
            <ChevronLeft size={24} />
          </motion.button>
        ) : (
          <motion.div
            key="success-msg"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-full py-6 bg-green-500/10 border-2 border-green-500 rounded-[2rem] flex items-center justify-center gap-3 text-green-600 font-black text-xl italic"
          >
            <Check size={28} strokeWidth={4} />
            נתראה בקרוב!
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
