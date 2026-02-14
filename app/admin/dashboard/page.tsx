"use client";

import React, { useEffect, useState } from "react";
import { db } from "../../../lib/firebase";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { Users, MessageSquare, ExternalLink, Share2, Copy, Check } from "lucide-react";
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

  const copyToClipboard = (id: string) => {
    const url = `${window.location.origin}/chat/${id}`;
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(""), 2000);
  };

  const shareToWhatsApp = (phone: string, name: string, id: string) => {
    const url = `${window.location.origin}/chat/${id}`;
    const message = encodeURIComponent(`היי ${name}, הנה הלינק האישי שלך לניהול ה-AI ב-SabanOS:\n${url}`);
    window.open(`https://wa.me/${phone.replace(/\D/g, "")}?text=${message}`, "_blank");
  };

  return (
    <main className="min-h-screen bg-[#020617] text-white font-sans" dir="rtl">
      <Navigation />
      <div className="pt-32 px-6 max-w-7xl mx-auto">
        <h1 className="text-3xl font-black mb-8 italic">ניהול לקוחות <span className="text-green-500">SabanOS</span></h1>
        
        <div className="bg-white/5 border border-white/10 rounded-[2.5rem] overflow-hidden">
          <table className="w-full text-right">
            <thead className="bg-white/10 text-white/50 text-xs">
              <tr>
                <th className="p-6">לקוח</th>
                <th className="p-6">סוג עסק</th>
                <th className="p-6">לינק ניהול</th>
                <th className="p-6">פעולות</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {leads.map((lead: any) => (
                <tr key={lead.id} className="hover:bg-white/[0.02] transition-all">
                  <td className="p-6 font-bold">{lead.fullName || lead.businessName}</td>
                  <td className="p-6 text-sm">{lead.businessType === 'beauty' ? '💄 טיפוח' : lead.businessType}</td>
                  <td className="p-6">
                    <button 
                      onClick={() => copyToClipboard(lead.id)}
                      className="flex items-center gap-2 text-xs bg-white/5 px-3 py-2 rounded-xl hover:bg-white/10 transition-all"
                    >
                      {copiedId === lead.id ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
                      {copiedId === lead.id ? "הועתק!" : "העתק לינק"}
                    </button>
                  </td>
                  <td className="p-6 flex gap-3">
                    <button 
                      onClick={() => shareToWhatsApp(lead.whatsapp, lead.fullName, lead.id)}
                      className="p-3 bg-green-500/10 text-green-500 rounded-xl hover:bg-green-500 hover:text-black transition-all"
                      title="שלח לינק בוואטסאפ"
                    >
                      <Share2 size={18} />
                    </button>
                    <button 
                      onClick={() => window.open(`/chat/${lead.id}`, "_blank")}
                      className="p-3 bg-blue-500/10 text-blue-500 rounded-xl hover:bg-blue-500 hover:text-white transition-all"
                    >
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
