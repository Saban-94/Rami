"use client";

import React, { useEffect, useState } from "react";
// שימוש בכינוי למניעת התנגשות עם ה-export const dynamic
import nextDynamic from "next/dynamic";
import Navigation from "../../components/Navigation";

// הגדרות Segment - בפורמט תקין עבור Next.js 14/15
export const dynamic = "force-dynamic";
export const revalidate = 0;

// טעינה דינמית ללא SSR - זה הצעד שמונע את ה-ReferenceError ב-Build
const TrialRegistrationForm = nextDynamic(
  () => import("../../components/TrialRegistrationForm"),
  { 
    ssr: false,
    loading: () => <div className="min-h-[400px] w-full animate-pulse bg-white/5 rounded-3xl" />
  }
);

export default function TrialPage() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // אם אנחנו ב-Build/שרת, נחזיר שלד ריק כדי לא להריץ לוגיקת לקוח
  if (!isMounted) return <div className="min-h-screen bg-[#020617]" />;

  return (
    <main className="min-h-screen bg-[#020617] text-white overflow-x-hidden" dir="rtl">
      <Navigation />
      <div className="relative z-10 pt-32 pb-20 px-4 max-w-7xl mx-auto flex flex-col items-center">
        <h1 className="text-4xl md:text-6xl font-black italic mb-12">
          התחלת 10 ימי <span className="text-green-500">התנסות</span>
        </h1>
        <div className="w-full max-w-4xl">
          <TrialRegistrationForm />
        </div>
      </div>
    </main>
  );
}
