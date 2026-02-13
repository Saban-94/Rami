"use client";

import React, { useEffect, useState } from "react";
// שינוי שם הייבוא ל-nextDynamic פותר את שגיאת ה-[object Object]
import nextDynamic from "next/dynamic";
import Navigation from "../../components/Navigation";

// הגדרות Route - חובה להשתמש בערכים פשוטים
export const dynamic = "force-dynamic";
export const revalidate = 0;

// טעינה דינמית ללא SSR
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

  // הגנה: אם השרת מנסה לרנדר בזמן ה-Build, הוא יקבל div ריק ולא יקרוס
  if (!mounted) return <div className="min-h-screen bg-[#020617]" />;

  return (
    <main className="min-h-screen bg-[#020617] text-white overflow-x-hidden" dir="rtl">
      <Navigation />
      <div className="relative z-10 pt-32 pb-20 px-4 max-w-4xl mx-auto flex flex-col items-center">
        <h1 className="text-4xl md:text-6xl font-black italic tracking-tighter mb-12">
          התחלת 10 ימי <span className="text-green-500">התנסות</span>
        </h1>
        <TrialRegistrationForm />
      </div>
    </main>
  );
}
