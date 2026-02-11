import type { Metadata, Viewport } from "next";
import "./globals.css";

// Metadata חייב להיות אובייקט פשוט בתוך קובץ שרת (Layout)
export const metadata: Metadata = {
  title: "SabanOS | Business AI",
  description: "מערכת ניהול חכמה",
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  themeColor: "#075e54",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="he" dir="rtl">
      <head>
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
