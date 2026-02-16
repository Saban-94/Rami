import type { Metadata } from "next";
import { Assistant } from "next/font/google";
import "./globals.css";
import { ToastProvider } from "@/components/ui/ToastProvider";
import { I18nProvider } from "@/components/I18nProvider";

/**
 * הגדרת הפונט Assistant בצורה אופטימלית ל-Next.js.
 * זה מונע את הצורך בקישור חיצוני ל-Google Fonts שגרם לנפילות ב-Build.
 */
const assistant = Assistant({
  subsets: ["hebrew", "latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800"],
  display: "swap", // מבטיח שהטקסט יוצג מיד עם פונט מערכת עד שהפונט נטען
});

export const metadata: Metadata = {
  title: "SabanOS | Smart Business Infrastructure",
  description: "מערכת ניהול חכמה לעסקים - יצירת אפליקציות וניהול תשתיות AI",
  manifest: "/manifest.json",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="he" dir="rtl">
      <head>
        {/* אין צורך בקישורי פונטים חיצוניים כאן - הכל מטופל ע"י ה-Assistant למעלה */}
      </head>
      <body className={assistant.className}>
        {/* עטיפת האפליקציה ב-Providers:
           1. I18nProvider - לניהול שפות.
           2. ToastProvider - לניהול התראות (חייב להיות כאן כדי ש-useToast יעבוד בכל מקום).
        */}
        <I18nProvider lang="he">
          <ToastProvider>
            {children}
          </ToastProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
