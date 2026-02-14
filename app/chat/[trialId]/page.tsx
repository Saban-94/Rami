"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { db } from "../../../lib/firebase";
import { doc, getDoc, updateDoc, collection, query, orderBy, onSnapshot, addDoc, serverTimestamp } from "firebase/firestore";
import Navigation from "../../../components/Navigation";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { 
  Smartphone, Layout, Palette, Sparkles, Rocket, 
  Check, ChevronLeft, Calendar, Clock, Lock, 
  Sun, Moon, Coffee, BookOpen, Scissors, 
  Stethoscope, Briefcase, ChevronRight, User, Send, MessageSquare
} from "lucide-react";
import { format, addDays, isSameDay, startOfDay } from "date-fns";
import { he } from "date-fns/locale";

// --- קטגוריות הזרקה ---
const CATEGORIES = [
  { id: 'barber', name: 'יופי וטיפוח', icon: <Scissors size={18}/> },
  { id: 'food', name: 'מזון ומשקאות', icon: <Coffee size={18}/> },
  { id: 'retail', name: 'חנויות וספרים', icon: <BookOpen size={18}/> },
  { id: 'medical', name: 'רפואה וקליניקות', icon: <Stethoscope size={18}/> },
];

export default function SabanOSUnifiedStudio({ params }: { params: { trialId: string } }) {
  // --- States ---
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [inputCode, setInputCode] = useState("");
  const [businessData, setBusinessData] = useState<any>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // --- Chat States ---
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  // --- UI Builder States ---
  const [selectedCat, setSelectedCat] = useState(CATEGORIES[0]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  // --- Initial Fetch ---
  useEffect(() => {
    const fetchDoc = async () => {
      try {
        const docRef = doc(db, "trials", params.trialId);
        const snap = await getDoc(docRef);
        if (snap.exists()) setBusinessData(snap.data());
      } catch (err) { console.error(err); }
      setLoading(false);
    };
    fetchDoc();
  }, [params.trialId]);

  // --- Realtime Chat Listener ---
  useEffect(() => {
    if (!isAuthorized) return;
    const q = query(collection(db, "trials", params.trialId, "messages"), orderBy("createdAt", "asc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setMessages(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setTimeout(() => scrollRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
    });
    return () => unsubscribe();
  }, [isAuthorized, params.trialId]);

  // --- Handlers ---
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    const msg = newMessage;
    setNewMessage("");
    await addDoc(collection(db, "trials", params.trialId, "messages"), {
      text: msg,
      sender: "admin",
      createdAt: serverTimestamp(),
    });
  };

  const handleVerify = () => {
    if (inputCode === businessData?.accessCode) {
      setIsAuthorized(true);
    } else {
      alert("קוד שגוי");
    }
  };

  const triggerSuccess = () => {
    setIsSuccess(true);
    confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 }, colors: ['#22c55e', '#ffffff', '#fbbf24'] });
  };

  const weekDays = useMemo(() => Array.from({ length: 7 }).map((_, i) => addDays(startOfDay(new Date()), i)), []);

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-[#020617] text-green-500 font-black animate-pulse text-2xl uppercase tracking-tighter">SabanOS Core...</div>;

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center p-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white/5 border border-white/10 p-12 rounded-[4rem] max-w-md w-full text-center shadow-2xl backdrop-blur-xl">
          <div className="w-20 h-20 bg-green-500 rounded-[2rem] mx-auto mb-8 flex items-center justify-center text-white shadow-xl shadow-green-500/20"><Lock size={32} /></div>
          <h2 className="text-3xl font-black text-white mb-6 italic uppercase tracking-tighter text-right">כניסה לסטודיו</h2>
          <input type="password" maxLength={4} value={inputCode} onChange={(e) => setInputCode(e.target.value)} className="w-full bg-black/40 border-2 border-white/10 rounded-3xl p-6 text-center text-4xl tracking-[15px] text-green-500 outline-none focus:border-green-500 mb-8" placeholder="****" />
          <button onClick={handleVerify} className="w-full bg-green-600 text-white font-black py-5 rounded-3xl text-xl shadow-lg hover:bg-green-700 transition-all uppercase tracking-widest">Open Session</button>
        </motion.div>
      </div>
    );
  }

  return (
    <main className={`min-h-screen ${isDarkMode ? 'bg-[#020617] text-white' : 'bg-[#F8FAFC] text-slate-900'} transition-colors duration-500 font-sans`} dir="rtl">
      <Navigation />
      
      <div className="pt-24 px-6 max-w-[1900px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 h-[calc(100vh-100px)] pb-6">
        
        {/* --- 1. LEFT: Tools & Categories --- */}
        <div className="lg:col-span-3 flex flex-col gap-4 overflow-y-auto custom-scrollbar">
          <div className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-[3rem] p-6 shadow-sm">
            <h2 className="text-lg font-black italic mb-6 flex items-center gap-2">
              <Layout size={18} className="text-green-500" /> הזרקת תבניות
            </h2>
            <div className="space-y-2">
              {CATEGORIES.map((cat) => (
                <button key={cat.id} onClick={() => setSelectedCat(cat)} 
                  className={`w-full p-4 rounded-2xl flex items-center justify-between transition-all ${selectedCat.id === cat.id ? 'bg-green-600 text-white shadow-lg' : 'bg-slate-50 dark:bg-white/5 hover:border-green-500/30'}`}>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white/10 rounded-lg">{cat.icon}</div>
                    <span className="text-sm font-bold italic">{cat.name}</span>
                  </div>
                  <ChevronRight size={14} className={selectedCat.id === cat.id ? 'opacity-100' : 'opacity-20'} />
                </button>
              ))}
            </div>
          </div>
          <button onClick={() => setIsDarkMode(!isDarkMode)} className="w-full py-5 bg-slate-900 dark:bg-white text-white dark:text-black rounded-3xl font-black text-xs flex items-center justify-center gap-2 shadow-xl">
            {isDarkMode ? <Sun size={16}/> : <Moon size={16}/>} {isDarkMode ? 'LIGHT MODE' : 'DARK MODE'}
          </button>
        </div>

        {/* --- 2. CENTER: iPhone Builder (Visual Preview) --- */}
        <div className="lg:col-span-4 flex flex-col items-center justify-center relative bg-slate-100 dark:bg-black/20 rounded-[4rem] border border-dashed border-slate-300 dark:border-white/5">
          <div className="w-[280px] h-[580px] bg-black rounded-[3.5rem] border-[10px] border-slate-800 shadow-2xl relative overflow-hidden ring-4 ring-black/10 scale-[1.05]">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-6 bg-slate-800 rounded-b-2xl z-30" />
            <div className={`w-full h-full p-5 pt-12 overflow-y-auto ${isDarkMode ? 'bg-[#0b141a]' : 'bg-white'}`}>
              <div className="text-center mb-6">
                <h3 className="text-xl font-black italic">{businessData?.businessName}</h3>
                <p className="text-[8px] opacity-40 uppercase tracking-widest">Premium {selectedCat.name} Studio</p>
              </div>

              {/* Weekly Calendar */}
              <div className="flex gap-2 overflow-x-auto pb-3 no-scrollbar mb-4">
                {weekDays.map(d => (
                  <button key={d.toISOString()} onClick={() => setSelectedDate(d)} 
                    className={`min-w-[50px] py-3 rounded-xl border transition-all ${isSameDay(d, selectedDate) ? 'bg-green-600 text-white border-green-500 shadow-lg' : 'bg-slate-50 dark:bg-white/5 text-slate-400'}`}>
                    <span className="text-[8px] block font-bold">{format(d, "EEE", { locale: he })}</span>
                    <span className="text-md font-black">{format(d, "d")}</span>
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-3 gap-2">
                {["09:00", "10:00", "11:00", "12:00", "15:00", "16:00"].map(t => (
                  <button key={t} onClick={() => setSelectedSlot(t)} 
                    className={`py-2 rounded-lg text-[10px] font-bold border transition-all ${selectedSlot === t ? 'bg-slate-900 text-white' : 'bg-white/50 dark:bg-white/5 border-slate-100 dark:border-white/5'}`}>
                    {t}
                  </button>
                ))}
              </div>

              <button disabled={!selectedSlot || isSuccess} onClick={triggerSuccess} 
                className={`w-full mt-6 py-4 rounded-2xl font-black text-sm transition-all ${selectedSlot && !isSuccess ? 'bg-green-600 text-white shadow-xl' : 'bg-slate-100 text-slate-300'}`}>
                {isSuccess ? 'תור שוריין!' : `קבע ל-${selectedSlot || '...'}`}
              </button>
            </div>
            
            <div className="absolute bottom-0 left-0 right-0 h-16 bg-white/80 dark:bg-black/80 backdrop-blur-xl border-t border-slate-100 dark:border-white/5 flex items-center justify-around px-4">
              <Smartphone size={16} className="text-green-500" /><Calendar size={16} className="opacity-20" /><User size={16} className="opacity-20" />
            </div>
          </div>
        </div>

        {/* --- 3. RIGHT: Unified AI Chat & Dashboard --- */}
        <div className="lg:col-span-5 flex flex-col gap-4 overflow-hidden">
          <div className="bg-white dark:bg-[#0b141a] border border-slate-200 dark:border-white/10 rounded-[3.5rem] flex-1 flex flex-col shadow-2xl relative overflow-hidden">
            {/* Header */}
            <div className="p-6 border-b border-slate-100 dark:border-white/5 flex items-center justify-between bg-slate-50/50 dark:bg-white/5">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-green-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-green-500/20"><MessageSquare size={24} /></div>
                <div>
                  <h2 className="text-xl font-black italic tracking-tighter uppercase leading-none">Chat Session</h2>
                  <p className="text-[10px] text-green-500 font-bold uppercase mt-1 flex items-center gap-1"><span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"/> המוח מחובר</p>
                </div>
              </div>
              <Rocket size={20} className="opacity-20" />
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
              {messages.map((msg) => (
                <motion.div key={msg.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.sender === "admin" ? "justify-start" : "justify-end"}`}>
                  <div className={`max-w-[85%] p-4 rounded-[2rem] text-sm font-medium shadow-sm ${
                    msg.sender === "admin" 
                    ? "bg-slate-100 dark:bg-white/5 rounded-tr-none text-slate-800 dark:text-slate-200" 
                    : "bg-green-600 text-white rounded-tl-none shadow-green-500/10"
                  }`}>
                    {msg.text}
                  </div>
                </motion.div>
              ))}
              <div ref={scrollRef} />
            </div>

            {/* Input Area */}
            <div className="p-6 bg-slate-50/50 dark:bg-white/5 border-t border-slate-100 dark:border-white/5">
              <form onSubmit={handleSendMessage} className="relative flex items-center gap-3">
                <input 
                  type="text" 
                  value={newMessage} 
                  onChange={(e) => setNewMessage(e.target.value)} 
                  placeholder="דבר עם המוח או שלח הודעה ללקוח..."
                  className="flex-1 bg-white dark:bg-black/40 border border-slate-200 dark:border-white/10 rounded-[2rem] p-5 pr-6 text-sm outline-none focus:ring-2 ring-green-500 transition-all shadow-inner"
                />
                <button type="submit" className="p-5 bg-green-600 text-white rounded-[1.5rem] shadow-xl hover:scale-105 transition-all">
                  <Send size={20} />
                </button>
              </form>
            </div>
          </div>
        </div>

      </div>
    </main>
  );
}
