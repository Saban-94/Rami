"use client";

import React, { useEffect, useState } from "react";
import { db } from "../../../lib/firebase";
import { collection, query, orderBy, onSnapshot, updateDoc, doc } from "firebase/firestore";
import { Users, Calendar, MessageSquare, CheckCircle, Clock, Search } from "lucide-react";
import Navigation from "../../../components/Navigation";

export default function AdminDashboard() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!db) return;

    // האזנה בזמן אמת ללידים חדשים
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

  const updateStatus = async (id, newStatus) => {
    const docRef = doc(db, "trials", id);
    await updateDoc(docRef, { status: newStatus });
  };

  return (
    <main className="min-h-screen bg-[#020617] text-white" dir="rtl">
      <Navigation />
      
      <div className="pt-24 px-6 max-w-7xl mx-auto">
        <header className="mb-10 flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-black italic">לוח בקרה <span className="text-green-500">SabanOS</span></h1>
            <p className="text-white/50">ניהול לידים ותורים בזמן אמת</p>
          </div>
          <div className="bg-white/5 p-2 rounded-2xl border border-white/10 flex gap-4">
             <div className="text-center px-4">
               <div className="text-xs text-white/40">סה"כ לידים</div>
               <div className="text-xl font-bold">{leads.length}</div>
             </div>
          </div>
        </header>

        {/* טבלת לידים */}
        <div className="bg-white/5 border border-white/10 rounded-[2rem] overflow-hidden backdrop-blur-md">
          <div className="p-6 border-b border-white/10 flex justify-between items-center">
            <h2 className="flex items-center gap-2 font-bold">
              <Users size={20} className="text-green-500" /> נרשמו לאחרונה
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-right">
              <thead className="bg-white/5 text-white/40 text-sm">
                <tr>
                  <th className="p-4">בעל עסק</th>
                  <th className="p-4">סוג עסק</th>
                  <th className="p-4">וואטסאפ</th>
                  <th className="p-4">סטטוס</th>
                  <th className="p-4">פעולות</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {leads.map((lead: any) => (
                  <tr key={lead.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="p-4 font-bold">{lead.fullName || "ללא שם"}</td>
                    <td className="p-4 text-white/60">{lead.businessType === 'beauty' ? '💄 יופי וטיפוח' : lead.businessType}</td>
                    <td className="p-4 font-mono">{lead.whatsapp}</td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        lead.status === 'active' ? 'bg-green-500/20 text-green-500' : 'bg-yellow-500/20 text-yellow-500'
                      }`}>
                        {lead.status === 'active' ? 'פעיל' : 'בממתנה'}
                      </span>
                    </td>
                    <td className="p-4">
                       <button 
                        onClick={() => window.location.href = `/chat/${lead.id}`}
                        className="p-2 hover:bg-white/10 rounded-lg text-blue-400 transition-all"
                        title="צפה בצ'אט"
                       >
                         <MessageSquare size={18} />
                       </button>
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
