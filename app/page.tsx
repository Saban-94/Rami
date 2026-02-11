"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, Zap, MessageCircle } from "lucide-react";

// שימוש בנתיבים יחסיים פשוטים - מונע שגיאות ב-Build של Vercel
import Navigation from "../components/Navigation";
import ContactSection from "../components/ContactSection";

export default function HomePage() {
  const [chatStep, setChatStep] = useState(0);
  const [isReady, setIsReady] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // אתחול בטוח של OneSignal בצד הלקוח בלבד
    if (typeof window !== "undefined") {
      const win = window as any;
      win.OneSignalDeferred = win.OneSignalDeferred || [];
      win.OneSignalDeferred.push(async function(OneSignal: any) {
        await OneSignal.init({
          appId: "91e6c6f7-5fc7-47d0-b114-b1694f408258",
        });
      });
    }

    const interval = setInterval(() => {
      setChatStep((prev) => (prev < 1 ? prev + 1 : 0));
    }, 4500);

    return () => clearInterval(interval);
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
    <main className="min-h-screen bg-white dark:bg-[#020617] text-right px-4" dir="rtl">
      <Navigation />
      <audio ref={audioRef} src="/sounds/whatsapp.mp3" preload="auto" />

      {!isReady && (
        <button
          onClick={handleActivation}
          className="fixed top-24 left-6 z-[999] bg-orange-500 text-white px-5 py-3 rounded-2xl shadow-2xl animate-bounce font-bold border-2 border-white"
        >
          🔔 הפעל צליל ואפליקציה
        </button>
      )}

      <section className="pt-32 pb-20 max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16">
        <div className="flex-1 space-y-8">
          <h1 className="text-6xl md:text-8xl font-black dark:text-white leading-none tracking-tighter">
            העסק שלך <br /> <span className="text-green-500">עובד בשבילך.</span>
          </h1>
          <p className="text-xl text-slate-500 dark:text-slate-400">
            SabanOS AI - ניהול תורים וסליקה אוטומטית בוואטסאפ.
          </p>
          <button 
            onClick={() => window.open("https://wa.me/972508861080")}
            className="px-12 py-6 bg-green-500 text-black font-black rounded-3xl text-2xl shadow-xl hover:scale-105 transition-all"
          >
            קבל 15% הנחה עכשיו
          </button>
        </div>

        <div className="flex-1 relative">
          <div className="relative mx-auto border-[12px] border-slate-900 rounded-[3.5rem] h-[600px] w-[300px] shadow-2xl bg-[#0b141a] overflow-hidden">
            <div className="bg-[#1f2c34] p-4 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-[10px] font-bold text-black">AI</div>
              <div className="text-white text-[12px] font-bold">SabanOS AI</div>
            </div>
            <div className="p-4 space-y-4">
              <AnimatePresence mode="wait">
                {chatStep === 0 && (
                  <motion.div key="0" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="bg-[#1f2c34] p-2 rounded-lg text-white text-[11px] mr-auto">
                    שלום! רוצה להפוך את העסק שלך לאוטומטי?
                  </motion.div>
                )}
                {chatStep === 1 && (
                  <motion.div key="1" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="bg-[#005c4b] p-2 rounded-lg text-white text-[11px] ml-auto">
                    כן, אני רוצה לקבוע תורים בוואטסאפ.
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>

      <ContactSection />
    </main>
  );
}
