"use client";

import React from "react";
import { motion } from "framer-motion";
import { 
  ArrowLeft, Rocket, ShieldCheck, Zap, 
  MessageSquare, Send, Phone
} from "lucide-react";
import Navigation from "../components/Navigation";
import StatsGrid from "../components/StatsGrid";
import PlannerDemo from "../components/PlannerDemo";
import ProjectsShowcase from "../components/ProjectsShowcase";
import ServicesSection from "../components/ServicesSection";
import ContactSection from "../components/ContactSection";

// לוגואים למערכות שרמי מתמחה בהן
const techLogos = [
  { name: "Google", src: "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg" },
  { name: "Microsoft", src: "https://upload.wikimedia.org/wikipedia/commons/9/96/Microsoft_logo_%282012%29.svg" },
  { name: "Gemini AI", src: "https://www.gstatic.com/lamda/images/gemini-sparkle_360_08d13264c7810777326090e5015b3e20.svg" },
  { name: "ChatGPT", src: "https://upload.wikimedia.org/wikipedia/commons/0/04/ChatGPT_logo.svg" },
  { name: "Copilot", src: "https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_Copilot_icon.svg" },
  { name: "Firebase", src: "https://www.vectorlogo.zone/logos/firebase/firebase-icon.svg" },
  { name: "Vercel", src: "https://www.svgrepo.com/show/342111/vercel.svg" },
  { name: "Google Sheets", src: "https://upload.wikimedia.org/wikipedia/commons/3/30/Google_Sheets_logo_%282014-2020%29.svg" },
  { name: "Apps Script", src: "https://upload.wikimedia.org/wikipedia/commons/d/da/Google_Apps_Script_logo.svg" },
  { name: "WhatsApp", src: "https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" },
  { name: "Azure", src: "https://upload.wikimedia.org/wikipedia/commons/a/a8/Microsoft_Azure_Logo.svg" },
  { name: "Power Automate", src: "https://upload.wikimedia.org/wikipedia/commons/d/d4/Microsoft_Power_Automate_Logo.svg" },
];

export default function HomePage() {
  const openWhatsApp = () => {
    const phoneNumber = "972508861080";
    const message = encodeURIComponent("שלום רמי, אני מעוניין בשירותי האוטומציה והפיתוח שלך. אשמח שנחזור אלי.");
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, "_blank");
  };

  const tickerVariants = {
    animate: {
      x: ["0%", "-100%"],
      transition: {
        x: {
          repeat: Infinity,
          repeatType: "loop",
          duration: 30, // מהירות הסרט הנע
          ease: "linear",
        },
      },
    },
  };

  return (
    <main className="min-h-screen bg-[#F8FAFC] dark:bg-[#020617] transition-colors duration-500 pb-20">
      <Navigation />

      {/* --- HERO SECTION --- */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden text-right">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-gradient-to-b from-cyan-500/10 via-blue-500/5 to-transparent blur-3xl opacity-60" />
        
        <div className="max-w-7xl mx-auto relative z-10 flex flex-col lg:flex-row items-center justify-between gap-16">
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex-1"
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
            
            <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mb-12 leading-relaxed">
              מומחה בבניית מערכות ליבה עסקיות המשלבות בינה מלאכותית, ניהול לוגיסטי חכם ואינטגרציה מלאה.
            </p>
            
            <div className="flex flex-wrap gap-5">
              <button 
                onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}
                className="group bg-cyan-500 hover:bg-cyan-400 text-white px-10 py-5 rounded-2xl font-black shadow-2xl shadow-cyan-500/40 transition-all flex items-center gap-3 text-lg"
              >
                צפה בפורטפוליו
                <ArrowLeft className="group-hover:-translate-x-2 transition-transform" />
              </button>
              
              <button 
                onClick={openWhatsApp}
                className="flex items-center gap-3 px-6 py-5 rounded-2xl bg-green-500/10 border border-green-500/20 text-green-600 dark:text-green-400 font-bold hover:bg-green-500 hover:text-white transition-all shadow-sm"
              >
                <MessageSquare size={20} />
                <span>שיחת וואטסאפ מהירה</span>
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* --- LOGO TICKER: סרט הלוגואים הנע --- */}
      <div className="overflow-hidden whitespace-nowrap py-6 bg-white dark:bg-slate-950 border-y border-white/10 relative z-20">
        <motion.div 
          className="inline-block"
          variants={tickerVariants}
          initial="animate" // Start the animation immediately
          animate="animate"
        >
          {/* כדי שהלוגואים יחזרו על עצמם וייצרו רצף חלק */}
          {[...techLogos, ...techLogos].map((logo, index) => (
            <img 
              key={index} 
              src={logo.src} 
              alt={logo.name} 
              className="h-10 mx-8 inline-block opacity-60 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-300"
              style={{ maxHeight: '40px', width: 'auto' }} // Ensure consistent size
            />
          ))}
        </motion.div>
      </div>

      <div className="max-w-7xl mx-auto px-6 space-y-32">
        <StatsGrid />
        <ServicesSection />
        
        {/* פרויקטים */}
        <section id="projects" className="scroll-mt-28">
          <ProjectsShowcase />
        </section>

        {/* פאנל בקרה ומשימות דמה */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center text-right">
          <PlannerDemo />
          <div className="space-y-6">
            <h2 className="text-4xl font-black dark:text-white leading-tight">
              שליטה מרכזית <br />
              <span className="text-cyan-500">בזמן אמת</span>
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-lg">
              המערכות שלנו עובדות מסביב לשעון. סנכרון מלא ב-Background לכל הפלטפורמות.
            </p>
          </div>
        </section>

        {/* טופס צור קשר מובנה */}
        <section id="contact" className="scroll-mt-28 pb-20">
          <ContactSection />
        </section>
      </div>

      {/* FLOATING WHATSAPP BUTTON */}
      <motion.div 
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="fixed bottom-8 left-8 z-50"
      >
        <button 
          onClick={openWhatsApp}
          className="p-5 bg-green-500 text-white rounded-full shadow-[0_0_20px_rgba(34,197,94,0.5)] hover:scale-110 transition-transform flex items-center justify-center"
          title="דבר איתי בוואטסאפ"
        >
          <Phone size={28} fill="currentColor" />
        </button>
      </motion.div>

    </main>
  );
}
