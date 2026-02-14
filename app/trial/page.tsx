"use client";

import React, { useEffect, useState } from "react";
import Navigation from "../../components/Navigation";
import TrialRegistrationForm from "../../components/TrialRegistrationForm";

export default function TrialPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // מניעת שגיאות Hydration - מציג רקע כהה עד שהצד לקוח מוכן
  if (!mounted) {
    return <div className="min-h-screen bg-[#020617]" />;
  }

  return (
    <main className="min-h-screen bg-[#020617] text-white overflow-x-hidden" dir="rtl">
      <Navigation />
      
      {/* עיצוב רקע דקורטיבי למראה פרימיום */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-green-500/10 blur-[120px] pointer-events-none" />

      <div className="relative z-10 pt-32 pb-20 px-4 max-w-4xl mx-auto flex flex-col items-center">
        <header className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-black italic tracking-tighter mb-4">
            התחלת 10 ימי <span className="text-green-500 underline decoration-white/10">התנסות</span>
          </h1>
          <p className="text-white/50 text-lg">הצטרפו למערכת SabanOS והפכו את העסק לחכם יותר</p>
        </header>

        <div className="w-full animate-in fade-in slide-in-from-bottom-4 duration-1000">
          <TrialRegistrationForm />
        </div>
      </div>
    </main>
  );
}
