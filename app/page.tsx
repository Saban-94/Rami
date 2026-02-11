"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, Zap, Send, Smartphone } from "lucide-react";
import Navigation from "../components/Navigation";
import ContactSection from "../components/ContactSection";

export default function HomePage() {
  const [chatStep, setChatStep] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // לוגיקת סימולטור צ'אט חכם
  useEffect(() => {
    const sequence = async () => {
      setIsTyping(true);
      await new Promise(r => setTimeout(r, 2000));
      setIsTyping(false);
      setChatStep(prev => (prev < 2 ? prev + 1 : 0));
    };

    const interval = setInterval(sequence, 5000);
    return () => clearInterval(interval);
  }, [chatStep]);

  const handleInteraction = () => {
    // רטט בנייד (Haptic Feedback)
    if (typeof window !== "undefined" && window.navigator.vibrate) {
      window.navigator.vibrate(15);
    }
    
    // שחרור אודיו
    if (audioRef.current) {
      audioRef.current.play().then(() => {
        audioRef.current?.pause();
        setIsReady(true);
      }).catch(() => {});
    }
  };

  return (
    <main className="min-h-screen bg-[#020617] text-white selection:bg-green-500/30">
      <Navigation />
      <audio ref={audioRef} src="/sounds/whatsapp.mp3" preload="auto" />

      {/* כפתור הפעלה בעיצוב Glass */}
      {!isReady && (
        <motion.button
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          onClick={handleInteraction}
          className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[100] bg-white/10 backdrop-blur-md border border-white/20 px-8 py-4 rounded-full shadow-2xl flex items-center gap-3"
        >
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
          <span className="font-bold">הפעל חוויית AI מלאה</span>
        </motion.button>
      )}

      {/* HERO SECTION */}
      <section className="relative pt-40 pb-20 px-6 max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-20">
        <div className="flex-1 space-y-10 text-right z-10">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-block px-4 py-2 bg-green-500/10 border border-green-500/20 rounded-full text-green-400 font-mono text-sm"
          >
            OS v2.0 - הניהול הופך לאוטומטי
          </motion.div>
          <h1 className="text-7xl md:text-9xl font-black leading-[0.9] tracking-tighter italic">
            Saban<span className="text-green-500">OS</span>
          </h1>
          <p className="text-2xl text-slate-400 max-w-xl">
            מערכת ההפעלה הראשונה לעסק שלך שרצה לגמרי בתוך הוואטסאפ.
          </p>
          <div className="flex flex-wrap gap-4">
            <button 
              onMouseDown={handleInteraction}
              className="bg-green-500 text-black px-10 py-5 rounded-2xl font-black text-xl hover:shadow-[0_0_30px_rgba(34,197,94,0.4)] transition-all"
            >
              התחל עכשיו
            </button>
            <button className="bg-white/5 backdrop-blur-sm border border-white/10 px-10 py-5 rounded-2xl font-bold text-xl">
              איך זה עובד?
            </button>
          </div>
        </div>

        {/* iPHONE SIMULATOR - GLASSMORPHISM */}
        
        <div className="flex-1 relative group">
          <div className="absolute -inset-10 bg-green-500/20 blur-[100px] rounded-full group-hover:bg-green-500/30 transition-all" />
          <div className="relative mx-auto border-[8px] border-white/10 rounded-[3rem] h-[650px] w-[320px] bg-black/40 backdrop-blur-2xl overflow-hidden shadow-2xl border-b-[15px]">
            {/* WhatsApp Header */}
            <div className="bg-white/5 p-6 pt-12 border-b border-white/10 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-green-500 to-emerald-700" />
              <div>
                <p className="font-bold text-sm">SabanOS AI</p>
                <p className="text-[10px] text-green-500">מחובר למערכת העסק</p>
              </div>
            </div>

            {/* Chat Body */}
            <div className="p-4 space-y-4">
              <div className="bg-white/5 p-3 rounded-2xl text-[12px] max-w-[80%] mr-auto rounded-tl-none">
                היי רמי, זיהיתי לקוח חדש שרוצה קוסמטיקה למחר ב-10:00. לאשר?
              </div>
              
              <AnimatePresence>
                {isTyping && (
                  <motion.div 
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }} 
                    exit={{ opacity: 0 }}
                    className="flex gap-1 p-2 bg-green-600/20 w-12 rounded-full justify-center"
                  >
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-bounce" />
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-bounce [animation-delay:0.2s]" />
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-bounce [animation-delay:0.4s]" />
                  </motion.div>
                )}
              </AnimatePresence>

              {chatStep >= 1 && (
                <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="bg-green-600 p-3 rounded-2xl text-[12px] max-w-[80%] ml-auto rounded-tr-none shadow-lg">
                  כן, תאשר ותשלח לו לינק לסליקה.
                </motion.div>
              )}
            </div>

            {/* WhatsApp Input Mockup */}
            <div className="absolute bottom-6 left-0 right-0 px-4">
              <div className="bg-white/10 p-3 rounded-full flex items-center gap-2 border border-white/10">
                <div className="flex-1 text-[10px] text-slate-500 pr-2">כתוב הודעה...</div>
                <Send size={16} className="text-green-500" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <ContactSection />
    </main>
  );
}
