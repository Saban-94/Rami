import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SabanOS | Business AI",
  description: "מערכת ניהול חכמה מבוססת AI",
  manifest: "/manifest.json", // גרשיים חובה!
};

export const viewport: Viewport = {
  themeColor: "#075e54",
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
      <head>
        <link rel="apple-touch-icon" href="https://cdn-icons-png.flaticon.com/512/5968/5968841.png" />
        <script 
          src="https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.page.js" 
          defer
        ></script>
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
