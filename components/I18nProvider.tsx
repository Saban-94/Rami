// components/I18nProvider.tsx
"use client";
import React, { createContext, useContext, useEffect, useState } from "react";

export const I18nProvider = ({ children }: { children: React.ReactNode }) => {
  const [locale, setLocale] = useState<"en" | "he" | "ar">("he"); // ברירת מחדל קבועה לשרת

  useEffect(() => {
    // רק אחרי שהקומפוננטה עולה בדפדפן, נבדוק מה שמור ב-Storage
    const saved = localStorage.getItem("nile.locale") as any;
    if (saved) setLocale(saved);
  }, []);

  // ... שאר הלוגיקה של ה-Provider
  return (
    <I18nContext.Provider value={{ locale, setLocale }}>
      <div dir={locale === "en" ? "ltr" : "rtl"}>{children}</div>
    </I18nContext.Provider>
  );
};
