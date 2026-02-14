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
  Stethoscope, Briefcase, ChevronRight, User, Send, 
  MessageSquare, BarChart3, TrendingUp, Users, Eye
} from "lucide-react";
import { format, addDays, isSameDay, startOfDay } from "date-fns";
import { he } from "date-fns/locale";

const CATEGORIES = [
  { id: 'barber', name: 'יופי וטיפוח', icon: <Scissors size={18}/> },
  { id: 'food', name: 'מזון ומשקאות', icon: <Coffee size={18}/> },
  { id: 'retail', name: 'חנויות וספרים', icon: <BookOpen size={18}/> },
  { id: 'medical', name: 'רפואה וקליניקות', icon: <Stethoscope size={18}/> },
];

export default function SabanOSStudioPro({ params }: { params: { trialId: string } }) {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [activeTab, setActiveTab] = useState<"design" | "analytics">("design");
  const [inputCode, setInputCode] = useState("");
  const [businessData, setBusinessData] = useState<any>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [selectedCat, setSelectedCat] = useState(CATEGORIES[1]); // דיפולט לאוכל בשביל הסימולציה
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [aiCanvasText, setAiCanvasText] = useState("");
  
  const scrollRef = useRef<HTMLDivElement>(null);

  // --- Realtime Data & Analytics Mock ---
  const stats = {
    todayViews: 142,
    conversionRate: "12%",
    activeNow: 4,
    weeklyData: [40, 70, 45, 90, 65, 80, 110]
  };

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

  useEffect(() => {
    if (!isAuthorized) return;
    const q = query(collection(db, "trials", params.trialId, "messages"), orderBy("createdAt", "asc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setMessages(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setTimeout(() => scrollRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
    });
    return () => unsubscribe();
  }, [isAuthorized, params.trialId]);

  const typeToCanvas = (text: string) => {
    setAiCanvasText("");
    let i = 0;
    const interval = setInterval(() => {
      setAiCanvasText((prev) => prev + text.charAt(i));
      i++;
      if (i >= text.length) clearInterval(interval);
    }, 25);
  };

  const handleVerify = () => {
    if (inputCode === businessData?.accessCode) {
      setIsAuthorized(true);
      typeToCanvas(`ברוך הבא ל-Studio v2.5. המערכת סונכרנה בהצלחה.`);
    }
  };

  const triggerSuccess = () => {
    setIsSuccess(true);
    confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 }, colors: ['#22c55e', '#ffffff', '#fbbf24'] });
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-[#020617] text-green-500 font-black animate-pulse">SabanOS Core...</div>;

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center p-4">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-white/5 border border-white/10 p-12 rounded-[4rem] max-w-md w-full text-center shadow-2xl backdrop-blur-xl">
          <div className="w-20 h-20 bg-green-500 rounded-[2rem] mx-auto mb-8 flex items-center justify-center text-white"><Lock size={32} /></div>
          <h2 className="text-3xl font-black text-white mb-6 italic uppercase">Studio Access</h2>
          <input type="password" maxLength={4} value={inputCode} onChange={(e) => setInputCode(e.target.value)} className="w-full bg-black/40 border-2 border-white/10 rounded-3xl p-6 text-center text-4xl tracking-[15px] text-green-500 outline-none focus:border-green-500 mb-8" placeholder="****" />
          <button onClick={handleVerify} className="w-full bg-green-600 text-white font-black py-5 rounded-3xl text-xl shadow-lg uppercase">Open Studio</button>
        </motion.div>
      </div>
    );
  }

  return (
    <main className={`min-h-screen ${isDarkMode ? 'bg-[#020617] text-white' : 'bg-[#F8FAFC] text-slate-900'} transition-colors duration-500 font-sans`} dir="rtl">
      <Navigation />
      
      <div className="pt-24 px-6 max-w-[1900px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 h-[calc(100vh-100px)]">
        
        {/* --- LEFT: Sidebar (Tabs Control) --- */}
        <div className="lg:col-span-3 flex flex-col gap-4">
          <div className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-[3rem] p-6 shadow-sm flex flex-col gap-2">
            <button onClick={() => setActiveTab("design")} className={`w-full p-5 rounded-2xl flex items-center gap-4 transition-all ${activeTab === "design" ? 'bg-green-600 text-white shadow-lg' : 'hover:bg-slate-50 dark:hover:bg-white/5'}`}>
              <Palette size={20} /> <span className="font-black italic">עיצוב אפליקציה</span>
            </button>
            <button onClick={() => { setActiveTab("analytics"); typeToCanvas("טוען נתונים חיים מהאפליקציה... הנה הפעילות של הלקוחות שלך מהשבוע האחרון."); }} className={`w-full p-5 rounded-2xl flex items-center gap-4 transition-all ${activeTab === "analytics" ? 'bg-green-600 text-white shadow-lg' : 'hover:bg-slate-50 dark:hover:bg-white/5'}`}>
              <BarChart3 size={20} /> <span className="font-black italic">סטטיסטיקה חיה</span>
            </button>
          </div>

          {activeTab === "design" && (
            <div className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-[3rem] p-6 shadow-sm overflow-y-auto">
              <h2 className="text-sm font-black uppercase opacity-30 mb-4 px-2">Templates</h2>
              <div className="space-y-2">
                {CATEGORIES.map((cat) => (
                  <button key={cat.id} onClick={() => setSelectedCat(cat)} className={`w-full p-4 rounded-xl flex items-center justify-between ${selectedCat.id === cat.id ? 'bg-slate-100 dark:bg-white/10 border-r-4 border-green-500' : ''}`}>
                    <div className="flex items-center gap-3">{cat.icon} <span className="text-xs font-bold">{cat.name}</span></div>
                  </button>
                ))}
              </div>
            </div>
          )}

          <button onClick={() => setIsDarkMode(!isDarkMode)} className="w-full py-5 bg-slate-900 dark:bg-white text-white dark:text-black rounded-3xl font-black text-xs">
            {isDarkMode ? 'LIGHT MODE' : 'DARK MODE'}
          </button>
        </div>

        {/* --- CENTER: Display Area --- */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center relative bg-slate-100 dark:bg-black/20 rounded-[4rem] border border-dashed border-slate-300 dark:border-white/5">
          <AnimatePresence mode="wait">
            {activeTab === "design" ? (
              <motion.div key="iphone" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="w-[280px] h-[580px] bg-black rounded-[3.5rem] border-[10px] border-slate-800 shadow-2xl relative overflow-hidden ring-4 ring-black/10">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-6 bg-slate-800 rounded-b-2xl z-30" />
                <div className={`w-full h-full p-5 pt-12 overflow-y-auto ${isDarkMode ? 'bg-[#0b141a]' : 'bg-white'}`}>
                  <div className="text-center mb-6">
                    <h3 className="text-xl font-black italic">{businessData?.businessName}</h3>
                    <p className="text-[8px] opacity-40 uppercase tracking-widest">{selectedCat.name}</p>
                  </div>
                  {/* ... Preview UI ... */}
                  <div className="h-32 bg-green-500/5 rounded-3xl border border-dashed border-green-500/20 flex items-center justify-center">
                    <Sparkles className="text-green-500 opacity-20" size={32} />
                  </div>
                  <button onClick={triggerSuccess} className="w-full mt-10 py-5 bg-green-600 text-white rounded-3xl font-black shadow-xl">PUBLISH APP</button>
                </div>
              </motion.div>
            ) : (
              <motion.div key="stats" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} className="w-full max-w-md p-8">
                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="bg-white dark:bg-white/5 p-6 rounded-[2.5rem] shadow-sm border border-slate-200 dark:border-white/10">
                    <Eye className="text-blue-500 mb-2" size={20} />
                    <h4 className="text-2xl font-black">{stats.todayViews}</h4>
                    <p className="text-[10px] opacity-40 font-bold uppercase">צפיות היום</p>
                  </div>
                  <div className="bg-white dark:bg-white/5 p-6 rounded-[2.5rem] shadow-sm border border-slate-200 dark:border-white/10">
                    <TrendingUp className="text-green-500 mb-2" size={20} />
                    <h4 className="text-2xl font-black">{stats.conversionRate}</h4>
                    <p className="text-[10px] opacity-40 font-bold uppercase">יחס המרה</p>
                  </div>
                </div>
                
                {/* Live Activity Chart (Mock) */}
                <div className="bg-white dark:bg-white/5 p-8 rounded-[3rem] shadow-sm border border-slate-200 dark:border-white/10">
                  <div className="flex items-center justify-between mb-6">
                    <h4 className="font-black italic uppercase tracking-tighter">פעילות שבועית</h4>
                    <div className="flex items-center gap-2 text-green-500 text-[10px] font-black uppercase"><Users size={12}/> {stats.activeNow} מחוברים</div>
                  </div>
                  <div className="flex items-end justify-between h-32 gap-2">
                    {stats.weeklyData.map((val, idx) => (
                      <motion.div 
                        key={idx} 
                        initial={{ height: 0 }} 
                        animate={{ height: `${val}%` }} 
                        transition={{ delay: idx * 0.1, type: "spring" }}
                        className="flex-1 bg-green-500/20 hover:bg-green-500 transition-all rounded-t-lg"
                      />
                    ))}
                  </div>
                  <div className="flex justify-between mt-4 text-[8px] font-black opacity-20 uppercase">
                    <span>א</span><span>ב</span><span>ג</span><span>ד</span><span>ה</span><span>ו</span><span>ש</span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* --- RIGHT: Chat --- */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          <div className="bg-white dark:bg-[#0b141a] border border-slate-200 dark:border-white/10 rounded-[3.5rem] flex-1 flex flex-col shadow-2xl overflow-hidden">
             {/* Chat Header */}
             <div className="p-6 border-b border-slate-100 dark:border-white/5 flex items-center gap-4 bg-slate-50/50 dark:bg-white/5">
                <div className="w-12 h-12 bg-green-500 rounded-2xl flex items-center justify-center text-white"><MessageSquare size={24} /></div>
                <div><h2 className="text-xl font-black italic uppercase leading-none">Business Chat</h2><p className="text-[10px] text-green-500 font-bold uppercase mt-1">Live Feed</p></div>
             </div>
             {/* Chat Flow */}
             <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {messages.map((msg) => (
                  <div key={msg.id} className={`flex ${msg.sender === "admin" ? "justify-start" : "justify-end"}`}>
                    <div className={`p-4 rounded-[2rem] text-sm ${msg.sender === "admin" ? "bg-slate-100 dark:bg-white/5" : "bg-green-600 text-white"}`}>{msg.text}</div>
                  </div>
                ))}
                <div ref={scrollRef} />
             </div>
             {/* Canvas Voice/Text */}
             <AnimatePresence>
               {aiCanvasText && (
                 <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="mx-6 mb-4 p-5 bg-green-500/10 rounded-3xl border border-green-500/20 italic font-bold text-green-700 dark:text-green-400 text-xs">
                    {aiCanvasText}
                 </motion.div>
               )}
             </AnimatePresence>
             <div className="p-6 border-t border-slate-100 dark:border-white/5">
                <form onSubmit={(e) => { e.preventDefault(); handleSendMessage(e); }} className="flex items-center gap-2">
                  <input type="text" value={newMessage} onChange={(e) => setNewMessage(e.target.value)} placeholder="כתוב משהו..." className="flex-1 bg-slate-50 dark:bg-black/40 p-4 rounded-2xl text-xs outline-none" />
                  <button type="submit" className="p-4 bg-green-600 text-white rounded-xl shadow-lg"><Send size={18} /></button>
                </form>
             </div>
          </div>
        </div>

      </div>
    </main>
  );
}

// --- Mock Handlers ---
async function handleSendMessage(e: any) {
  // פונקציית השליחה המקורית שלך ל-Firebase
}
