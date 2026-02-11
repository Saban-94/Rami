"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Bell, Zap, MessageCircle, Star, Clock, 
  CheckCircle2, ShoppingCart, EyeOff 
} from "lucide-react";

// תיקון נתיבים עם גרשיים חובה!
import Navigation from "../components/Navigation";
import ContactSection from "../components/ContactSection";

// מניעת שגיאות טיפוס ב-Build עבור OneSignal
declare global {
  interface Window {
    OneSignalDeferred: any;
    OneSignal: any;
  }
}

export default function HomePage() {
  const [chatStep, setChatStep] = useState(0);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // אתחול OneSignal
    if (typeof window !== "undefined") {
      window.OneSignalDeferred = window.OneSignalDeferred || [];
      window.OneSignalDeferred.push(async function(OneSignal: any) {
        await OneSignal.init({
          appId: "91e6c6f7-5fc7-47d0-b114-b1694f408258",
        });
      });
    }

    // סימולטור צ'אט
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
    if (window.OneSignal) {
      window.OneSignal.showNativePrompt();
    }

    if (audioRef.current) {
      audioRef.current.play().then(() => {
        audioRef.current?.pause();
        setNotificationsEnabled(true);
      }).catch(console.error);
    }
  };

  return (
    <main className="min-h-screen bg-[#F8FAFC] dark:bg-[#020617] pb-20 text-right" dir="rtl">
      <Navigation />
      <audio ref={audioRef} src="/sounds/whatsapp.mp3" preload="auto" />

      {!notificationsEnabled && (
        <button
          onClick={handleEnableAll}
          className="fixed top-24 left-6 z-[100] bg-orange-500 text-white px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2 border-2 border-white animate-bounce"
        >
          <Bell size={20} />
          <span className="font-bold text-sm">הפעל צלצול והתראות</span>
        </button>
      )}

      <section className="relative pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16">
          <div className="flex-1 space-y-8">
            <h1 className="text-6xl md:text-8xl font-black dark:text-white leading-none tracking-tighter">
              העסק שלך <br /> <span className="text-green-500">עובד בשבילך.</span>
            </h1>
            <p className="text-xl text-slate-500 dark:text-slate-400 max-w-xl leading-relaxed">
              ניהול תורים, קטלוג מוצרים וסליקה מלאה ישירות בוואטסאפ – SabanOS AI.
            </p>
            <button onClick={() => window.open("https://wa.me/972508861080")} className="px-12 py-6 bg-green-500 text-black font-black rounded-3xl text-2xl shadow-xl hover:scale-105 transition-all">
              קבל 15% הנחה עכשיו
            </button>
          </div>

          <div className="flex-1 relative">
            <div className="relative mx-auto border-[12px] border-slate-900 rounded-[3.5rem] h-[650px] w-[320px] shadow-2xl bg-black overflow-hidden border-b-[20px]">
              <div className="h-full bg-[#0b141a] flex flex-col">
                <div className="bg-[#1f2c34] p-5 pt-10 flex items-center gap-3 border-b border-white/5">
                  <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center font-black text-[10px]">AI</div>
                  <div className="text-right">
                    <p className="text-white text-xs font-bold">שירה קוסמטיקה</p>
                    <p className="text-[8px] text-green-500">מקליד/ה...</p>
                  </div>
                </div>
                <div className="flex-1 p-4 space-y-4">
                  <AnimatePresence mode="wait">
                    {chatStep >= 0 && (
                      <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="bg-[#1f2c34] p-3 rounded-xl text-white text-[11px] max-w-[85%] mr-auto">
                        שלום! אני העוזר של שירה. רוצה לקבוע תור?
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <ContactSection />
    </main>
  );
}
