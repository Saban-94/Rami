"use client";

import React, { useState, useEffect, useMemo } from "react";
import { db } from "../../../lib/firebase";
import { doc, onSnapshot } from "firebase/firestore";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Send, Lightbulb, Smartphone, Layout, Rocket } from "lucide-react";

export default function SabanOSMentorStudio({ params }: { params: { trialId: string } }) {
  const [businessData, setBusinessData] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([
    { role: 'ai', text: "שלום! אני ג'ימיני, המדריך האישי שלך ב-SabanOS. בוא נלמד איך לבנות את האפליקציה שלך." }
  ]);
  const [inputValue, setInputValue] = useState("");

  // --- 1. מנגנון ההדרכה של ג'ימיני ---
  // רשימת טיפים ופקודות שה-AI מציע למשתמש לפי הקשר
  const mentorTips = [
    { title: "עיצוב דף הבית", prompt: "ג'ימיני, תעצב לי דף נחיתה יוקרתי עם תמונת אווירה של מספרה." },
    { title: "יצירת קטלוג", prompt: "תוסיף לקטלוג שלי תספורת גבר ב-100 ש״ח ועיצוב זקן ב-50 ש״ח." },
    { title: "חיבור יומן", prompt: "איך אני מסנכרן את היומן שלי ל-Google Calendar?" },
  ];

  useEffect(() => {
    if (!params.trialId) return;
    const unsub = onSnapshot(doc(db, "trials", params.trialId), (snap) => {
      if (snap.exists()) setBusinessData(snap.data());
    });
    return () => unsub();
  }, [params.trialId]);

  const handleSendMessage = (text: string = inputValue) => {
    if (!text.trim()) return;
    const newMessages = [...messages, { role: 'user', text }];
    setMessages(newMessages);
    setInputValue("");

    // סימולציה של תגובת המדריך (כאן יבוא החיבור ל-Gemini API האמיתי)
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        role: 'ai', 
        text: `הבנתי! אתה רוצה לבצע: "${text}". אני מעדכן את האפליקציה שלך עכשיו...` 
      }]);
    }, 1000);
  };

  return (
    <main className="min-h-screen bg-[#0C0C0D] text-white grid grid-cols-1 lg:grid-cols-12 gap-0 overflow-hidden">
      
      {/* --- צד שמאל: קנבס השיחה והמדריך --- */}
      <aside className="lg:col-span-4 border-l border-white/10 flex flex-col bg-black/40 backdrop-blur-3xl">
        <div className="p-8 border-b border-white/10 flex items-center gap-3">
          <div className="w-10 h-10 bg-green-600 rounded-xl flex items-center justify-center shadow-lg shadow-green-600/20">
            <Sparkles size={20} />
          </div>
          <div>
            <h2 className="font-black italic uppercase tracking-tighter">Gemini Mentor</h2>
            <p className="text-[10px] text-green-500 font-bold uppercase">SabanOS v3.0</p>
          </div>
        </div>

        {/* אזור ההודעות */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
          {messages.map((m, i) => (
            <motion.div 
              initial={{ opacity: 0, x: m.role === 'ai' ? 20 : -20 }}
              animate={{ opacity: 1, x: 0 }}
              key={i}
              className={`flex ${m.role === 'ai' ? 'justify-start' : 'justify-end'}`}
            >
              <div className={`max-w-[85%] p-5 rounded-[2rem] text-sm font-bold italic leading-relaxed ${
                m.role === 'ai' ? 'bg-green-600/10 border-r-4 border-green-600 text-green-400' : 'bg-white/5 border border-white/10 text-white'
              }`}>
                {m.text}
              </div>
            </motion.div>
          ))}
        </div>

        {/* הצעות למידה (Tips) */}
        <div className="px-6 py-4 bg-white/5 border-t border-white/10">
          <p className="text-[10px] font-black uppercase opacity-40 mb-3 flex items-center gap-2">
            <Lightbulb size={12} /> הצעות לביצוע:
          </p>
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
            {mentorTips.map((tip, i) => (
              <button 
                key={i}
                onClick={() => handleSendMessage(tip.prompt)}
                className="whitespace-nowrap px-4 py-2 bg-green-600/20 hover:bg-green-600/40 text-green-500 rounded-full text-xs font-black transition-all border border-green-600/20"
              >
                {tip.title}
              </button>
            ))}
          </div>
        </div>

        {/* תיבת קלט */}
        <div className="p-6 relative">
          <input 
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="רשום כאן פקודה לג'ימיני..."
            className="w-full bg-white/5 border border-white/10 rounded-[2rem] p-6 pr-6 pl-16 text-sm outline-none focus:ring-2 ring-green-500 transition-all shadow-inner font-bold italic"
          />
          <button 
            onClick={() => handleSendMessage()}
            className="absolute left-10 top-1/2 -translate-y-1/2 p-3 bg-green-600 text-white rounded-full shadow-xl hover:scale-110 transition-all"
          >
            <Send size={18} />
          </button>
        </div>
      </aside>

      {/* --- צד ימין: ה-Preview של האפליקציה (התוצאה של השיחה) --- */}
      <section className="lg:col-span-8 flex flex-col items-center justify-center bg-[#0C0C0D] relative">
         {/* iPhone Preview */}
         <div className="relative group">
            <div className="absolute -inset-10 bg-green-500/10 blur-[100px] rounded-full opacity-50 group-hover:opacity-100 transition-opacity" />
            <div className="w-[320px] h-[660px] bg-black rounded-[4rem] border-[12px] border-slate-900 shadow-2xl relative overflow-hidden z-10 ring-1 ring-white/20">
               <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-7 bg-slate-900 rounded-b-3xl z-50" />
               <div className="w-full h-full bg-white p-8 pt-16 flex flex-col items-center text-black">
                  <h3 className="text-2xl font-black italic mb-2 tracking-tighter">{businessData?.businessName || "העסק שלך"}</h3>
                  <div className="w-12 h-1 bg-green-500 mb-10 rounded-full" />
                  
                  {/* דוגמה לאלמנטים שה-AI מזריק */}
                  <div className="w-full space-y-4">
                    <div className="h-32 bg-slate-100 rounded-3xl animate-pulse flex items-center justify-center text-[10px] font-black uppercase opacity-20 italic">Hero Image Here</div>
                    <div className="h-14 bg-green-600 rounded-2xl flex items-center justify-center text-white font-black text-xs">הזמנת תור מהירה</div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="h-20 bg-slate-50 rounded-2xl border border-slate-100" />
                      <div className="h-20 bg-slate-50 rounded-2xl border border-slate-100" />
                    </div>
                  </div>
               </div>
            </div>
         </div>

         {/* הודעה צפה - Status מה-AI */}
         <motion.div 
           initial={{ y: 50, opacity: 0 }}
           animate={{ y: 0, opacity: 1 }}
           className="mt-12 bg-white/5 border border-white/10 px-8 py-4 rounded-full flex items-center gap-4 shadow-2xl backdrop-blur-xl"
         >
            <div className="w-2 h-2 bg-green-500 rounded-full animate-ping" />
            <span className="text-xs font-black uppercase tracking-widest opacity-70">
              ה-AI מסנכרן שינויים בזמן אמת...
            </span>
         </motion.div>
      </section>

    </main>
  );
}
