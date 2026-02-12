"use client";

// 1. הגדרת התנהגות הדף - ללא כפל שמות
export const dynamic = "force-dynamic";

import React, { useEffect, useState } from "react";
// 2. שינוי שם הייבוא כדי למנוע את שגיאת ה-Object ב-revalidate
import nextDynamic from "next/dynamic";
import Navigation from "../../components/Navigation";

// 3. טעינה דינמית של הטופס ללא SSR
const TrialRegistrationForm = nextDynamic(
  () => import("../../components/TrialRegistrationForm"),
  { 
    ssr: false,
    loading: () => <div className="h-96 w-full animate-pulse bg-white/5 rounded-3xl" />
  }
);

export default function TrialPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // מונע הרצה של קוד Firebase/app בזמן ה-Build בשרת
  if (!mounted) return <div className="min-h-screen bg-[#020617]" />;

  return (
    <main className="min-h-screen bg-[#020617] text-white overflow-x-hidden" dir="rtl">
      <Navigation />

      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-green-500/10 blur-[120px] rounded-full" />
      </div>

      <div className="relative z-10 pt-32 pb-20 px-4 max-w-7xl mx-auto flex flex-col items-center">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-black italic tracking-tighter">
            התחלת 10 ימי <span className="text-green-500">התנסות</span>
          </h1>
          <p className="text-slate-400 mt-4 text-lg">חבר את העסק שלך ל-AI של SabanOS תוך דקות.</p>
        </div>

        <div className="w-full max-w-4xl grid lg:grid-cols-1 gap-16 items-start">
          <TrialRegistrationForm />
        </div>
      </div>
    </main>
  );
}
