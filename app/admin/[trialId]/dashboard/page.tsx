"use client";
import React from "react";
import LeadsList from "@/components/LeadsList";
import LiveFleetMap from "@/components/LiveFleetMap";
import { Truck, Users, DollarSign, Calendar as CalIcon } from "lucide-react";

export default function AbuRassemCentralDashboard() {
  return (
    <div className="min-h-screen bg-slate-50 p-8" dir="rtl">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* שלום אבו ראסם */}
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-black italic text-slate-900">דשבורד אבו אל ראסם 👑</h1>
            <p className="text-slate-500 font-bold">המערכת מסונכרנת עם המחירון וזיהוי ה-AI</p>
          </div>
          <div className="bg-white p-4 rounded-3xl shadow-sm border border-slate-200 flex items-center gap-4">
             <div className="text-right">
                <p className="text-[10px] font-black text-slate-400 uppercase">סטטוס מנוע</p>
                <p className="text-green-500 font-black">SabanOS LIVE</p>
             </div>
             <div className="w-3 h-3 bg-green-500 rounded-full animate-ping" />
          </div>
        </header>

        {/* סטטיסטיקות מהירות */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <StatCard icon={<Users />} label="לידים חדשים" value="12" color="text-blue-600" />
          <StatCard icon={<Truck />} label="הובלות היום" value="4" color="text-orange-600" />
          <StatCard icon={<CalIcon />} label="תיאומים לשישי" value="8" color="text-purple-600" />
          <StatCard icon={<DollarSign />} label="צפי הכנסות" value="₪14,500" color="text-green-600" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-white rounded-[3rem] p-8 border border-slate-200 shadow-sm">
            <h2 className="text-xl font-black mb-6 italic">לידים חמים וניתוח תמונות 📸</h2>
            <LeadsList trialId="abu-rassem" />
          </div>
          <div className="lg:col-span-1 space-y-8">
            <div className="bg-slate-900 rounded-[3rem] p-8 text-white shadow-2xl">
               <h2 className="text-xl font-black mb-6 italic">מעקב צי חי 🚛</h2>
               <LiveFleetMap />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, color }: any) {
  return (
    <div className="bg-white p-6 rounded-[2.5rem] border border-slate-200 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
      <div className={`p-4 bg-slate-50 rounded-2xl ${color}`}>{icon}</div>
      <div>
        <p className="text-xs font-bold text-slate-400 uppercase">{label}</p>
        <p className="text-xl font-black italic text-slate-900">{value}</p>
      </div>
    </div>
  );
}
