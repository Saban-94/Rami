"use client";
import React, { useEffect, useState } from "react";
import nextDynamic from "next/dynamic";
import Navigation from "../../components/Navigation";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const TrialForm = nextDynamic(() => import("../../components/TrialRegistrationForm"), { ssr: false });

export default function TrialPage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return <div className="min-h-screen bg-[#020617]" />;

  return (
    <main className="min-h-screen bg-[#020617] text-white">
      <Navigation />
      <div className="pt-32 flex flex-col items-center">
        <TrialForm />
      </div>
    </main>
  );
}
