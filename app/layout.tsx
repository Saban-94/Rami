import type { Metadata, Viewport } from "next";
import Script from "next/dynamic"; // שימוש ב-next/script לטעינה אופטימלית
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
      <head>
        {/* סקריפט OneSignal */}
        <script src="https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.page.js" defer></script>
        <script dangerouslySetInnerHTML={{
          __html: `
            window.OneSignal = window.OneSignal || [];
            OneSignal.push(function() {
              OneSignal.init({
                appId: "YOUR_ONESIGNAL_APP_ID", // רמי, תדביק כאן את ה-ID מהפאנל של OneSignal
                safari_web_id: "YOUR_SAFARI_WEB_ID",
                notifyButton: { enable: true },
              });
            });
          `
        }} />
      </head>
      <body className="antialiased selection:bg-green-500/30 overflow-x-hidden bg-[#020617] text-white">
        {children}
      </body>
    </html>
  );
}
