"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Bell, Zap, MessageCircle, Star, Clock, 
  CheckCircle2, ShoppingCart, EyeOff 
} from "lucide-react";

import Navigation from "../components/Navigation";
import ContactSection from "../components/ContactSection";

export default function HomePage() {
  const [chatStep, setChatStep] = useState(0);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // אתחול OneSignal
    if (typeof window !== "undefined") {
      const windowAny = window as any;
      windowAny.OneSignalDeferred = windowAny.OneSignalDeferred || [];
      windowAny.OneSignalDeferred.push(async function(OneSignal: any) {
        await OneSignal.init({
          appId: "91e6c6f7-5fc7-47d0-b114-b1694f408258",
          safari_web_id: "web.onesignal.auto.103e3009-847e-4061-9f93-41c390500742",
        });
      });
    }

    // סימולטור צ'אט עם צליל (אם אושר)
    const interval = setInterval(() => {
      setChatStep((prev) => {
        const next = prev < 3 ? prev + 1 : 0;
        if (next !== 0 && audioRef.current) {
          audioRef.current.play().catch(() => {});
        }
        return next;
      });
    }, 4500);

    return () => clearInterval(interval);
  }, []);

  const handleEnableAll = async () => {
    // 1. הפעלת OneSignal
    const windowAny = window as any;
    if (windowAny.OneSignal) {
      windowAny.OneSignal.showNativePrompt();
    }

    // 2. הפעלת סאונד (חובה לחיצה של משתמש)
    if (audioRef.current) {
      audioRef.current.play().then(() => {
        audioRef.current?.pause();
        if (audioRef.current) audioRef.current.currentTime = 0;
        setNotificationsEnabled(true);
      }).catch(console.error);
    }
  };

  const openWhatsApp = () => {
    window.open("https://wa.me/972508861080?text=שלום רמי, אני מעוניין בסימולציה", "_blank");
  };

  return (
    <main className="min-h-screen bg-[#F8FAFC] dark:bg-[#020617] pb-20 overflow-x-hidden text-right" dir="rtl">
      <Navigation />
      
      {/* אודיו מוסתר */}
      <audio ref={audioRef} src="/sounds/whatsapp.mp3" preload="auto" />

      {/* כפתור הפעלת התראות צף - מופיע רק אם לא אושר */}
      {!notificationsEnabled && (
        <motion.button
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          onClick={handleEnableAll}
          className="fixed top-24 left-6 z-[100] bg-orange-500 text-white px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2 border-2 border-white animate-bounce"
        >
          <Bell size={20} className="animate-pulse" />
          <span className="font-bold text-sm">הפעל צלצול והתראות</span>
        </motion.button>
      )}

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16">
          <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} className="flex-1 space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20 text-green-600 font-black text-xs">
              <Zap size={14} fill="currentColor" /> <span>מערכת ה-AI של שירה קוסמטיקה</span>
            </div>
            <h1 className="text-6xl md:text-8xl font-black dark:text-white leading-none">
              העסק שלך <br /> <span className="text-green-500">עובד בשבילך.</span>
            </h1>
            <p className="text-xl text-slate-500 dark:text-slate-400 max-w-xl">
              מענה אוטומטי, קביעת תורים וסליקה - הכל בתוך הוואטסאפ.
            </p>
            <button onClick={openWhatsApp} className="px-12 py-6 bg-green-500 text-black font-black rounded-3xl text-2xl shadow-xl hover:scale-105 transition-all">
              קבל 15% הנחה להקמה
            </button>
          </motion.div>

          {/* iPHONE SIMULATOR */}
          <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} className="flex-1 relative">
            <div className="relative mx-auto border-[12px] border-slate-900 rounded-[3.5rem] h-[700px] w-[330px] shadow-2xl bg-black overflow-hidden border-b-[20px]">
              <div className="h-full bg-[#0b141a] flex flex-col">
                <div className="bg-[#1f2c34] p-5 pt-10 flex items-center gap-3 border-b border-white/5">
                  <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center font-black">AI</div>
                  <div className="text-right">
                    <p className="text-white text-xs font-bold">העוזר של שירה</p>
                    <p className="text-[10px] text-green-500">מקליד/ה...</p>
                  </div>
                </div>

                <div className="flex-1 p-4 space-y-4">
                  <AnimatePresence mode="wait">
                    {chatStep >= 0 && (
                      <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="bg-[#1f2c34] p-3 rounded-xl text-white text-[11px] max-w-[85%] mr-auto">
                        שלום! רוצה לקבוע תור לטיפול פנים?
                      </motion.div>
                    )}
                    {chatStep >= 1 && (
                      <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="bg-[#005c4b] p-3 rounded-xl text-white text-[11px] max-w-[80%] ml-auto">
                        כן, יש מקום למחר?
                      </motion.div>
                    )}
                    {chatStep >= 2 && (
                      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-[#1f2c34] p-3 rounded-xl text-white text-[11px] max-w-[85%] mr-auto border border-green-500/30">
                        קבעתי לך למחר ב-09:00! תזכורת נשלחה.
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <ContactSection />

      <motion.button 
        onClick={openWhatsApp}
        className="fixed bottom-8 left-8 p-6 bg-green-500 text-black rounded-full shadow-2xl z-50 hover:scale-110 transition-all"
      >
        <MessageCircle size={32} />
      </motion.button>
    </main>
  );
}
