"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Truck, HeartPulse, Scissors, Star, 
  MapPin, Clock, ShieldCheck, Sparkles,
  ChevronRight, Calendar, Smartphone
} from "lucide-react";
import Link from "next/link";
import Navigation from "../components/Navigation";
import ContactSection from "../components/ContactSection";

// מאגר העסקים לסימולטור ה"זיקית"
const BUSINESS_MODES = {
  moving: {
    id: "moving",
    title: "הובלות אבו אל ראסם",
    subtitle: "ניהול לוגיסטי חכם",
    color: "bg-blue-600",
    text: "text-blue-500",
    icon: <Truck className="text-white" size={24} />,
    mockupContent: (
      <div className="space-y-4">
        <div className="bg-blue-500/10 p-4 rounded-2xl border border-blue-500/20">
          <p className="text-[10px] font-bold text-blue-500 uppercase">הצעת מחיר AI</p>
          <p className="text-lg font-black italic text-white">₪1,075.00</p>
        </div>
        <div className="bg-white/5 p-3 rounded-xl border border-white/10 flex items-center justify-between">
          <span className="text-[10px] text-white">משאית בדרך לטייבה</span>
          <div className="w-2 h-2 bg-green-500 rounded-full animate-ping" />
        </div>
        <button className="w-full py-3 bg-blue-600 rounded-xl text-[10px] font-black uppercase italic">עקוב אחרי ההובלה</button>
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
    mockupContent: (
      <div className="space-y-4">
        <div className="bg-emerald-500/10 p-4 rounded-2xl border border-emerald-500/20">
          <p className="text-[10px] font-bold text-emerald-500 uppercase">תור קרוב</p>
          <p className="text-lg font-black italic text-white">היום, 16:30</p>
        </div>
        <div className="space-y-2">
          <div className="p-3 bg-white/5 rounded-xl border border-white/10 text-[10px] text-white">ניקוי אבנית - 150₪</div>
          <div className="p-3 bg-white/5 rounded-xl border border-white/10 text-[10px] text-white">הלבנה - 800₪</div>
        </div>
        <button className="w-full py-3 bg-emerald-500 rounded-xl text-[10px] font-black uppercase italic">קבע תור מהיר</button>
      </div>
    )
  },
  beauty: {
    id: "beauty",
    title: "רויטל קוסמטיקה",
    subtitle: "יופי וטיפוח מבוסס AI",
    color: "bg-pink-500",
    text: "text-pink-500",
    icon: <Scissors className="text-white" size={24} />,
    mockupContent: (
      <div className="space-y-4">
        <div className="bg-pink-500/10 p-4 rounded-2xl border border-pink-500/20 text-right">
          <p className="text-[10px] font-bold text-pink-500 uppercase">היומן שלך מסודר</p>
          <p className="text-[11px] font-medium text-white/80">3 לקוחות מחכות היום</p>
        </div>
        <div className="flex gap-2">
          <div className="flex-1 bg-white/5 p-3 rounded-xl border border-white/10 text-center">
            <p className="text-[12px] font-bold text-white">9:00</p>
            <p className="text-[8px] text-pink-400">פדיקור</p>
          </div>
          <div className="flex-1 bg-white/5 p-3 rounded-xl border border-white/10 text-center">
            <p className="text-[12px] font-bold text-white">11:30</p>
            <p className="text-[8px] text-pink-400">לק ג'ל</p>
          </div>
        </div>
        <button className="w-full py-3 bg-pink-500 rounded-xl text-[10px] font-black uppercase italic">פתח יומן AI</button>
      </div>
    )
  }
};

const REVIEWS = [
  { name: "אבי מ.", text: "המעבר הכי מהיר שהיה לי! אבו ראסם מקצוען, המעקב החי נתן לי שקט נפשי.", stars: 5, type: "moving" },
  { name: "ליטל ד.", text: "קבעתי תור לדר' משה דרך האתר, הכל היה פשוט וקליל. אני מחייכת ונהנית מהתוצאה!", stars: 5, type: "dental" },
  { name: "רויטל הקוסמטיקאית", text: "ה-AI סידר לי את היומן בצורה מושלמת. כבר לא צריכה להתעסק עם הודעות וואטסאפ כל היום.", stars: 5, type: "beauty" }
];

export default function HomePage() {
  const [mode, setMode] = useState(BUSINESS_MODES.moving);

  return (
    <div className="min-h-screen bg-[#020510] text-white font-sans overflow-x-hidden" dir="rtl">
      <Navigation />

      <main className="max-w-7xl mx-auto px-6 pt-32 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* צד שיווקי */}
          <div className="space-y-8 text-right">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-black uppercase tracking-widest">
              <Sparkles size={14} /> Rami-IT Systems v3.0
            </motion.div>
            
            <h1 className="text-6xl md:text-[85px] font-black leading-[0.9] italic tracking-tighter">
              העסק שלך <br /> <span className={mode.text}>באוטומט מלא.</span>
            </h1>

            <p className="text-xl text-slate-400 max-w-lg leading-relaxed font-medium italic">
              תן ל-AI לבנות לך הצעות מחיר, לחשב מסלולי הובלה, ולסדר לך את היומן במקומך. הכל באפליקציה אחת ממותגת.
            </p>

            {/* כפתורי בחירת עסק (זיקית) */}
            <div className="flex flex-wrap gap-4 pt-4">
              <button onClick={() => setMode(BUSINESS_MODES.moving)} className={`px-6 py-3 rounded-2xl flex items-center gap-2 font-black transition-all ${mode.id === 'moving' ? 'bg-blue-600 scale-105 shadow-lg shadow-blue-500/20' : 'bg-white/5 border border-white/10 hover:bg-white/10'}`}>
                <Truck size={18} /> הובלות
              </button>
              <button onClick={() => setMode(BUSINESS_MODES.dental)} className={`px-6 py-3 rounded-2xl flex items-center gap-2 font-black transition-all ${mode.id === 'dental' ? 'bg-emerald-600 scale-105 shadow-lg shadow-emerald-500/20' : 'bg-white/5 border border-white/10 hover:bg-white/10'}`}>
                <HeartPulse size={18} /> מרפאת שיניים
              </button>
              <button onClick={() => setMode(BUSINESS_MODES.beauty)} className={`px-6 py-3 rounded-2xl flex items-center gap-2 font-black transition-all ${mode.id === 'beauty' ? 'bg-pink-600 scale-105 shadow-lg shadow-pink-500/20' : 'bg-white/5 border border-white/10 hover:bg-white/10'}`}>
                <Scissors size={18} /> קוסמטיקה
              </button>
            </div>

            <div className="pt-8">
              <Link href="/create-business" className="inline-flex items-center gap-4 px-10 py-5 bg-white text-black font-black rounded-[2rem] text-xl shadow-2xl hover:scale-105 transition-all">
                צור אפליקציה לעסק שלך עוד היום <ChevronRight />
              </Link>
            </div>
          </div>

          {/* iPhone Simulator דינמי */}
          <div className="relative flex justify-center py-10">
            <div className="relative border-[12px] border-slate-900 rounded-[3.5rem] h-[640px] w-[310px] bg-black shadow-2xl overflow-hidden shadow-blue-500/10">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-7 bg-slate-900 rounded-b-3xl z-50" />
              
              <AnimatePresence mode="wait">
                <motion.div 
                  key={mode.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.1 }}
                  transition={{ duration: 0.4 }}
                  className="h-full flex flex-col p-6"
                >
                  <div className="flex items-center justify-between mb-8 mt-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shadow-lg ${mode.color}`}>
                        {mode.icon}
                      </div>
                      <div className="text-right">
                        <p className="text-[11px] font-black text-white italic">{mode.title}</p>
                        <p className="text-[8px] text-white/40 font-bold uppercase tracking-tighter">{mode.subtitle}</p>
                      </div>
                    </div>
                  </div>
                  {mode.mockupContent}
                  <div className="mt-auto space-y-3">
                    <div className="h-1 w-20 bg-white/10 rounded-full mx-auto" />
                    <p className="text-center text-[8px] text-white/20 font-bold tracking-widest uppercase">Powered by SabanOS</p>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* סקשן ביקורות (גוגל סטייל) */}
        <section className="mt-40">
          <h3 className="text-center text-3xl font-black mb-12 italic">מה אומרים עלינו בגוגל? ⭐⭐⭐⭐⭐</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {REVIEWS.map((rev, i) => (
              <motion.div 
                whileHover={{ y: -10 }}
                key={i} 
                className="bg-white/5 border border-white/10 p-8 rounded-[2.5rem] space-y-4"
              >
                <div className="flex gap-1 text-amber-500">
                  {[...Array(rev.stars)].map((_, s) => <Star key={s} size={16} fill="currentColor" />)}
                </div>
                <p className="text-lg font-bold italic leading-relaxed">"{rev.text}"</p>
                <div className="flex items-center gap-3 border-t border-white/10 pt-4">
                  <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center font-black text-xs">
                    {rev.name[0]}
                  </div>
                  <p className="text-sm font-black opacity-60 italic">{rev.name}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      </main>

      <ContactSection />
    </div>
  );
}
