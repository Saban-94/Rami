"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Truck, HeartPulse, Scissors, Star, 
  ChevronRight, Sparkles, MapPin, Calendar, CheckCircle2
} from "lucide-react";
import Link from "next/link";
import Navigation from "../components/Navigation";
import ContactSection from "../components/ContactSection";

// לוגואים לסרט הנע
const TECH_LOGOS = [
  { name: "Google", url: "https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_\"G\"_logo.svg" },
  { name: "Microsoft", url: "https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg" },
  { name: "Gemini", url: "https://upload.wikimedia.org/wikipedia/commons/8/8a/Google_Gemini_logo.svg" },
  { name: "ChatGPT", url: "https://upload.wikimedia.org/wikipedia/commons/0/04/ChatGPT_logo.svg" },
  { name: "Firebase", url: "https://upload.wikimedia.org/wikipedia/commons/3/37/Firebase_Logo.svg" },
  { name: "WhatsApp", url: "https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" },
  { name: "Next.js", url: "https://upload.wikimedia.org/wikipedia/commons/8/8e/Nextjs-logo.svg" },
];

const BUSINESS_MODES = {
  moving: {
    id: "moving",
    mainTitle: "הובלות ולוגיסטיקה",
    subTitle: "תן ל-AI לבנות לך הצעות מחיר, לחשב מסלולי הובלה, ולנהל את המעברים במקומך. הכל מחובר ל-Google ו-WhatsApp.",
    colorText: "text-blue-500",
    btnColor: "bg-blue-600",
    icon: <Truck size={24} className="text-white" />,
    mockup: (
      <div className="space-y-4">
        <div className="bg-blue-500/10 p-4 rounded-2xl border border-blue-500/20">
          <p className="text-[10px] font-black text-blue-500 uppercase">ניתוח הובלה (AI)</p>
          <p className="text-lg font-black italic text-white leading-none mt-1">₪1,075.00</p>
        </div>
        <div className="flex items-center gap-2 bg-white/5 p-3 rounded-xl border border-white/10">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-ping" />
          <span className="text-[10px] font-bold text-white/80 italic text-nowrap">משאית מחוברת למפה בזמן אמת</span>
        </div>
      </div>
    )
  },
  dental: {
    id: "dental",
    mainTitle: "מרפאות ורופאים",
    subTitle: "ניהול תורים חכם מבוסס AI, אישור הגעה אוטומטי בוואטסאפ וסנכרון מלא ליומן שלכם. שירות מקצועי ללא הפסקה.",
    colorText: "text-emerald-500",
    btnColor: "bg-emerald-600",
    icon: <HeartPulse size={24} className="text-white" />,
    mockup: (
      <div className="space-y-4">
        <div className="bg-emerald-500/10 p-4 rounded-2xl border border-emerald-500/20">
          <p className="text-[10px] font-black text-emerald-500 uppercase">תור מאושר (AI)</p>
          <p className="text-lg font-black italic text-white leading-none mt-1">היום ב-16:30</p>
        </div>
        <div className="flex items-center gap-2 bg-white/5 p-3 rounded-xl border border-white/10">
          <CheckCircle2 size={14} className="text-emerald-500" />
          <span className="text-[10px] font-bold text-white/80 italic">נשלח אישור הגעה בוואטסאפ</span>
        </div>
      </div>
    )
  },
  beauty: {
    id: "beauty",
    mainTitle: "קוסמטיקה ויופי",
    subTitle: "הבוט שלנו יסגור לך לקוחות בזמן שאת עובדת. סנכרון יומן חכם, ניהול מלאי ותזכורות אוטומטיות לכל לקוחה.",
    colorText: "text-pink-500",
    btnColor: "bg-pink-600",
    icon: <Scissors size={24} className="text-white" />,
    mockup: (
      <div className="space-y-4">
        <div className="bg-pink-500/10 p-4 rounded-2xl border border-pink-500/20">
          <p className="text-[10px] font-black text-pink-500 uppercase">היומן שלך מלא</p>
          <p className="text-lg font-black italic text-white leading-none mt-1">12 תיאומים השבוע</p>
        </div>
        <div className="flex gap-2">
           <div className="h-10 flex-1 bg-white/5 rounded-lg border border-white/10" />
           <div className="h-10 flex-1 bg-pink-500/20 rounded-lg border border-pink-500/40" />
        </div>
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* CONTENT SECTION */}
          <div className="space-y-8 text-right">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-black uppercase tracking-widest">
              <Sparkles size={14} /> Rami-IT Global Systems
            </motion.div>
            
            <AnimatePresence mode="wait">
              <motion.div
                key={mode.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
              >
                <h1 className="text-6xl md:text-[85px] font-black leading-[0.9] italic tracking-tighter">
                  ענף {mode.mainTitle} <br /> <span className={mode.colorText}>באוטומט מלא.</span>
                </h1>
                <p className="text-xl text-slate-400 max-w-lg leading-relaxed font-medium italic mt-6">
                  {mode.subTitle}
                </p>
              </motion.div>
            </AnimatePresence>

            {/* BUTTONS - CHAMELEON MODE */}
            <div className="flex flex-wrap gap-4 pt-4">
              <button onClick={() => setMode(BUSINESS_MODES.moving)} className={`px-8 py-4 rounded-2xl flex items-center gap-3 font-black transition-all ${mode.id === 'moving' ? 'bg-blue-600 scale-110 shadow-xl' : 'bg-white/5 hover:bg-white/10 border border-white/10'}`}>
                <Truck size={20} /> הובלות
              </button>
              <button onClick={() => setMode(BUSINESS_MODES.dental)} className={`px-8 py-4 rounded-2xl flex items-center gap-3 font-black transition-all ${mode.id === 'dental' ? 'bg-emerald-600 scale-110 shadow-xl' : 'bg-white/5 hover:bg-white/10 border border-white/10'}`}>
                <HeartPulse size={20} /> מרפאה
              </button>
              <button onClick={() => setMode(BUSINESS_MODES.beauty)} className={`px-8 py-4 rounded-2xl flex items-center gap-3 font-black transition-all ${mode.id === 'beauty' ? 'bg-pink-600 scale-110 shadow-xl' : 'bg-white/5 hover:bg-white/10 border border-white/10'}`}>
                <Scissors size={20} /> יופי
              </button>
            </div>

            <div className="pt-8">
              <Link href="https://rami-seven.vercel.app/trial" className="inline-flex items-center gap-4 px-12 py-6 bg-white text-black font-black rounded-[2.5rem] text-2xl shadow-2xl hover:scale-105 transition-all active:scale-95">
                צור אפליקציה לעסק שלך <ChevronRight />
              </Link>
            </div>
          </div>

          {/* SIMULATOR SECTION */}
          <div className="relative flex justify-center py-10">
             <div className="relative border-[14px] border-slate-900 rounded-[3.5rem] h-[640px] w-[315px] bg-black shadow-2xl overflow-hidden shadow-blue-500/10">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-7 bg-slate-900 rounded-b-3xl z-50" />
                <AnimatePresence mode="wait">
                  <motion.div key={mode.id} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="h-full flex flex-col p-6">
                    <div className="flex items-center gap-3 mb-8 mt-4">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg ${mode.btnColor}`}>
                        {mode.icon}
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-black text-white italic leading-tight">SabanOS 3.0</p>
                        <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest">{mode.id === 'moving' ? 'הובלות' : mode.id === 'dental' ? 'רפואה' : 'קוסמטיקה'}</p>
                      </div>
                    </div>
                    {mode.mockup}
                    <div className="mt-auto pt-10 border-t border-white/5 space-y-2">
                       <div className="h-1 w-full bg-white/5 rounded-full" />
                       <p className="text-[8px] text-center font-black text-white/20 uppercase tracking-[0.4em]">Integrated Intelligence</p>
                    </div>
                  </motion.div>
                </AnimatePresence>
             </div>
          </div>
        </div>

        {/* TECH MARQUEE */}
        <div className="mt-40 border-y border-white/5 py-12 relative overflow-hidden">
           <div className="flex gap-16 animate-marquee whitespace-nowrap">
              {[...TECH_LOGOS, ...TECH_LOGOS].map((logo, i) => (
                <div key={i} className="flex items-center gap-4 opacity-30 hover:opacity-100 transition-opacity grayscale hover:grayscale-0">
                  <img src={logo.url} alt={logo.name} className="h-8 w-8 object-contain" />
                  <span className="text-lg font-black italic tracking-tighter uppercase">{logo.name}</span>
                </div>
              ))}
           </div>
        </div>

        {/* GOOGLE REVIEWS STYLE */}
        <section className="mt-32 grid grid-cols-1 md:grid-cols-3 gap-8 text-right">
          <ReviewCard name="אבי מ." stars={5} text="המעבר מטייבה להרצליה תוקתק! הצעת המחיר ב-AI הייתה מדויקת על השקל. פשוט מדהים." sub="הובלות" />
          <ReviewCard name="ליטל ד." stars={5} text="קבעתי תור לדר' משה, קיבלתי אישור בוואטסאפ באותו רגע. השירות הכי קליל שקיבלתי." sub="מרפאה" />
          <ReviewCard name="רויטל ק." stars={5} text="ה-AI מסדר לי את היומן בזמן שאני עם לקוחות. כבר לא צריכה מזכירה!" sub="קוסמטיקה" />
        </section>
      </main>

      <ContactSection />

      <style jsx global>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(50%); }
        }
        .animate-marquee {
          animation: marquee 30s linear infinite;
          display: flex;
          width: max-content;
        }
      `}</style>
    </div>
  );
}

function ReviewCard({ name, text, stars, sub }: any) {
  return (
    <div className="bg-white/5 border border-white/10 p-8 rounded-[2.5rem] hover:bg-white/[0.07] transition-all">
      <div className="flex gap-1 mb-4 text-amber-500">
        {[...Array(stars)].map((_, i) => <Star key={i} size={14} fill="currentColor" />)}
      </div>
      <p className="text-xl font-bold italic mb-4 leading-relaxed italic">"{text}"</p>
      <p className="text-xs font-black text-blue-400 uppercase tracking-widest">{name} | {sub}</p>
    </div>
  );
}
