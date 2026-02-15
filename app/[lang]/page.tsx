/* app/[lang]/page.tsx */
import { Suspense } from "react";
import { getDictionary } from "@/lib/dictionary";
import { getManifestAction } from "@/app/actions/manifest"; // וודא שהנתיב תקין אצלך
import ClientHome from "@/components/ClientHome"; // קומפוננטת צד הלקוח שלך

export default async function Page({ params: { lang } }: { params: { lang: string } }) {
  const dict = await getDictionary(lang);
  
  // ניסיון משיכת נתונים עם טיפול בשגיאות (כדי למנוע קריסת שרת)
  let manifest = null;
  try {
    const result = await getManifestAction();
    manifest = result?.manifest || null;
  } catch (error) {
    console.error("Failed to fetch manifest on server:", error);
  }

  // הגנה קריטית: אם אין מניפסט, נשתמש בערכי ברירת מחדל במקום לקרוס
  const safeManifest = {
    brandTag: manifest?.brandTag || "SabanOS",
    companyName: manifest?.companyName || "Saban AI",
    description: manifest?.description || "Business AI Solutions",
    ...manifest
  };

  return (
    <main className="min-h-screen bg-[#020617]" dir={lang === 'he' ? 'rtl' : 'ltr'}>
      <Suspense fallback={<HomeLoadingSkeleton />}>
        {/* העברת הנתונים לקומפוננטת לקוח בצורה בטוחה */}
        <ClientHome 
          dict={dict} 
          lang={lang} 
          initialManifest={safeManifest} 
        />
      </Suspense>
    </main>
  );
}

// קומפוננטת טעינה למניעת Layout Shift
function HomeLoadingSkeleton() {
  return (
    <div className="h-screen w-full flex items-center justify-center bg-[#020617]">
      <div className="flex flex-col items-center gap-4">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-blue-500 font-bold animate-pulse uppercase tracking-widest text-xs">
          Loading SabanOS Engine...
        </p>
      </div>
    </div>
  );
}
