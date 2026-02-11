import "./globals.css";
import { Heebo } from "next/font/google";
import { ThemeProvider } from "next-themes";
import Navigation from "../components/Navigation";

const heebo = Heebo({ subsets: ["hebrew"], variable: "--font-hebrew" });

export const metadata = {
  title: "Rami Systems | IT & Automation",
  description: "מומחה IT ואוטומציה בין Google Workspace ל-Microsoft 365",
  manifest: "/manifest.json", // חיבור ה-PWA
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="he" dir="rtl" suppressHydrationWarning>
<body className={`${heebo.variable} font-hebrew bg-white text-slate-900 dark:bg-[#0F172A] dark:text-slate-50 antialiased transition-colors duration-300 opacity-100`}>        <ThemeProvider attribute="class" defaultTheme="dark">
          <Navigation />
          <div className="pt-16">
            {children}
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
