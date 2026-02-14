"use client";

import React, { useEffect, useState } from "react";
import { db } from "../../../lib/firebase";
import { collection, query, orderBy, onSnapshot, doc, updateDoc } from "firebase/firestore";
import { Users, Share2, Bell, Lock, Edit2, Play } from "lucide-react";
import Navigation from "../../../components/Navigation";

export default function AdminDashboard() {
  const [leads, setLeads] = useState([]);

  useEffect(() => {
    if (!db) return;
    const q = query(collection(db, "trials"), orderBy("createdAt", "desc"));
    return onSnapshot(q, (snapshot) => {
      setLeads(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
  }, []);

  const playTestSound = () => {
    new Audio("/sounds/whatsapp.mp3").play();
  };

  const shareAccess = (lead: any) => {
    const url = `${window.location.origin}/chat/${lead.id}`;
    const msg = `שלום ${lead.fullName}, המערכת שלך מוכנה!\n\n🔗 לינק: ${url}\n🔑 קוד גישה: ${lead.accessCode}\n\nבהצלחה!`;
    window.open(`https://wa.me/${lead.whatsapp.replace(/\D/g, "")}?text=${encodeURIComponent(msg)}`, "_blank");
  };

  return (
    <main className="min-h-screen bg-[#020617] text-white" dir="rtl">
      <Navigation />
      <div className="pt-32 px-6 max-w-7xl mx-auto pb-20">
        <div className="flex justify-between items-center mb-12">
          <h1 className="text-4xl font-black italic tracking-tighter">SabanOS <span className="text-green-500">Command Center</span></h1>
          <button onClick={playTestSound} className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-xl text-xs hover:bg-white/10 border border-white/10 transition-all">
            <Play size={14} /> בדיקת צליל מערכת
          </button>
        </div>

        <div className="grid gap-6">
          {leads.map((lead: any) => (
            <div key={lead.id} className="bg-white/5 border border-white/10 p-6 rounded-[2.5rem] flex flex-wrap items-center justify-between backdrop-blur-xl hover:border-green-500/30 transition-all">
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 rounded-2xl bg-white/10 overflow-hidden flex items-center justify-center border border-white/10">
                  {lead.logoUrl ? <img src={lead.logoUrl} className="w-full h-full object-cover" /> : <Users size={24} className="opacity-20" />}
                </div>
                <div>
                  <h3 className="text-xl font-bold italic">{lead.fullName}</h3>
                  <p className="text-white/40 text-sm">{lead.businessName} • {lead.whatsapp}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 mt-4 md:mt-0">
                <div className="flex flex-col items-center bg-black/40 px-6 py-2 rounded-2xl border border-white/5">
                  <span className="text-[10px] text-white/40 uppercase font-bold">Access Code</span>
                  <span className="text-green-500 font-mono font-black text-xl tracking-widest">{lead.accessCode}</span>
                </div>
                
                <div className="flex gap-2">
                  <button onClick={() => shareAccess(lead)} className="p-4 bg-green-500/10 text-green-500 rounded-2xl hover:bg-green-500 hover:text-black transition-all">
                    <Share2 size={20} />
                  </button>
                  <button className="p-4 bg-blue-500/10 text-blue-500 rounded-2xl hover:bg-blue-500 hover:text-white transition-all">
                    <Bell size={20} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
