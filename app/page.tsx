"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Zap, Activity, ShieldCheck, Calendar, Users, 
  ShoppingBag, Sparkles, Smartphone, Terminal, 
  MessageSquare, CheckCircle2, HeartPulse, Scissors, Car
} from "lucide-react";
import Link from "next/link";

// רכיבי עזר פנימיים
import Navigation from "@/components/Navigation";
import ContactSection from "@/components/ContactSection";

const BUSINESS_SAMPLES = [
  {
    type: "מרפאת שיניים",
    brand: "Nile-App",
    presenter: "ד״ר שן",
    icon: <HeartPulse className="text-blue-400" />,
    events: [
      { time: "08:15", title: "הלבנה", status: "אושר אוטומטית", color: "#66F2C2" },
      { time: "10:30", title: "טיפול שורש", status: "AI קבע תור", color: "#4DA3FF" }
    ]
  },
  {
    type: "מוסך מקצועי",
    brand: "Auto-Master",
    presenter: "רמי מנהל המערכת",
    icon: <Car className="text-amber-500" />,
    events: [
      { time: "09:00", title: "טיפול 10K", status: "סונכרן מהצ'אט", color: "#F7D96F" },
      { time: "11:00", title: "החלפת בלמים", status: "אושר ב-SMS", color: "#66F2C2" }
    ]
  },
  {
    type: "מספרת בוטיק",
    brand: "Glow-Cut",
    presenter: "עמאר אומן",
    icon: <Scissors className="text-purple-500" />,
    events: [
      { time: "14:30", title: "תספורת ועיצוב", status: "לקוח חדש מהלינק", color: "#D19CFF" },
      { time: "16:00", title: "צבע פרימיום", status: "בוטל אוטומטית", color: "#FF7272" }
    ]
  }
];

export default function SabanOSPremiumHome() {
  const [activeBiz, setActiveBiz] = useState(0);

  // החלפת סימולציות עסקית כל 6 שניות
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveBiz((prev) => (prev + 1) % BUSINESS_SAMPLES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <main className="min-h-screen bg-[#020510] text-white text-right overflow-x-hidden" dir="rtl">
      <Navigation />

      {/* Hero Section עם המוח התלת-ממדי */}
      <section className="relative pt-32 pb-24 px-6 overflow-hidden">
        {/* רקע חי (Live Background) */}
        <div className="absolute top-0 left-0 w-full h-full opacity-30">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-green-500/20 blur-[150px] rounded-full animate-pulse" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/20 blur-[150px] rounded-full" />
        </div>

        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16 relative z-10">
          
          <motion.div 
            initial={{ opacity: 0, x: 50 }} 
            animate={{ opacity: 1, x: 0 }} 
            className="flex-1 space-y-8"
          >
            <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-green-500/10 text-green-500 text-xs font-black uppercase tracking-widest border border-green-500/20 backdrop-blur-md">
              <Zap size={14} className="animate-bounce" /> SabanOS AI Brain Active
            </div>
            
            <h1 className="text-6xl md:text-[90px] font-black leading-[0.9] tracking-tighter italic">
              תן ל-AI לנהל <br /> 
              <span className="text-green-500">בלי לגעת בכלום.</span>
            </h1>
            
            <p className="text-xl text-slate-400 max-w-xl leading-relaxed font-medium italic">
              המערכת של {BUSINESS_SAMPLES[activeBiz].brand} כבר חושבת בשבילך. תורים, לקוחות וקטלוגים – הכל מנוהל על ידי המוח המרכזי.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6">
              <Link href="/trial" className="px-14 py-6 bg-green-600 text-white font-black rounded-[2.5rem] text-xl shadow-[0_20px_50px_rgba(22,163,74,0.3)] hover:scale-105 transition-all flex items-center gap-3">
                הפעל את המוח העסקי <Sparkles size={20} />
              </Link>
            </div>
          </motion.div>

          {/* iPhone Simulation Page */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }} 
            animate={{ opacity: 1, scale: 1 }} 
            className="flex-1 relative"
          >
            {/* Simulation Header */}
            <div className="absolute -top-12 left-1/2 -translate-x-1/2 text-center w-full">
                <span className="text-[10px] font-black uppercase text-green-500 tracking-[0.5em] block mb-2">Simulating Workspace</span>
                <h3 className="text-2xl font-black italic">{BUSINESS_SAMPLES[activeBiz].type}</h3>
            </div>

            {/* iPhone Frame */}
            <div className="relative mx-auto border-[12px] border-[#1e293b] rounded-[4rem] h-[720px] w-[340px] shadow-[0_0_100px_rgba(0,0,0,1)] bg-black overflow-hidden backdrop-blur-3xl">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-7 bg-[#1e293b] rounded-b-3xl z-50" />
              
              <AnimatePresence mode="wait">
                <motion.div 
                  key={activeBiz}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="h-full bg-[#020617] p-6 pt-12 overflow-y-auto custom-scrollbar"
                >
                  <div className="flex items-center justify-between mb-8 border-b border-white/5 pb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/10">
                        {BUSINESS_SAMPLES[activeBiz].icon}
                      </div>
                      <span className="text-xs font-black uppercase tracking-widest">{BUSINESS_SAMPLES[activeBiz].brand}</span>
                    </div>
                    <Activity size={16} className="text-green-500" />
                  </div>

                  {/* AI Status Banner */}
                  <div className="bg-green-600/10 border border-green-600/20 p-4 rounded-2xl mb-6 text-center">
                    <p className="text-[10px] text-green-500 font-black uppercase flex items-center justify-center gap-2">
                      <Zap size={10} /> AI Agent: {BUSINESS_SAMPLES[activeBiz].presenter}
                    </p>
                  </div>

                  {/* Smart Appointments List */}
                  <div className="space-y-3">
                    {BUSINESS_SAMPLES[activeBiz].events.map((event, i) => (
                      <motion.div 
                        key={i}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.2 }}
                        className="p-4 bg-white/5 border rounded-2xl flex items-center justify-between"
                        style={{ borderColor: `${event.color}33` }}
                      >
                        <div>
                          <p className="text-[10px] font-black" style={{ color: event.color }}>{event.time}</p>
                          <p className="text-sm font-bold">{event.title}</p>
                        </div>
                        <div className="text-[9px] font-black uppercase opacity-40 italic">{event.status}</div>
                      </motion.div>
                    ))}
                  </div>

                  {/* Glassmorphism Log */}
                  <div className="mt-8 p-4 bg-white/5 rounded-2xl border border-white/5 font-mono text-[8px] space-y-1">
                    <p className="text-blue-400">[08:15] Recognizing Customer...</p>
                    <p className="text-green-500">[08:15] CRM Identified: Saban-94</p>
                    <p className="text-amber-400">[08:16] AI confirmed 🦷 Health Update</p>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
            
            {/* Glow */}
            <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-64 h-20 blur-[80px] bg-green-500/30 opacity-50" />
          </motion.div>
        </div>
      </section>

      {/* System Auditor Section (המלשינון) */}
      <section className="py-24 max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div className="p-10 bg-black/40 border border-white/5 rounded-[3.5rem] font-mono text-sm backdrop-blur-2xl shadow-2xl overflow-hidden relative group">
            <div className="absolute top-0 right-0 p-4"><Terminal size={18} className="text-green-500" /></div>
            <div className="space-y-3 opacity-60">
              <p className="text-green-500">[SYSTEM] SabanOS Auditor v3.0 Initialized</p>
              <p>[09:21:04] AI_BRAIN: Analyzing traffic for Dental Clinic...</p>
              <p className="text-blue-400">[09:22:15] CRM: 4 New Magic Link registrations</p>
              <p className="text-purple-400">[09:23:01] CALENDAR: Auto-confirming 14:00 session</p>
              <p className="animate-pulse">_</p>
            </div>
          </div>
          <div className="space-y-6">
            <h2 className="text-5xl font-black italic uppercase tracking-tighter">המלשינון <br /><span className="text-green-500">של המערכת.</span></h2>
            <p className="text-slate-400 text-lg italic">כל פעולה, כל תור, כל לקוח – הכל מתועד בשקיפות מלאה. השקט הנפשי שאתה צריך כדי לנהל אימפריה.</p>
          </div>
        </div>
      </section>

      <ContactSection />
    </main>
  );
}
