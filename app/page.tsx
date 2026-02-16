"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Rocket, Zap, Star, HeartPulse, Scissors, Car,
  Moon, Sun, Activity, Sparkles
} from "lucide-react";
import Link from "next/link";

// וודא שהרכיבים האלו קיימים בנתיב המדויק
import Navigation from "@/components/Navigation";
import ContactSection from "@/components/ContactSection";

const BUSINESS_SAMPLES = [
  {
    type: "מרפאת שיניים",
    brand: "Nile-App",
    color: "#4DA3FF",
    icon: <HeartPulse className="text-blue-500" />,
    events: ["הלבנה - 08:15", "טיפול שורש - 10:30"]
  },
  {
    type: "מוסך מומחים",
    brand: "AutoMaster",
    color: "#F7D96F",
    icon: <Car className="text-amber-500" />,
    events: ["טיפול 10K - 09:00", "החלפת בלמים - 12:00"]
  },
  {
    type: "מספרת בוטיק",
    brand: "Glow Hair",
    color: "#D19CFF",
    icon: <Scissors className="text-purple-500" />,
    events: ["תספורת גבר - 14:00", "עיצוב זקן - 15:30"]
  }
];

const googleReviews = [
  {
    name: "ד״ר שן - Nile App",
    role: "מרפאת שיניים",
    text: "ה-AI סוגר תורים בשעות הלילה. חסכנו חצי משרה של פקידה.",
    avatar: "https://i.pravatar.cc/150?img=11"
  },
  {
    name: "עמאר אומן",
    role: "מעצב שיער",
    text: "הלקוחות פשוט שולחים הודעה והתור נסגר לבד. שקט נפשי מלא.",
    avatar: "https://i.pravatar.cc/150?img=12"
  },
  {
    name: "רוני שמש",
    role: "מוסך TurboFix",
    text: "שקיפות מלאה מול הלקוח. המערכת הכי יציבה שעבדתי איתה.",
    avatar: "https://i.pravatar.cc/150?img=13"
  }
];

export default function SabanOSHome() {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [activeBiz, setActiveBiz] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveBiz((prev) => (prev + 1) % BUSINESS_SAMPLES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const themeClass = isDarkMode ? "bg-[#020510] text-white" : "bg-slate-50 text-slate-900";

  return (
    <div className={`min-h-screen transition-colors duration-700 overflow-x-hidden ${themeClass}`} dir="rtl">
      <Navigation />
      
      {/* כפתור החלפת מצב */}
      <button 
        onClick={() => setIsDarkMode(!isDarkMode)}
        className="fixed bottom-10 left-10 z-[100] p-4 rounded-full bg-green-500 text-black shadow-2xl hover:scale-110 transition-all focus:outline-none"
      >
        {isDarkMode ? <Sun size={24} /> : <Moon size={24} />}
      </button>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16">
        <div className="flex-1 space-y-8 z-10 text-right">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 text-green-500 text-[10px] font-black uppercase border border-green-500/20">
            <Sparkles size={14} /> SabanOS AI Enterprise v3.0
          </div>
          
          <h1 className="text-6xl md:text-[85px] font-black leading-[0.85] italic tracking-tighter">
            העסק שלך <br /> <span className="text-green-500">ב-Autopilot.</span>
          </h1>
          
          <p className="text-xl max-w-xl opacity-70 italic">
            ניהול חכם למרפאות, מוסכים ומספרות. ה-AI שמנהל תורים ולקוחות בזמן שאתה עובד.
          </p>
          
          <div className="pt-4">
            <Link href="/trial" className="inline-flex px-12 py-6 bg-green-600 text-white font-black rounded-[2.5rem] text-2xl shadow-2xl hover:bg-green-500 transition-all">
              צור סטודיו עכשיו
            </Link>
          </div>
        </div>

        {/* iPhone Simulator */}
        <div className="flex-1 relative flex justify-center">
          <div className={`relative border-[12px] rounded-[4rem] h-[650px] w-[320px] shadow-2xl overflow-hidden transition-all ${isDarkMode ? 'border-slate-800 bg-black' : 'border-slate-200 bg-white'}`}>
             <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-7 bg-slate-800 rounded-b-3xl z-50" />
             
             <AnimatePresence mode="wait">
                <motion.div 
                  key={activeBiz}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="p-6 pt-12 h-full flex flex-col"
                >
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center border border-white/10">
                        {BUSINESS_SAMPLES[activeBiz].icon}
                      </div>
                      <span className={`text-[10px] font-black uppercase ${isDarkMode ? 'text-white' : 'text-black'}`}>{BUSINESS_SAMPLES[activeBiz].brand}</span>
                    </div>
                    <Activity size={14} className="text-green-500" />
                  </div>

                  <div className="space-y-4">
                    {BUSINESS_SAMPLES[activeBiz].events.map((e, idx) => (
                      <div key={idx} className={`p-4 rounded-2xl border ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-100'}`}>
                        <p className="text-xs font-bold" style={{ color: BUSINESS_SAMPLES[activeBiz].color }}>{e}</p>
                        <p className="text-[10px] opacity-40 mt-1 italic">סונכרן ע"י SabanOS AI</p>
                      </div>
                    ))}
                  </div>

                  <div className="mt-auto p-4 bg-black rounded-2xl border border-white/5 font-mono text-[8px] text-green-500">
                    <p className="opacity-50 uppercase tracking-tighter">[AI Auditor Active]</p>
                    <p>{`> Syncing CRM Data...`}</p>
                  </div>
                </motion.div>
             </AnimatePresence>
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section className={`py-24 ${isDarkMode ? 'bg-black/40' : 'bg-white'}`}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col items-center mb-16 gap-4 text-center">
            <img src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_\"G\"_Logo.svg" className="w-10 h-10" alt="G" />
            <h2 className="text-4xl font-black italic uppercase tracking-tighter">דירוג גוגל SabanOS</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {googleReviews.map((rev, i) => (
              <motion.div 
                key={i}
                whileHover={{ y: -10 }}
                className={`p-8 rounded-[3rem] border transition-all ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200 shadow-xl'}`}
              >
                <div className="flex items-center gap-4 mb-6 text-right">
                  <img src={rev.avatar} className="w-12 h-12 rounded-full border-2 border-green-500" alt={rev.name} />
                  <div>
                    <div className="flex text-yellow-500 gap-0.5 mb-1">
                      {[...Array(5)].map((_, j) => <Star key={j} size={12} fill="currentColor" />)}
                    </div>
                    <p className="font-black italic text-xs leading-none">{rev.name}</p>
                  </div>
                </div>
                <p className="text-sm font-medium italic leading-relaxed opacity-80 text-right">"{rev.text}"</p>
                <p className="text-[9px] font-black uppercase text-green-500 mt-6 tracking-widest text-right">{rev.role}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <ContactSection />
    </div>
  );
}
