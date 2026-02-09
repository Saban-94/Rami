import "./globals.css";
import { Heebo } from "next/font/google";
import { ThemeProvider } from "next-themes";
import Navigation from "@/components/Navigation";

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
      <body className={`${heebo.variable} font-hebrew bg-white dark:bg-[#0F172A] text-slate-900 dark:text-white transition-colors duration-300`}>
        <ThemeProvider attribute="class" defaultTheme="dark">
          <Navigation />
          <div className="pt-16">
            {children}
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
