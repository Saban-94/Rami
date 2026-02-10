"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Bell, ShieldCheck, Zap, MessageCircle, 
  TrendingUp, EyeOff, Smartphone, Gift,
  Star, Clock, CheckCircle2, ShoppingCart, 
  Calendar, CreditCard, Send
} from "lucide-react";

// רכיבי תשתית
import Navigation from "../components/Navigation";
import ContactSection from "../components/ContactSection";

const reviews = [
  {
    name: "אבי ביטון",
    role: "בעל מספרת VIP",
    text: "לא האמנתי שיש כלי יותר חזק מוואטסאפ. המערכת שראמי בנה לי משלבת ניהול תורים אוטומטי בתוך הצ'אט. זה פשוט עובד 24/7!",
    stars: 5,
    img: "https://i.pravatar.cc/150?u=avi"
  },
  {
    name: "מיכל לוי",
    role: "סטודיו פילאטיס",
    text: "מאז הפנייה לראמי הוא ליווה אותי מהתחלה ועד הסוף. מצאתי מענה לכל שאלה בכל שעה. האפליקציה הייתה באוויר תוך פחות מ-4 ימים!",
    stars: 5,
    img: "https://i.pravatar.cc/150?u=michal"
  },
  {
    name: "ד\"ר שגיא כהן",
    role: "מרפאת שיניים",
    text: "ה-AI עושה את העבודה במקומי. לקוחות קובעים תורים לבד, מקבלים תזכורות אוטומטיות, ואני רק מגיע לעבוד. גאוני.",
    stars: 5,
    img: "https://i.pravatar.cc/150?u=sagi"
  }
];

export default function HomePage() {
  const [chatStep, setChatStep] = useState(0);

  // סימולציית צ'אט אוטומטית
  useEffect(() => {
    const interval = setInterval(() => {
      setChatStep((prev) => (prev < 3 ? prev + 1 : 0));
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const openWhatsApp = () => {
    window.open(`https://wa.me/972508861080?text=${encodeURIComponent("שלום רמי, אני מעוניין בסימולציה לעסק שלי!")}`, "_blank");
  };

  return (
    <main className="min-h-screen bg-[#F8FAFC] dark:bg-[#020617] transition-colors duration-500 pb-20 overflow-x-hidden text-right" dir="rtl">
      <Navigation />

      {/* --- HERO & iPHONE SIMULATOR --- */}
      <section className="relative pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16">
          
          {/* טקסט שיווקי */}
          <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} className="flex-1 space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20 text-green-600 font-black text-xs uppercase">
              <Zap size={14} /> <span>העסק שלך לא הולך לישון לעולם</span>
            </div>
            <h1 className="text-6xl md:text-8xl font-black dark:text-white tracking-tighter">
              העובד שלא <br /> <span className="text-green-500 italic">מתעייף.</span>
            </h1>
            <p className="text-xl text-slate-500 dark:text-slate-400 max-w-xl leading-relaxed">
              תנו ל-AI לעבוד במקומכם. אפליקציית WhatsApp Hybrid מספקת מענה 24/7, ניהול תורים, קטלוג מוצרים וסליקה מלאה – הכל ללא צורך בחנות האפליקציות (PWA).
            </p>
            
            <div className="bg-blue-500/5 p-6 rounded-3xl border border-blue-500/10 space-y-4">
              <h4 className="font-bold text-blue-500 flex items-center gap-2">
                <ShieldCheck size={18} /> מודל Freemium מנצח
              </h4>
              <p className="text-sm dark:text-slate-300">
                ניצול מקסימלי של המכסות החינמיות ב-**Firebase** ו-**Gemini AI**. אנחנו בונים לך תשתית בעלות אפסית שמתרחבת רק כשהעסק גדל.
              </p>
            </div>

            <button onClick={openWhatsApp} className="px-12 py-6 bg-green-500 text-black font-black rounded-2xl text-2xl shadow-2xl hover:scale-105 transition-all">
              התחל סימולציה לעסק שלך
            </button>
          </motion.div>

          {/* האייפון האינטראקטיבי */}
          <div className="flex-1 relative">
            <div className="relative mx-auto border-[12px] border-slate-900 rounded-[3.5rem] h-[700px] w-[340px] shadow-2xl bg-black overflow-hidden border-b-[20px]">
              <div className="absolute top-0 w-full h-8 bg-black z-40 flex justify-center">
                <div className="w-24 h-5 bg-slate-900 rounded-b-2xl" />
              </div>

              {/* תוכן הצ'אט */}
              <div className="h-full bg-[#0b141a] p-4 pt-12 flex flex-col">
                <div className="bg-[#1f2c34] p-3 rounded-xl mb-4 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center font-bold">AI</div>
                  <div className="text-[10px] text-white">בוט שירות 24/7</div>
                </div>

                <div className="flex-1 space-y-4 overflow-y-auto">
                  <AnimatePresence>
                    {chatStep >= 0 && (
                      <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="bg-[#1f2c34] p-3 rounded-xl rounded-tr-none text-white text-[11px] max-w-[80%] self-end">
                        "שלום! איך אני יכול לעזור לך היום בסטודיו הפילאטיס?"
                      </motion.div>
                    )}
                    {chatStep >= 1 && (
                      <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="bg-[#005c4b] p-3 rounded-xl rounded-tl-none text-white text-[11px] max-w-[80%]">
                        "היי, אני רוצה לקבוע שיעור למחר בבוקר."
                      </motion.div>
                    )}
                    {chatStep >= 2 && (
                      <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="bg-[#1f2c34] p-3 rounded-xl text-white text-[11px] self-end space-y-2">
                        <p>"בשמחה! הנה המועדים הפנויים:"</p>
                        <div className="grid grid-cols-2 gap-2 mt-2">
                          <button className="bg-green-600 p-1 rounded">08:00</button>
                          <button className="bg-green-600 p-1 rounded">10:00</button>
                        </div>
                      </motion.div>
                    )}
                    {chatStep >= 3 && (
                      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-2 rounded-xl text-black text-[10px] flex items-center gap-2">
                        <img src="https://images.unsplash.com/photo-1518611012118-296072bb5602?w=50&h=50&fit=crop" className="rounded-md" />
                        <div>
                          <p className="font-bold">סדרת 10 שיעורים</p>
                          <p className="text-green-600">₪450.00 - הוסף לעגלה</p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Footer סליקה */}
                <div className="mt-4 border-t border-white/10 pt-4 flex justify-around opacity-50">
                  <CreditCard size={16} className="text-blue-400" />
                  <Smartphone size={16} className="text-green-400" />
                  <span className="text-[10px] text-white">Bit / PayPal / Credit</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- FEATURES GRID --- */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="glass p-8 rounded-[2.5rem] border border-white/10 text-center space-y-4">
            <div className="p-4 bg-green-500/10 rounded-full w-fit mx-auto text-green-500"><Calendar size={32} /></div>
            <h3 className="text-xl font-black dark:text-white">ניהול תורים חכם</h3>
            <p className="text-sm text-slate-500 italic">מסתנכרן ישירות עם היומן שלך ושולח תזכורות אוטומטיות ללקוח.</p>
          </div>
          <div className="glass p-8 rounded-[2.5rem] border border-white/10 text-center space-y-4">
            <div className="p-4 bg-blue-500/10 rounded-full w-fit mx-auto text-blue-500"><ShoppingCart size={32} /></div>
            <h3 className="text-xl font-black dark:text-white">קטלוג מוצרים בוואטסאפ</h3>
            <p className="text-sm text-slate-500 italic">הצגת מוצרים כהודעות מעוצבות כולל תמונות ומחירים בזמן אמת.</p>
          </div>
          <div className="glass p-8 rounded-[2.5rem] border border-white/10 text-center space-y-4">
            <div className="p-4 bg-purple-500/10 rounded-full w-fit mx-auto text-purple-500"><EyeOff size={32} /></div>
            <h3 className="text-xl font-black dark:text-white">ניהול שקוף (Blind Eye)</h3>
            <p className="text-sm text-slate-500 italic">תיאום פנימי בין נציגים בתוך קבוצת הוואטסאפ ללא ידיעת הלקוח.</p>
          </div>
        </div>
      </section>

      {/* --- REVIEWS (GOOGLE STYLE) --- */}
      <section className="py-20 bg-slate-50 dark:bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl font-black text-center mb-16 dark:text-white underline decoration-green-500 underline-offset-8">מה אומרים העסקים?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {reviews.map((rev, i) => (
              <motion.div key={i} whileHover={{ y: -10 }} className="bg-white dark:bg-slate-800 p-8 rounded-[2rem] shadow-xl border border-slate-100 dark:border-white/5">
                <div className="flex items-center gap-4 mb-6">
                  <img src={rev.img} className="w-12 h-12 rounded-full border-2 border-green-500" />
                  <div className="text-right">
                    <p className="font-bold dark:text-white">{rev.name}</p>
                    <p className="text-xs text-slate-500">{rev.role}</p>
                  </div>
                </div>
                <div className="flex gap-1 mb-4 text-yellow-400">
                  {[...Array(rev.stars)].map((_, s) => <Star key={s} size={14} fill="currentColor" />)}
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-300 italic leading-relaxed">"{rev.text}"</p>
                <div className="mt-6 pt-4 border-t border-slate-100 dark:border-white/5 flex items-center gap-2 text-[10px] text-slate-400">
                  <CheckCircle2 size={12} className="text-blue-500" /> פורסם בגוגל עסקים
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* --- CONTACT --- */}
      <ContactSection />

      {/* FLOATING ACTION */}
      <motion.button 
        onClick={openWhatsApp}
        className="fixed bottom-8 left-8 p-6 bg-green-500 text-black rounded-full shadow-[0_0_50px_rgba(34,197,94,0.4)] z-50 hover:scale-110 transition-transform"
      >
        <MessageCircle size={32} />
      </motion.button>
    </main>
  );
}
