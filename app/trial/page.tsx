"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Navigation from "../../components/Navigation";

// בידוד הטופס - לא ירונדר בשרת בכלל
const DynamicForm = dynamic(
  () => import("../../components/TrialRegistrationForm"),
  { ssr: false }
);

export default function TrialPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <div className="min-h-screen bg-[#020617]" />;

  return (
    <main className="min-h-screen bg-[#020617] text-white" dir="rtl">
      <Navigation />
      <div className="pt-32 pb-20 px-4 max-w-4xl mx-auto flex flex-col items-center">
        <h1 className="text-4xl md:text-6xl font-black italic mb-12">
          התחלת 10 ימי <span className="text-green-500">התנסות</span>
        </h1>
        <DynamicForm />
      </div>
    </main>
  );
}
