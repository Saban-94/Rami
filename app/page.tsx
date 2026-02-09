import StatsGrid from "@/components/StatsGrid";
import PlannerDemo from "@/components/PlannerDemo";

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-white dark:bg-[#0F172A] pt-4 pb-20">
      <div className="max-w-md mx-auto">
        {/* Header פשוט */}
        <div className="px-6 mb-8 mt-4">
          <h1 className="text-2xl font-bold">שלום, רמי 👋</h1>
          <p className="text-slate-500 text-sm">הנה מה שקורה במערכות שלך היום</p>
        </div>

        {/* נתונים מהירים */}
        <StatsGrid />

        {/* משימות פלנר */}
        <PlannerDemo />

        {/* כפתור פעולה מהירה */}
        <div className="fixed bottom-6 left-0 right-0 px-8">
          <button className="w-full bg-cyan-500 hover:bg-cyan-400 text-[#0F172A] font-bold py-4 rounded-2xl shadow-lg shadow-cyan-500/30 transition-all flex items-center justify-center gap-2">
            צור אוטומציה חדשה +
          </button>
        </div>
      </div>
    </main>
  );
}
