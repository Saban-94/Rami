"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Rocket, ShieldCheck, Zap, Laptop, Tablet, Smartphone } from "lucide-react";
import StatsGrid from "@/components/StatsGrid";
import PlannerDemo from "@/components/PlannerDemo";
import ProjectsShowcase from "@/components/ProjectsShowcase";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#F8FAFC] dark:bg-[#020617] transition-colors duration-500 pb-20">
      
      {/* --- HERO SECTION --- */}
      <section className="relative pt-20 pb-16 px-6 overflow-hidden">
        {/* אפקטי תאורה ברקע - WOW ויזואלי */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-gradient-to-b from-cyan-500/10 to-transparent blur-3xl opacity-50" />
        
        <div className="max-w-6xl mx-auto relative z-10 text-center md:text-right flex flex-col md:flex-row items-center justify-between gap-12">
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex-1"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-600 dark:text-cyan-400 text-xs font-bold mb-6">
              <Rocket size={14} />
              <span>מומחה IT ואוטומציה 2026</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight dark:text-white">
              הופכים רעיונות ל-<span className="text-transparent bg-clip-text bg-gradient-to-l from-cyan-500 to-blue-600">מערכות חכמות</span>
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mb-10 leading-relaxed">
              פתרונות קצה לעסקים מבוססי M365 וגוגל. מהשטח של ח. סבן ועד לאוטומציות ענן מורכבות - הכל במקום אחד, מעוצב ונגיש מכל מכשיר.
            </p>
            
            <div className="flex flex-wrap gap-4 justify-center md:justify-start">
              <button 
                onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}
                className="group bg-cyan-500 hover:bg-cyan-400 text-white px-8 py-4 rounded-2xl font-bold shadow-xl shadow-cyan-500/20 transition-all flex items-center gap-3"
              >
                לפרויקטים שלי
                <ArrowLeft className="group-hover:-translate-x-2 transition-transform" />
              </button>
              <div className="flex items-center gap-3 px-6 py-4 rounded-2xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 shadow-sm text-sm font-medium">
                <ShieldCheck className="text-green-500" />
                <span>מאובטח ב-SSO</span>
              </div>
            </div>
          </motion.div>

          {/* ויזואל רספונסיבי - WOW */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex-1 relative"
          >
            <div className="relative z-10 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md border border-white/20 p-2 rounded-[3rem] shadow-2xl">
               <img 
                 src="https://github.com/ramims2026-bit.png" 
                 alt="Rami" 
                 className="rounded-[2.5rem] w-full max-w-[400px] mx-auto grayscale hover:grayscale-0 transition-all duration-700"
               />
            </div>
            {/* צפיפות מכשירים - אינדיקציה ל-PWA */}
            <div className="absolute -bottom-6 -right-6 bg-white dark:bg-slate-900 p-4 rounded-2xl shadow-xl border border-slate-100 dark:border-white/10 flex gap-4">
              <Smartphone size={20} className="text-cyan-500" />
              <Tablet size={20} className="text-blue-500" />
              <Laptop size={20} className="text-indigo-500" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* --- CONTENT SECTION --- */}
      <div className="max-w-6xl mx-auto px-6 space-y-24">
        
        {/* סטטיסטיקות יוקרתיות */}
        <section>
          <StatsGrid />
        </section>

        {/* פרויקטים - ה-WOW הגדול */}
        <section id="projects" className="scroll-mt-24">
          <ProjectsShowcase />
        </section>

        {/* פאנל שליטה - דאטה חי */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 pb-12">
          <div className="space-y-6">
            <h2 className="text-3xl font-bold flex items-center gap-3 italic">
              <Zap className="text-yellow-400 fill-yellow-400" />
              זמן אמת
            </h2>
            <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
              המערכות שלנו עובדות מסביב לשעון. כאן ניתן לראות סנכרון חי של משימות ודוחות מכלל הפלטפורמות הארגוניות.
            </p>
            <div className="p-8 rounded-[2rem] bg-gradient-to-br from-cyan-500/10 to-transparent border border-cyan-500/20">
              <h4 className="font-bold text-lg mb-2">סטטוס סנכרון</h4>
              <div className="flex items-center gap-4 text-sm text-green-500 font-bold">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                </span>
                חיבור פעיל ל-Microsoft Graph
              </div>
            </div>
          </div>
          <PlannerDemo />
        </section>

      </div>
    </main>
  );
}
