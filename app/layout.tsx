"use client";

import "./globals.css";
import { Heebo } from "next/font/google";
import { ThemeProvider } from "next-themes";
import Navigation from "../components/Navigation";
import React, { useEffect } from "react";
import Script from "next/script"; // הייבוא עכשיו בראש הקובץ

const heebo = Heebo({ subsets: ["hebrew"], variable: "--font-hebrew" });

// הגדרת טיפוס ל-Window כדי ש-TypeScript לא יצעק על OneSignal
declare global {
  interface Window {
    OneSignalDeferred: any;
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  
  useEffect(() => {
    // 1. אתחול OneSignal
    if (typeof window !== "undefined") {
      window.OneSignalDeferred = window.OneSignalDeferred || [];
      window.OneSignalDeferred.push(async function(OneSignal: any) {
        await OneSignal.init({
          appId: "91e6c6f7-5fc7-47d0-b114-b1694f408258",
        });
      });
    }

    // 2. בקשת אישור להתראות דפדפן
    if (typeof window !== "undefined" && "Notification" in window) {
      Notification.requestPermission();
    }

    // 3. טריק "דריכת" האודיו לסאונד וואטסאפ
    const unlockAudio = () => {
      const audio = new Audio("/sounds/whatsapp.mp3");
      audio.play().then(() => {
        audio.pause();
        audio.currentTime = 0;
      }).catch(() => {});
      document.removeEventListener('click', unlockAudio);
    };
    document.addEventListener('click', unlockAudio);
  }, []);

  return (
    <html lang="he" dir="rtl" suppressHydrationWarning>
      <head>
        {/* טעינת הסקריפט של OneSignal בצורה נכונה */}
        <Script 
          src="https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.page.js" 
          strategy="afterInteractive" 
        />
      </head>
      <body className={`${heebo.variable} font-hebrew bg-white text-slate-900 dark:bg-[#0F172A] dark:text-slate-50 antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="dark">
          <Navigation />
          <div className="pt-16">
            {children}
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
