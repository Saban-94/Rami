"use client";

import React from "react";
import { motion } from "framer-motion";
import { 
  ArrowLeft, Rocket, ShieldCheck, Zap, 
  Laptop, Tablet, Smartphone, Code2, 
  Database, Globe, Share2, Cpu 
} from "lucide-react";
import Navigation from "../components/Navigation";
import StatsGrid from "../components/StatsGrid";
import PlannerDemo from "../components/PlannerDemo";
import ProjectsShowcase from "../components/ProjectsShowcase";
import ServicesSection from "../components/ServicesSection";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#F8FAFC] dark:bg-[#020617] transition-colors duration-500 pb-20">
      <Navigation />

      {/* --- HERO SECTION: ה-WOW הראשוני --- */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        {/* אלמנטים גרפיים יוקרתיים ברקע */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-gradient-to-b from-cyan-500/10 via-blue-500/5 to-transparent blur-3xl opacity-60" />
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-16">
            
            {/* צד טקסט שיווקי */}
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="flex-1 text-center lg:text-right"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-600 dark:text-cyan-400 text-xs font-black mb-8 tracking-widest uppercase">
                <Rocket size={14} />
                <span>Rami Suite v2.0 | Next-Gen Automation</span>
              </div>
              
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-black mb-8 leading-[1.1] dark:text-white tracking-tighter">
                ארכיטקטורת <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-l from-cyan-500 via-blue-500 to-indigo-600">
                  ענן ואוטומציה
                </span>
              </h1>
              
              <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mb-12 leading-relaxed mx-auto lg:mr-0">
                מומחה בבניית מערכות ליבה עסקיות המשלבות בינה מלאכותית, ניהול לוגיסטי חכם ואינטגרציה מלאה בין מערכות Microsoft ו-Google. הפתרונות שלך, בשליטה מוחלטת שלי.
              </p>
              
              <div className="flex flex-wrap gap-5 justify-center lg:justify-start">
                <button 
                  onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}
                  className="group bg-cyan-500 hover:bg-cyan-400 text-white px-10 py-5 rounded-2xl font-black shadow-2xl shadow-cyan-500/40 transition-all flex items-center gap-3 text-lg"
                >
                  צפה בפורטפוליו
                  <ArrowLeft className="group-hover:-translate-x-2 transition-transform" />
                </button>
                
                <div className="flex items-center gap-4 px-6 py-5 rounded-2xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 shadow-sm">
                  <div className="flex -space-x-3">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="w-8 h-8 rounded-full border-2 border-[#F8FAFC] dark:border-[#020617] bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-[10px] font-bold">
                        {i === 4 ? <Share2 size={12}/> : <ShieldCheck size={12}/>}
                      </div>
                    ))}
                  </div>
                  <span className="text-sm font-bold dark:text-slate-300">Enterprise Ready</span>
                </div>
              </div>
            </motion.div>

            {/* ויזואל טכנולוגי - WOW */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1 }}
              className="flex-1 relative"
            >
              <div className="relative z-10 p-4 rounded-[3.5rem] bg-gradient-to-br from-white/20 to-transparent backdrop-blur-xl border border-white/30 shadow-2xl">
                <div className="aspect-square bg-slate-900 rounded-[3rem] overflow-hidden relative group">
                   <img 
                     src="https://github.com/Saban-94.png" 
                     alt="Rami Profile" 
                     className="w-full h-full object-cover opacity-80 group-hover:scale-110 transition-transform duration-1000 grayscale group-hover:grayscale-0"
                   />
                   <div className="absolute inset-0 bg-gradient-to-t from-cyan-900/80 to-transparent" />
                   <div className="absolute bottom-8 right-8 text-right">
                      <p className="text-cyan-400 font-black text-2xl tracking-widest uppercase">RAMI</p>
                      <p className="text-white text-xs font-bold tracking-widest opacity-70 italic">System Architect</p>
                   </div>
                </div>
              </div>
              
              {/* Floating Tech Icons */}
              <div className="absolute -top-10 -left-10 p-5 bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-white/20 animate-bounce">
                <Database className="text-orange-500" size={32} />
              </div>
              <div className="absolute top-1/2 -right-12 p-5 bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-white/20">
                <Cpu className="text-blue-500" size={32} />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* --- CONTENT SECTION: פריסת השירותים והפרויקטים --- */}
      <div className="max-w-7xl mx-auto px-6 space-y-32">
        
        {/* סטטיסטיקות עוצמה */}
        <section>
          <StatsGrid />
        </section>

        {/* שירותים וכלים (Google, MS, Firebase, Vercel) */}
        <ServicesSection />

        {/* פרויקטים נבחרים - ללא מזהים, WOW שיווקי מלא */}
        <section id="projects" className="scroll-mt-28">
          <ProjectsShowcase />
        </section>

        {/* Control Center - דאטה חי / דמה יוקרתי */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center pb-24">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            <div className="p-3 bg-cyan-500/10 rounded-2xl border border-cyan-500/20 w-fit">
              <Zap className="text-cyan-500" size={32} fill="currentColor" />
            </div>
            <h2 className="text-4xl font-black dark:text-white leading-tight">
              שליטה מרכזית <br />
              <span className="text-cyan-500">בזמן אמת</span>
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-lg leading-relaxed">
              המערכות שבניתי מתוכננות לעבודה מאומצת. כאן מוצגת דוגמה לסנכרון משימות וניהול נתונים שמתבצע ב-Background, תוך חיבור ישיר ל-Cloud.
            </p>
            
            <ul className="space-y-4">
              {[
                "סנכרון דו-כיווני בין Microsoft ל-Google",
                "ניהול ענן מבוזר (Vercel Edge)",
                "אבטחת נתונים בסטנדרט Firebase High-End"
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3 font-bold text-sm dark:text-slate-200">
                  <div className="w-1.5 h-1.5 rounded-full bg-cyan-500" />
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>

          <div className="relative">
            <div className="absolute -inset-4 bg-cyan-500/5 blur-2xl rounded-[3rem]" />
            <PlannerDemo />
          </div>
        </section>

      </div>

      {/* --- FLOATING ACTION BUTTON --- */}
      <motion.div 
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 w-full max-w-xs px-6"
      >
        <button className="w-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black py-5 rounded-2xl shadow-2xl flex items-center justify-center gap-3 hover:scale-105 transition-transform">
          בוא נבנה פרויקט WOW
          <Zap size={18} fill="currentColor" />
        </button>
      </motion.div>

    </main>
  );
}
