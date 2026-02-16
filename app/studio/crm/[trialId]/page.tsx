'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  db 
} from '@/lib/firebase';
import { 
  doc, onSnapshot, updateDoc, collection, query, orderBy, 
  addDoc, serverTimestamp, deleteDoc, deleteField 
} from 'firebase/firestore';
import { 
  ShieldCheck, Palette, Users, Calendar as CalendarIcon, 
  ShoppingBag, Activity, Zap, Terminal, Send, Paperclip,
  ChevronRight, ChevronLeft, Plus, MessageSquare, Trash2, Link as LinkIcon
} from 'lucide-react';
import Navigation from '@/components/Navigation';
import MobilePreview from '@/components/studio/MobilePreview';
import { useToast } from '@/components/ui/ToastProvider';
import { suggestDesignFromPrompt } from '@/app/actions/gemini-brain';

// --- 1. רכיב קטלוג (Inline) ---
const CatalogSection = ({ trialId, products }: { trialId: string, products: any[] }) => {
  return (
    <div className="grid grid-cols-2 gap-4 animate-in fade-in duration-500">
      {products.map((p, i) => (
        <div key={i} className="p-6 bg-white/5 border border-white/10 rounded-[2.5rem] relative group">
          {p.onSale && <span className="absolute -top-2 -right-2 bg-red-600 text-white text-[10px] font-black px-3 py-1 rounded-full shadow-lg animate-bounce">SALE</span>}
          <h4 className="font-bold italic">{p.name}</h4>
          <p className="text-xs opacity-50 mb-4">{p.description || 'מוצר מהקטלוג'}</p>
          <div className="flex items-center gap-3 font-black">
             <span className={p.onSale ? 'line-through opacity-30 text-xs' : ''}>₪{p.price}</span>
             {p.onSale && <span className="text-green-500 italic">₪{p.salePrice}</span>}
          </div>
        </div>
      ))}
      <button className="border-2 border-dashed border-white/5 rounded-[2.5rem] p-10 opacity-30 hover:opacity-100 transition-all flex flex-col items-center gap-2">
        <Plus size={24} /> <span className="text-[10px] font-black uppercase">הוסף מוצר</span>
      </button>
    </div>
  );
};

// --- 2. רכיב CRM (Inline) ---
const CRMSection = ({ trialId, customers }: { trialId: string, customers: any[] }) => {
  return (
    <div className="space-y-4 animate-in slide-in-from-bottom-4 duration-500">
      {customers.map((c, i) => (
        <div key={i} className="bg-white/5 border border-white/10 p-5 rounded-[2.5rem] flex items-center justify-between group hover:border-green-500/30 transition-all">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-500/10 rounded-2xl flex items-center justify-center text-green-500 border border-green-500/20">
              <Users size={20} />
            </div>
            <div>
              <h3 className="font-black italic flex items-center gap-2">{c.name} {c.source === 'magic_link' && <LinkIcon size={12} className="text-blue-400"/>}</h3>
              <p className="text-[10px] opacity-50 font-bold uppercase">{c.phone} • {c.source || 'Manual'}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <a href={`https://wa.me/${c.phone}`} target="_blank" className="p-3 bg-green-600/10 text-green-500 rounded-xl hover:bg-green-600 hover:text-white transition-all"><MessageSquare size={16}/></a>
          </div>
        </div>
      ))}
    </div>
  );
};

// --- 3. הדף המרכזי המאוחד ---
export default function SabanOSStudioPro({ params }: { params: { trialId: string } }) {
  const [activeTab, setActiveTab] = useState<"design" | "crm" | "calendar" | "catalog">("design");
  const [manifest, setManifest] = useState<any>(null);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [prompt, setPrompt] = useState("");
  const [logs, setLogs] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { addToast } = useToast();

  const logAction = useCallback((type: string, details: string) => {
    setLogs(prev => [{ id: Date.now(), type, details, time: new Date().toLocaleTimeString() }, ...prev].slice(0, 10));
  }, []);

  useEffect(() => {
    if (!params.trialId) return;
    
    // סנכרון מניפסט
    const unsubManifest = onSnapshot(doc(db, "trials", params.trialId), (snap) => {
      if (snap.exists()) setManifest(snap.data());
    });

    // סנכרון לקוחות
    const unsubCustomers = onSnapshot(collection(db, "trials", params.trialId, "customers"), (snap) => {
      setCustomers(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      logAction("DB", "Customers synced");
    });

    // סנכרון קטלוג
    const unsubCatalog = onSnapshot(collection(db, "trials", params.trialId, "catalog"), (snap) => {
      setProducts(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      logAction("DB", "Catalog synced");
    });

    return () => { unsubManifest(); unsubCustomers(); unsubCatalog(); };
  }, [params.trialId, logAction]);

  const handleAiAction = async () => {
    if (!prompt.trim()) return;
    logAction("AI", `Executing: ${prompt.substring(0, 15)}...`);
    try {
      const patch = await suggestDesignFromPrompt({ prompt });
      await updateDoc(doc(db, "trials", params.trialId), patch);
      setPrompt("");
      addToast("העיצוב עודכן!", "success");
      logAction("SUCCESS", "AI Patch Applied via Dot Notation");
    } catch (err) {
      logAction("ERROR", "AI Failed");
    }
  };

  return (
    <main className={`h-screen flex flex-col transition-colors duration-500 ${isDarkMode ? 'bg-[#020617] text-white' : 'bg-slate-50 text-slate-900'}`} dir="rtl">
      <Navigation />
      
      <div className="flex-1 grid grid-cols-12 pt-16 overflow-hidden">
        
        {/* עמודה 1: המלשינון */}
        <aside className="col-span-2 border-l border-white/5 bg-black/20 p-4 flex flex-col">
          <div className="flex items-center gap-2 text-[10px] font-black uppercase text-green-500 mb-4 tracking-widest">
            <Terminal size={14} /> System Auditor
          </div>
          <div className="flex-1 overflow-y-auto space-y-2 font-mono text-[9px]">
            {logs.map(log => (
              <div key={log.id} className="p-2 bg-white/5 rounded-lg border border-white/5 opacity-70">
                <span className="text-blue-400">[{log.time}]</span> <span className="font-bold">{log.type}:</span> {log.details}
              </div>
            ))}
          </div>
        </aside>

        {/* עמודה 2: Workspace */}
        <section className="col-span-6 p-10 overflow-y-auto custom-scrollbar">
          <div className="flex gap-2 mb-10 bg-white/5 p-1 rounded-2xl w-fit">
            {['design', 'crm', 'calendar', 'catalog'].map((t) => (
              <button 
                key={t} onClick={() => setActiveTab(t as any)}
                className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase transition-all ${activeTab === t ? 'bg-green-600' : 'opacity-40 hover:opacity-100'}`}
              >
                {t}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              <h1 className="text-5xl font-black italic uppercase tracking-tighter mb-8">
                {activeTab === 'design' ? 'Studio Core' : activeTab.toUpperCase()}
              </h1>
              
              {activeTab === 'design' && (
                <div className="p-10 bg-white/5 rounded-[3.5rem] border border-white/10 relative">
                   <h2 className="text-xl font-black italic mb-6">AI Control Panel</h2>
                   <div className="relative flex items-center gap-3">
                     <div className="relative flex-1">
                        <input 
                          type="text" value={prompt} onChange={(e) => setPrompt(e.target.value)}
                          className="w-full bg-black/40 border border-white/10 rounded-2xl p-6 pr-14 outline-none focus:border-green-500"
                          placeholder="מה לשנות בעיצוב?"
                        />
                        <button 
                          onClick={() => fileInputRef.current?.click()}
                          className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-green-500 z-50"
                        >
                          <Paperclip size={22} />
                        </button>
                        <input type="file" ref={fileInputRef} className="hidden" />
                     </div>
                     <button onClick={handleAiAction} className="bg-green-600 p-6 rounded-2xl shadow-xl"><Send size={20}/></button>
                   </div>
                </div>
              )}

              {activeTab === 'crm' && <CRMSection trialId={params.trialId} customers={customers} />}
              {activeTab === 'catalog' && <CatalogSection trialId={params.trialId} products={products} />}
              {activeTab === 'calendar' && (
                <div className="h-64 border-2 border-dashed border-white/10 rounded-[3rem] flex items-center justify-center italic opacity-30">
                   Calendar Grid Active - Monthly View
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </section>

        {/* עמודה 3: Preview */}
        <aside className="col-span-4 flex items-center justify-center bg-black/10 border-r border-white/5">
           <div className="sticky top-0 h-full w-full flex items-center justify-center p-12">
              <MobilePreview manifest={manifest} />
           </div>
        </aside>

      </div>
    </main>
  );
}
