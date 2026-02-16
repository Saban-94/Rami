"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Rocket, Zap, Star, CheckCircle2, 
  Smartphone, MessageSquare, Bell, Calendar, 
  ShoppingBag, Users, LayoutDashboard, Sparkles
} from "lucide-react";
import Link from "next/link";

// רכיבים
import Navigation from "./components/Navigation";
import ContactSection from "./components/ContactSection";

export default function HomePage() {
  const [demoStep, setDemoStep] = useState(0); // 0: Chat, 1: Calendar, 2: Catalog

  // החלפת שקפים אוטומטית בסימולטור
  useEffect(() => {
    const timer = setInterval(() => {
      setDemoStep((prev) => (prev + 1) % 3);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-[#020617] text-right transition-colors duration-300" dir="rtl">
      <Navigation />

      {/* Hero Section */}
      <section className="relative pt-32 pb-24 px-6 overflow-hidden">
        {/* Background Glows */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-green-500/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/10 blur-[120px] rounded-full" />

        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16">
          
          <motion.div 
            initial={{ opacity: 0, x: 50 }} 
            animate={{ opacity: 1, x: 0 }} 
            className="flex-1 space-y-8 z-10"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-green-500/10 text-green-500 text-xs font-black uppercase tracking-widest border border-green-500/20">
              <Sparkles size={14} /> SabanOS Enterprise v3.0
            </div>
            
            <h1 className="text-7xl md:text-[100px] font-black dark:text-white leading-[0.9] tracking-tighter italic">
              העסק שלך, <br /> 
              <span className="text-green-500">באוטומט מלא.</span>
            </h1>
            
            <p className="text-xl text-slate-600 dark:text-slate-400 max-w-xl leading-relaxed font-medium">
              הבינה המלאכותית שסוגרת לך תורים, מנהלת לקוחות ומציגה קטלוג יוקרתי – הכל במקום אחד. המהפכה של SabanOS כבר כאן.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 items-center">
              <Link href="/trial" className="w-full sm:w-auto px-16 py-7 bg-green-600 text-white font-black rounded-[2.5rem] text-2xl shadow-[0_20px_50px_rgba(22,163,74,0.3)] hover:scale-105 hover:bg-green-500 transition-all flex items-center justify-center gap-3">
                צור סטודיו עכשיו <Rocket size={24} />
              </Link>
            </div>

            <div className="flex items-center gap-6 mt-8">
              <div className="flex -space-x-3 space-x-reverse">
                {[1,2,3,4].map(i => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-[#020617] bg-slate-800" />
                ))}
              </div>
              <p className="text-sm font-bold opacity-60">+500 עסקים כבר עברו לאוטומציה</p>
            </div>
          </motion.div>

          {/* iPHONE MASTER SIMULATOR */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }} 
            animate={{ opacity: 1, scale: 1 }} 
            className="flex-1 relative z-10"
          >
            <div className="relative mx-auto border-[14px] border-slate-900 rounded-[4rem] h-[700px] w-[340px] shadow-[0_80px_150px_-20px_rgba(0,0,0,0.8)] bg-black overflow-hidden">
              {/* Notch */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-7 bg-slate-900 rounded-b-3xl z-50" />
              
              <AnimatePresence mode="wait">
                {/* שקף 1: AI Chat Agent */}
                {demoStep === 0 && (
                  <motion.div 
                    key="chat"
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="h-full bg-[#0b141a] p-6 pt-12 flex flex-col"
                  >
                    <div className="flex items-center gap-3 mb-8">
                      <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center text-black font-black">AI</div>
                      <div>
                        <p className="text-white text-xs font-bold uppercase">SabanOS Agent</p>
                        <p className="text-[10px] text-green-500">פעיל כעת</p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="bg-[#1f2c34] p-4 rounded-2xl rounded-tr-none text-white text-xs max-w-[85%]">היי! אני סוגר לך את התור למחר ב-10:00. לאשר?</div>
                      <div className="bg-[#005c4b] p-4 rounded-2xl rounded-tl-none text-white text-xs max-w-[85%] mr-auto">כן, תודה!</div>
                      <div className="bg-[#1f2c34] p-4 rounded-2xl rounded-tr-none text-white text-xs max-w-[85%] border border-green-500/40 font-bold italic">בוצע ✅. התור רשום ביומן!</div>
                    </div>
                  </motion.div>
                )}

                {/* שקף 2: Smart Calendar Grid */}
                {demoStep === 1 && (
                  <motion.div 
                    key="calendar"
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="h-full bg-slate-50 p-6 pt-12"
                  >
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-black font-black italic">יומן פברואר</h3>
                      <Calendar className="text-green-600" size={20} />
                    </div>
                    <div className="grid grid-cols-7 gap-1">
                      {[...Array(28)].map((_, i) => (
                        <div key={i} className={`h-10 rounded-lg flex items-center justify-center text-[10px] font-bold ${i === 15 ? 'bg-green-500 text-white' : 'bg-slate-200 text-slate-400'}`}>
                          {i + 1}
                        </div>
                      ))}
                    </div>
                    <div className="mt-6 space-y-3">
                      <div className="p-3 bg-white shadow-sm border-r-4 border-green-500 rounded-xl text-[10px] text-black font-bold">10:00 - תספורת (ראמי)</div>
                      <div className="p-3 bg-white shadow-sm border-r-4 border-amber-500 rounded-xl text-[10px] text-black font-bold opacity-50">11:30 - פנוי להזמנה</div>
                    </div>
                  </motion.div>
                )}

                {/* שקף 3: Smart Catalog */}
                {demoStep === 2 && (
                  <motion.div 
                    key="catalog"
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="h-full bg-[#020617] p-6 pt-12"
                  >
                    <div className="flex items-center justify-between mb-8">
                      <h3 className="text-white font-black italic uppercase">Catalog Pro</h3>
                      <ShoppingBag className="text-green-500" size={20} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      {[1,2,3,4].map(i => (
                        <div key={i} className="aspect-square bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col justify-end">
                          <div className="w-full h-2 bg-green-500/20 rounded-full mb-2" />
                          <p className="text-white text-[10px] font-black italic">PRODUCT #{i}</p>
                          <p className="text-green-500 text-[10px] font-bold">₪199</p>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            {/* Glow under iPhone */}
            <div className={`absolute -bottom-10 left-1/2 -translate-x-1/2 w-64 h-20 blur-[60px] opacity-50 transition-colors duration-1000 ${demoStep === 0 ? 'bg-green-500' : demoStep === 1 ? 'bg-blue-500' : 'bg-purple-500'}`} />
          </motion.div>
        </div>
      </section>

      {/* REVIEWS & TECH TICKER כפי שהיה קודם... */}
      <section className="py-24 max-w-7xl mx-auto px-6">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-5xl md:text-7xl font-black italic dark:text-white uppercase tracking-tighter">המנהלים <span className="text-green-500">החדשים</span></h2>
          <p className="text-slate-500 font-bold uppercase tracking-widest text-sm">הצטרפו למהפכה הטכנולוגית של העסקים בישראל</p>
        </div>
        {/* שאר המדורים כפי שהיו... */}
      </section>

      <ContactSection />
    </main>
  );
}
