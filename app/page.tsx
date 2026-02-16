"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Rocket, Zap, Star, CheckCircle2, 
  Smartphone, MessageSquare, Calendar, 
  ShoppingBag, Users, Sparkles
} from "lucide-react";
import Link from "next/link";

// תיקון הייבוא לנתיב אבסולוטי
import Navigation from "@/components/Navigation";
import ContactSection from "@/components/ContactSection";

export default function HomePage() {
  const [demoStep, setDemoStep] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setDemoStep((prev) => (prev + 1) % 3);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-[#020617] text-right transition-colors duration-300 overflow-x-hidden" dir="rtl">
      <Navigation />

      {/* Hero Section */}
      <section className="relative pt-32 pb-24 px-6">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-green-500/10 blur-[120px] rounded-full" />
        
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16">
          <motion.div 
            initial={{ opacity: 0, x: 50 }} 
            animate={{ opacity: 1, x: 0 }} 
            className="flex-1 space-y-8 z-10"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-green-500/10 text-green-500 text-xs font-black uppercase border border-green-500/20">
              <Sparkles size={14} /> SabanOS Enterprise v3.0
            </div>
            
            <h1 className="text-7xl md:text-[100px] font-black dark:text-white leading-[0.9] tracking-tighter italic">
              העסק שלך, <br /> 
              <span className="text-green-500">באוטומט מלא.</span>
            </h1>
            
            <p className="text-xl text-slate-600 dark:text-slate-400 max-w-xl leading-relaxed font-medium">
              הבינה המלאכותית שסוגרת תורים, מנהלת לקוחות ומציגה קטלוג יוקרתי – הכל במקום אחד.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6">
              <Link href="/trial" className="px-16 py-7 bg-green-600 text-white font-black rounded-[2.5rem] text-2xl shadow-xl hover:scale-105 transition-all flex items-center gap-3">
                צור סטודיו עכשיו <Rocket size={24} />
              </Link>
            </div>
          </motion.div>

          {/* iPhone Master Simulator */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }} 
            animate={{ opacity: 1, scale: 1 }} 
            className="flex-1 relative"
          >
            <div className="relative mx-auto border-[14px] border-slate-900 rounded-[4rem] h-[700px] w-[340px] shadow-2xl bg-black overflow-hidden">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-7 bg-slate-900 rounded-b-3xl z-50" />
              
              <AnimatePresence mode="wait">
                {demoStep === 0 && (
                  <motion.div key="chat" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-full bg-[#0b141a] p-6 pt-12">
                    <div className="flex items-center gap-3 mb-8">
                      <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center font-black">AI</div>
                      <span className="text-white text-xs font-bold uppercase">SabanOS Agent</span>
                    </div>
                    <div className="space-y-4">
                      <div className="bg-[#1f2c34] p-4 rounded-2xl text-white text-xs max-w-[85%]">היי! אני סוגר לך את התור למחר ב-10:00. לאשר?</div>
                      <div className="bg-[#005c4b] p-4 rounded-2xl text-white text-xs max-w-[85%] mr-auto">כן, תודה!</div>
                    </div>
                  </motion.div>
                )}

                {demoStep === 1 && (
                  <motion.div key="calendar" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-full bg-slate-50 p-6 pt-12 text-slate-900">
                    <h3 className="font-black italic mb-6">יומן פברואר</h3>
                    <div className="grid grid-cols-7 gap-1">
                      {[...Array(28)].map((_, i) => (
                        <div key={i} className={`h-8 rounded-lg flex items-center justify-center text-[10px] ${i === 15 ? 'bg-green-500 text-white' : 'bg-slate-200'}`}>{i + 1}</div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {demoStep === 2 && (
                  <motion.div key="catalog" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-full bg-[#020617] p-6 pt-12">
                    <h3 className="text-white font-black italic uppercase mb-8">Catalog Pro</h3>
                    <div className="grid grid-cols-2 gap-4">
                      {[1,2,3,4].map(i => (
                        <div key={i} className="aspect-square bg-white/5 border border-white/10 rounded-2xl p-4" />
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <div className={`absolute -bottom-10 left-1/2 -translate-x-1/2 w-64 h-20 blur-[60px] opacity-50 transition-colors duration-1000 ${demoStep === 0 ? 'bg-green-500' : demoStep === 1 ? 'bg-blue-500' : 'bg-purple-500'}`} />
          </motion.div>
        </div>
      </section>

      <ContactSection />
    </main>
  );
}
