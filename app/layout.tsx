import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { Assistant, Inter } from "next/font/google";
import { ToastProvider } from "./components/ui/ToastProvider"; // וידוא נתיב יחסי תקין
import "./globals.css";

// טעינת פונטים עם Display Swap לביצועים מקסימליים
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

/**
 * Metadata דינמי - בגרסה המלאה נשתמש ב-generateMetadata. 
 * כאן הגדרנו את הבסיס החזק שמתאים לכל ה-PWA של SabanOS.
 */
export const metadata: Metadata = {
  title: {
    default: "SabanOS | Business AI Studio",
    template: "%s | SabanOS"
  },
  description: "העסק שלך עובד בשבילך עם בינה מלאכותית חכמה בסטודיו ובניהול התורים",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "SabanOS",
  },
  icons: {
    apple: "/icons/icon-192x192.png",
  }
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
      <head>
        {/* OneSignal SDK - טעינה אסינכרונית בטוחה */}
        <script src="https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.page.js" defer></script>
        <Script id="onesignal-init" strategy="afterInteractive">
          {`
            window.OneSignal = window.OneSignal || [];
            OneSignal.push(function() {
              OneSignal.init({
                appId: "be79010a-3a55-4672-9701-f2f9f1295240",
                safari_web_id: "web.onesignal.auto.1046894c-83b6-45a4-984f-c4e1376f932f",
                notifyButton: { enable: false },
                allowLocalhostAsSecureOrigin: true,
              });

              // מאזין לשינויי הרשאה - עוזר לנו לדעת מתי עמאר אישר קבלת פושים
              if (OneSignal.Notifications && typeof OneSignal.Notifications.on === 'function') {
                OneSignal.Notifications.on('permissionChange', function(permission) {
                  console.log("SabanOS Notification Permission:", permission);
                });
              }
            });
          `}
        </Script> 
      </head>
      <body className="font-sans antialiased selection:bg-blue-500/30 overflow-x-hidden bg-[#020617] text-white">
        <ToastProvider>
          <div className="relative min-h-screen flex flex-col">
            {/* ה-Children מייצג את הסטודיו או את האפליקציה של הלקוח */}
            <main className="flex-1">
              {children}
            </main>
          </div>
        </ToastProvider>
      </body>
    </html>
  );
}
