"use client";
import React, { createContext, useContext, useEffect, useState } from "react";

// ודא שאתה לא קורא ל-localStorage כאן בחוץ!
export const I18nProvider = ({ children }: { children: React.ReactNode }) => {
  const [locale, setLocale] = useState<"en" | "he" | "ar">("he");

  useEffect(() => {
    // רק כאן זה בטוח!
    const saved = localStorage.getItem("nile.locale") as any;
    if (saved) setLocale(saved);
  }, []);

  return (
    <I18nContext.Provider value={{ locale, setLocale }}>
      <div dir={locale === "en" ? "ltr" : "rtl"}>{children}</div>
    </I18nContext.Provider>
  );
};
