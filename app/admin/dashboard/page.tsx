"use client";

import React, { useEffect, useState } from "react";
import { db } from "@/lib/firebase"; // Client SDK
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { 
  Users, HardDrive, Calendar as CalendarIcon, 
  ExternalLink, Search, LayoutGrid, Activity, ShieldCheck 
} from "lucide-react";

export default function SabanosAdminDashboard() {
  const [trials, setTrials] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const q = query(collection(db, "trials"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setTrials(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const filteredTrials = trials.filter(t => 
    t.businessName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#020617] text-white p-8 font-sans" dir="rtl">
      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-black tracking-tighter flex items-center gap-3">
            <ShieldCheck className="text-blue-500" size={40} />
            SabanOS <span className="text-blue-500">Control Center</span>
          </h1>
          <p className="text-slate-400 mt-2 font-medium">ניהול לקוחות, תשתיות ויומנים - ramims2026@gmail.com</p>
        </div>

        <div className="flex bg-white/5 border border-white/10 p-2 rounded-2xl w-full md:w-auto">
          <Search className="text-slate-500 ml-2 mt-2" size={20} />
          <input 
            type="text" 
            placeholder="חפש עסק..." 
            className="bg-transparent outline-none text-sm p-2 w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <StatCard icon={<Users />} title="לקוחות פעילים" value={trials.length} color="blue" />
        <StatCard icon={<Activity />} title="יומנים בשימוש" value={trials.filter(t => t.calendarId).length} color="emerald" />
        <StatCard icon={<HardDrive />} title="אחסון Drive" value={trials.filter(t => t.driveFolderId).length} color="amber" />
      </div>

      {/* Main Table */}
      <div className="bg-white/5 border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl">
        <table className="w-full text-right">
          <thead className="bg-white/5 border-b border-white/10">
            <tr>
              <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-500">שם העסק</th>
              <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-500">סטטוס תשתית</th>
              <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-500">Google Calendar</th>
              <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-500">Google Drive</th>
              <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-500">ניהול</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {filteredTrials.map((trial) => (
              <tr key={trial.id} className="hover:bg-white/[0.02] transition-colors group">
                <td className="p-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center font-black">
                      {trial.businessName?.[0] || 'S'}
                    </div>
                    <div>
                      <p className="font-bold text-sm">{trial.businessName || 'עסק חדש'}</p>
                      <p className="text-[10px] text-slate-500 font-mono tracking-tighter">{trial.id}</p>
                    </div>
                  </div>
                </td>
                <td className="p-6">
                  {trial.infrastructureReady ? (
                    <span className="bg-emerald-500/10 text-emerald-500 text-[10px] font-black px-3 py-1 rounded-full border border-emerald-500/20 uppercase">Active</span>
                  ) : (
                    <span className="bg-slate-500/10 text-slate-500 text-[10px] font-black px-3 py-1 rounded-full border border-slate-500/20 uppercase">Pending</span>
                  )}
                </td>
                <td className="p-6">
                  {trial.calendarId ? (
                    <a 
                      href={`https://calendar.google.com/calendar/u/0?cid=${trial.calendarId}`} 
                      target="_blank" 
                      className="text-blue-400 hover:text-blue-300 flex items-center gap-2 text-xs font-bold"
                    >
                      <CalendarIcon size={14} /> פתח יומן <ExternalLink size={12} />
                    </a>
                  ) : "-"}
                </td>
                <td className="p-6">
                  {trial.driveFolderId ? (
                    <a 
                      href={`https://drive.google.com/drive/folders/${trial.driveFolderId}`} 
                      target="_blank" 
                      className="text-amber-400 hover:text-amber-300 flex items-center gap-2 text-xs font-bold"
                    >
                      <HardDrive size={14} /> פתח תיקייה <ExternalLink size={12} />
                    </a>
                  ) : "-"}
                </td>
                <td className="p-6">
                  <a 
                    href={`/studio/chat-agent/${trial.id}`} 
                    className="p-3 bg-white/10 hover:bg-blue-600 rounded-xl transition-all inline-block group-hover:scale-110"
                  >
                    <LayoutGrid size={16} />
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function StatCard({ icon, title, value, color }: any) {
  const colors: any = {
    blue: "from-blue-500/20 text-blue-500 border-blue-500/20",
    emerald: "from-emerald-500/20 text-emerald-500 border-emerald-500/20",
    amber: "from-amber-500/20 text-amber-500 border-amber-500/20"
  };

  return (
    <div className={`bg-gradient-to-br ${colors[color]} border p-8 rounded-[2.5rem] relative overflow-hidden`}>
      <div className="relative z-10">
        <div className="mb-4 opacity-70">{icon}</div>
        <p className="text-[10px] font-black uppercase tracking-[0.2em] mb-1">{title}</p>
        <p className="text-4xl font-black">{value}</p>
      </div>
      <div className="absolute top-[-20%] right-[-10%] opacity-10 scale-[2]">
        {icon}
      </div>
    </div>
  );
}
