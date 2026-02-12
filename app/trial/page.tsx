"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Navigation from "../../components/Navigation";

// פתרון הקסם: טעינה דינמית של כל התוכן הכבד שמשתמש ב-Firebase
const DynamicTrialContent = dynamic(
  () => import("../../components/TrialRegistrationForm"),
  { 
    ssr: false, 
    loading: () => (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    ) 
  }
);

export default function TrialPage() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return <div className="min-h-screen bg-[#020617]" />;
  }

  return (
    <main className="min-h-screen bg-[#020617] text-white overflow-x-hidden" dir="rtl">
      <Navigation />

      {/* רקע דקורטיבי */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-green-500/10 blur-[120px] rounded-full" />
      </div>

      <div className="relative z-10 pt-32 pb-20 px-4 max-w-7xl mx-auto flex flex-col items-center">
        <div className="text-center space-y-4 mb-12">
          <h1 className="text-4xl md:text-6xl font-black italic tracking-tighter">
            התחלת 10 ימי <span className="text-green-500">התנסות</span>
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            מלא את הפרטים ובוט ה-AI שלך יתחיל לעבוד באופן מיידי.
          </p>
        </div>

        <div className="w-full max-w-4xl grid lg:grid-cols-1 gap-16 items-start">
          {/* כאן נכנס הטופס שנטען רק בדפדפן */}
          <DynamicTrialContent />
        </div>
      </div>
    </main>
  );
}
