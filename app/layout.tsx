import type { Metadata } from "next";
import { Assistant } from "next/font/google";
import "./globals.css";
// ייבוא בטוח מהתיקייה המרכזית
import { ToastProvider } from "@/components/ui/ToastProvider";
import { I18nProvider } from "@/components/I18nProvider";

const assistant = Assistant({ 
  subsets: ["latin", "hebrew"],
  display: 'swap',
});

export const metadata: Metadata = {
  title: "SabanOS Dashboard",
  description: "ניהול חכם לעסקים מבוסס AI",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="he" dir="rtl">
      <body className={assistant.className}>
        {/* ה-Provider חייב לעטוף את כל ה-children כדי ש-useToast יעבוד */}
        <I18nProvider lang="he">
          <ToastProvider>
            {children}
          </ToastProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
