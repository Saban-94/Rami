// components/Renderer.tsx
"use client";
import React from "react";
// ... שאר הייבואים

export const ManifestRenderer: React.FC<{ manifest: any }> = ({ manifest }) => {
  // הגנה: אם המניפסט ריק, אל תנסה לרנדר כלום
  if (!manifest || !manifest.app) {
    return <div className="p-10 text-center opacity-50">ממתין לנתוני אפליקציה...</div>;
  }

  // שימוש בסימן שאלה (?) לפני גישה לשדות עמוקים
  const brandName = manifest.app?.nameHe || "ניל-App";
  const brandTag = manifest.app?.brandTag || "סטודיו אוטונומי"; 

  return (
    <div className="nile-renderer">
       <header className="p-4 text-center">
         <h1 className="font-black">{brandName}</h1>
         <p className="text-[10px] opacity-50 uppercase tracking-widest">{brandTag}</p>
       </header>
       {/* שאר הלוגיקה של הבלוקים */}
    </div>
  );
};
