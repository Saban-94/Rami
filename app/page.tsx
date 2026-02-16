"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Rocket, Zap, Star, CheckCircle2, HeartPulse, Scissors, Car,
  Smartphone, MessageSquare, Calendar, Sparkles, Moon, Sun, Activity
} from "lucide-react";
import Link from "next/link";

// רכיבים חיצוניים
import Navigation from "@/components/Navigation";
import ContactSection from "@/components/ContactSection";

const BUSINESS_SAMPLES = [
  {
    type: "מרפאת שיניים",
    brand: "Nile-App",
    presenter: "ד״ר שן",
    icon: <HeartPulse className="text-blue-500" />,
    color: "#4DA3FF",
    events: ["הלבנה - 08:15", "טיפול שורש - 10:30"]
  },
  {
    type: "מוסך מומחים",
    brand: "AutoMaster",
    presenter: "רמי המנהל",
    icon: <Car className="text-amber-500" />,
    color: "#F7D96F",
    events: ["טיפול 10K - 09:00", "החלפת בלמים - 12:00"]
  },
  {
    type: "מספרת בוטיק",
    brand: "Glow Hair",
    presenter: "עמאר אומן",
    icon: <Scissors className="text-purple-500" />,
    color: "#D19CFF",
    events: ["תספורת גבר - 14:00", "עיצוב זקן - 15:30"]
  }
];

const googleReviews = [
  {
    name: "ד״ר שן - Nile App",
    role: "מרפאת שיניים",
    text: "ה-AI סוגר תורים בשעות הלילה כשהמרפאה סגורה. חסכנו חצי משרה של פקידת קבלה.",
    avatar: "https://i.pravatar.cc/150?img=11"
  },
  {
    name: "עמאר אומן",
    role: "מעצב שיער",
    text: "הלקוחות פשוט שולחים הודעה והתור נסגר לבד. המלשינון נותן שקט שאף תור לא מתפספס.",
    avatar: "https://i.pravatar.cc/150?img=12"
  },
  {
    name: "רוני שמש",
    role: "מוסך TurboFix",
    text: "שקיפות מלאה מול הלקוח. המערכת הכי יציבה ומתקדמת שעבדתי איתה.",
    avatar: "https://i.pravatar.cc/150?img=13"
  }
];

export default function SabanOSProductionHome() {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [activeBiz, setActiveBiz] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setActiveBiz((prev) => (prev + 1) % BUSINESS_SAMPLES.length), 5000);
    return () => clearInterval(timer);
  }, []);

  const themeClass = isDarkMode ? "bg-[#020510] text-white" : "bg-white text-slate-900";

  return (
    <main className={`min-h-screen transition-colors duration-700 overflow-x-hidden ${themeClass}`} dir="rtl">
      <Navigation />
      
      {/* כפתור החלפת מצב צף */}
      <button 
        onClick={() => setIsDarkMode(!isDarkMode)}
        className="fixed bottom-10 left-10 z-[100] p-4 rounded-full bg-green-500 text-black shadow-2xl hover:scale-110 transition-all"
      >
        {isDarkMode ? <Sun size={24} /> : <Moon size={24} />}
      </button>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16">
        <div className="flex-1 space-y-8 relative z-10">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 text-green-500 text-xs font-black uppercase border border-green-500/20">
            <Sparkles size={14} /> SabanOS AI Enterprise v3.0
          </motion.div>
          
          <h1 className="text-7xl md:text-[100px] font-black leading-[0.85] italic tracking-tighter">
            העסק שלך <br /> <span className="text-green-500">ב-Autopilot.</span>
          </h1>
          
          <p className={`text-xl max-w-xl italic ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
            ניהול חכם למרפאות, מוסכים ומספרות. ה-AI שמנהל תורים, לקוחות ומכירות בזמן שאתה מתפנה לעבודה.
          </p>
          
          <Link href="/trial" className="inline-flex px-12 py-6 bg-green-600 text-white font-black rounded-[2.5rem] text-2xl shadow-2xl hover:bg-green-500 transition-all">
            צור סטודיו עכשיו
          </Link>
        </div>

        {/* Simulator iPhone */}
        <div className="flex-1 relative">
          <div className={`relative mx-auto border-[12px] rounded-[4rem] h-[680px] w-[330px] shadow-2xl overflow-hidden transition-all ${isDarkMode ? 'border-slate-800 bg-black' : 'border-slate-200 bg-slate-50'}`}>
             <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-7 bg-slate-800 rounded-b-3xl z-50" />
             
             <AnimatePresence mode="wait">
                <motion.div 
                  key={activeBiz}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="p-6 pt-12 h-full"
                >
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/10">
                        {BUSINESS_SAMPLES[activeBiz].icon}
                      </div>
                      <span className={`text-xs font-black uppercase ${isDarkMode ? 'text-white' : 'text-black'}`}>{BUSINESS_SAMPLES[activeBiz].brand}</span>
                    </div>
                    <Activity size={14} className="text-green-500" />
                  </div>

                  <div className="space-y-4">
                    <p className="text-[10px] opacity-40 font-bold uppercase tracking-widest">יומן פגישות יומי</p>
                    {BUSINESS_SAMPLES[activeBiz].events.map((e, i) => (
                      <div key={i} className={`p-4 rounded-2xl border ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200 shadow-sm'}`}>
                        <p className="text-xs font-bold" style={{ color: BUSINESS_SAMPLES[activeBiz].color }}>{e}</p>
                        <p className="text-[10px] opacity-50 mt-1">אושר אוטומטית ע"י SabanOS</p>
                      </div>
                    ))}
                  </div>

                  {/* AI Status Terminal */}
                  <div className="mt-12 p-4 bg-black rounded-2xl border border-white/5 font-mono text-[8px] text-green-500 space-y-1">
                    <p className="opacity-50 tracking-tighter uppercase">[AI Auditor Active]</p>
                    <p>{`> Capturing Client Data`}</p>
                    <p>{`> CRM Synced: NileApp`}</p>
                  </div>
                </motion.div>
             </AnimatePresence>
          </div>
        </div>
      </section>

      {/* Google Reviews Section */}
      <section className={`py-24 ${isDarkMode ? 'bg-black/20' : 'bg-slate-100'}`}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col items-center mb-16 gap-4">
            <img src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_\"G\"_Logo.svg" className="w-10 h-10" alt="G" />
            <h2 className="text-4xl font-black italic uppercase tracking-tighter">דירוג הלקוחות שלנו</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {googleReviews.map((rev, i) => (
              <motion.div 
                key={i}
                whileHover={{ y: -10 }}
                className={`p-8 rounded-[3rem] border transition-all ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200 shadow-xl'}`}
              >
                <div className="flex items-center gap-4 mb-6">
                  <img src={rev.avatar} className="w-14 h-14 rounded-full border-2 border-green-500" alt={rev.name} />
                  <div>
                    <div className="flex text-yellow-500 gap-0.5 mb-1">
                      {[...Array(5)].map((_, j) => <Star key={j} size={14} fill="currentColor" />)}
                    </div>
                    <p className="font-black italic text-sm">{rev.name}</p>
                  </div>
                </div>
                <p className="text-sm font-medium italic leading-relaxed opacity-80">"{rev.text}"</p>
                <p className="text-[10px] font-black uppercase text-green-500 mt-6 tracking-widest">{rev.role} • Google Review</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <ContactSection />
    </main>
  );
}
