"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Rocket, Zap, Star, CheckCircle2, 
  Smartphone, MessageSquare, Bell, Calendar, 
  ArrowLeft, MousePointer2 
} from "lucide-react";
import Link from "next/link";

// רכיבים
import Navigation from "../components/Navigation";
import ContactSection from "../components/ContactSection";

const techLogos = [
  { name: "Google", src: "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg" },
  { name: "Microsoft", src: "https://upload.wikimedia.org/wikipedia/commons/9/96/Microsoft_logo_%282012%29.svg" },
  { name: "Firebase", src: "https://www.vectorlogo.zone/logos/firebase/firebase-icon.svg" },
  { name: "Vercel", src: "https://www.svgrepo.com/show/342111/vercel.svg" },
  { name: "OneSignal", src: "https://upload.wikimedia.org/wikipedia/commons/f/f1/OneSignal_logo.svg" },
  { name: "WhatsApp", src: "https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" },
];

const reviews = [
  { name: "אבי ביטון", role: "מספרת VIP", text: "לא האמנתי שיש כלי כזה. המערכת שראמי בנה לי מנהלת תורים אוטומטית. זה עובד 24/7 בזמן שאני ישן!", stars: 5 },
  { name: "מיכל לוי", role: "סטודיו פילאטיס", text: "הכלי פשוט הכיר לי את כל הצדדים של העסק בצורה מקצועית. הלקוחות קובעות ב-3 בלילה והיומן מתמלא לבד.", stars: 5 },
  { name: "עמאר גוהר", role: "יופי וטיפוח", text: "מהרגע שנרשמתי, הכל רץ. הלוגו שלי מופיע, ההתראות מגיעות לנייד, וה-AI סוגר לי לקוחות בוואטסאפ.", stars: 5 },
  { name: "דניאל אברהם", role: "חומרי בניין", text: "ייעוץ שיווקי וטכנולוגי ברמה הכי גבוהה שיש. המערכת חוסכת לי מזכירה וזמן יקר.", stars: 5 }
];

export default function HomePage() {
  const [chatStep, setChatStep] = useState(0);
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        setChatStep((prev) => (prev < 3 ? prev + 1 : 0));
        if (chatStep < 3) {
          const audio = new Audio("/sounds/whatsapp.mp3");
          audio.play().catch(() => {});
        }
      }, 1500);
    }, 5000);
    return () => clearInterval(interval);
  }, [chatStep]);

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-[#020617] text-right transition-colors duration-300" dir="rtl">
      <Navigation />

      {/* Hero Section */}
      <section className="relative pt-32 pb-16 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16">
          
          <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} className="flex-1 space-y-8 z-10">
            <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-green-500/10 text-green-500 text-xs font-black uppercase tracking-widest border border-green-500/20">
              <Zap size={14} /> AI Business Revolution
            </div>
            <h1 className="text-6xl md:text-8xl font-black dark:text-white leading-tight tracking-tighter italic">
              העסק שלך <br /> <span className="text-green-500 underline decoration-white/10">עובד בשבילך.</span>
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-400 max-w-xl leading-relaxed font-medium">
              ניהול תורים, קטלוג מוצרים וסנכרון יומנים מלא ישירות בוואטסאפ. המערכת שהופכת פניות למזומן, 24/7.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 items-center">
              <Link href="/trial" className="w-full sm:w-auto px-12 py-6 bg-green-500 text-black font-black rounded-[2rem] text-2xl shadow-2xl hover:scale-105 transition-all flex items-center justify-center gap-3">
                התחל ניסיון חינם <Rocket size={24} />
              </Link>
              <div className="flex items-center gap-2 text-slate-400 font-bold italic">
                <CheckCircle2 size={18} className="text-green-500" /> קבל 15% הנחה היום
              </div>
            </div>
          </motion.div>

          {/* iPHONE SIMULATOR */}
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex-1 relative z-10">
            <div className="relative mx-auto border-[12px] border-slate-900 rounded-[3.5rem] h-[650px] w-[320px] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] bg-black overflow-hidden border-b-[20px]">
              <div className="h-full bg-[#0b141a] flex flex-col font-sans">
                <div className="bg-[#1f2c34] p-5 pt-10 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center font-black text-black italic">AI</div>
                  <div>
                    <p className="text-white text-xs font-bold">שירה קוסמטיקה - SabanOS</p>
                    <p className="text-[10px] text-green-500">{isTyping ? "מקליד/ה..." : "מחובר/ת"}</p>
                  </div>
                </div>
                <div className="flex-1 p-4 space-y-4">
                  <AnimatePresence>
                    {chatStep >= 0 && (
                      <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="bg-[#1f2c34] p-3 rounded-2xl rounded-tr-none text-white text-[11px] max-w-[85%] mr-auto shadow-md">
                        שלום! אני העוזר של שירה. רוצה לקבוע תור לטיפול פנים?
                      </motion.div>
                    )}
                    {chatStep >= 1 && (
                      <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="bg-[#005c4b] p-3 rounded-2xl rounded-tl-none text-white text-[11px] max-w-[80%] ml-auto shadow-md">
                        כן, יש מקום למחר?
                      </motion.div>
                    )}
                    {chatStep >= 2 && (
                      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-[#1f2c34] p-3 rounded-2xl rounded-tr-none text-white text-[11px] max-w-[85%] mr-auto border border-green-500/30">
                        בוודאי! מצאתי לך מקום ב-10:00. רשמתי אותך ביומן! ✅
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* TECH TICKER - לוגואים רצים */}
      <div className="py-12 bg-white/5 border-y border-white/5 overflow-hidden">
        <div className="flex gap-12 animate-infinite-scroll">
          {[...techLogos, ...techLogos].map((logo, i) => (
            <img key={i} src={logo.src} alt={logo.name} className="h-8 opacity-30 grayscale hover:grayscale-0 hover:opacity-100 transition-all cursor-pointer" />
          ))}
        </div>
      </div>

      {/* REVIEWS SECTION */}
      <section className="py-24 max-w-7xl mx-auto px-6">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl font-black italic dark:text-white">בעלי עסקים <span className="text-green-500 underline">משבחים</span></h2>
          <p className="text-slate-500">הצטרפו למאות עסקים שהפכו את הוואטסאפ למכונת עבודה</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {reviews.map((rev, i) => (
            <div key={i} className="bg-white dark:bg-white/5 p-8 rounded-[2.5rem] border border-slate-200 dark:border-white/10 flex flex-col gap-4 hover:scale-105 transition-all shadow-xl">
              <div className="flex gap-1 text-yellow-500">
                {[...Array(rev.stars)].map((_, s) => <Star key={s} size={16} fill="currentColor" />)}
              </div>
              <p className="text-slate-700 dark:text-slate-300 font-medium italic leading-relaxed">"{rev.text}"</p>
              <div className="mt-auto pt-4 border-t border-slate-100 dark:border-white/5">
                <p className="font-black dark:text-white">{rev.name}</p>
                <p className="text-xs text-green-500 font-bold uppercase">{rev.role}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-24 bg-green-500 dark:bg-green-600 rounded-[4rem] mx-6 mb-24 overflow-hidden relative">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12 relative z-10">
          {[
            { step: "01", title: "הרשמה מהירה", desc: "ממלאים פרטי עסק בטופס הדיגיטלי שלנו ב-3 שלבים." },
            { step: "02", title: "ה-AI לומד אותך", desc: "סנכרון יומנים, מחירונים והגדרת קול המותג שלך." },
            { step: "03", title: "התחלת עבודה", desc: "הלקוחות סוגרים תורים ואתה מקבל התראות פוש לנייד." }
          ].map((item, i) => (
            <div key={i} className="text-black">
              <div className="text-5xl font-black opacity-20 mb-4">{item.step}</div>
              <h3 className="text-2xl font-black mb-2 italic">{item.title}</h3>
              <p className="font-bold opacity-80">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <ContactSection />
    </main>
  );
}
