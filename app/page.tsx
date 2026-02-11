'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, MessageCircle, Zap } from 'lucide-react';

// התאם את הנתיבים בהתאם למבנה שלך
import Navigation from '../components/Navigation';
import ContactSection from '../components/ContactSection';

export default function HomePage() {
  const [chatStep, setChatStep] = useState(0);
  const [isReady, setIsReady] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // אתחול OneSignal + סימולטור צ'אט — בצד לקוח בלבד
  useEffect(() => {
    // OneSignal: מאתחלים רק בדפדפן
    if (typeof window !== 'undefined') {
      const win = window as any;
      win.OneSignalDeferred = win.OneSignalDeferred || [];
      win.OneSignalDeferred.push(async (OneSignal: any) => {
        try {
          await OneSignal.init({
            appId: '91e6c6f7-5fc7-47d0-b114-b1694f408258',
            allowLocalhostAsSecureOrigin: true,
          });
        } catch { /* no-op */ }
      });
    }

    // סימולציית צ'אט (שלושת המצבים)
    const interval = setInterval(() => {
      setChatStep((prev) => (prev < 2 ? prev + 1 : 0));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // מפעיל סאונד פעם אחת (לשחרור נעילת אודיו) + מזמין הרשאת Push
  const startApp = () => {
    try {
      audioRef.current?.play?.().then(() => {
        audioRef.current?.pause?.();
        setIsReady(true);
      }).catch(() => {});
    } catch {}

    if (typeof window !== 'undefined') {
      const win = window as any;
      if (win.OneSignal?.showSlidedownPrompt) {
        win.OneSignal.showSlidedownPrompt();
      }
    }
  };

  const chatMessage = useMemo(() => {
    if (chatStep === 0) return 'שלום! רוצה להפוך את העסק שלך לאוטומטי?';
    if (chatStep === 1) return 'כן, אני רוצה לקבוע תורים בוואטסאפ.';
    return 'מעולה! מתחילים בהגדרות מהירות, ותוך דקות הרובוט עובד בשבילך.';
  }, [chatStep]);

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-zinc-900 dark:to-zinc-950">
      <Navigation />

      {/* HERO */}
      <section className="relative py-20">
        <div className="mx-auto max-w-6xl px-4">
          <div className="grid items-center gap-10 lg:grid-cols-2">
            {/* טקסט */}
            <div>
              <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">
                העסק שלך <span className="text-emerald-500">עובד בשבילך</span>.
              </h1>
              <p className="mt-4 text-slate-600 dark:text-slate-300">
                SabanOS AI — ניהול תורים וסליקה אוטומטית בצ׳אט בסגנון ווצאף. התראות בזמן אמת, ושמירה למאגר מאובטח.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                {!isReady && (
                  <button
                    onClick={startApp}
                    className="inline-flex items-center gap-2 rounded-2xl bg-amber-400 text-black font-black px-6 py-3 shadow-lg hover:scale-[1.02] transition"
                    title="הפעל צליל ואפליקציה"
                  >
                    <Bell className="w-5 h-5" />
                    הפעל צליל ואפליקציה
                  </button>
                )}

                <button
                  onClick={() => {
                    if (typeof window !== 'undefined') {
                      window.open('https://wa.me/972508861080', '_blank', 'noopener,noreferrer');
                    }
                  }}
                  className="inline-flex items-center gap-2 rounded-2xl bg-green-500 text-black font-black px-6 py-3 shadow-lg hover:scale-[1.02] transition"
                >
                  <MessageCircle className="w-5 h-5" />
                  קבל 15% הנחה עכשיו
                </button>

                <a
                  href="#contact"
                  className="inline-flex items-center gap-2 rounded-2xl border border-slate-300/60 dark:border-slate-700/60 px-6 py-3 hover:bg-slate-100/50 dark:hover:bg-white/5 transition"
                >
                  <Zap className="w-5 h-5 text-emerald-500" />
                  בקש דמו / רכישה
                </a>
              </div>
            </div>

            {/* סימולטור צ'אט */}
            <div className="relative">
              <div className="rounded-[2.4rem] border border-white/10 dark:border-white/10 bg-white/60 dark:bg-zinc-900/60 backdrop-blur-2xl shadow-2xl p-2 w-full max-w-sm mx-auto">
                <div className="rounded-[2rem] bg-slate-100/60 dark:bg-zinc-800/60 border border-black/5 dark:border-white/10 overflow-hidden">
                  <div className="h-6 bg-gradient-to-r from-black/50 via-black/30 to-black/50 rounded-b-2xl mx-auto w-40 mt-2" />
                  <div className="p-4 h-[420px] flex flex-col gap-3">
                    <div className="text-xs text-slate-500 dark:text-slate-400">SabanOS AI • דמו חי</div>

                    <div className="flex-1 space-y-2">
                      <AnimatePresence mode="popLayout">
                        <motion.div
                          key={chatStep}
                          initial={{ y: 10, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          exit={{ y: -10, opacity: 0 }}
                          transition={{ type: 'spring', stiffness: 300, damping: 24 }}
                          className="max-w-[85%] rounded-2xl px-3 py-2 text-sm shadow-sm bg-white/90 dark:bg-zinc-700/80 text-slate-800 dark:text-slate-100"
                        >
                          <div className="text-[10px] opacity-75 mb-0.5">לקוח</div>
                          <div>{chatMessage}</div>
                          <div className="mt-0.5 text-[10px] opacity-70">10:21</div>
                        </motion.div>
                      </AnimatePresence>

                      <div className="max-w-[85%] ml-auto rounded-2xl px-3 py-2 text-sm shadow-sm bg-emerald-500 text-white">
                        <div className="text-[10px] opacity-75 mb-0.5">נציג</div>
                        <div>מעולה! אפעיל לך את האוטומציות בדקות.</div>
                        <div className="mt-0.5 text-[10px] opacity-85">10:22</div>
                      </div>
                    </div>

                    <div className="bg-white/70 dark:bg-zinc-800/70 rounded-xl px-3 py-2 text-sm text-slate-500 dark:text-slate-400">
                      כתבו הודעה…
                    </div>
                  </div>
                </div>
              </div>

              {/* התראה מדומה */}
              <AnimatePresence>
                {isReady && (
                  <motion.div
                    initial={{ y: -10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -10, opacity: 0 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                    className="absolute -top-6 right-3 bg-black text-white text-xs rounded-full px-3 py-1 shadow-xl flex items-center gap-2"
                  >
                    <Bell className="w-4 h-4 text-amber-400" />
                    התקבלה הזמנה מלקוח
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* אלמנט האודיו (טעון מראש) */}
        <audio ref={audioRef} src="/notification.mp3" preload="auto" />
      </section>

      {/* טופס יצירת קשר */}
      <ContactSection />
    </main>
  );
}
