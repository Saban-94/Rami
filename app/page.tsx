"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Bell, ShieldCheck, Zap, MessageCircle, 
  TrendingUp, EyeOff, Smartphone, Gift,
  ArrowLeft, Rocket, Phone, CheckCircle2
} from "lucide-react";

// רכיבים שייבאת (וודא שהם קיימים בתיקיית components)
import Navigation from "../components/Navigation";
import StatsGrid from "../components/StatsGrid";
import ServicesSection from "../components/ServicesSection";
import ContactSection from "../components/ContactSection";
import ProjectsShowcase from "../components/ProjectsShowcase";

const techLogos = [
  { name: "Google", src: "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg" },
  { name: "Microsoft", src: "https://upload.wikimedia.org/wikipedia/commons/9/96/Microsoft_logo_%282012%29.svg" },
  { name: "Gemini", src: "https://www.gstatic.com/lamda/images/gemini-sparkle_360_08d13264c7810777326090e5015b3e20.svg" },
  { name: "Firebase", src: "https://www.vectorlogo.zone/logos/firebase/firebase-icon.svg" },
  { name: "Vercel", src: "https://www.svgrepo.com/show/342111/vercel.svg" },
  { name: "ChatGPT", src: "https://upload.wikimedia.org/wikipedia/commons/0/04/ChatGPT_logo.svg" },
  { name: "OneSignal", src: "https://upload.wikimedia.org/wikipedia/commons/f/f1/OneSignal_logo.svg" },
  { name: "WhatsApp", src: "https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" },
];

export default function HomePage() {
  const openWhatsApp = () => {
    const phoneNumber = "972508861080";
    const message = encodeURIComponent("שלום רמי, אני מעוניין ב-WhatsApp Hybrid עם הטבת ה-15% הנחה!");
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, "_blank");
  };

  return (
    <main className="min-h-screen bg-[#F8FAFC] dark:bg-[#020617] transition-colors duration-500 pb-20 overflow-x-hidden text-right" dir="rtl">
      <Navigation />

      {/* --- HERO SECTION --- */}
      <section className="relative pt-32 pb-12 px-6">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-gradient-to-b from-green-500/10 via-cyan-500/5 to-transparent blur-3xl opacity-60" />
        
        <div className="max-w-7xl mx-auto relative z-10 flex flex-col lg:flex-row items-center justify-between gap-16">
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex-1"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20 text-green-600 dark:text-green-400 text-xs font-black mb-8 tracking-widest uppercase">
              <Zap size={14} fill="currentColor" />
              <span>מערכת הדגל הנמכרת ביותר 2025</span>
            </div>
            
            <h1 className="text-6xl md:text-8xl font-black mb-8 leading-tight dark:text-white tracking-tighter">
              WhatsApp <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-l from-green-500 to-emerald-600">
                Hybrid Engine
              </span>
            </h1>
            
            <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mb-12 leading-relaxed">
              הפתרון המושלם לעסקים: חוויית הוואטסאפ המוכרת בשילוב עוצמת ענן של Firebase והתראות OneSignal. מעל 135 ארגונים כבר עברו לאוטומציה מלאה.
            </p>

            <div className="flex flex-wrap gap-5 justify-start">
              <button 
                onClick={openWhatsApp}
                className="group bg-green-600 hover:bg-green-500 text-white px-10 py-5 rounded-2xl font-black shadow-2xl shadow-green-500/30 transition-all flex items-center gap-3 text-xl"
              >
                רכוש עכשיו (15% הנחה)
                <Zap size={20} fill="currentColor" />
              </button>
            </div>
          </motion.div>

          {/* --- ה-WOW: קנבס אייפון בגודל מלא --- */}
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex-1 relative"
          >
            {/* מסגרת מכשיר יוקרתית */}
            <div className="relative mx-auto border-[12px] border-slate-900 rounded-[4rem] h-[750px] w-[360px] shadow-[0_0_100px_rgba(34,197,94,0.2)] bg-black overflow-hidden group">
              {/* Notch */}
              <div className="absolute top-0 w-full h-8 bg-black z-40 flex justify-center">
                <div className="w-28 h-6 bg-slate-900 rounded-b-3xl" />
              </div>

              {/* מסך האפליקציה */}
              <div className="h-full w-full bg-[#0b141a] p-6 pt-16 flex flex-col gap-4">
                {/* Header דמה */}
                <div className="flex items-center justify-between bg-[#1f2c34] p-4 rounded-2xl border border-white/5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center text-black font-black">R</div>
                    <div className="text-right">
                      <p className="text-white text-xs font-bold">מערכת הזמנות</p>
                      <p className="text-[8px] text-green-500 font-bold">מחובר ל-Firebase</p>
                    </div>
                  </div>
                  <EyeOff size={16} className="text-slate-500" />
                </div>

                {/* בועות הודעה */}
                <motion.div 
                  initial={{ x: 50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 1 }}
                  className="bg-[#005c4b] p-4 rounded-2xl rounded-tr-none text-white text-sm max-w-[80%] self-end shadow-lg"
                >
                  "רמי, תאשר לי משלוח של 10 מכולות לאתר בחיפה"
                </motion.div>

                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 2 }}
                  className="bg-white/10 p-3 rounded-xl border border-white/10 flex items-center gap-3 self-center mt-4"
                >
                  <Bell size={14} className="text-yellow-400 animate-swing" />
                  <span className="text-[10px] text-white">התראת OneSignal נשלחה למנהל</span>
                </motion.div>

                {/* כלי עין עיוורת */}
                <div className="mt-auto bg-[#1f2c34] p-4 rounded-3xl border-t border-green-500/30">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold text-slate-400 italic">BLIND-EYE MODE</span>
                    <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
                  </div>
                  <p className="text-[10px] text-slate-300">נציג 1: "המכולות בדרך" (הלקוח לא רואה)</p>
                </div>
              </div>
            </div>
            
            {/* Badge מכירות */}
            <div className="absolute -bottom-8 -right-8 bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] shadow-2xl border border-slate-200 dark:border-white/10 text-center">
              <TrendingUp className="text-green-500 mb-2 mx-auto" size={32} />
              <p className="text-4xl font-black dark:text-white leading-none">135+</p>
              <p className="text-[10px] font-bold uppercase text-slate-500">התקנות פעילות</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* --- LOGO TICKER (סרט נע) --- */}
      <div className="py-12 bg-white/5 border-y border-white/5 overflow-hidden flex whitespace-nowrap relative z-20">
        <motion.div 
          className="flex gap-20 flex-none items-center"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        >
          {[...techLogos, ...techLogos].map((logo, index) => (
            <img key={index} src={logo.src} alt={logo.name} className="h-8 md:h-12 opacity-40 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-500" />
          ))}
        </motion.div>
      </div>

      {/* --- CONTENT AREA --- */}
      <div className="max-w-7xl mx-auto px-6 space-y-32 mt-20">
        <StatsGrid />
        
        {/* באנר הטבה בולט */}
        <motion.div 
          whileHover={{ scale: 1.02 }}
          className="p-10 rounded-[3rem] bg-gradient-to-r from-green-600 to-emerald-800 text-white flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl shadow-green-500/20"
        >
          <div className="flex items-center gap-6">
            <div className="p-5 bg-white/20 rounded-full backdrop-blur-md">
              <Gift size={40} className="text-white" />
            </div>
            <div className="text-right">
              <h4 className="text-3xl font-black">הטבה בלעדית ללקוחות חדשים</h4>
              <p className="text-white/80 font-bold">הזמן עכשיו את אפליקציית הדגל וקבל 15% הנחה על הקמת המערכת.</p>
            </div>
          </div>
          <button onClick={openWhatsApp} className="px-12 py-5 bg-white text-green-700 font-black rounded-2xl shadow-xl hover:bg-slate-100 transition-all text-xl">
            מימוש ההטבה
          </button>
        </motion.div>

        <ServicesSection />
        
        <section id="projects" className="scroll-mt-28">
          <ProjectsShowcase />
        </section>

        <section id="contact" className="scroll-mt-28">
          <ContactSection />
        </section>
      </div>

      {/* כפתור וואטסאפ צף */}
      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="fixed bottom-8 left-8 z-50">
        <button 
          onClick={openWhatsApp}
          className="p-6 bg-green-500 text-white rounded-full shadow-[0_0_40px_rgba(34,197,94,0.4)] hover:scale-110 transition-transform"
        >
          <Phone size={32} fill="currentColor" />
        </button>
      </motion.div>
    </main>
  );
}
