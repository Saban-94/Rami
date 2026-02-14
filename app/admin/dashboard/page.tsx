"use client";

import React, { useEffect, useState } from "react";
import { db } from "../../../lib/firebase";
import { collection, query, orderBy, onSnapshot, updateDoc, doc } from "firebase/firestore";
import { Users, MessageSquare, ExternalLink, Calendar, CheckCircle2, Clock } from "lucide-react";
import Navigation from "../../../components/Navigation";

export default function AdminDashboard() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!db) return;
    const q = query(collection(db, "trials"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const leadsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setLeads(leadsData);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // פונקציה לפתיחת וואטסאפ מהיר
  const openWhatsApp = (phone: string, name: string) => {
    const cleanPhone = phone.replace(/\D/g, "");
    const formattedPhone = cleanPhone.startsWith("0") ? "972" + cleanPhone.substring(1) : cleanPhone;
    const message = encodeURIComponent(`שלום ${name}, ראיתי שנרשמת למערכת SabanOS, אשמח לעזור לך להתקדם.`);
    window.open(`https://wa.me/${formattedPhone}?text=${message}`, "_blank");
  };

  return (
    <main className="min-h-screen bg-[#020617] text-white font-sans" dir="rtl">
      <Navigation />
      
      <div className="pt-32 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {/* כרטיסיות סטטיסטיקה מהירה */}
          <div className="bg-white/5 border border-white/10 p-6 rounded-[2rem] backdrop-blur-xl">
            <div className="flex justify-between items-start mb-4">
              <Users className="text-blue-500" size={24} />
              <span className="text-[10px] bg-blue-500/20 text-blue-500 px-2 py-1 rounded-full font-bold">LIVE</span>
            </div>
            <div className="text-2xl font-black">{leads.length}</div>
            <div className="text-white/40 text-sm">נרשמו סה"כ</div>
          </div>
          
          <div className="bg-white/5 border border-white/10 p-6 rounded-[2rem] backdrop-blur-xl">
            <div className="flex justify-between items-start mb-4">
              <Calendar className="text-green-500" size={24} />
            </div>
            <div className="text-2xl font-black">{leads.filter((l: any) => l.businessType === 'beauty').length}</div>
            <div className="text-white/40 text-sm">עסקי יופי וטיפוח</div>
          </div>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl">
          <div className="p-8 border-b border-white/10 flex justify-between items-center bg-white/[0.02]">
            <h2 className="text-xl font-black italic flex items-center gap-3">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              ניהול פניות נכנסות
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-right">
              <thead className="bg-white/5 text-white/40 text-xs uppercase tracking-widest">
                <tr>
                  <th className="p-6">בעל עסק / שם</th>
                  <th className="p-6">סוג עסק</th>
                  <th className="p-6">מטרה</th>
                  <th className="p-6">פעולות</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {leads.map((lead: any) => (
                  <tr key={lead.id} className="hover:bg-white/[0.03] transition-all group">
                    <td className="p-6">
                      <div className="font-bold text-lg">{lead.fullName || lead.businessName}</div>
                      <div className="text-sm text-white/40 font-mono">{lead.whatsapp}</div>
                    </td>
                    <td className="p-6">
                      <span className="bg-blue-500/10 text-blue-400 px-3 py-1 rounded-lg text-xs font-bold border border-blue-500/20">
                        {lead.businessType === 'beauty' ? '💄 טיפוח' : lead.businessType}
                      </span>
                    </td>
                    <td className="p-6 max-w-xs truncate text-white/60 text-sm italic">
                      {lead.goals || "לא צוינה מטרה"}
                    </td>
                    <td className="p-6">
                      <div className="flex items-center gap-3">
                        <button 
                          onClick={() => openWhatsApp(lead.whatsapp, lead.fullName)}
                          className="p-3 bg-green-500/10 hover:bg-green-500 text-green-500 hover:text-black rounded-xl transition-all"
                          title="שלח וואטסאפ"
                        >
                          <MessageSquare size={18} />
                        </button>
                        <button 
                          onClick={() => window.location.href = `/chat/${lead.id}`}
                          className="p-3 bg-blue-500/10 hover:bg-blue-500 text-blue-500 hover:text-white rounded-xl transition-all"
                          title="ניהול AI"
                        >
                          <ExternalLink size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
}
