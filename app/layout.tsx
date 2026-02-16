import type { Metadata } from "next";
import { Assistant } from "next/font/google";
import "./globals.css";
import { ToastProvider } from "@/components/ui/ToastProvider";
import { I18nProvider } from "@/components/I18nProvider";

const assistant = Assistant({ subsets: ["latin", "hebrew"] });

export const metadata: Metadata = {
  title: "SabanOS Dashboard",
  description: "מערכת ניהול חכמה לעסקים",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="he" dir="rtl">
      <body className={assistant.className}>
        <I18nProvider lang="he">
          <ToastProvider>
            {children}
          </ToastProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
