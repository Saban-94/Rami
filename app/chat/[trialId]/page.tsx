"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { db } from "../../../lib/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import Navigation from "../../../components/Navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Smartphone, Layout, Sparkles, Rocket, 
  Check, ChevronLeft, Calendar, Clock, Lock, 
  Sun, Moon, Coffee, BookOpen, Scissors, 
  Stethoscope, Briefcase, ChevronRight, Settings, Layers
} from "lucide-react";
import { format, addDays, isSameDay, startOfDay } from "date-fns";
import { he } from "date-fns/locale";

// --- Configuration & Vertical Mapping ---
const CATEGORIES = [
  { id: 'barber', name: 'יופי וטיפוח', icon: <Scissors size={18}/>, tools: ['תורים', 'גלריה', 'צוות'] },
  { id: 'food', name: 'מזון ומשקאות', icon: <Coffee size={18}/>, tools: ['תפריט', 'משלוחים', 'מבצעים'] },
  { id: 'retail', name: 'חנויות וסלולר', icon: <Smartphone size={18}/>, tools: ['קטלוג', 'מעבדה', 'מלאי'] },
  { id: 'medical', name: 'רפואה וקליניקות', icon: <Stethoscope size={18}/>, tools: ['תיקים רפואיים', 'תורים', 'מרשמים'] },
];

export default function SabanOSProductionStudio({ params }: { params: { trialId: string } }) {
  // --- States ---
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [inputCode, setInputCode] = useState("");
  const [businessData, setBusinessData] = useState<any>(null);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [loading, setLoading] = useState(true);
  const [selectedCat, setSelectedCat] = useState(CATEGORIES[0]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [aiCanvasText, setAiCanvasText] = useState("");
  const [currentLang, setCurrentLang] = useState<"he" | "ar" | "en">("he");

  // --- OneSignal dynamic initialization (Fix for undefined property error) ---
  useEffect(() => {
    if (typeof window !== "undefined") {
      const initOneSignal = async () => {
        const OneSignal = (window as any).OneSignal;
        if (OneSignal) {
          await OneSignal.push(() => {
            OneSignal.init({
              appId: "YOUR_ONESIGNAL_ID", // TODO: Replace with real ID
              allowLocalhostAsSecureOrigin: true,
            });
          });
        }
      };
      initOneSignal();
    }
  }, []);

  // --- Initial Data Fetch ---
  useEffect(() => {
    const fetchDoc = async () => {
      try {
        const docRef = doc(db, "trials", params.trialId);
        const snap = await getDoc(docRef);
        if (snap.exists()) {
          const data = snap.data();
          setBusinessData(data);
          const matchedCat = CATEGORIES.find(c => c.id === data.industry) || CATEGORIES[0];
          setSelectedCat(matchedCat);
        }
      } catch (err) { console.error("Firebase Error:", err); }
      setLoading(false);
    };
    fetchDoc();
  }, [params.trialId]);

  // --- AI Logic ---
  const typeToCanvas = (text: string) => {
    setAiCanvasText("");
    let i = 0;
    const interval = setInterval(() => {
      setAiCanvasText((prev) => prev + text.charAt(i));
      i++;
      if (i >= text.length) clearInterval(interval);
    }, 20);
  };

  const handleVerify = () => {
    if (inputCode === businessData?.accessCode) {
      setIsAuthorized(true);
      typeToCanvas(`SabanOS v3.0 Production Ready. שלום ${businessData?.businessName}. המוח מלוטש וממתין לפקודה.`);
    } else {
      alert("קוד גישה שגוי");
    }
  };

  // --- Confetti Success Logic (Dynamic Import for Vercel) ---
  const triggerSuccess = async () => {
    setIsSuccess(true);
    try {
      const confetti = (await import("canvas-confetti")).default;
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#22c55e', '#ffffff', '#fbbf24']
      });
    } catch (e) {}
    typeToCanvas("הצלחה! התור שוריין, הודעת אישור נשלחה ללקוח והסתנכרנה ליומן הגוגל שלך.");
  };

  const weekDays = useMemo(() => Array.from({ length: 7 }).map((_, i) => addDays(startOfDay(new Date()), i)), []);

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-[#0C0C0D] text-green-500 font-black text-2xl animate-pulse italic">SABANOS STUDIO LOADING...</div>;

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-[#0C0C0D] flex items-center justify-center p-4">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-white/5 border border-white/10 p-12 rounded-[4rem] max-w-md w-full text-center shadow-2xl backdrop-blur-3xl">
          <div className="w-24 h-24 bg-green-600 rounded-[2.5rem] mx-auto mb-8 flex items-center justify-center text-white shadow-xl shadow-green-600/20"><Lock size={40} /></div>
          <h2 className="text-3xl font-black mb-6 italic tracking-tighter uppercase">Studio Access</h2>
          <input type="password" maxLength={4} value={inputCode} onChange={(e) => setInputCode(e.target.value)} className="w-full bg-black/40 border-2 border-white/10 rounded-3xl p-6 text-center text-4xl tracking-[15px] text-green-600 outline-none focus:border-green-500 mb-8" placeholder="****" />
          <button onClick={handleVerify} className="w-full bg-green-600 text-white font-black py-5 rounded-3xl text-xl shadow-lg hover:bg-green-700 transition-all uppercase">Open Diamond Studio</button>
        </motion.div>
      </div>
    );
  }

  return (
    <main className={`min-h-screen ${isDarkMode ? 'bg-[#0C0C0D] text-white' : 'bg-slate-50 text-slate-900'} transition-colors duration-500 font-sans`} dir={currentLang === 'en' ? 'ltr' : 'rtl'}>
      <Navigation />
      
      <div className="pt-28 px-8 max-w-[1900px] mx-auto pb-10 grid grid-cols-1 lg:grid-cols-12 gap-10 h-[calc(100vh-120px)]">
        
        {/* --- 1. Vertical Sidebar (Contextual) --- */}
        <aside className="lg:col-span-3 space-y-6 overflow-y-auto no-scrollbar">
          <div className="bg-white/5 dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-[3.5rem] p-8 shadow-sm backdrop-blur-xl">
            <h2 className="text-xl font-black italic mb-8 flex items-center gap-3">
              <Layout size={20} className="text-green-500" /> ניהול {selectedCat.name}
            </h2>
            <div className="space-y-2">
              {selectedCat.tools.map((tool) => (
                <button key={tool} className="w-full p-5 rounded-[2rem] bg-white/5 border border-transparent hover:border-green-500/30 flex items-center justify-between group transition-all">
                  <span className="font-bold italic text-sm">{tool}</span>
                  <Layers size={14} className="opacity-20 group-hover:opacity-100" />
                </button>
              ))}
            </div>
          </div>
          
          <div className="flex gap-4">
             <button onClick={() => setIsDarkMode(!isDarkMode)} className="flex-1 py-6 bg-slate-900 dark:bg-white text-white dark:text-black rounded-[2.5rem] font-black text-xs shadow-xl flex items-center justify-center gap-2">
                {isDarkMode ? <Sun size={16}/> : <Moon size={16}/>} THEME
             </button>
             <select 
               value={currentLang} 
               onChange={(e: any) => setCurrentLang(e.target.value)}
               className="flex-1 py-6 bg-green-600 text-white rounded-[2.5rem] font-black text-xs text-center outline-none appearance-none cursor-pointer"
             >
               <option value="he">עברית</option>
               <option value="ar">العربية</option>
               <option value="en">English</option>
             </select>
          </div>
        </aside>

        {/* --- 2. Diamond Preview (iPhone Canvas) --- */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center relative bg-slate-200/10 dark:bg-white/5 rounded-[5rem] border border-dashed border-white/10">
          <div className="w-[360px] h-[740px] bg-black rounded-[4rem] border-[10px] border-slate-900 shadow-[0_0_80px_rgba(0,0,0,0.4)] relative overflow-hidden ring-1 ring-white/20">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-7 bg-slate-900 rounded-b-3xl z-50" />
            
            <div className={`w-full h-full p-8 pt-16 transition-all duration-700 overflow-y-auto ${isDarkMode ? 'bg-[#0b141a]' : 'bg-white'}`}>
              <div className="text-center mb-10">
                <h3 className={`text-3xl font-black italic ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{businessData?.businessName}</h3>
                <div className="w-12 h-1 bg-green-500 mx-auto mt-2 rounded-full" />
              </div>

              {/* Weekly Picker */}
              <div className="flex gap-2 overflow-x-auto pb-4 no-scrollbar mb-8">
                {weekDays.map(d => (
                  <button key={d.toISOString()} onClick={() => setSelectedDate(d)} 
                    className={`min-w-[60px] py-4 rounded-2xl border transition-all ${isSameDay(d, selectedDate) ? 'bg-green-600 text-white border-green-500 shadow-lg' : 'bg-slate-50 dark:bg-white/5 text-slate-400 border-transparent'}`}>
                    <span className="text-[10px] block font-bold">{format(d, "EEE", { locale: currentLang === 'ar' ? undefined : he })}</span>
                    <span className="text-lg font-black">{format(d, "d")}</span>
                  </button>
                ))}
              </div>

              {/* Time Grid with Pulse on first slot */}
              <div className="grid grid-cols-3 gap-3 mb-10">
                {["09:00", "10:00", "11:00", "12:00", "15:00", "17:00"].map((t, idx) => (
                  <button key={t} onClick={() => setSelectedSlot(t)} 
                    className={`py-4 rounded-2xl text-xs font-black border transition-all relative ${selectedSlot === t ? 'bg-slate-900 dark:bg-white text-white dark:text-black scale-105 shadow-xl' : 'bg-white/50 dark:bg-white/5 border-slate-100 dark:border-white/5'}`}>
                    {t}
                    {idx === 0 && !selectedSlot && <span className="absolute inset-0 rounded-2xl bg-green-500/20 animate-ping pointer-events-none" />}
                  </button>
                ))}
              </div>

              <motion.button 
                disabled={!selectedSlot || isSuccess} 
                onClick={triggerSuccess}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`w-full py-5 rounded-[2rem] font-black text-lg transition-all ${selectedSlot && !isSuccess ? 'bg-green-600 text-white shadow-2xl shadow-green-600/30' : 'bg-slate-200 text-slate-400'}`}
              >
                {isSuccess ? 'שוריין בהצלחה!' : `קבע ל-${selectedSlot || '...'}`}
              </motion.button>
            </div>
          </div>
          {/* Success Confetti overlay logic handled dynamically */}
        </div>

        {/* --- 3. AI Designer (The Mentor) --- */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <div className="bg-white dark:bg-white/5 border border-white/10 rounded-[4rem] p-10 flex-1 flex flex-col shadow-2xl relative overflow-hidden backdrop-blur-3xl">
            <div className="flex items-center gap-4 mb-10">
              <div className="w-14 h-14 bg-green-500 rounded-[1.5rem] flex items-center justify-center text-white shadow-lg shadow-green-500/20"><Sparkles size={24} /></div>
              <div>
                <h2 className="text-2xl font-black italic tracking-tighter uppercase leading-none">AI Designer</h2>
                <div className="flex items-center gap-2 mt-1"><span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" /><p className="text-[10px] text-green-600 font-black uppercase tracking-widest">Mentor Active</p></div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto mb-8 custom-scrollbar">
              <AnimatePresence>
                {aiCanvasText && (
                  <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="p-8 bg-green-500/5 border-r-4 border-green-600 rounded-l-[3rem] shadow-inner">
                    <p className="text-xl font-bold leading-relaxed text-green-700 dark:text-green-400 italic">{aiCanvasText}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="relative group">
              <textarea 
                placeholder="תכתוב ל-AI: 'תעצב לי דף קטלוג יוקרתי'..." 
                className="w-full h-32 bg-slate-50 dark:bg-black/40 border border-slate-200 dark:border-white/10 rounded-[2.5rem] p-6 text-sm outline-none focus:ring-2 ring-green-500 transition-all resize-none shadow-inner" 
              />
              <button className="absolute bottom-4 left-4 p-4 bg-green-600 text-white rounded-2xl shadow-xl hover:scale-110 transition-all active:scale-95">
                <Rocket size={20}/>
              </button>
            </div>
          </div>
        </div>

      </div>
    </main>
  );
}
