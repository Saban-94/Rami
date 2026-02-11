"use client"; // <--- חייב להוסיף את זה בראש הקובץ כי יש useEffect

import "./globals.css";
import { Heebo } from "next/font/google";
import { ThemeProvider } from "next-themes";
import Navigation from "../components/Navigation";
import React, { useEffect } from "react"; // <--- הוספנו את useEffect לייבוא

const heebo = Heebo({ subsets: ["hebrew"], variable: "--font-hebrew" });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  
  useEffect(() => {
    // בקשת אישור להתראות
    if (typeof window !== "undefined" && "Notification" in window) {
      Notification.requestPermission().then(permission => {
        if (permission === "granted") {
          console.log("התראות מאושרות");
        }
      });
    }
  import Script from "next/script";

// בתוך ה-return של ה-RootLayout:
<head>
  <Script 
    src="https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.page.js" 
    strategy="afterInteractive" 
  />
</head>
    // טריק "דריכת" האודיו
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
      <body className={`${heebo.variable} font-hebrew bg-white text-slate-900 dark:bg-[#0F172A] dark:text-slate-50 antialiased transition-colors duration-300`}>
        <ThemeProvider attribute="class" defaultTheme="dark">
          <Navigation />
          <main className="pt-16">
            {children}
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}

// שים לב: ב-Next.js, כשמשתמשים ב-"use client", אי אפשר לייצא Metadata מאותו קובץ.
// אם ה-Build נכשל על ה-Metadata, פשוט תמחק את ה-export const metadata מכאן ותעביר אותו לקובץ page.tsx הראשי.
