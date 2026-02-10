"use client";

import React from "react";
import { motion } from "framer-motion";
import { 
  ArrowLeft, Rocket, ShieldCheck, Zap, 
  MessageSquare, Phone, Code2 
} from "lucide-react";

// ייבוא הקומפוננטות שבנינו
import Navigation from "../components/Navigation";
import StatsGrid from "../components/StatsGrid";
import PlannerDemo from "../components/PlannerDemo";
import ProjectsShowcase from "../components/ProjectsShowcase";
import ServicesSection from "../components/ServicesSection";
import ContactSection from "../components/ContactSection";

// מערך לוגואים לסרט הנע (Tech Stack)
const techLogos = [
  { name: "Google", src: "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg" },
  { name: "Microsoft", src: "https://upload.wikimedia.org/wikipedia/commons/9/96/Microsoft_logo_%282012%29.svg" },
  { name: "Gemini", src: "https://www.gstatic.com/lamda/images/gemini-sparkle_360_08d13264c7810777326090e5015b3e20.svg" },
  { name: "Firebase", src: "https://www.vectorlogo.zone/logos/firebase/firebase-icon.svg" },
  { name: "Vercel", src: "https://www.svgrepo.com/show/342111/vercel.svg" },
  { name: "ChatGPT", src: "https://upload.wikimedia.org/wikipedia/commons/0/04/ChatGPT_logo.svg" },
  { name: "WhatsApp", src: "https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" },
];

export default function HomePage() {
  const openWhatsApp = () => {
    const phoneNumber = "972508861080";
    const message = encodeURIComponent("שלום רמי, אני מעוניין בשירותי האוטומציה והפיתוח שלך.");
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, "_blank");
  };

  return (
    <main className="min-h-screen bg-[#F8FAFC] dark:bg-[#020617] transition-colors duration-500 pb-20 overflow-x-hidden">
      <Navigation />

      {/* --- HERO SECTION --- */}
      <section className="relative pt-32 pb-16 px-6 text-right">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-gradient-to-b from-cyan-500/10 via-blue-500/5 to-transparent blur-3xl opacity-60 pointer-events-none" />
        
        <div className="max-w-7xl mx-auto relative z-10 flex flex-col lg:flex-row-reverse items-center justify-between gap-16">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex-1"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-600 dark:text-cyan-400 text-xs font-black mb-8 tracking-widest uppercase">
              <Rocket size={14} />
              <span>Rami Suite v2.0 | Next-Gen Automation</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-black mb-8 leading-[1.1] dark:text-white">
              ארכיטקטורת <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-l from-cyan-500 via-blue-500 to-indigo-600">
                ענן ואוטומציה
              </span>
            </h1>
            
            <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mb-12 leading-relaxed">
              הופכים קוד גולמי לפתרונות עסקיים. מומחה באינטגרציה בין Google ל-Microsoft ובניית מערכות AI מותאמות אישית.
            </p>
            
            <div className="flex flex-wrap gap-5 justify-start">
              <button 
                onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}
                className="group bg-cyan-500 hover:bg-cyan-400 text-white px-10 py-5 rounded-2xl font-black shadow-2xl transition-all flex items-center gap-3"
              >
                צפה בפורטפוליו
                <ArrowLeft className="group-hover:-translate-x-2 transition-transform" />
              </button>
              <button 
                onClick={openWhatsApp}
                className="flex items-center gap-3 px-8 py-5 rounded-2xl bg-green-500/10 border border-green-500/20 text-green-600 font-bold hover:bg-green-500 hover:text-white transition-all"
              >
                <MessageSquare size={20} />
                <span>דבר איתי בוואטסאפ</span>
              </button>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex-1 relative hidden lg:block"
          >
            <div className="relative z-10 p-4 rounded-[3.5rem] bg-gradient-to-br from-white/20 to-transparent backdrop-blur-xl border border-white/30 shadow-2xl overflow-hidden aspect-square max-w-md mx-auto">
               <img 
                 src="https://github.com/Saban-94.png" 
                 alt="Rami Profile" 
                 className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700 opacity-80"
               />
               <div className="absolute inset-0 bg-gradient-to-t from-cyan-950/40 to-transparent" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* --- LOGO TICKER (סרט נע) --- */}
      <div className="py-12 bg-white/5 border-y border-white/5 overflow-hidden flex whitespace-nowrap relative z-20">
        <motion.div 
          className="flex gap-16 flex-none items-center"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        >
          {[...techLogos, ...techLogos].map((logo, index) => (
            <img key={index} src={logo.src} alt={logo.name} className="h-8 md:h-10 opacity-40 grayscale hover:grayscale-0 hover:opacity-100 transition-all" />
          ))}
        </motion.div>
      </div>

      {/* --- CONTENT AREA --- */}
      <div className="max-w-7xl mx-auto px-6 space-y-32 mt-20">
        <StatsGrid />
        <ServicesSection />
        
        <section id="projects" className="scroll-mt-28 text-right">
          <ProjectsShowcase />
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center text-right">
          <PlannerDemo />
          <div className="space-y-6">
            <h2 className="text-4xl font-black dark:text-white">שליטה מלאה <span className="text-cyan-500">בזמן אמת</span></h2>
            <p className="text-slate-500 dark:text-slate-400 text-lg">המערכות שבניתי מתוכננות לעבודה מאומצת. סנכרון מלא של דאטה עסקי מכל מקום בעולם.</p>
          </div>
        </section>

        <section id="contact" className="scroll-mt-28">
          <ContactSection />
        </section>
      </div>

      {/* --- כפתור וואטסאפ צף --- */}
      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="fixed bottom-8 left-8 z-50">
        <button 
          onClick={openWhatsApp}
          className="p-5 bg-green-500 text-white rounded-full shadow-[0_0_20px_rgba(34,197,94,0.5)] hover:scale-110 transition-transform flex items-center justify-center"
        >
          <Phone size={28} fill="currentColor" />
        </button>
      </motion.div>
    </main>
  );
}
