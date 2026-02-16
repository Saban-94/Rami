"use client";

import React, { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { collection, query, onSnapshot, orderBy, doc, updateDoc } from "firebase/firestore";
import { User, Phone, Mail, Calendar, CheckCircle, Clock, Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function CRMManager({ trialId }: { trialId: string }) {
  const [leads, setLeads] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    // משיכת לידים ישירות מהצ'אט של העסק
    const q = query(
      collection(db, "trials", trialId, "leads"), 
      orderBy("createdAt", "desc")
    );
    
    const unsubscribe = onSnapshot(q, (snap) => {
      setLeads(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, [trialId]);

  const updateStatus = async (leadId: string, newStatus: string) => {
    const leadRef = doc(db, "trials", trialId, "leads", leadId);
    await updateDoc(leadRef, { status: newStatus });
  };

  const filteredLeads = leads.filter(lead => 
    (lead.name?.toLowerCase().includes(searchTerm.toLowerCase()) || lead.phone?.includes(searchTerm)) &&
    (filter === "all" || lead.status === filter)
  );

  return (
    <div className="space-y-6">
      {/* סרגל כלים CRM */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="relative w-full md:w-96">
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 opacity-30" size={18} />
          <input 
            type="text"
            placeholder="חיפוש לפי שם או טלפון..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pr-12 pl-4 text-sm outline-none focus:border-green-500 transition-all"
          />
        </div>
        <div className="flex gap-2">
          {['all', 'new', 'in-progress', 'completed'].map((f) => (
            <button 
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${filter === f ? 'bg-green-600 text-white' : 'bg-white/5 hover:bg-white/10'}`}
            >
              {f === 'all' ? 'הכל' : f === 'new' ? 'חדש' : f === 'in-progress' ? 'בטיפול' : 'הושלם'}
            </button>
          ))}
        </div>
      </div>

      {/* רשימת לקוחות */}
      <div className="grid gap-4">
        <AnimatePresence>
          {filteredLeads.map((lead) => (
            <motion.div 
              key={lead.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white/5 border border-white/10 p-6 rounded-[2.5rem] flex flex-col lg:flex-row justify-between items-center gap-6 hover:border-green-500/30 transition-all group"
            >
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-700 rounded-2xl flex items-center justify-center text-white shadow-lg">
                  <User size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-black italic">{lead.name || "אנונימי"}</h3>
                  <div className="flex gap-3 mt-1 opacity-50 text-xs font-bold">
                    <span className="flex items-center gap-1"><Phone size={12}/> {lead.phone}</span>
                    <span className="flex items-center gap-1"><Calendar size={12}/> {lead.createdAt?.toDate().toLocaleDateString('he-IL')}</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button 
                  onClick={() => updateStatus(lead.id, 'in-progress')}
                  className={`p-3 rounded-xl transition-all ${lead.status === 'in-progress' ? 'bg-blue-500 text-white' : 'bg-white/5 opacity-30 hover:opacity-100'}`}
                  title="סמן כבטיפול"
                >
                  <Clock size={18} />
                </button>
                <button 
                  onClick={() => updateStatus(lead.id, 'completed')}
                  className={`p-3 rounded-xl transition-all ${lead.status === 'completed' ? 'bg-green-600 text-white' : 'bg-white/5 opacity-30 hover:opacity-100'}`}
                  title="סמן כהושלם"
                >
                  <CheckCircle size={18} />
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
