"use client";

import React, { useEffect, useState } from "react";
import { db } from "../../../lib/firebase";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { Users, Share2, ExternalLink, Copy, Check, Lock } from "lucide-react";
import Navigation from "../../../components/Navigation";

export default function AdminDashboard() {
  const [leads, setLeads] = useState([]);
  const [copiedId, setCopiedId] = useState("");

  useEffect(() => {
    if (!db) return;
    const q = query(collection(db, "trials"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setLeads(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, []);

  const shareToWhatsApp = (lead: any) => {
    const url = `${window.location.origin}/chat/${lead.id}`;
    const message = encodeURIComponent(`שלום ${lead.fullName},\nהנה פרטי הגישה למערכת SabanOS שלך:\n🔗 לינק: ${url}\n🔑 קוד גישה: ${lead.accessCode}`);
    window.open(`https://wa.me/${lead.whatsapp.replace(/\D/g, "")}?text=${message}`, "_blank");
  };

  return (
    <main className="min-h-screen bg-[#020617] text-white" dir="rtl">
      <Navigation />
      <div className="pt-32 px-6 max-w-7xl mx-auto">
        <h1 className="text-3xl font-black mb-10 italic">ניהול לקוחות <span className="text-green-500 underline">SabanOS</span></h1>
        
        <div className="bg-white/5 border border-white/10 rounded-[2.5rem] overflow-hidden backdrop-blur-xl">
          <table className="w-full text-right">
            <thead className="bg-white/10 text-white/50 text-xs uppercase tracking-tighter">
              <tr>
                <th className="p-6">בעל עסק</th>
                <th className="p-6">סוג</th>
                <th className="p-6">קוד גישה</th>
                <th className="p-6">פעולות</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {leads.map((lead: any) => (
                <tr key={lead.id} className="hover:bg-white/[0.03] transition-all">
                  <td className="p-6">
                    <div className="font-bold">{lead.fullName}</div>
                    <div className="text-xs text-white/30">{lead.whatsapp}</div>
                  </td>
                  <td className="p-6 text-sm">{lead.businessType === 'beauty' ? '💄 יופי' : '💼 כללי'}</td>
                  <td className="p-6">
                    <div className="flex items-center gap-2 text-green-500 font-mono font-bold bg-green-500/10 w-fit px-3 py-1 rounded-lg border border-green-500/20">
                      <Lock size={12} /> {lead.accessCode}
                    </div>
                  </td>
                  <td className="p-6 flex gap-3">
                    <button onClick={() => shareToWhatsApp(lead)} className="p-3 bg-green-500/10 text-green-500 rounded-xl hover:bg-green-500 hover:text-black transition-all">
                      <Share2 size={18} />
                    </button>
                    <button onClick={() => window.open(`/chat/${lead.id}`, "_blank")} className="p-3 bg-white/5 text-white/50 rounded-xl hover:bg-white/10 transition-all">
                      <ExternalLink size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
