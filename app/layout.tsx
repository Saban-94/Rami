import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SabanOS | Business AI",
  description: "העסק שלך עובד בשבילך עם בינה מלאכותית בוואטסאפ",
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  themeColor: "#020617",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="he" dir="rtl">
      <body className="antialiased selection:bg-green-500/30 overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}
