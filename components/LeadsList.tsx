"use client";
import React, { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { Phone, MapPin, IceCream } from "lucide-react";

export default function LeadsList({ trialId }: { trialId: string }) {
  const [leads, setLeads] = useState<any[]>([]);

  useEffect(() => {
    const q = query(collection(db, "trials", trialId, "leads"), orderBy("createdAt", "desc"));
    return onSnapshot(q, (snapshot) => {
      setLeads(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
  }, [trialId]);

  return (
    <div className="space-y-4">
      {leads.map((lead) => (
        <div key={lead.id} className="p-4 border rounded-2xl bg-slate-50 flex justify-between items-center">
          <div>
            <h3 className="font-bold text-lg">{lead.name || "לקוח חדש"}</h3>
            <div className="flex gap-3 text-sm text-slate-500">
              <span className="flex items-center gap-1"><MapPin size={14}/> {lead.origin}</span>
              {lead.isRefrigerated && <span className="flex items-center gap-1 text-blue-600 font-bold"><IceCream size={14}/> קירור</span>}
            </div>
          </div>
          <a href={`tel:${lead.phone}`} className="p-3 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors">
            <Phone size={20} />
          </a>
        </div>
      ))}
      {leads.length === 0 && <p className="text-center text-slate-400 py-10">אין לידים כרגע...</p>}
    </div>
  );
}
