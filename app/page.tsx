"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Bell, ShieldCheck, Zap, MessageCircle, 
  Star, Clock, CheckCircle2, ShoppingCart, 
  Calendar, CreditCard, Send, Smartphone, Gift, EyeOff
} from "lucide-react";

// רכיבים (וודא שהם קיימים בתיקיית components שלך)
import Navigation from "../components/Navigation";
import ContactSection from "../components/ContactSection";

// לוגואים רצים (Tech Stack)
const techLogos = [
  { name: "Google", src: "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg" },
  { name: "Microsoft", src: "https://upload.wikimedia.org/wikipedia/commons/9/96/Microsoft_logo_%282012%29.svg" },
  { name: "Gemini", src: "https://www.gstatic.com/lamda/images/gemini-sparkle_360_08d13264c7810777326090e5015b3e20.svg" },
  { name: "Firebase", src: "https://www.vectorlogo.zone/logos/firebase/firebase-icon.svg" },
  { name: "Vercel", src: "https://www.svgrepo.com/show/342111/vercel.svg" },
  { name: "OneSignal", src: "https://upload.wikimedia.org/wikipedia/commons/f/f1/OneSignal_logo.svg" },
  { name: "WhatsApp", src: "https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" },
];

const reviews = [
  {
    name: "אבי ביטון",
    role: "בעל מספרת VIP",
    text: "לא האמנתי שיש כלי יותר חזק מוואטסאפ רגיל. המערכת שראמי בנה לי משלבת ניהול תורים אוטומטי בתוך הצ'אט. זה פשוט עובד 24/7 בזמן שאני ישן!",
    stars: 5,
    img: "https://cdn.dribbble.com/userupload/29736698/file/original-1ef955c551eede8401da24a210ad3a86.jpg?resize=1024x768&vertical=center"
  },
  {
    name: "מיכל לוי",
    role: "סטודיו פילאטיס",
    text: "מאז הפנייה לראמי הוא ליווה אותי בכל שעה. האפליקציה הייתה באוויר תוך פחות מ-4 ימים! לקוחות קובעות שיעורים ב-3 בלילה והיומן שלי מתמלא לבד.",
    stars: 5,
    img: "https://cdn.dribbble.com/userupload/29736698/file/original-1ef955c551eede8401da24a210ad3a86.jpg?resize=1024x768&vertical=center"
  },
  {
    name: "דורון יצחקי",
    role: "קליניקה לקוסמטיקה",
    text: "ה-AI לומד את העסק שלך ופשוט עונה במקומך. התשלום עובר בביט או באשראי ישירות מהצ'אט. המכירות עלו ב-40% בלי מגע אדם.",
    stars: 5,
    img: "https://cdn.dribbble.com/userupload/29736698/file/original-1ef955c551eede8401da24a210ad3a86.jpg?resize=1024x768&vertical=center"
  }
];

export default function HomePage() {
  const [chatStep, setChatStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setChatStep((prev) => (prev < 4 ? prev + 1 : 0));
    }, 4500);
    return () => clearInterval(interval);
  }, []);

  const openWhatsApp = () => {
    window.open(`https://wa.me/972508861080?text=${encodeURIComponent("שלום רמי, אני מעוניין בסימולציה לעסק שלי עם הטבת ה-15%!")}`, "_blank");
  };

  return (
    <main className="min-h-screen bg-[#F8FAFC] dark:bg-[#020617] transition-colors duration-500 pb-20 overflow-x-hidden text-right" dir="rtl">
      <Navigation />

      {/* --- HERO & iPHONE SIMULATOR --- */}
      <section className="relative pt-32 pb-20 px-6">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-gradient-to-b from-green-500/10 via-cyan-500/5 to-transparent blur-3xl opacity-60" />
        
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16 relative z-10">
          
          {/* CONTENT AREA */}
          <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} className="flex-1 space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20 text-green-600 font-black text-xs uppercase tracking-widest">
              <Zap size={14} fill="currentColor" /> <span>מערכת הדגל הנמכרת ביותר ל-2025</span>
            </div>
            
            <h1 className="text-6xl md:text-8xl font-black dark:text-white tracking-tighter leading-none">
              העסק שלך <br /> <span className="text-green-500">עובד בשבילך.</span>
            </h1>
            
            <p className="text-xl text-slate-500 dark:text-slate-400 max-w-xl leading-relaxed">
              למה לעבוד קשה כשה-AI יכול לעשות את זה במקומך? מענה 24/7, קביעת תורים, קטלוג מוצרים וסליקה מלאה ישירות בוואטסאפ – **ללא צורך בחנות האפליקציות**.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <div className="flex items-center gap-3 bg-white dark:bg-white/5 p-4 rounded-2xl border border-slate-200 dark:border-white/10 shadow-sm">
                  <CheckCircle2 className="text-blue-500" />
                  <span className="text-sm font-bold dark:text-slate-200">התקנה בסיסית חינמית (Firebase/Gemini)</span>
               </div>
               <div className="flex items-center gap-3 bg-white dark:bg-white/5 p-4 rounded-2xl border border-slate-200 dark:border-white/10 shadow-sm">
                  <Clock className="text-green-500" />
                  <span className="text-sm font-bold dark:text-slate-200">זמינות מלאה 3:00 לפנות בוקר</span>
               </div>
            </div>

            <div className="pt-6">
              <button onClick={openWhatsApp} className="px-12 py-6 bg-green-500 text-black font-black rounded-3xl text-2xl shadow-[0_20px_50px_rgba(34,197,94,0.3)] hover:scale-105 transition-all">
                קבל 15% הנחה להקמה עכשיו
              </button>
            </div>
          </motion.div>

          {/* iPHONE SIMULATOR - THE WOW FACTOR */}
          <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} className="flex-1 relative">
            <div className="relative mx-auto border-[12px] border-slate-900 rounded-[4rem] h-[750px] w-[350px] shadow-2xl bg-black overflow-hidden border-b-[24px]">
              <div className="absolute top-0 w-full h-8 bg-black z-40 flex justify-center">
                <div className="w-24 h-5 bg-slate-900 rounded-b-2xl" />
              </div>

              {/* WHATSAPP PWA UI */}
              <div className="h-full bg-[#0b141a] flex flex-col">
                <div className="bg-[#1f2c34] p-5 pt-12 flex items-center justify-between border-b border-white/5 shadow-md">
                   <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center font-black">AI</div>
                      <div>
                         <p className="text-white text-xs font-bold">העוזר החכם של העסק</p>
                         <p className="text-[8px] text-green-500">עונה בזמן אמת...</p>
                      </div>
                   </div>
                   <div className="flex gap-3 text-slate-400">
                      <CreditCard size={14} />
                      <Calendar size={14} />
                   </div>
                </div>

                <div className="flex-1 p-4 space-y-4 overflow-hidden">
                  <AnimatePresence mode="wait">
                    {chatStep >= 0 && (
                      <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} className="bg-[#1f2c34] p-3 rounded-2xl rounded-tr-none text-white text-[11px] max-w-[85%] self-end mr-auto">
                         "שלום! ראיתי שאת מעוניינת בטיפול קוסמטי. ה-AI שלי לומד את הלו"ז ומוצא לך מקום."
                      </motion.div>
                    )}
                    {chatStep >= 1 && (
                      <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} className="bg-[#005c4b] p-3 rounded-2xl rounded-tl-none text-white text-[11px] max-w-[80%]">
                         "כן, למחר בבוקר בבקשה."
                      </motion.div>
                    )}
                    {chatStep >= 2 && (
                      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-[#1f2c34] p-3 rounded-2xl text-white text-[11px] self-end mr-auto border border-green-500/30">
                         <p>"נקבע לך תור למחר ב-09:00! נשלחה תזכורת ב-OneSignal. תרצי להוסיף סדרת טיפולים במבצע?"</p>
                         <div className="mt-2 bg-white/5 p-2 rounded-xl flex items-center gap-2 border border-white/10">
                            <div className="w-8 h-8 bg-green-500/20 rounded-md" />
                            <span className="text-[8px]">סדרת טיפולים (10+2)</span>
                            <span className="text-[8px] font-bold text-green-400">₪599</span>
                         </div>
                      </motion.div>
                    )}
                    {chatStep >= 3 && (
                      <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="bg-white p-3 rounded-2xl flex items-center justify-between text-black shadow-2xl">
                         <div className="flex items-center gap-2">
                            <ShoppingCart size={16} className="text-green-600" />
                            <span className="text-[10px] font-black italic uppercase">Checkout</span>
                         </div>
                         <span className="text-[9px] font-bold">סה"כ לתשלום: ₪599</span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* BOTTOM TAB - BLIND EYE */}
                <div className="bg-[#1f2c34] p-4 border-t border-white/5 flex items-center justify-between">
                   <div className="flex items-center gap-2">
                      <EyeOff size={14} className="text-purple-400" />
                      <span className="text-[8px] font-bold text-slate-400 tracking-widest">BLIND-EYE MODE ACTIVE</span>
                   </div>
                   <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
                </div>
              </div>
            </div>

            {/* FLOATING BADGE */}
            <div className="absolute -bottom-10 -right-10 bg-white dark:bg-slate-900 p-8 rounded-[3rem] shadow-2xl border border-slate-200 dark:border-white/10 text-center">
               <p className="text-5xl font-black text-green-500">135+</p>
               <p className="text-[10px] font-black uppercase tracking-widest dark:text-slate-400">עסקים פעילים</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* --- LOGO TICKER --- */}
      <div className="py-12 bg-white/5 border-y border-white/5 overflow-hidden flex whitespace-nowrap relative z-20">
        <motion.div className="flex gap-24 flex-none items-center" animate={{ x: ["0%", "-50%"] }} transition={{ duration: 25, repeat: Infinity, ease: "linear" }}>
          {[...techLogos, ...techLogos].map((l, i) => (
            <img key={i} src={l.src} alt={l.name} className="h-8 md:h-12 opacity-30 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-500" />
          ))}
        </motion.div>
      </div>

      {/* --- REVIEWS (GOOGLE STYLE) --- */}
      <section className="py-24 bg-slate-50 dark:bg-slate-900/40">
        <div className="max-w-7xl mx-auto px-6">
           <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-black dark:text-white mb-4">המהפכה של העסקים</h2>
              <p className="text-slate-500 dark:text-slate-400 font-bold italic">"לא חזרנו אחורה מאז שראמי נכנס לתמונה"</p>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {reviews.map((rev, i) => (
                <motion.div key={i} whileHover={{ y: -10 }} className="bg-white dark:bg-slate-800 p-10 rounded-[2.5rem] shadow-xl border border-slate-100 dark:border-white/5 relative">
                   <div className="absolute top-6 left-6 flex gap-1 text-yellow-400">
                      {[...Array(5)].map((_, s) => <Star key={s} size={12} fill="currentColor" />)}
                   </div>
                   <div className="flex items-center gap-4 mb-6">
                      <img src={rev.img} className="w-14 h-14 rounded-full border-2 border-green-500 object-cover" />
                      <div className="text-right">
                         <p className="font-black dark:text-white text-lg leading-tight">{rev.name}</p>
                         <p className="text-xs text-slate-500 font-bold">{rev.role}</p>
                      </div>
                   </div>
                   <p className="text-slate-600 dark:text-slate-300 italic text-sm leading-relaxed mb-6">"{rev.text}"</p>
                   <div className="flex items-center gap-2 text-[10px] font-black uppercase text-blue-500 bg-blue-500/5 w-fit px-3 py-1 rounded-full border border-blue-500/10">
                      <CheckCircle2 size={10} /> פורסם בגוגל עסקים
                   </div>
                </motion.div>
              ))}
           </div>
        </div>
      </section>

      {/* --- CONTACT SECTION --- */}
      <section id="contact">
        <ContactSection />
      </section>

      {/* FLOATING ACTION BUTTON */}
      <motion.button 
        onClick={openWhatsApp}
        className="fixed bottom-8 left-8 p-6 bg-green-500 text-black rounded-full shadow-[0_20px_60px_rgba(34,197,94,0.5)] z-50 hover:scale-110 transition-all flex items-center justify-center"
      >
        <MessageCircle size={32} />
      </motion.button>

    </main>
  );
}
