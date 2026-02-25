"use client";
import React from "react";
import LeadsList from "@/components/LeadsList";
import LiveFleetMap from "@/components/LiveFleetMap"; // המפה שבנינו קודם

export default function AbuRassemDashboard({ params }: { params: { trialId: string } }) {
  return (
    <div className="min-h-screen bg-slate-50 p-6" dir="rtl">
      <h1 className="text-3xl font-black mb-8 italic">SabanOS - אבו אל ראסם</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* צד ימין: ניהול לידים חמים וניתוח AI */}
        <div className="lg:col-span-2">
          <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-200">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <span className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
              לידים חמים מהצ'אט (כולל ניתוח תמונות)
            </h2>
            <LeadsList trialId={params.trialId} />
          </div>
        </div>

        {/* צד שמאל: מעקב צי בזמן אמת */}
        <div className="lg:col-span-1">
          <div className="bg-slate-900 p-6 rounded-[2rem] text-white shadow-xl">
            <h2 className="text-xl font-bold mb-4">מפת הובלות בשידור חי</h2>
            <LiveFleetMap />
            <p className="text-[10px] text-slate-400 mt-4">המפה משותפת ללקוחות לצפייה בסטטוס ההובלה שלהם.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
