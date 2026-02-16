'use client';

import React, { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, query, onSnapshot, orderBy, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { User, Phone, Mail, Link as LinkIcon, Trash2, Search, Filter, MessageSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function CRMManager({ trialId }: { trialId: string }) {
  const [customers, setCustomers] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    if (!trialId) return;
    const q = query(collection(db, 'trials', trialId, 'customers'), orderBy('createdAt', 'desc'));
    const unsub = onSnapshot(q, (snap) => {
      setCustomers(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    return () => unsub();
  }, [trialId]);

  const deleteCustomer = async (id: string) => {
    if (confirm("האם למחוק לקוח זה? הפעולה לצמיתות.")) {
      await deleteDoc(doc(db, 'trials', trialId, 'customers', id));
    }
  };

  const filtered = customers.filter(c => 
    (c.name?.toLowerCase().includes(searchTerm.toLowerCase()) || c.phone?.includes(searchTerm)) &&
    (filter === "all" || c.source === filter)
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* סרגל כלים - CRM Control */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-white/5 p-6 rounded-[2.5rem] border border-white/10">
        <div className="relative w-full md:w-96">
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 opacity-30" size={18} />
          <input 
            type="text"
            placeholder="חפש לפי שם או טלפון..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-black/20 border border-white/5 rounded-2xl py-3 pr-12 pl-4 text-sm outline-none focus:border-green-500 transition-all"
          />
        </div>
        
        <div className="flex gap-2 p-1 bg-black/20 rounded-2xl border border-white/5">
          {['all', 'magic_link', 'manual'].map((f) => (
            <button 
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${filter === f ? 'bg-green-600 text-white shadow-lg' : 'opacity-40 hover:opacity-100'}`}
            >
              {f === 'all' ? 'הכל' : f === 'magic_link' ? 'לינק קסם' : 'ידני'}
            </button>
          ))}
        </div>
      </div>

      {/* רשימת כרטיסי לקוח */}
      <div className="grid gap-4">
        <AnimatePresence mode="popLayout">
          {filtered.map((customer) => (
            <motion.div 
              key={customer.id}
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white/5 border border-white/10 p-5 rounded-[2.5rem] flex flex-col lg:flex-row justify-between items-center gap-6 group hover:border-green-500/30 transition-all"
            >
              <div className="flex items-center gap-5">
                <div className="w-14 h-14 bg-gradient-to-br from-green-500/20 to-emerald-700/20 rounded-2xl flex items-center justify-center border border-green-500/20 shadow-inner">
                  <User className="text-green-500" size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-black italic flex items-center gap-2 tracking-tight">
                    {customer.name}
                    {customer.source === 'magic_link' && <LinkIcon size={12} className="text-blue-400" title="הצטרף דרך הלינק" />}
                  </h3>
                  <div className="flex gap-4 mt-1 opacity-50 text-[11px] font-bold uppercase tracking-tighter">
                    <span className="flex items-center gap-1"><Phone size={12}/> {customer.phone}</span>
                    {customer.email && <span className="flex items-center gap-1"><Mail size={12}/> {customer.email}</span>}
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <a 
                  href={`https://wa.me/${customer.phone?.replace(/\D/g, '')}`} 
                  target="_blank"
                  className="p-3 bg-green-600/10 hover:bg-green-600 text-green-500 hover:text-white rounded-xl transition-all"
                >
                  <MessageSquare size={18} />
                </a>
                <button 
                  onClick={() => deleteCustomer(customer.id)}
                  className="p-3 bg-red-500/10 hover:bg-red-600 text-red-500 hover:text-white rounded-xl transition-all"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {filtered.length === 0 && (
          <div className="text-center py-20 bg-white/5 rounded-[3rem] border border-dashed border-white/10 opacity-30 italic">
            <Users size={48} className="mx-auto mb-4" />
            <p>לא נמצאו לקוחות התואמים את החיפוש</p>
          </div>
        )}
      </div>
    </div>
  );
}
