import type { Metadata, Viewport } from "next";
import Script from "next/script"; // תיקון ייבוא ל-next/script
import { Assistant, Inter } from "next/font/google";
import { ToastProvider } from "@/components/ui/ToastProvider";
import "./globals.css";

// פונטים למראה פרימיום
const assistant = Assistant({ 
  subsets: ["hebrew", "latin"],
  variable: "--font-assistant",
  weight: ["200", "400", "700", "800"],
});

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter" 
});

export const metadata: Metadata = {
  title: "SabanOS | Business AI Studio",
  description: "העסק שלך עובד בשבילך עם בינה מלאכותית חכמה בוואטסאפ ובסטודיו",
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
        {/* טעינה אופטימלית של OneSignal */}
        <Script 
          src="https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.page.js" 
          strategy="afterInteractive" 
        />
        <Script id="onesignal-init" strategy="afterInteractive">
          {`
            window.OneSignal = window.OneSignal || [];
            OneSignal.push(function() {
              OneSignal.init({
                appId: "be79010a-3a55-4672-9701-f2f9f1295240", // ה-ID המעודכן שלך
                safari_web_id: "web.onesignal.auto.1046894c-83b6-45a4-984f-c4e1376f932f",
                notifyButton: { enable: true },
                allowLocalhostAsSecureOrigin: true,
              });
            });
          `}
        </Script>
      </head>
      <body className="font-sans antialiased selection:bg-green-500/30 overflow-x-hidden bg-[#020617] text-white">
        
        {/* מערכת ההתראות של ג'ימיני AI */}
        <ToastProvider>
          <div className="relative min-h-screen flex flex-col">
            {children}
          </div>

          {/* אפקט הילה יוקרתי ברקע האתר */}
          <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-green-500/5 blur-[120px]" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-500/5 blur-[120px]" />
          </div>
        </ToastProvider>

      </body>
    </html>
  );
}
