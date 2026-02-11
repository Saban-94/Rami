"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Bell, ShieldCheck, Zap, MessageCircle, 
  Star, Clock, CheckCircle2, ShoppingCart, 
  Calendar, CreditCard, Send, Smartphone, Gift, EyeOff
} from "lucide-react";

// ייבוא רכיבים בנתיב יחסי נקי
import Navigation from "../components/Navigation";
import ContactSection from "../components/ContactSection";

// הגדרת טיפוס ל-Window
declare global {
  interface Window {
    OneSignalDeferred: any;
  }
}

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

    // 2. פונקציית סאונד פנימית
    const playNotification = () => {
      try {
        const audio = new Audio("/sounds/whatsapp.mp3");
        audio.play().catch(() => {});
      } catch (e) {}
    };

    // 3. לוגיקת צ'אט סימולטור
    const interval = setInterval(() => {
      setChatStep((prev) => {
        const next = prev < 3 ? prev + 1 : 0;
        if (next !== 0) playNotification();
        return next;
      });
    }, 4500);

    return () => clearInterval(interval);
  }, []);

  const openWhatsApp = () => {
    window.open("https://wa.me/972508861080", "_blank");
  };

  return (
    <main className="min-h-screen bg-[#F8FAFC] dark:bg-[#020617] pb-20 overflow-x-hidden text-right" dir="rtl">
      <Navigation />

      <section className="relative pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16">
          <div className="flex-1 space-y-8">
            <h1 className="text-6xl md:text-8xl font-black dark:text-white leading-none tracking-tighter">
              העסק שלך <br /> <span className="text-green-500">עובד בשבילך.</span>
            </h1>
            <p className="text-xl text-slate-500 dark:text-slate-400 max-w-xl">
              ניהול תורים, קטלוג מוצרים וסליקה מלאה ישירות בוואטסאפ.
            </p>
            <button onClick={openWhatsApp} className="px-12 py-6 bg-green-500 text-black font-black rounded-3xl text-2xl shadow-xl hover:scale-105 transition-all">
              קבל 15% הנחה עכשיו
            </button>
          </div>

          {/* iPHONE SIMULATOR */}
          <div className="flex-1 relative">
            <div className="relative mx-auto border-[12px] border-slate-900 rounded-[3.5rem] h-[700px] w-[340px] shadow-2xl bg-black overflow-hidden border-b-[20px]">
              <div className="h-full bg-[#0b141a] flex flex-col">
                <div className="bg-[#1f2c34] p-5 pt-10 flex items-center gap-3 border-b border-white/5">
                  <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center font-black">AI</div>
                  <div className="text-right">
                    <p className="text-white text-[12px] font-bold">שירה קוסמטיקה</p>
                    <p className="text-[10px] text-green-500 tracking-wider">מקליד/ה...</p>
                  </div>
                </div>

                <div className="flex-1 p-4 space-y-4">
                  <AnimatePresence mode="wait">
                    {chatStep >= 0 && (
                      <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="bg-[#1f2c34] p-3 rounded-xl text-white text-[11px] max-w-[85%] mr-auto shadow-sm">
                        שלום! אני העוזר של שירה. רוצה לקבוע תור?
                      </motion.div>
                    )}
                    {chatStep >= 1 && (
                      <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="bg-[#005c4b] p-3 rounded-xl text-white text-[11px] max-w-[80%] ml-auto shadow-sm">
                        כן, מתי יש מקום?
                      </motion.div>
                    )}
                    {chatStep >= 2 && (
                      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-[#1f2c34] p-3 rounded-xl text-white text-[11px] max-w-[85%] mr-auto border border-green-500/30">
                        מצאתי לך מקום למחר ב-09:00! לשמור לך?
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
