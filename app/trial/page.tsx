"use client";

import React, { useEffect, useState } from "react";
// שימוש בכינוי (Alias) כדי למנוע התנגשות שמות קטלנית
import dynamicImport from "next/dynamic";
import Navigation from "../../components/Navigation";
import { Zap, Clock, ShieldCheck } from "lucide-react";

// הגדרות קריטיות ל-Vercel - חובה להשתמש בערכים פשוטים
export const dynamic = "force-dynamic";
export const revalidate = 0;

// טעינה דינמית ללא SSR - זה מונע את ה-ReferenceError: app is not defined
const TrialRegistrationForm = dynamicImport(
  () => import("../../components/TrialRegistrationForm"),
  { 
    ssr: false, 
    loading: () => <div className="h-96 w-full animate-pulse bg-white/5 rounded-3xl border border-white/10" /> 
  }
);

export default function TrialPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="min-h-screen bg-[#020617]" />;
  }

  return (
    <main className="min-h-screen bg-[#020617] text-white overflow-x-hidden" dir="rtl">
      <Navigation />
      
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-green-500/10 blur-[120px] rounded-full" />
      </div>

      <div className="relative z-10 pt-32 pb-20 px-4 max-w-7xl mx-auto flex flex-col items-center">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-black italic tracking-tighter">
            הצטרף למהפכת ה-<span className="text-green-500">AI</span>
          </h1>
        </div>

        <div className="w-full grid lg:grid-cols-2 gap-16 items-start">
          <TrialRegistrationForm />
          
          <div className="space-y-8 text-right">
            <h3 className="text-2xl font-bold italic border-r-4 border-green-500 pr-4">מה תקבל?</h3>
            <div className="flex items-start gap-4">
              <div className="p-3 bg-white/5 rounded-2xl text-green-500"><Zap /></div>
              <div>
                <h4 className="font-bold text-xl text-white">חיבור לוואטסאפ</h4>
                <p className="text-slate-400">בוט ה-AI ילמד את העסק שלך ויתחיל לענות ללקוחות.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
