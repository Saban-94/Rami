"use client";
import { Users, Briefcase, Zap, TrendingUp } from "lucide-react";

export default function StatsGrid() {
  const stats = [
    { name: "פרויקטים", value: "12", icon: <Briefcase className="text-cyan-400" />, trend: "+2 החודש" },
    { name: "לידים חדשים", value: "48", icon: <Users className="text-blue-400" />, trend: "+12% בשבוע" },
    { name: "אוטומציות פעילות", value: "156", icon: <Zap className="text-yellow-400" />, trend: "99.9% Uptime" },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 px-4">
      {stats.map((stat) => (
        <div key={stat.name} className="glass p-6 rounded-3xl border border-white/10 shadow-xl relative overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-white/5 rounded-2xl">{stat.icon}</div>
            <span className="text-[10px] font-bold text-green-400 bg-green-400/10 px-2 py-1 rounded-full flex items-center gap-1">
              <TrendingUp size={10} /> {stat.trend}
            </span>
          </div>
          <p className="text-slate-400 text-sm font-medium">{stat.name}</p>
          <h4 className="text-3xl font-bold mt-1">{stat.value}</h4>
        </div>
      ))}
    </div>
  );
}
