import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { Assistant, Inter } from "next/font/google";
// תיקון קריטי: מעבר לנתיב יחסי מדויק וביטול תלות ב-Alias
import { ToastProvider } from "../components/ui/ToastProvider";
import "./globals.css";

// הוספת display: 'swap' למניעת כישלון טעינה בזמן ה-Build
const assistant = Assistant({ 
  subsets: ["hebrew", "latin"],
  variable: "--font-assistant",
  display: 'swap',
});

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter",
  display: 'swap',
});

export const metadata: Metadata = {
  title: "SabanOS | Business AI Studio",
  description: "העסק שלך עובד בשבילך עם בינה מלאכותית חכמה בוואטסאפ ובסטודיו",
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  themeColor: "#020617",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="he" dir="rtl" className={`${assistant.variable} ${inter.variable}`} suppressHydrationWarning>
      <head><Script id="onesignal-init" strategy="afterInteractive">
  {`
    window.OneSignal = window.OneSignal || [];
    OneSignal.push(function() {
      OneSignal.init({
        appId: "be79010a-3a55-4672-9701-f2f9f1295240",
        safari_web_id: "web.onesignal.auto.1046894c-83b6-45a4-984f-c4e1376f932f",
        notifyButton: { enable: false }, // כיבוי הכפתור המובנה למניעת שגיאות UI
        allowLocalhostAsSecureOrigin: true,
      });

      // בדיקת בטיחות כפולה למניעת שגיאת ה-undefined
      if (OneSignal.Notifications && typeof OneSignal.Notifications.on === 'function') {
        OneSignal.Notifications.on('permissionChange', function(permission) {
          console.log("OneSignal Permission Changed:", permission);
        });
      } else {
        console.log("OneSignal Notifications not ready yet - skipping listener");
      }
    });
  `}
</Script> 
      </head>
      <body className="font-sans antialiased selection:bg-green-500/30 overflow-x-hidden bg-[#020617] text-white">
        {/* ה-Provider עטוף בבדיקה פשוטה ליתר ביטחון */}
        <ToastProvider>
          <div className="relative min-h-screen flex flex-col">
            {children}
          </div>
        </ToastProvider>
      </body>
    </html>
  );
}
