"use client";

import React, { useEffect, useState } from "react";
import nextDynamic from "next/dynamic"; // שינינו את השם כאן
import Navigation from "../../components/Navigation";

// הגדרות בילד - שים לב לשימוש ב-export נפרד
export const dynamic = "force-dynamic";
export const revalidate = 0;

// טעינה דינמית של הטופס ללא SSR בכלל
const TrialForm = nextDynamic(
  () => import("../../components/TrialRegistrationForm"),
  { 
    ssr: false,
    loading: () => <div className="h-96 w-full animate-pulse bg-white/5 rounded-3xl" />
  }
);

export default function TrialPage() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // אם אנחנו בבילד (שרת), אל תחזיר כלום - זה ימנע את שגיאת ה-app is not defined
  if (!isClient) return <div className="min-h-screen bg-[#020617]" />;

  return (
    <main className="min-h-screen bg-[#020617] text-white overflow-x-hidden" dir="rtl">
      <Navigation />
      <div className="relative z-10 pt-32 pb-20 px-4 max-w-7xl mx-auto flex flex-col items-center">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-black italic tracking-tighter">
            התחלת 10 ימי <span className="text-green-500">התנסות</span>
          </h1>
        </div>
        <div className="w-full max-w-4xl">
          <TrialForm />
        </div>
      </div>
    </main>
  );
}
