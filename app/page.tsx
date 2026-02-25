"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Rocket, Zap, Star, HeartPulse, Truck, Map, 
  Moon, Sun, Activity, Sparkles, ClipboardCheck, Phone
} from "lucide-react";
import Link from "next/link";

import Navigation from "@/components/Navigation";
import ContactSection from "@/components/ContactSection";

const SAMPLES = [
  {
    type: "Logistics",
    brand: "הובלות אבו ראסם",
    color: "#3B82F6", // Blue
    icon: <Truck size={20} className="text-blue-500" />,
    events: ["הובלה לטייבה - 09:00", "דירת 3 חדרים - 13:00"],
    special: "חישוב מסלול AI פעיל 🚛"
  },
  {
    type: "Clinic",
    brand: "DentalCare Pro",
    color: "#10B981", // Green
    icon: <HeartPulse size={20} className="text-emerald-500" />,
    events: ["הלבנה - 08:15", "טיפול שורש - 10:30"],
    special: "סנכרון תורים אוטומטי 🦷"
  }
];

export default function HomePage() {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [activeIdx, setActiveIdx] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIdx((prev) => (prev + 1) % SAMPLES.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const themeClass = isDarkMode ? "bg-[#020510] text-white" : "bg-slate-50 text-slate-900";

  return (
    <div className={`min-h-screen transition-colors duration-700 ${themeClass}`} dir="rtl">
      <Navigation />
      
      <button 
        onClick={() => setIsDarkMode(!isDarkMode)}
        className="fixed bottom-10 left-10 z-[100] p-4 rounded-full bg-blue-600 text-white shadow-2xl"
      >
        {isDarkMode ? <Sun size={24} /> : <Moon size={24} />}
      </button>

      <section className="relative pt-32 pb-20 px-6 max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16">
        <div className="flex-1 space-y-8 text-right">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 text-blue-500 text-[10px] font-black uppercase border border-blue-500/20">
            <Sparkles size={14} /> SabanOS Enterprise v3.0
          </div>
          
          <h1 className="text-6xl md:text-[80px] font-black leading-[0.9] italic tracking-tighter">
            הובלות ועסקים <br /> <span className="text-blue-600">באוטומט מלא.</span>
          </h1>
          
          <div className="space-y-4 max-w-xl">
            <p className="text-xl opacity-70 italic font-medium leading-relaxed">
              תן ל-AI לבנות לך הצעות מחיר אוטומטיות, לחשב מסלול לכל הובלה, ולנהל את המעברים במקומך.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Link href="/trial/bL8blHgaXlwfp88qLhFO" className="inline-flex items-center justify-center px-10 py-5 bg-blue-600 text-white font-black rounded-[2rem] text-xl shadow-2xl hover:scale-105 transition-all">
              צור אפליקציה לעסק שלך עוד היום
            </Link>
          </div>
        </div>

        {/* Mockup iPhone Simulation */}
        <div className="flex-1 relative flex justify-center">
          <div className={`relative border-[10px] rounded-[3.5rem] h-[620px] w-[300px] shadow-[0_0_60px_rgba(59,130,246,0.15)] overflow-hidden ${isDarkMode ? 'border-slate-800 bg-black' : 'border-slate-200 bg-white'}`}>
             <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-6 bg-slate-800 rounded-b-2xl z-50" />
             
             <AnimatePresence mode="wait">
                <motion.div 
                  key={activeIdx}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.05 }}
                  className="p-5 pt-10 h-full flex flex-col"
                >
                  {/* Brand Header */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                      <div className="w-9 h-9 rounded-xl bg-slate-800 flex items-center justify-center border border-white/10">
                        {SAMPLES[activeIdx].icon}
                      </div>
                      <span className="text-xs font-black uppercase italic tracking-tighter">{SAMPLES[activeIdx].brand}</span>
                    </div>
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-ping" />
                  </div>

                  {/* Order / Lead Simulation */}
                  <div className="bg-blue-600/10 border border-blue-500/20 p-4 rounded-2xl mb-4">
                    <p className="text-[10px] font-bold text-blue-500 uppercase">הצעת מחיר AI אחרונה</p>
                    <p className="text-lg font-black italic">₪1,075.00</p>
                  </div>

                  <div className="space-y-3">
                    <p className="text-[10px] font-bold opacity-40 uppercase">לו"ז פעיל להיום</p>
                    {SAMPLES[activeIdx].events.map((e, i) => (
                      <div key={i} className={`p-4 rounded-xl border flex flex-col gap-1 ${isDarkMode ? 'bg-white/5 border-white/5' : 'bg-slate-50 border-slate-100'}`}>
                        <p className="text-xs font-black">{e}</p>
                        <div className="flex items-center gap-1 opacity-40">
                          <ClipboardCheck size={10} />
                          <span className="text-[9px] italic">נאשר ונשלח לינק מעקב</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-auto bg-green-500/10 border border-green-500/20 p-3 rounded-xl flex items-center gap-2">
                    <Zap size={14} className="text-green-500" />
                    <span className="text-[9px] font-black text-green-500 uppercase tracking-widest">{SAMPLES[activeIdx].special}</span>
                  </div>
                </motion.div>
             </AnimatePresence>
          </div>
          
          {/* Floating Element: Live Map Info */}
          <motion.div 
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="absolute -right-10 top-1/2 bg-white text-slate-900 p-4 rounded-2xl shadow-2xl border border-slate-100 hidden md:block"
          >
            <Map className="text-blue-600 mb-1" size={24} />
            <p className="text-[10px] font-black italic text-nowrap">ציר הובלה בזמן אמת</p>
          </motion.div>
        </div>
      </section>

      <ContactSection />
    </div>
  );
}
