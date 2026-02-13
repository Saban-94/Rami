"use client";

import React, { useEffect, useState } from "react";
// שינוי שם הייבוא ל-nextDynamic פותר את שגיאת ה-Invalid revalidate [object Object]
import nextDynamic from "next/dynamic";
import Navigation from "../../components/Navigation";
import { Zap, Clock, ShieldCheck } from "lucide-react";

// הגדרות Route - חובה להשתמש בערכים פשוטים
export const dynamic = "force-dynamic";
export const revalidate = 0;

// טעינה דינמית של הטופס ללא SSR - מונע שגיאות "app is not defined" בזמן הבילד
const TrialRegistrationForm = nextDynamic(
  () => import("../../components/TrialRegistrationForm"),
  { 
    ssr: false, 
    loading: () => <div className="h-96 w-full animate-pulse bg-white/5 rounded-3xl border border-white/10" /> 
  }
);

export default function TrialPage() {
  const [mounted, setMounted] = useState(false);

  // מבטיח שהקוד של Firebase (בתוך הטופס) ירוץ רק אחרי שהדף נטען בדפדפן
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#020617] text-white overflow-x-hidden" dir="rtl">
      <Navigation />

      {/* רקע דקורטיבי */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-green-500/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-500/10 blur-[120px] rounded-full" />
      </div>

      <div className="relative z-10 pt-32 pb-20 px-4 max-w-7xl mx-auto flex flex-col items-center">
        <div className="text-center space-y-4 mb-12">
          <h1 className="text-4xl md:text-6xl font-black italic tracking-tighter">
            הצטרף למהפכת ה-<span className="text-green-500">AI</span>
          </h1>
          <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto">
            10 ימי התנסות מלאה ב-SabanOS. בלי כרטיס אשראי ובלי התחייבות.
          </p>
        </div>

        <div className="w-full grid lg:grid-cols-2 gap-16 items-start mt-8">
          {/* הטופס שנטען דינמית */}
          <TrialRegistrationForm />

          {/* פיצ'רים ומידע נוסף */}
          <div className="space-y-10 py-6">
            <h3 className="text-2xl font-bold italic border-r-4 border-green-500 pr-4 text-right">
              מה תקבל בגרסת הניסיון?
            </h3>
            
            <div className="space-y-8">
              <div className="flex items-start gap-4 justify-start text-right">
                <div className="p-3 bg-white/5 rounded-2xl text-green-500">
                  <Zap size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-xl text-white">חיבור מיידי לוואטסאפ</h4>
                  <p className="text-slate-400">בוט ה-AI ילמד את העסק שלך ויתחיל לענות ללקוחות תוך דקות.</p>
                </div>
              </div>

              <div className="flex items-start gap-4 justify-start text-right">
                <div className="p-3 bg-white/5 rounded-2xl text-green-500">
                  <Clock size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-xl text-white">זמינות 24/7</h4>
                  <p className="text-slate-400">העסק שלך עונה תמיד, גם כשאתה ישן או עסוק בפרויקטים אחרים.</p>
                </div>
              </div>

              <div className="flex items-start gap-4 justify-start text-right">
                <div className="p-3 bg-white/5 rounded-2xl text-green-500">
                  <ShieldCheck size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-xl text-white">אבטחה מלאה</h4>
                  <p className="text-slate-400">כל הנתונים שלך ושל הלקוחות שלך מוצפנים ומאובטחים בענן של Google.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
