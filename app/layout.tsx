import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SabanOS | Business AI",
  description: "מערכת ניהול חכמה מבוססת AI",
  manifest: "/manifest.json", // וודא שקובץ זה קיים בתיקיית public
};

export const viewport: Viewport = {
  themeColor: "#075e54",import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SabanOS | Business AI",
  description: "העסק שלך עובד בשבילך עם בינה מלאכותית בוואטסאפ",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "SabanOS",
  },
};

export const viewport: Viewport = {
  themeColor: "#020617",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false, // מונע זום לא רצוי ב-PWA
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="he" dir="rtl">
      <head>
        {/* הגדרה קריטית לאייפון להסתרת ממשק הדפדפן */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <link rel="apple-touch-icon" href="https://cdn-icons-png.flaticon.com/512/5968/5968841.png" />
      </head>
      <body className="antialiased selection:bg-green-500/30 overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="he" dir="rtl">
      <body className="antialiased">{children}</body>
    </html>
  );
}
