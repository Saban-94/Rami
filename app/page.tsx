"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Bell, ShieldCheck, Zap, MessageCircle, 
  Star, Clock, CheckCircle2, ShoppingCart, 
  Calendar, CreditCard, Send, Smartphone, Gift, EyeOff
} from "lucide-react";

// נתיבים עם גרשיים בלבד!
import Navigation from "../components/Navigation";
import ContactSection from "../components/ContactSection";

// הגדרת טיפוס למניעת שגיאות Build
declare global {
  interface Window {
    OneSignalDeferred: any;
  }
}

const techLogos = [
  { name: "Google", src: "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg" },
  { name: "Microsoft", src: "https://upload.wikimedia.org/wikipedia/commons/9/96/Microsoft_logo_%282012%29.svg" },
  { name: "Firebase", src: "https://www.vectorlogo.zone/logos/firebase/firebase-icon.svg" },
  { name: "Vercel", src: "https://www.svgrepo.com/show/342111/vercel.svg" },
  { name: "OneSignal", src: "https://upload.wikimedia.org/wikipedia/commons/f/f1/OneSignal_logo.svg" },
  { name: "WhatsApp", src: "https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" },
];

const reviews = [
  {
    name: "אבי ביטון",
    role: "בעל מספרת VIP",
    text: "המערכת שראמי בנה לי משלבת ניהול תורים אוטומטי. זה עובד 24/7!",
    stars: 5,
    img: "https://cdn.dribbble.com/userupload/29736698/file/original-1ef955c551eede8401da24a210ad3a86.jpg?resize=1024x768&vertical=center"
  }
];

export default function HomePage() {
  const [chatStep, setChatStep] = useState(0);

  useEffect(() => {
    // 1. OneSignal
    if (typeof window !== "undefined") {
      window.OneSignalDeferred = window.OneSignalDeferred || [];
      window.OneSignalDeferred.push(async function(OneSignal: any) {
        await OneSignal.init({
          appId: "91e6c6f7-5fc7-47d0-b114-b1694f408258",
        });
      });
    }

    // 2. צלצול הודעה
    const playPing = () => {
      const audio = new Audio("/sounds/whatsapp.mp3");
      audio.play().catch(() => {});
    };

    // 3. לוגיקת סימולטור
    const interval = setInterval(() => {
      setChatStep((prev) => {
        const next = prev < 3 ? prev + 1 : 0;
        if (next !== 0) playPing();
        return next;
      });
    }, 4500);

    return () => clearInterval(interval);
  }, []);

  const openWhatsApp = () => {
    window.open(`https://wa.me/972508861080?text=שלום רמי, אני מעוניין בסימולציה`, "_blank");
  };

  return (
    <main className="min-h-screen bg-[#F8FAFC] dark:bg-[#020617] pb-20 overflow-x-hidden text-right" dir="rtl">
      <Navigation />

      <section className="relative pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16">
          
          <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} className="flex-1 space-y-8">
            <h1 className="text-6xl md:text-8xl font-black dark:text-white leading-none">
              העסק שלך <br /> <span className="text-green-500">עובד בשבילך.</span>
            </h1>
            <p className="text-xl text-slate-500 dark:text-slate-400 max-w-xl">
              ניהול תורים, קטלוג מוצרים וסליקה מלאה ישירות בוואטסאפ.
            </p>
            <button onClick={openWhatsApp} className="px-12 py-6 bg-green-500 text-black font-black rounded-3xl text-2xl shadow-xl hover:scale-105 transition-all">
              קבל 15% הנחה עכשיו
            </button>
          </motion.div>

          {/* iPHONE SIMULATOR */}
          <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} className="flex-1 relative">
            <div className="relative mx-auto border-[12px] border-slate-900 rounded-[4rem] h-[700px] w-[340px] shadow-2xl bg-black overflow-hidden border-b-[20px]">
              <div className="h-full bg-[#0b141a] flex flex-col">
                <div className="bg-[#1f2c34] p-5 pt-10 flex items-center gap-3 border-b border-white/5">
                  <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center font-black">AI</div>
                  <div className="text-right">
                    <p className="text-white text-xs font-bold">שירה קוסמטיקה</p>
                    <p className="text-[10px] text-green-500 tracking-wider">מקליד/ה...</p>
                  </div>
                </div>

                <div className="flex-1 p-4 space-y-4">
                  <AnimatePresence mode="wait">
                    {chatStep >= 0 && (
                      <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="bg-[#1f2c34] p-3 rounded-xl text-white text-[11px] max-w-[85%] mr-auto">
                        שלום! רוצה לקבוע תור למחר?
                      </motion.div>
                    )}
                    {chatStep >= 1 && (
                      <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="bg-[#005c4b] p-3 rounded-xl text-white text-[11px] max-w-[80%] ml-auto">
                        כן, מתי יש מקום?
                      </motion.div>
                    )}
                    {chatStep >= 2 && (
                      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-[#1f2c34] p-3 rounded-xl text-white text-[11px] max-w-[85%] mr-auto border border-green-500/30">
                         נקבע לך תור למחר ב-09:00!
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <div className="py-12 bg-white/5 border-y border-white/5 overflow-hidden flex whitespace-nowrap">
        <motion.div className="flex gap-24 flex-none items-center" animate={{ x: ["0%", "-50%"] }} transition={{ duration: 25, repeat: Infinity, ease: "linear" }}>
          {[...techLogos, ...techLogos].map((l, i) => (
            <img key={i} src={l.src} alt={l.name} className="h-8 md:h-12 opacity-30 grayscale" />
          ))}
        </motion.div>
      </div>

      <ContactSection />
    </main>
  );
}
