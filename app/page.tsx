"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Truck, HeartPulse, Scissors, Star, 
  ChevronRight, Sparkles, Code2, Globe, Database
} from "lucide-react";
import Link from "next/link";
import Navigation from "../components/Navigation";
import ContactSection from "../components/ContactSection";

// לוגואים לסרט הנע (Tech Stack)
const TECH_LOGOS = [
  { name: "Google", url: "https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_\"G\"_logo.svg" },
  { name: "Microsoft", url: "https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg" },
  { name: "Gemini", url: "https://upload.wikimedia.org/wikipedia/commons/8/8a/Google_Gemini_logo.svg" },
  { name: "ChatGPT", url: "https://upload.wikimedia.org/wikipedia/commons/0/04/ChatGPT_logo.svg" },
  { name: "Firebase", url: "https://upload.wikimedia.org/wikipedia/commons/3/37/Firebase_Logo.svg" },
  { name: "WhatsApp", url: "https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" },
  { name: "Next.js", url: "https://upload.wikimedia.org/wikipedia/commons/8/8e/Nextjs-logo.svg" },
  { name: "Vercel", url: "https://upload.wikimedia.org/wikipedia/commons/5/5e/Vercel_logo_black.svg" }
];

const BUSINESS_MODES = {
  moving: {
    id: "moving",
    title: "הובלות אבו אל ראסם",
    subtitle: "ניהול לוגיסטי חכם",
    color: "bg-blue-600",
    text: "text-blue-500",
    icon: <Truck className="text-white" size={24} />,
    content: (
      <div className="space-y-4">
        <div className="bg-blue-500/10 p-4 rounded-2xl border border-blue-500/20">
          <p className="text-[10px] font-bold text-blue-500">מחיר AI משוער</p>
          <p className="text-lg font-black italic text-white">₪1,075.00</p>
        </div>
        <div className="bg-white/5 p-3 rounded-xl border border-white/10 flex items-center justify-between">
          <span className="text-[10px] text-white">משאית בדרך ליעד</span>
          <div className="w-2 h-2 bg-green-500 rounded-full animate-ping" />
        </div>
      </div>
    )
  },
  dental: {
    id: "dental",
    title: "Dr. Moshe Dental",
    subtitle: "מרפאת שיניים מתקדמת",
    color: "bg-emerald-500",
    text: "text-emerald-500",
    icon: <HeartPulse className="text-white" size={24} />,
    content: (
      <div className="space-y-4">
        <div className="bg-emerald-500/10 p-4 rounded-2xl border border-emerald-500/20">
          <p className="text-[10px] font-bold text-emerald-500 uppercase">תור קרוב</p>
          <p className="text-lg font-black italic text-white">16:30 היום</p>
        </div>
        <button className="w-full py-3 bg-emerald-600 rounded-xl text-[10px] font-black italic">קבע תור מהיר</button>
      </div>
    )
  },
  beauty: {
    id: "beauty",
    title: "רויטל קוסמטיקה",
    subtitle: "יופי מבוסס AI",
    color: "bg-pink-500",
    text: "text-pink-500",
    icon: <Scissors className="text-white" size={24} />,
    content: (
      <div className="space-y-4 text-right">
        <div className="bg-pink-500/10 p-4 rounded-2xl border border-pink-500/20">
          <p className="text-[10px] font-bold text-pink-500">היומן שלך מסודר</p>
          <p className="text-[11px] text-white/80">3 לקוחות מחכות היום</p>
        </div>
        <div className="h-20 bg-white/5 rounded-xl border border-white/10" />
      </div>
    )
  }
};

export default function HomePage() {
  const [mode, setMode] = useState(BUSINESS_MODES.moving);

  return (
    <div className="min-h-screen bg-[#020510] text-white font-sans overflow-x-hidden" dir="rtl">
      <Navigation />

      <main className="max-w-7xl mx-auto px-6 pt-32 pb-20">
        
        {/* Hero Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8 text-right">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-black uppercase">
              <Sparkles size={14} /> Rami-IT Enterprise Solutions
            </motion.div>
            
            <h1 className="text-6xl md:text-[85px] font-black leading-[0.9] italic tracking-tighter">
              העסק שלך <br /> <span className={mode.text}>באוטומט מלא.</span>
            </h1>

            <p className="text-xl text-slate-400 max-w-lg leading-relaxed font-medium italic">
              תן ל-AI לבנות לך הצעות מחיר, לחשב מסלולי הובלה, ולסדר לך את היומן במקומך. הכל מחובר ל-Google ו-WhatsApp.
            </p>

            {/* כפתורי ה"זיקית" */}
            <div className="flex flex-wrap gap-4 pt-4">
              <button onClick={() => setMode(BUSINESS_MODES.moving)} className={`px-6 py-3 rounded-2xl flex items-center gap-2 font-black transition-all ${mode.id === 'moving' ? 'bg-blue-600 scale-105 shadow-xl shadow-blue-500/20' : 'bg-white/5 border border-white/10 hover:bg-white/10'}`}>
                <Truck size={18} /> הובלות
              </button>
              <button onClick={() => setMode(BUSINESS_MODES.dental)} className={`px-6 py-3 rounded-2xl flex items-center gap-2 font-black transition-all ${mode.id === 'dental' ? 'bg-emerald-600 scale-105 shadow-xl shadow-emerald-500/20' : 'bg-white/5 border border-white/10 hover:bg-white/10'}`}>
                <HeartPulse size={18} /> מרפאה
              </button>
              <button onClick={() => setMode(BUSINESS_MODES.beauty)} className={`px-6 py-3 rounded-2xl flex items-center gap-2 font-black transition-all ${mode.id === 'beauty' ? 'bg-pink-600 scale-105 shadow-xl shadow-pink-500/20' : 'bg-white/5 border border-white/10 hover:bg-white/10'}`}>
                <Scissors size={18} /> יופי
              </button>
            </div>

            <div className="pt-8">
              <Link href="https://rami-seven.vercel.app/trial" className="inline-flex items-center gap-4 px-10 py-5 bg-white text-black font-black rounded-[2rem] text-xl shadow-2xl hover:scale-105 transition-all">
                צור אפליקציה לעסק שלך עוד היום <ChevronRight />
              </Link>
            </div>
          </div>

          {/* iPhone Simulator */}
          <div className="relative flex justify-center py-10">
            <div className="relative border-[12px] border-slate-900 rounded-[3.5rem] h-[600px] w-[300px] bg-black shadow-2xl overflow-hidden">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-7 bg-slate-900 rounded-b-3xl z-50" />
              <AnimatePresence mode="wait">
                <motion.div key={mode.id} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="h-full flex flex-col p-6">
                  <div className="flex items-center gap-3 mb-8 mt-4">
                    <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${mode.color}`}>
                      {mode.icon}
                    </div>
                    <div className="text-right">
                      <p className="text-[11px] font-black text-white italic">{mode.title}</p>
                      <p className="text-[8px] text-white/40 font-bold uppercase">{mode.subtitle}</p>
                    </div>
                  </div>
                  {mode.content}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* --- סרט נע של לוגואים (Tech Stack Marquee) --- */}
        <div className="mt-32 border-y border-white/5 py-12 overflow-hidden bg-white/[0.02]">
          <p className="text-center text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 mb-10 italic">
            מומחה באינטגרציות ומערכות מבוססות
          </p>
          <div className="flex w-[200%] gap-16 animate-marquee">
            {[...TECH_LOGOS, ...TECH_LOGOS].map((logo, i) => (
              <div key={i} className="flex items-center gap-4 grayscale opacity-40 hover:grayscale-0 hover:opacity-100 transition-all cursor-default min-w-[150px]">
                <img src={logo.url} alt={logo.name} className="h-8 w-8 object-contain" />
                <span className="text-sm font-black italic">{logo.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* סקשן ביקורות */}
        <section className="mt-32 grid grid-cols-1 md:grid-cols-3 gap-8">
          <ReviewCard name="אבי מ." text="הובלה מטייבה להרצליה תוקתקה! המעקב החי פשוט גאוני." type="הובלות" />
          <ReviewCard name="ליטל ד." text="קבעתי תור לדר משה, האתר פשוט ונוח. מחייכת ונהנית מהתוצאה!" type="מרפאה" />
          <ReviewCard name="רויטל הקוסמטיקאית" text="ה-AI סידר לי את היומן בצורה מקצועית. סוף סוף יש שקט." type="יופי" />
        </section>
      </main>

      <ContactSection />

      <style jsx global>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(50%); }
        }
        .animate-marquee {
          animation: marquee 25s linear infinite;
        }
      `}</style>
    </div>
  );
}

function ReviewCard({ name, text, type }: any) {
  return (
    <div className="bg-white/5 border border-white/10 p-8 rounded-[2.5rem] space-y-4">
      <div className="flex gap-1 text-amber-500">
        {[...Array(5)].map((_, i) => <Star key={i} size={14} fill="currentColor" />)}
      </div>
      <p className="text-lg font-bold italic">"{text}"</p>
      <p className="text-xs font-black opacity-40 uppercase tracking-widest">{name} | {type}</p>
    </div>
  );
}
