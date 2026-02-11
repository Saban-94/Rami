"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Bell, Zap, MessageCircle, Star, Clock, 
  CheckCircle2, ShoppingCart, EyeOff 
} from "lucide-react";

// תיקון קריטי: נתיבים יחסיים עטופים בגרשיים בלבד
import Navigation from "../components/Navigation";
import ContactSection from "../components/ContactSection";

// הגדרת טיפוס למניעת שגיאות בזמן הקומפילציה
declare global {
  interface Window {
    OneSignalDeferred: any;
    OneSignal: any;
  }
}

export default function HomePage() {
  const [chatStep, setChatStep] = useState(0);
  const [isReady, setIsReady] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // 1. אתחול OneSignal בצורה בטוחה בלקוח
    if (typeof window !== "undefined") {
      const win = window as any;
      win.OneSignalDeferred = win.OneSignalDeferred || [];
      win.OneSignalDeferred.push(async function(OneSignal: any) {
        await OneSignal.init({
          appId: "91e6c6f7-5fc7-47d0-b114-b1694f408258",
        });
      });
    }

    // 2. אינטרוול סימולטור הצ'אט
    const interval = setInterval(() => {
      setChatStep((prev) => {
        const next = prev < 3 ? prev + 1 : 0;
        // צליל וואטסאפ (רק אם המשתמש "דרך" את האודיו)
        if (next !== 0 && audioRef.current) {
          audioRef.current.play().catch(() => {});
        }
        return next;
      });
    }, 4500);

    return () => clearInterval(interval);
  }, []);

  // פונקציה שמאשרת גם סאונד וגם התראות בלחיצה אחת
  const handleEnableAll = async () => {
    const win = window as any;
    if (win.OneSignal) {
      win.OneSignal.showNativePrompt();
    }
    if (audioRef.current) {
      audioRef.current.play().then(() => {
        audioRef.current?.pause();
        setIsReady(true);
      }).catch(console.error);
    }
  };

  return (
    <main className="min-h-screen bg-[#F8FAFC] dark:bg-[#020617] pb-20 text-right" dir="rtl">
      <Navigation />
      
      {/* אלמנט אודיו חיוני - וודא שהקובץ קיים ב-public/sounds/whatsapp.mp3 */}
      <audio ref={audioRef} src="/sounds/whatsapp.mp3" preload="auto" />

      {/* כפתור הפעלה צף - חובה כדי לעקוף חסימת אודיו בדפדפן */}
      {!isReady && (
        <button
          onClick={handleEnableAll}
          className="fixed top-24 left-6 z-[999] bg-orange-500 text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-2 border-2 border-white animate-bounce"
        >
          <Bell size={20} />
          <span className="font-bold text-sm">הפעל צלצול והתראות</span>
        </button>
      )}

      <section className="relative pt-32 pb-20 px-6 max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16">
        <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} className="flex-1 space-y-8">
          <h1 className="text-6xl md:text-8xl font-black dark:text-white leading-none tracking-tighter">
            העסק שלך <br /> <span className="text-green-500">עובד בשבילך.</span>
          </h1>
          <p className="text-xl text-slate-500 dark:text-slate-400 max-w-xl leading-relaxed font-medium">
            ניהול תורים, קטלוג מוצרים וסליקה מלאה ישירות בוואטסאפ – ללא צורך בחנות האפליקציות.
          </p>
          <button 
            onClick={() => window.open("https://wa.me/972508861080")}
            className="px-12 py-6 bg-green-500 text-black font-black rounded-3xl text-2xl shadow-[0_20px_50px_rgba(34,197,94,0.3)] hover:scale-105 transition-all"
          >
            קבל 15% הנחה עכשיו
          </button>
        </motion.div>

        {/* iPHONE SIMULATOR */}
        <div className="flex-1 relative">
          <div className="relative mx-auto border-[12px] border-slate-900 rounded-[3.5rem] h-[650px] w-[320px] shadow-2xl bg-[#0b141a] overflow-hidden border-b-[20px]">
            <div className="h-full flex flex-col">
              <div className="bg-[#1f2c34] p-5 pt-10 flex items-center gap-3 border-b border-white/5">
                <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center font-bold text-[10px]">AI</div>
                <div className="text-right">
                  <p className="text-white text-xs font-bold">שירה קוסמטיקה - AI</p>
                  <p className="text-[8px] text-green-500 font-medium">מקליד/ה...</p>
                </div>
              </div>

              <div className="flex-1 p-4 space-y-4">
                <AnimatePresence mode="wait">
                  {chatStep >= 0 && (
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="bg-[#1f2c34] p-3 rounded-xl text-white text-[11px] max-w-[85%] mr-auto">
                      שלום! אני העוזר של שירה. רוצה לקבוע תור?
                    </motion.div>
                  )}
                  {chatStep >= 1 && (
                    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="bg-[#005c4b] p-3 rounded-xl text-white text-[11px] max-w-[80%] ml-auto">
                      כן, למחר בבוקר בבקשה.
                    </motion.div>
                  )}
                  {chatStep >= 2 && (
                    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-[#1f2c34] p-3 rounded-xl text-white text-[11px] max-w-[85%] mr-auto border border-green-500/30">
                       נקבע לך תור למחר ב-09:00! תזכורת נשלחה.
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </section>

      <ContactSection />
    </main>
  );
}
