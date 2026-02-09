"use client";

import React from "react";
import { motion } from "framer-motion";
import { 
  Cloud, 
  Database, 
  Code2, 
  ArrowLeft, 
  Download, 
  Mail, 
  Github,
  CheckCircle2
} from "lucide-react";

export default function Home() {
  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  return (
    <div className="min-h-screen bg-[#0F172A] text-white overflow-hidden">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-8 py-6 border-b border-slate-800 bg-[#0F172A]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-lg flex items-center justify-center font-bold text-xl shadow-lg shadow-cyan-500/20">
            R
          </div>
          <span className="text-xl font-bold tracking-tight">Rami <span className="text-cyan-400">Systems</span></span>
        </div>
        
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
          <a href="#about" className="hover:text-cyan-400 transition-colors">אודות</a>
          <a href="#projects" className="hover:text-cyan-400 transition-colors">פרויקטים</a>
          <a href="#services" className="hover:text-cyan-400 transition-colors">שירותים</a>
          <button className="bg-cyan-500 hover:bg-cyan-400 text-[#0F172A] px-5 py-2 rounded-full font-bold transition-all transform hover:scale-105">
            צור קשר
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-20 pb-32 px-8 flex flex-col md:flex-row items-center justify-between max-w-7xl mx-auto gap-12">
        {/* Background Glow */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-cyan-500/10 blur-[120px] rounded-full -z-10" />
        
        <motion.div 
          className="flex-1 text-right md:text-right"
          initial="initial"
          animate="animate"
          variants={fadeIn}
        >
          <div className="inline-block px-4 py-1.5 mb-6 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-sm font-medium">
            Full-Stack Solutions Architect
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold leading-tight mb-6">
            רמי מסארוה <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-l from-cyan-400 to-blue-500">
              מומחה IT ואוטומציה
            </span>
          </h1>
          <p className="text-slate-400 text-lg md:text-xl mb-10 max-w-2xl leading-relaxed">
            בניית גשרים טכנולוגיים בין Google Workspace ל-Microsoft 365. 
            מפתח אפליקציות PWA ומערכות לוגיסטיקה חכמות שחוסכות זמן וכסף לעסקים.
          </p>
          
          <div className="flex flex-wrap gap-4 justify-start">
            <button className="flex items-center gap-2 bg-white text-[#0F172A] px-8 py-4 rounded-xl font-bold hover:bg-cyan-50 transition-all shadow-xl">
              צפה בפרויקטים
              <ArrowLeft size={20} />
            </button>
            <button className="flex items-center gap-2 border border-slate-700 bg-slate-800/50 px-8 py-4 rounded-xl font-bold hover:bg-slate-800 transition-all">
              הורד קו"ח
              <Download size={20} />
            </button>
          </div>

          {/* Tech Stack Icons */}
          <div className="mt-12 flex items-center gap-6 opacity-50 grayscale hover:grayscale-0 transition-all">
            <Cloud size={24} />
            <Database size={24} />
            <Code2 size={24} />
            <span className="text-sm font-mono tracking-widest uppercase">Next.js | Firebase | M365</span>
          </div>
        </motion.div>

        {/* Hero Image / Placeholder */}
        <motion.div 
          className="flex-1 relative"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
        >
          <div className="relative w-full aspect-square max-w-[500px] mx-auto">
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-3xl rotate-6 opacity-20 animate-pulse" />
            <div className="absolute inset-0 border-2 border-cyan-500/30 rounded-3xl -rotate-3" />
            <div className="relative z-10 w-full h-full bg-slate-800 rounded-3xl overflow-hidden border border-slate-700 shadow-2xl flex items-center justify-center">
               <img 
                src="https://github.com/ramims2026-bit.png" 
                alt="Rami Massarwa" 
                className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500"
              />
            </div>
          </div>
        </motion.div>
      </section>

      {/* Services Grid Preview */}
      <section className="bg-slate-900/50 py-24 px-8 border-y border-slate-800">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-2xl bg-[#1E293B] border border-slate-700 hover:border-cyan-500/50 transition-all group">
              <div className="w-12 h-12 bg-cyan-500/10 rounded-lg flex items-center justify-center mb-6 group-hover:bg-cyan-500 transition-colors">
                <Cloud className="text-cyan-500 group-hover:text-white" />
              </div>
              <h3 className="text-xl font-bold mb-4">אוטומציה עסקית</h3>
              <p className="text-slate-400">חיבור מלא בין כלים ארגוניים לחיסכון בזמן ושגיאות אנוש.</p>
            </div>
            
            <div className="p-8 rounded-2xl bg-[#1E293B] border border-slate-700 hover:border-cyan-500/50 transition-all group">
              <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center mb-6 group-hover:bg-blue-500 transition-colors">
                <Code2 className="text-blue-500 group-hover:text-white" />
              </div>
              <h3 className="text-xl font-bold mb-4">פיתוח אפליקציות</h3>
              <p className="text-slate-400">בניית מערכות PWA מהירות המותאמות בדיוק לצרכי הארגון.</p>
            </div>

            <div className="p-8 rounded-2xl bg-[#1E293B] border border-slate-700 hover:border-cyan-500/50 transition-all group">
              <div className="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center mb-6 group-hover:bg-purple-500 transition-colors">
                <Database className="text-purple-500 group-hover:text-white" />
              </div>
              <h3 className="text-xl font-bold mb-4">ניהול מסדי נתונים</h3>
              <p className="text-slate-400">פתרונות מבוססי Firebase ו-Sheets לניהול מלאי ולוגיסטיקה.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-8 border-t border-slate-800 text-center">
        <p className="text-slate-500 text-sm">
          © {new Date().getFullYear()} Rami Systems. נבנה בגאווה בעזרת Next.js & Firebase.
        </p>
      </footer>
    </div>
  );
}
