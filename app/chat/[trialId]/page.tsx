"use client";

import React, { useState, useEffect, useRef } from "react";
import { db } from "../../../lib/firebase";
import { doc, getDoc, updateDoc, arrayUnion } from "firebase/firestore";
import Navigation from "../../../components/Navigation";
import ChatInterface from "../../../components/ChatInterface";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Brain, Calendar, Save, Plus, Sun, Moon, 
  MessageSquare, UserPlus, Share2, Activity, 
  Sparkles, TrendingUp, Users, Lock, Clock, Paperclip 
} from "lucide-react";

export default function SabanOSStudio({ params }: { params: { trialId: string } }) {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [inputCode, setInputCode] = useState("");
  const [businessData, setBusinessData] = useState<any>(null);
  const [extraContext, setExtraContext] = useState("");
  const [aiCanvasText, setAiCanvasText] = useState("");
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [newCustomer, setNewCustomer] = useState({ name: "", phone: "" });
  const [isAddingCustomer, setIsAddingCustomer] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      audioRef.current = new Audio("/sounds/whatsapp.mp3");
    }

    const fetchDoc = async () => {
      try {
        const docRef = doc(db, "trials", params.trialId);
        const snap = await getDoc(docRef);
        if (snap.exists()) {
          const data = snap.data();
          setBusinessData(data);
          setExtraContext(data.businessContext || "");
        }
      } catch (err) {
        console.error("Firebase Error:", err);
      }
      setLoading(false);
    };

    fetchDoc();

    const win = window as any;
    if (win.OneSignal) {
      win.OneSignal.push(() => {
        if (win.OneSignal.Notifications) console.log("OneSignal Ready");
      });
    }
  }, [params.trialId]);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle("dark");
  };

  const handleVerify = () => {
    if (inputCode === businessData?.accessCode) {
      setIsAuthorized(true);
      if (audioRef.current) audioRef.current.play().catch(() => {});
      typeToCanvas(`מערכת SabanOS Studio הופעלה. שלום ${businessData?.fullName}, המוח מאזין ומסונכרן ליומן של ${businessData?.businessName}.`);
    } else {
      alert("קוד גישה שגוי");
    }
  };

  const typeToCanvas = (text: string) => {
    setAiCanvasText("");
    let i = 0;
    const interval = setInterval(() => {
      setAiCanvasText((prev) => prev + text.charAt(i));
      i++;
      if (i >= text.length) clearInterval(interval);
    }, 25);
  };

  const addCustomer = async () => {
    if (!newCustomer.name || !newCustomer.phone) return;
    setIsAddingCustomer(true);
    const docRef = doc(db, "trials", params.trialId);
    const customerObj = { ...newCustomer, id: Date.now(), date: new Date().toLocaleDateString('he-IL') };
    await updateDoc(docRef, { customers: arrayUnion(customerObj) });
    setBusinessData({ ...businessData, customers: [...(businessData.customers || []), customerObj] });
    setNewCustomer({ name: "", phone: "" });
    setIsAddingCustomer(false);
    typeToCanvas(`מעולה עמאר! הלקוח ${customerObj.name} נוסף בהצלחה. שלח לו הודעה כדי להתחיל.`);
  };

  const shareToWhatsApp = (customer: any) => {
    const msg = encodeURIComponent(`היי ${customer.name}, כאן ${businessData.businessName}. שמרתי אותך במערכת שלי! לקביעת תור מהיר בוואטסאפ: ${window.location.origin}/trial`);
    window.open(`https://wa.me/972${customer.phone.substring(1)}?text=${msg}`, "_blank");
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-[#020617] text-green-600 font-black italic animate-pulse text-2xl">SabanOS Studio...</div>;

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-[#020617] flex items-center justify-center p-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 p-12 rounded-[4rem] max-w-md w-full text-center shadow-2xl backdrop-blur-xl">
          <div className="w-24 h-24 bg-green-500 rounded-[2.5rem] mx-auto mb-8 flex items-center justify-center shadow-xl text-white shadow-green-500/20"><Lock size={40} /></div>
          <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-6 italic tracking-tighter uppercase">Enter Studio</h2>
          <input type="password" maxLength={4} value={inputCode} onChange={(e) => setInputCode(e.target.value)} className="w-full bg-slate-100 dark:bg-black/40 border-2 border-slate-200 dark:border-white/10 rounded-3xl p-6 text-center text-4xl tracking-[15px] text-green-600 outline-none focus:border-green-500 mb-8" placeholder="****" />
          <button onClick={handleVerify} className="w-full bg-green-600 text-white font-black py-5 rounded-3xl text-xl hover:bg-green-700 transition-all uppercase tracking-widest">START SESSION</button>
        </motion.div>
      </div>
    );
  }

  return (
    <main className={`min-h-screen ${isDarkMode ? 'bg-[#020617] text-white' : 'bg-[#F8FAFC] text-slate-900'} transition-colors duration-500 font-sans`} dir="rtl">
      <Navigation />
      
      <div className="pt-28 px-8 max-w-[1750px] mx-auto pb-20">
        
        {/* STATS & HEADER */}
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 mb-10">
          <div className="xl:col-span-2 bg-white dark:bg-white/5 p-8 rounded-[3.5rem] border border-slate-200 dark:border-white/10 shadow-sm backdrop-blur-md flex items-center gap-6">
            <div className="w-24 h-24 rounded-[2.5rem] bg-green-500/10 border-2 border-green-500/20 overflow-hidden flex items-center justify-center shadow-inner">
              {businessData?.logoUrl ? <img src={businessData.logoUrl} className="w-full h-full object-cover" /> : <span className="text-5xl font-black italic text-green-600">{businessData?.businessName?.[0]}</span>}
            </div>
            <div>
              <h1 className="text-4xl font-black italic tracking-tighter leading-none mb-2 uppercase">{businessData?.businessName} STUDIO</h1>
              <div className="flex items-center gap-2 text-green-600 font-bold text-xs uppercase tracking-widest">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(34,197,94,1)]" /> AI Brain: ONLINE
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-white/5 p-8 rounded-[3rem] border border-slate-200 dark:border-white/10 flex items-center justify-between"><div className="text-3xl font-black italic">{businessData?.customers?.length || 0}</div><Users className="text-green-500 opacity-20" size={40} /></div>
          <div className="bg-white dark:bg-white/5 p-8 rounded-[3rem] border border-slate-200 dark:border-white/10 flex items-center justify-between"><div className="text-3xl font-black italic">{(businessData?.customers?.length || 0) * 3 + 8}</div><TrendingUp className="text-blue-500 opacity-20" size={40} /></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* ניהול לקוחות */}
          <div className="lg:col-span-4 space-y-10">
            <div className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-[3.5rem] p-10 shadow-sm">
              <h2 className="text-xl font-black mb-8 flex items-center gap-3 italic uppercase"><UserPlus className="text-green-600" /> הוסף לקוח</h2>
              <div className="space-y-4">
                <input value={newCustomer.name} onChange={(e) => setNewCustomer({...newCustomer, name: e.target.value})} placeholder="שם מלא" className="w-full bg-slate-100 dark:bg-black/20 border-none rounded-2xl p-5 outline-none focus:ring-2 ring-green-500 transition-all font-bold" />
                <input value={newCustomer.phone} onChange={(e) => setNewCustomer({...newCustomer, phone: e.target.value})} placeholder="טלפון (05...)" className="w-full bg-slate-100 dark:bg-black/20 border-none rounded-2xl p-5 outline-none focus:ring-2 ring-green-500 transition-all font-bold" />
                <button onClick={addCustomer} disabled={isAddingCustomer} className="w-full bg-green-600 text-white font-black py-5 rounded-3xl hover:shadow-2xl transition-all flex items-center justify-center gap-3 uppercase tracking-tighter">
                  <Plus size={20} /> הוסף לסטודיו
                </button>
              </div>
            </div>
            <div className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-[3.5rem] p-10 shadow-sm overflow-hidden h-[450px] flex flex-col">
              <h3 className="text-lg font-black mb-6 opacity-40 uppercase italic tracking-widest"><Activity size={20}/> Feed</h3>
              <div className="space-y-4 overflow-y-auto flex-1 pr-2">
                {businessData?.customers?.slice().reverse().map((c: any) => (
                  <div key={c.id} className="p-5 bg-slate-50 dark:bg-white/5 rounded-[2.5rem] border border-slate-100 dark:border-white/5 flex justify-between items-center group">
                    <div><p className="font-black text-sm">{c.name}</p><p className="text-[10px] opacity-40 font-mono italic tracking-tighter uppercase">{c.date}</p></div>
                    <button onClick={() => shareToWhatsApp(c)} className="p-4 bg-green-600 text-white rounded-2xl hover:scale-110 transition-all shadow-lg shadow-green-500/20"><Share2 size={18} /></button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* יומן */}
          <div className="lg:col-span-4 space-y-10">
            <div className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-[4rem] p-12 shadow-sm h-full flex flex-col">
              <div className="flex items-center justify-between mb-12 italic uppercase tracking-tighter">
                <h2 className="text-2xl font-black flex items-center gap-4"><Calendar className="text-green-600" /> Schedule</h2>
              </div>
              <div className="grid grid-cols-7 gap-4 flex-1">
                {Array.from({ length: 28 }, (_, i) => i + 1).map(day => (
                  <button key={day} onClick={() => typeToCanvas(`ניתוח יומן ל-${day} בחודש... עמאר, היום הזה פנוי ב-SabanOS לתיאום תורים חדשים.`)} className="aspect-square rounded-2xl bg-slate-100 dark:bg-white/5 flex items-center justify-center font-black text-xl hover:bg-green-600 hover:text-white transition-all shadow-inner hover:shadow-lg">
                    {day}
                  </button>
                ))}
              </div>
              <div className="mt-8 pt-8 border-t border-slate-100 dark:border-white/5 flex justify-between items-center">
                 <button onClick={toggleTheme} className="flex items-center gap-3 text-xs font-black uppercase text-slate-400 hover:text-green-600 transition-all">{isDarkMode ? <Sun size={18} /> : <Moon size={18} />} Theme</button>
              </div>
            </div>
          </div>

          {/* AI LIVE CANVAS */}
          <div className="lg:col-span-4 h-full min-h-[850px]">
            <div className="bg-white dark:bg-[#0b141a] border-4 border-slate-200 dark:border-white/10 rounded-[5rem] h-full shadow-2xl flex flex-col relative overflow-hidden">
              <div className="bg-slate-50 dark:bg-[#1f2c34] p-10 flex items-center gap-5 border-b border-slate-200 dark:border-white/5">
                <div className="w-16 h-16 rounded-[2rem] bg-green-600 flex items-center justify-center font-black text-white text-3xl italic">AI</div>
                <div><h3 className="font-black text-2xl italic tracking-tighter uppercase">Studio AI Core</h3></div>
              </div>
              <div className="flex-1 p-12 overflow-y-auto">
                <AnimatePresence>
                  {aiCanvasText && (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="p-10 bg-green-600/5 dark:bg-green-600/10 border-r-4 border-green-600 rounded-l-[3rem] shadow-inner relative">
                      <Sparkles className="absolute top-4 left-4 text-green-500 opacity-20" size={24} />
                      <p className="text-2xl font-bold leading-snug text-green-700 dark:text-green-400 font-mono italic tracking-tight">{aiCanvasText}<span className="inline-block w-2.5 h-8 bg-green-600 animate-pulse ml-3 align-middle" /></p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              <div className="p-10 bg-slate-50 dark:bg-white/5 border-t border-slate-200 dark:border-white/5 flex gap-4">
                <div className="flex-1 bg-white dark:bg-black/40 border border-slate-200 dark:border-white/10 rounded-[2rem] p-5 text-xs font-black opacity-20 uppercase tracking-widest italic">AI Processing...</div>
                <div className="bg-green-600 p-5 rounded-[2rem] text-white shadow-xl shadow-green-600/20"><MessageSquare size={24} /></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
