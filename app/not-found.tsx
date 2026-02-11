"use client";
 app/not-found.tsx
import { useEffect } from "react";
import Link from "next/link";

export default function NotFound() {
  useEffect(() => {
    // כאן אפשר להוסיף לוגיקה אם רוצים, למשל רישום שגיאה ב-Console
    console.log("דף לא נמצא");
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#efeae2] p-4 text-center" dir="rtl">
      <h1 className="text-4xl font-black text-[#075e54] mb-4">404</h1>
      <p className="text-lg text-slate-700 mb-6">אופס! הדף שחיפשת לא קיים במערכת SabanOS.</p>
      <Link 
        href="/" 
        className="bg-[#00a884] text-white px-6 py-2 rounded-full font-bold shadow-lg hover:bg-[#008f70] transition-all"
      >
        חזרה לדף הבית
      </Link>
    </div>
  );
}
