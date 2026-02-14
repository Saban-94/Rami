"use client";

import React, { useState, useEffect, useMemo } from "react";
import { db } from "../../../lib/firebase";
import { doc, onSnapshot } from "firebase/firestore";
import Navigation from "../../../components/Navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Smartphone, Layout, Sparkles, Rocket, Lock, 
  Scissors, Stethoscope, Coffee, Layers, Sun, Moon 
} from "lucide-react";
import { format, addDays, startOfDay, isSameDay } from "date-fns";
import { he } from "date-fns/locale";

const CATEGORIES = [
  { id: 'barber', name: 'יופי וטיפוח', icon: <Scissors size={18}/>, tools: ['תורים', 'גלריה', 'צוות'] },
  { id: 'retail', name: 'חנויות וסלולר', icon: <Smartphone size={18}/>, tools: ['קטלוג', 'מעבדה', 'מלאי'] },
  { id: 'medical', name: 'רפואה וקליניקות', icon: <Stethoscope size={18}/>, tools: ['תיקים רפואיים', 'תורים'] },
];

export default function SabanOSProductionStudio({ params }: { params: { trialId: string } }) {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [inputCode, setInputCode] = useState("");
  const [businessData, setBusinessData] = useState<any>(null);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [loading, setLoading] = useState(true);
  const [permissionError, setPermissionError] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState(new Date());

  // --- 1. OneSignal Fix (Safe Initialization) ---
  useEffect(() => {
    if (typeof window !== "undefined") {
      const initOneSignal = async () => {
        const OneSignal = (window as any).OneSignal;
        if (OneSignal) {
          try {
            await OneSignal.push(() => {
              // בדיקה שה-SDK מוכן וקיים אובייקט Notifications
              if (OneSignal.Notifications) {
                OneSignal.init({
                  appId: "767878273802-1p5oifchiurnkhv9g4dfosn26snseh30", 
                  allowLocalhostAsSecureOrigin: true,
                });
              }
            });
          } catch (e) {
            console.error("OneSignal push error:", e);
          }
        }
      };
      initOneSignal();
    }
  }, []);

  // --- 2. Firestore Sync with Permission Handling ---
  useEffect(() => {
    if (!params.trialId || !db) {
      setLoading(false);
      return;
    }

    const unsub = onSnapshot(
      doc(db, "trials", params.trialId),
      (snap) => {
        if (snap.exists()) {
          setBusinessData(snap.data());
          setPermissionError(false);
        }
        setLoading(false);
      },
      (error) => {
        console.error("Firebase Sync Error:", error);
        if (error.code === 'permission-denied') {
          setPermissionError(true);
        }
        setLoading(false);
      }
    );

    return () => unsub();
  }, [params.trialId]);

  const handleVerify = () => {
    if (inputCode === businessData?.accessCode) {
      setIsAuthorized(true);
    } else {
      alert("קוד גישה שגוי");
    }
  };

  const weekDays = useMemo(() => Array.from({ length: 7 }).map((_, i) => addDays(startOfDay(new Date()), i)), []);

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-[#0C0C0D] text-green-500 font-black animate-pulse uppercase italic">SabanOS Loading...</div>;

  if (permissionError) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center p-6 text-center" dir="rtl">
        <div className="max-w-md p-10 bg-red-500/10 border border-red-500/30 rounded-[3rem]">
          <h1 className="text-2xl font-black text-red-500 mb-4">חסרות הרשאות אבטחה</h1>
          <p className="opacity-70 mb-8">יש לעדכן את ה-Rules ב-Firebase Console כדי לאפשר קריאה מהקולקציה trials.</p>
          <button onClick={() => window.location.reload()} className="px-8 py-3 bg-red-500 text-white rounded-2xl font-bold">נסה שוב</button>
        </div>
      </div>
    );
  }

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-[#0C0C0D] flex items-center justify-center p-4">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-white/5 border border-white/10 p-12 rounded-[4rem] max-w-md w-full text-center shadow-2xl backdrop-blur-3xl">
          <div className="w-20 h-20 bg-green-600 rounded-[2rem] mx-auto mb-8 flex items-center justify-center text-white shadow-xl shadow-green-600/20"><Lock size={32} /></div>
          <h2 className="text-2xl font-black mb-6 italic tracking-tighter uppercase text-white">Access SabanOS</h2>
          <input 
            type="password" 
            maxLength={4} 
            value={inputCode} 
            onChange={(e) => setInputCode(e.target.value)} 
            className="w-full bg-black/40 border-2 border-white/10 rounded-3xl p-6 text-center text-4xl tracking-[15px] text-green-600 outline-none focus:border-green-500 mb-8" 
            placeholder="****" 
          />
          <button onClick={handleVerify} className="w-full bg-green-600 text-white font-black py-5 rounded-3xl text-xl hover:bg-green-700 transition-all">ENTER STUDIO</button>
        </motion.div>
      </div>
    );
  }

  return (
    <main className={`min-h-screen ${isDarkMode ? 'bg-[#0C0C0D] text-white' : 'bg-slate-50 text-slate-900'} transition-colors duration-500`} dir="rtl">
      <Navigation />
      
      <div className="pt-28 px-8 max-w-[1800px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Sidebar */}
        <aside className="lg:col-span-3 space-y-6">
          <div className="bg-white/5 border border-white/10 rounded-[3rem] p-8 backdrop-blur-xl">
            <h2 className="text-xl font-black italic mb-6 flex items-center gap-3">
              <Layout size={20} className="text-green-500" /> ניהול עסק
            </h2>
            <div className="space-y-3">
              <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                <p className="text-[10px] uppercase opacity-40 font-black mb-1">שם העסק</p>
                <p className="font-bold">{businessData?.businessName}</p>
              </div>
              <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                <p className="text-[10px] uppercase opacity-40 font-black mb-1">סטטוס סטודיו</p>
                <p className="text-green-500 font-bold flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" /> Live & Syncing
                </p>
              </div>
            </div>
          </div>
          
          <button onClick={() => setIsDarkMode(!isDarkMode)} className="w-full py-6 bg-white/5 border border-white/10 text-white rounded-[2rem] font-black text-xs flex items-center justify-center gap-2">
            {isDarkMode ? <Sun size={16}/> : <Moon size={16}/>} TOGGLE THEME
          </button>
        </aside>

        {/* iPhone Preview Canvas */}
        <div className="lg:col-span-5 flex justify-center py-10 bg-white/5 rounded-[4rem] border border-dashed border-white/10">
          <div className="w-[360px] h-[740px] bg-black rounded-[4rem] border-[10px] border-slate-900 shadow-2xl relative overflow-hidden ring-1 ring-white/20">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-7 bg-slate-900 rounded-b-3xl z-50" />
            
            <div className={`w-full h-full p-8 pt-16 overflow-y-auto ${isDarkMode ? 'bg-[#0b141a]' : 'bg-white'}`}>
              <h3 className={`text-2xl font-black italic text-center mb-8 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                {businessData?.businessName}
              </h3>

              {/* Day Picker */}
              <div className="flex gap-2 overflow-x-auto pb-4 no-scrollbar mb-8">
                {weekDays.map(d => (
                  <button key={d.toISOString()} onClick={() => setSelectedDate(d)} 
                    className={`min-w-[55px] py-4 rounded-2xl border transition-all ${isSameDay(d, selectedDate) ? 'bg-green-600 text-white border-green-500' : 'bg-white/5 text-slate-400 border-transparent'}`}>
                    <span className="text-[10px] block font-bold">{format(d, "EEE", { locale: he })}</span>
                    <span className="text-lg font-black">{format(d, "d")}</span>
                  </button>
                ))}
              </div>

              {/* Time Slots */}
              <div className="grid grid-cols-3 gap-3">
                {["09:00", "10:30", "12:00", "14:30", "16:00", "17:30"].map((t) => (
                  <button key={t} onClick={() => setSelectedSlot(t)} 
                    className={`py-4 rounded-2xl text-xs font-black transition-all ${selectedSlot === t ? 'bg-white text-black scale-105 shadow-xl' : 'bg-white/5 border border-white/5 text-slate-400'}`}>
                    {t}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* AI Designer Side */}
        <aside className="lg:col-span-4 bg-green-600/5 border border-green-600/10 rounded-[4rem] p-10 backdrop-blur-3xl">
          <div className="flex items-center gap-4 mb-10">
            <div className="w-12 h-12 bg-green-500 rounded-2xl flex items-center justify-center text-white"><Sparkles size={20} /></div>
            <h2 className="text-2xl font-black italic uppercase italic">AI Designer</h2>
          </div>
          <div className="p-6 bg-white/5 border border-white/10 rounded-[2rem] text-sm leading-relaxed font-bold italic opacity-80">
            "שלום רמי, הסטודיו מסונכרן בשידור חי ל-Firestore. כל שינוי ב-Rules ישפיע מיידית על הממשק כאן."
          </div>
        </aside>

      </div>
    </main>
  );
}
