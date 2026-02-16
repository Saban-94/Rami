"use client";

import React, { createContext, useContext, useState } from 'react';

const I18nContext = createContext<any>(null);

export const I18nProvider = ({ children, lang }: { children: React.ReactNode, lang: string }) => {
  const [currentLang, setLang] = useState(lang);

  const t = (key: string) => {
    // לוגיקת תרגום בסיסית - ניתן להרחיב עם מילון
    return key;
  };

  return (
    <I18nContext.Provider value={{ lang: currentLang, setLang, t }}>
      {children}
    </I18nContext.Provider>
  );
};

// ייצוא פונקציית ה-Hook לשימוש ברחבי האפליקציה
export const useI18n = () => {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error("useI18n must be used within I18nProvider");
  }
  return context;
};
