// app/_components/SabanOSLandingClient.tsx
"use client";

import React, { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Calendar, Globe, Rocket, ChevronLeft, CheckCircle2 } from "lucide-react";

export default function SabanOSLandingClient({ dict, lang }: any) {
  // מערכת מדידה (Analytics) מובנית
  const trackEvent = (name: string, params = {}) => {
    if (typeof window !== "undefined" && (window as any).gtag) {
      (window as any).gtag('event', name, { ...params, lang });
    }
  };

  return (
    <div className="relative min-h-screen bg-[#0C0C0D] text-white overflow-hidden font-sans" dir={lang === 'en' ? 'ltr' : 'rtl'}>
      {/* רקע יוקרתי - Orbs & Grain */}
      <div className="absolute inset-0 z-0 opacity-30 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-green-500/20 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-gold-500/10 blur-[100px] rounded-full" />
      </div>

      {/* Hero Section */}
      <section className="relative z-10 pt-32 pb-20 px-6 max-w-7xl mx-auto text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <span className="inline-block px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-black tracking-widest uppercase mb-6 text-green-500">
            {dict.brandTag}
          </span>
          <h1 className="text-5xl md:text-7xl font-black italic tracking-tighter mb-8 leading-none">
            {dict.heroTitle}
          </h1>
          <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-12 leading-relaxed">
            {dict.heroSub}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <motion.a 
              href="/setup"
              onClick={() => trackEvent('cta_click', { pos: 'hero' })}
              whileHover={{ scale: 1.05 }}
              className="px-10 py-5 bg-green-600 text-white rounded-[2rem] font-black text-xl shadow-2xl shadow-green-600/20 flex items-center gap-3"
            >
              {dict.ctaPrimary} <Rocket size={22} />
            </motion.a>
            <button className="text-white/50 font-bold hover:text-white transition-colors">
              {dict.ctaSecondary}
            </button>
          </div>
        </motion.div>
      </section>

      {/* Benefits Grid */}
      <section className="relative z-10 py-20 px-6 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        <BenefitCard title={dict.benefits.aiTitle} text={dict.benefits.aiText} icon={<Sparkles />} />
        <BenefitCard title={dict.benefits.calTitle} text={dict.benefits.calText} icon={<Calendar />} />
        <BenefitCard title={dict.benefits.i18nTitle} text={dict.benefits.i18nText} icon={<Globe />} />
      </section>

      {/* Success Confetti Logic built-in for the setup preview... */}
    </div>
  );
}

function BenefitCard({ title, text, icon }: any) {
  return (
    <div className="p-10 rounded-[3rem] bg-white/5 border border-white/10 backdrop-blur-3xl hover:bg-white/10 transition-all group">
      <div className="w-14 h-14 bg-green-600/10 rounded-2xl flex items-center justify-center text-green-500 mb-6 group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <h3 className="text-2xl font-black italic mb-4 tracking-tight">{title}</h3>
      <p className="text-slate-400 leading-relaxed font-medium">{text}</p>
    </div>
  );
}
