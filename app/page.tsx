"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Rocket, Zap, Star, HeartPulse, Scissors, Car,
  Moon, Sun, Activity, Sparkles
} from "lucide-react";
import Link from "next/link";

import Navigation from "@/components/Navigation";
import ContactSection from "@/components/ContactSection";

const SAMPLES = [
  {
    type: "Clinic",
    brand: "Nile-App",
    color: "#4DA3FF",
    icon: <HeartPulse size={20} className="text-blue-500" />,
    events: ["הלבנה - 08:15", "טיפול שורש - 10:30"]
  },
  {
    type: "Garage",
    brand: "AutoMaster",
    color: "#F7D96F",
    icon: <Car size={20} className="text-amber-500" />,
    events: ["טיפול 10K - 09:00", "החלפת בלמים - 12:00"]
  }
];

export default function HomePage() {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [activeIdx, setActiveIdx] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIdx((prev) => (prev + 1) % SAMPLES.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const themeClass = isDarkMode ? "bg-[#020510] text-white" : "bg-slate-50 text-slate-900";

  return (
    <div className={`min-h-screen transition-colors duration-700 ${themeClass}`} dir="rtl">
      <Navigation />
      
      <button 
        onClick={() => setIsDarkMode(!isDarkMode)}
        className="fixed bottom-10 left-10 z-[100] p-4 rounded-full bg-green-500 text-black shadow-2xl"
      >
        {isDarkMode ? <Sun size={24} /> : <Moon size={24} />}
      </button>

      <section className="relative pt-32 pb-20 px-6 max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16">
        <div className="flex-1 space-y-8 text-right">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 text-green-500 text-[10px] font-black uppercase border border-green-500/20">
            <Sparkles size={14} /> SabanOS Enterprise v3.0
          </div>
          
          <h1 className="text-6xl md:text-[85px] font-black leading-[0.85] italic tracking-tighter">
            העסק שלך <br /> <span className="text-green-500">באוטומט מלא.</span>
          </h1>
          
          <p className="text-xl max-w-xl opacity-70 italic">
            הבינה המלאכותית שמנהלת תורים ולקוחות בזמן שאתה עובד.
          </p>
          
          <div className="pt-4">
            <Link href="/trial" className="inline-flex px-12 py-6 bg-green-600 text-white font-black rounded-[2.5rem] text-2xl shadow-2xl transition-all">
              התחל עכשיו
            </Link>
          </div>
        </div>

        <div className="flex-1 relative flex justify-center">
          <div className={`relative border-[12px] rounded-[4rem] h-[650px] w-[320px] shadow-2xl overflow-hidden ${isDarkMode ? 'border-slate-800 bg-black' : 'border-slate-200 bg-white'}`}>
             <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-7 bg-slate-800 rounded-b-3xl z-50" />
             
             <AnimatePresence mode="wait">
                <motion.div 
                  key={activeIdx}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="p-6 pt-12 h-full flex flex-col"
                >
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center border border-white/10">
                        {SAMPLES[activeIdx].icon}
                      </div>
                      <span className="text-[10px] font-black uppercase">{SAMPLES[activeIdx].brand}</span>
                    </div>
                    <Activity size={14} className="text-green-500" />
                  </div>

                  <div className="space-y-4">
                    {SAMPLES[activeIdx].events.map((e, i) => (
                      <div key={i} className={`p-4 rounded-2xl border ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-100'}`}>
                        <p className="text-xs font-bold" style={{ color: SAMPLES[activeIdx].color }}>{e}</p>
                        <p className="text-[10px] opacity-40 mt-1 italic">סונכרן אוטומטית</p>
                      </div>
                    ))}
                  </div>
                </motion.div>
             </AnimatePresence>
          </div>
        </div>
      </section>

      <ContactSection />
    </div>
  );
}
