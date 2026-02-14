"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";

export default function NotFound() {
  const [isMounted, setIsMounted] = useState(false);

  // שימוש ב-useEffect מבטיח שהלוגיקה תרוץ רק בדפדפן ולא בזמן ה-Build בשרת
  useEffect(() => {
    setIsMounted(true);
    console.log("דף SabanOS לא נמצא");
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#efeae2] p-4 text-center" dir="rtl">
      <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-gray-200 max-w-md w-full">
        <h1 className="text-6xl font-black text-[#075e54] mb-4">404</h1>
        <h2 className="text-2xl font-bold text-slate-800 mb-2">אופס! הדף לא נמצא</h2>
        <p className="text-slate-600 mb-8">
          הדף שחיפשת אינו קיים במערכת SabanOS או שהועבר לכתובת אחרת.
        </p>
        
        <Link 
          href="/" 
          className="inline-block w-full bg-[#00a884] hover:bg-[#008f70] text-white font-black py-4 rounded-full shadow-lg transition-all transform active:scale-95"
        >
          חזרה לדף הבית
        </Link>
      </div>
      
      <p className="mt-8 text-slate-400 text-xs font-bold uppercase tracking-widest">
        SabanOS Business AI System
      </p>
    </div>
  );
}
