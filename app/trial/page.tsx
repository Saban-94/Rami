"use client";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const revalidate = 0;
import React, { useEffect, useState } from "react";
import dynamicImport from "next/dynamic"; // ← לא מתנגש בשם

import Navigation from "../../components/Navigation";

// טעינת טופס רק בצד לקוח
const DynamicForm = dynamicImport(
  () => import("../../components/TrialRegistrationForm"),
  { ssr: false }
);

export default function TrialPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted)
    return <div className="min-h-screen bg-[#020617]" />;

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
