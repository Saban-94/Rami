"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import Navigation from "../../components/Navigation";
import { Zap, Clock, ShieldCheck } from "lucide-react";

// טעינה דינמית של הטופס - זה ימנע את שגיאת ה-ReferenceError בזמן ה-Build
const TrialRegistrationForm = dynamic(
  () => import("../../components/TrialRegistrationForm"),
  { ssr: false, loading: () => <div className="h-96 w-full animate-pulse bg-white/5 rounded-3xl" /> }
);

export default function TrialPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <main className="min-h-screen bg-[#020617] text-white overflow-x-hidden" dir="rtl">
      <Navigation />

      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-green-500/10 blur-[120px] rounded-full" />
      </div>

      <div className="relative z-10 pt-32 pb-20 px-4 max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-6xl font-black italic tracking-tighter">
            התחלת 10 ימי <span className="text-green-500">התנסות</span>
          </h1>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-16 items-start">
          <TrialRegistrationForm />
          
          <div className="space-y-10 py-6">
            <h3 className="text-2xl font-bold italic border-r-4 border-green-500 pr-4 text-right">מה תקבל?</h3>
            <div className="space-y-6 text-right">
               <div className="flex items-start gap-4 justify-start">
                 <div className="p-3 bg-white/5 rounded-2xl text-green-500"><Zap /></div>
                 <div>
                   <h4 className="font-bold text-xl">חיבור לוואטסאפ</h4>
                   <p className="text-slate-400">בוט ה-AI ילמד את העסק שלך ויתחיל לענות.</p>
                 </div>
               </div>
               <div className="flex items-start gap-4 justify-start">
                 <div className="p-3 bg-white/5 rounded-2xl text-green-500"><Clock size={24} /></div>
                 <div>
                   <h4 className="font-bold text-xl">זמינות 24/7</h4>
                   <p className="text-slate-400">העסק עונה תמיד, גם כשאתה לא פנוי.</p>
                 </div>
               </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
