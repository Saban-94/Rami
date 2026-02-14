// components/Renderer.tsx
"use client";
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useI18n } from "./I18nProvider";

export const ManifestRenderer = ({ manifest }: { manifest: any }) => {
  const { locale, dir } = useI18n();

  // הגנה קריטית מפני נתונים חסרים ב-Firestore
  if (!manifest || !manifest.app) {
    return <div className="p-10 text-center opacity-50 italic">טוען נתוני אפליקציה...</div>;
  }

  const brandName = manifest.app?.nameHe || "ניל-App";
  const brandTag = manifest.app?.brandTag || "סטודיו אוטונומי";

  return (
    <div dir={dir} className="h-full flex flex-col bg-white overflow-hidden font-sans">
      <header className="p-8 text-center border-b border-slate-50">
        <h1 className="text-2xl font-black italic text-slate-900">{brandName}</h1>
        <p className="text-[10px] opacity-40 uppercase tracking-widest mt-1">{brandTag}</p>
      </header>
      
      <main className="flex-1 p-4 space-y-4">
        {/* כאן ירונדרו הבלוקים לפי ה-manifest.pages */}
        <div className="h-32 bg-slate-50 rounded-3xl border border-dashed border-slate-200 flex items-center justify-center text-[10px] font-bold opacity-30 uppercase italic">
          Canvas Ready
        </div>
      </main>
    </div>
  );
};
