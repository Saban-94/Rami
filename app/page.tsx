"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Bell, Zap, MessageCircle, Star, CheckCircle2, 
  ArrowLeft, Rocket, ShieldCheck, Smartphone 
} from "lucide-react";
import Link from "next/link";

// ייבוא רכיבים
import Navigation from "../components/Navigation";
import ContactSection from "../components/ContactSection";

const reviews = [
  { name: "יוסי כהן", role: "בעל 'כהן לוגיסטיקה'", content: "הכלי הזה פשוט הכיר לי את כל הצדדים של העסק בצורה מקצועית. האוטומציה חוסכת לי שעות בכל יום.", stars: 5 },
  { name: "מיכל לוי", role: "מנהלת 'מכון יופי בוטיק'", content: "הלקוחות בטוחות שהן מדברות עם מזכירה אישית. ה-AI סוגר לי תורים גם ב-2 בלילה!", stars: 5 },
  { name: "דניאל אברהם", role: "בעל 'דניאל חומרי בניין'", content: "היכולת לסנכרן בין וואטסאפ ליומן היא גיים צ'יינג'ר. פשוט מדהים.", stars: 5 },
  { name: "שרה משארוה", role: "בעלת 'קליניקת שירה'", content: "סוף סוף אני יכולה להתרכז בטיפולים ולא בטלפונים. המערכת הכי טובה בשוק.", stars: 5 }
];

export default function HomePage() {
  const [chatStep, setChatStep] = useState(0);
  const [isReady, setIsReady] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const win = window as any;
      win.OneSignalDeferred = win.OneSignalDeferred || [];
      win.OneSignalDeferred.push(async function(OneSignal: any) {
        await OneSignal.init({ appId: "91e6c6f7-5fc7-47d0-b114-b1694f408258" });
      });

      const interval = setInterval(() => {
        setChatStep((prev) => (prev < 1 ? prev + 1 : 0));
      }, 4500);
      return () => clearInterval(interval);
    }
  }, []);

  const handleActivation = () => {
    if (audioRef.current) {
      audioRef.current.play().then(() => {
        audioRef.current?.pause();
        setIsReady(true);
      }).catch(() => {});
    }
    const win = window as any;
    if (win.OneSignal) win.OneSignal.showNativePrompt();
  };

  return (
    <main className="min-h-screen bg-white dark:bg-[#020617] text-right transition-colors duration-300" dir="rtl">
      <Navigation />
      <audio ref={audioRef} src="/sounds/whatsapp.mp3" preload="auto" />

      {/* כפתור הפעלה צף - רק אם המשתמש עוד לא דורך את האודיו */}
      {!isReady && (
        <button
          onClick={handleActivation}
          className="fixed bottom-10 left-6 z-[999] bg-green-500 text-black px-6 py-4 rounded-3xl shadow-2xl animate-bounce font-black flex items-center gap-2 border-2 border-white/20"
        >
          <Bell size={20} /> הפעל חוויה מלאה
        </button>
      )}

      {/* --- HERO SECTION --- */}
      <section className="pt-32 pb-20 max-w-7xl mx-auto px-6 flex flex-col lg:flex-row items-center gap-16 overflow-hidden">
        <div className="flex-1 space-y-8 z-10">
          <div className="inline-block px-4 py-1 rounded-full bg-green-500/10 text-green-500 text-xs font-black uppercase tracking-widest border border-green-500/20">
            AI Business Revolution
          </div>
          <h1 className="text-6xl md:text-8xl font-black dark:text-white leading-none tracking-tighter italic">
            Saban<span className="text-green-500">OS</span>
          </h1>
          <p className="text-2xl text-slate-600 dark:text-slate-400 font-medium max-w-xl">
            הופכים את הוואטסאפ למנהל העסק שלך. אוטומציה חכמה, סנכרון יומנים וניהול לקוחות 24/7.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <Link 
              href="/trial"
              className="w-full sm:w-auto px-12 py-6 bg-green-500 text-black font-black rounded-[2rem] text-2xl shadow-xl hover:scale-105 transition-all flex items-center justify-center gap-3"
            >
              התחל 10 ימי ניסיון <Rocket size={24} />
            </Link>
            <p className="text-slate-400 font-bold italic text-sm">קבל 15% הנחה בהרשמה היום!</p>
          </div>
        </div>

        {/* SIMULATOR */}
        <div className="flex-1 relative w-full max-w-[400px]">
          <div className="relative mx-auto border-[12px] border-slate-900 rounded-[3.5rem] h-[600px] w-full shadow-2xl bg-[#0b141a] overflow-hidden">
             {/* תוכן הווטסאפ מהקוד הקודם */}
             <div className="bg-[#1f2c34] p-4 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-[10px] font-bold text-black italic">AI</div>
              <div className="text-white text-[12px] font-bold">העוזר של SabanOS</div>
            </div>
            <div className="p-4 space-y-4">
              <AnimatePresence mode="wait">
                {chatStep === 0 && (
                  <motion.div key="0" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="bg-[#1f2c34] p-3 rounded-2xl rounded-tr-none text-white text-sm mr-auto max-w-[80%] shadow-lg">
                    שלום! רוצה לקבוע תור או לראות קטלוג? אני כאן בשבילך.
                  </motion.div>
                )}
                {chatStep === 1 && (
                  <motion.div key="1" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="bg-[#005c4b] p-3 rounded-2xl rounded-tl-none text-white text-sm ml-auto max-w-[80%] shadow-lg">
                    כן, אני רוצה לקבוע תור למחר בבוקר.
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>

      {/* --- תהליך ההרשמה --- */}
      <section className="py-24 bg-slate-50 dark:bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl font-black text-center mb-16 dark:text-white">איך זה <span className="text-green-500">עובד?</span></h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            {[
              { title: "נרשמים למערכת", desc: "ממלאים פרטי עסק בטופס הדיגיטלי שלנו ב-3 שלבים פשוטים.", icon: <Smartphone className="text-blue-500 mx-auto mb-4" /> },
              { title: "ה-AI לומד אותך", desc: "המערכת מסנכרנת את היומן והמחירון שלך ובונה לך מוח עסקי.", icon: <Zap className="text-yellow-500 mx-auto mb-4" /> },
              { title: "העסק רץ לבד", desc: "הלקוחות סוגרים תורים בוואטסאפ ואתה מקבל התראות פוש לנייד.", icon: <ShieldCheck className="text-green-500 mx-auto mb-4" /> }
            ].map((step, i) => (
              <div key={i} className="relative p-8 bg-white dark:bg-white/5 rounded-[2.5rem] border border-slate-200 dark:border-white/10">
                {step.icon}
                <h3 className="text-xl font-bold mb-2 dark:text-white">{step.title}</h3>
                <p className="text-slate-500 dark:text-slate-400">{step.desc}</p>
                {i < 2 && <ArrowLeft className="hidden md:block absolute -left-6 top-1/2 -translate-y-1/2 text-slate-300" size={32} />}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- ביקורות בעלי עסקים --- */}
      <section className="py-24 max-w-7xl mx-auto px-6">
        <h2 className="text-4xl font-black text-center mb-16 dark:text-white italic">מה אומרים <span className="text-green-500">הלקוחות?</span></h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {reviews.map((rev, i) => (
            <div key={i} className="bg-white dark:bg-white/5 p-6 rounded-[2rem] border border-slate-200 dark:border-white/10 flex flex-col gap-4 shadow-sm">
              <div className="flex gap-1 text-yellow-500">
                {[...Array(rev.stars)].map((_, s) => <Star key={s} size={16} fill="currentColor" />)}
              </div>
              <p className="text-slate-700 dark:text-slate-300 font-medium italic">"{rev.content}"</p>
              <div className="mt-auto">
                <p className="font-black dark:text-white">{rev.name}</p>
                <p className="text-xs text-slate-500">{rev.role}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <ContactSection />
    </main>
  );
}
