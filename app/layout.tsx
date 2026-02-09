import "./globals.css";
import { Inter, Heebo } from "next/font/google";

const heebo = Heebo({ subsets: ["hebrew"], variable: "--font-hebrew" });

export const metadata = {
  title: "רמי מסארוה | IT & Automation Expert",
  description: "פורטפוליו ופתרונות אוטומציה",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="he" dir="rtl">
      <body className={`${heebo.variable} font-hebrew bg-slate-50 text-slate-900`}>
        {children}
      </body>
    </html>
  );
}
