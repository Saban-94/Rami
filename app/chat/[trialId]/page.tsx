"use client";

import React, { useState, useEffect, useRef } from "react";
import { db } from "../../../lib/firebase";
import { doc, getDoc, updateDoc, arrayUnion } from "firebase/firestore";
import ChatInterface from "../../../components/ChatInterface";
import Navigation from "../../../components/Navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Brain, Sparkles, Lock, Calendar, 
  Clock, Paperclip, CheckCircle2, 
  User, Bell, ChevronRight, Layout
} from "lucide-react";

// נתוני דמה ליומן (Appointments)
const initialAppointments = [
  { id: 1, time: "15:00", customer: "אבי לוי", service: "טיפול פנים", color: "bg-orange-500" },
  { id: 2, time: "19:00", customer: "ראש גבר", service: "תספורת", color: "bg-blue-500" }
];

export default function SmartManagementPage({ params }: { params: { trialId: string } }) {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [inputCode, setInputCode] = useState("");
  const [businessData, setBusinessData] = useState<any>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [aiCanvasMessage, setAiCanvasMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchDoc = async () => {
      const docRef = doc(db, "trials", params.trialId);
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        setBusinessData(snap.data());
      }
      setLoading(false);
    };
    fetchDoc();
  }, [params.trialId]);

  const handleVerify = () => {
    if (inputCode === businessData?.accessCode) {
      setIsAuthorized(true);
      // ברכת שלום מעמאר בכניסה
      setTimeout(() => {
        triggerAiResponse(`שלום עמאר! המערכת מחוברת. מספרת ${businessData?.businessName} מוכנה לקבל לקוחות. היומן מעודכן ליום הנוכחי.`);
      }, 1000);
    }
  };

  const triggerAiResponse = (text: string) => {
    setAiCanvasMessage("");
    let i = 0;
    const interval = setInterval(() => {
      setAiCanvasMessage((prev) => prev + text.charAt(i));
      i++;
      if (i >= text.length) clearInterval(interval);
    }, 30);
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const fakeUrl = URL.createObjectURL(file);
    const docRef = doc(db, "trials", params.trialId);
    await updateDoc(docRef, { logoUrl: fakeUrl });
    setBusinessData({ ...businessData, logoUrl: fakeUrl });
    triggerAiResponse("הלוגו עודכן בהצלחה! המותג שלך נראה מעולה בראש הדף.");
  };

  if (loading) return <div className="min-h-screen bg-[#020617] flex items-center justify-center text-green-500 font-black italic animate-bounce">SabanOS Smart AI...</div>;

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center p-4 shadow-inner" dir="rtl">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="bg-white/5 border border-white/10 p-10 rounded-[3rem] max-w-sm w-full text-center backdrop-blur-3xl shadow-2xl">
          <div className="w-24 h-24 bg-green-500 rounded-[2.5rem] mx-auto mb-6 flex items-center justify-center shadow-[0_0_50px_rgba(34,197,94,0.3)]">
            <Lock className="text-black" size={40} />
          </div>
          <h2 className="text-2xl font-black text-white italic mb-2 tracking-tighter">כניסה למערכת SabanOS</h2>
          <p className="text-white/40 text-sm mb-8 italic">הזן קוד גישה לניהול המוח</p>
          <input 
            type="password" 
            maxLength={4}
            value={inputCode}
            onChange={(e) => setInputCode(e.target.value)}
            className="w-full bg-black/40 border-2 border-white/10 rounded-2xl p-5 text-center text-4xl tracking-[15px] text-green-500 outline-none focus:border-green-500 transition-all mb-6 shadow-inner"
            placeholder="****"
          />
          <button onClick={handleVerify} className="w-full bg-green-500 text-black font-black py-4 rounded-2xl hover:bg-green-400 transition-all uppercase tracking-widest">
            פתח דשבורד
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#020617] text-white font-sans" dir="rtl">
      <Navigation />
      
      <div className="pt-24 px-6 max-w-7xl mx-auto pb-20">
        
        {/* HEADER דינמי עם לוגו עמאר */}
        <div className="flex items-center justify-between mb-12 bg-white/5 p-8 rounded-[3rem] border border-white/10 backdrop-blur-md">
          <div className="flex items-center gap-6">
            <div className="relative">
              <div className="w-24 h-24 rounded-[2rem] bg-black/40 border-2 border-green-500/50 overflow-hidden shadow-2xl">
                {businessData?.logoUrl ? (
                  <img src={businessData.logoUrl} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-4xl font-black text-green-500 italic">
                    {businessData?.businessName?.[0]}
                  </div>
                )}
              </div>
              <button onClick={() => fileInputRef.current?.click()} className="absolute -bottom-2 -right-2 bg-green-500 text-black p-2 rounded-full hover:scale-110 transition-transform">
                <Paperclip size={16} />
              </button>
              <input type="file" ref={fileInputRef} onChange={handleLogoUpload} className="hidden" />
            </div>
            <div>
              <h1 className="text-4xl font-black italic tracking-tighter text-white">מספרת {businessData?.businessName}</h1>
              <p className="text-green-500 font-bold flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                SabanOS Smart AI - מחובר ומוכן לעבודה
              </p>
            </div>
          </div>
          <div className="hidden md:block text-left">
            <p className="text-white/20 text-[10px] uppercase font-bold tracking-[3px]">System Status</p>
            <p className="text-white/60 font-mono text-xs">Active Mode: Business Intelligence</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* צד ימין: יומן תורים חכם ומנהל תזכורות */}
          <div className="lg:col-span-5 space-y-8">
            <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-8 backdrop-blur-xl">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <Calendar className="text-green-500" size={24} />
                  <h2 className="text-xl font-black italic">יומן תורים דינמי</h2>
                </div>
                <div className="text-xs font-bold text-white/40">היום - {new Date().toLocaleDateString('he-IL')}</div>
              </div>

              <div className="space-y-4">
                {initialAppointments.map((apt) => (
                  <motion.div key={apt.id} whileHover={{ x: -5 }} className="flex items-center gap-4 bg-black/40 p-5 rounded-3xl border border-white/5 shadow-lg group">
                    <div className={`w-3 h-12 rounded-full ${apt.color} shadow-[0_0_15px_rgba(0,0,0,0.3)]`} />
                    <div className="flex-1">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-lg font-black">{apt.time}</span>
                        <span className="text-[10px] bg-white/10 px-2 py-1 rounded-lg text-white/60 font-bold uppercase">{apt.service}</span>
                      </div>
                      <div className="text-sm font-bold text-white/80 flex items-center gap-2">
                        <User size={14} className="text-green-500" />
                        {apt.customer}
                      </div>
                    </div>
                  </motion.div>
                ))}
                <div className="pt-6 border-t border-white/5 mt-6">
                  <div className="flex items-center gap-2 text-white/40 text-xs italic mb-4">
                    <Bell size={14} /> תזכורות מהמוח:
                  </div>
                  <div className="p-4 bg-orange-500/10 border border-orange-500/20 rounded-2xl text-orange-200 text-xs font-bold leading-relaxed">
                    שים לב עמאר: אבי לוי ביקש בשיחת הוואטסאפ לוודא שיש חניה פנויה ליד המספרה.
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* צד שמאל: קנבס הסימולציה עם ה-AI המדבר */}
          <div className="lg:col-span-7 space-y-8">
            <div className="bg-black border-[10px] border-slate-900 rounded-[3.5rem] h-[750px] shadow-2xl relative overflow-hidden flex flex-col">
              
              {/* כותרת הסימולטור */}
              <div className="bg-[#1f2c34] p-6 flex items-center justify-between border-b border-white/5">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center font-black text-black text-xl italic shadow-[0_0_20px_rgba(34,197,94,0.4)]">AI</div>
                  <div>
                    <h3 className="text-white font-black text-lg">סוכן המכירות SabanOS</h3>
                    <p className="text-[10px] text-green-500 font-bold uppercase tracking-widest">Listening Mode Active</p>
                  </div>
                </div>
                <Layout className="text-white/20" size={24} />
              </div>

              {/* גוף הסימולציה - הקנבס שבו ה-AI "חי" */}
              <div className="flex-1 p-8 relative overflow-y-auto bg-[url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')] bg-repeat bg-opacity-5">
                
                {/* צ'אט אינטראקטיבי */}
                <ChatInterface trialId={params.trialId} />

                {/* AI Canvas Feedback - הודעות מערכת בתוך הקנבס */}
                <AnimatePresence>
                  {aiCanvasMessage && (
                    <motion.div 
                      initial={{ scale: 0.8, opacity: 0 }} 
                      animate={{ scale: 1, opacity: 1 }} 
                      exit={{ scale: 0.8, opacity: 0 }}
                      className="absolute inset-x-8 top-1/2 -translate-y-1/2 z-50 pointer-events-none"
                    >
                      <div className="bg-green-500 text-black p-8 rounded-[3rem] shadow-[0_30px_60px_rgba(0,0,0,0.5)] border-4 border-white/20 text-center">
                        <div className="bg-black w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-4">
                          <Brain size={24} className="text-green-500" />
                        </div>
                        <p className="text-xl font-black italic leading-tight">{aiCanvasMessage}</p>
                        <div className="mt-4 flex justify-center gap-1">
                          {[1,2,3].map(d => <div key={d} className="w-1.5 h-1.5 bg-black/20 rounded-full animate-bounce" style={{animationDelay: `${d*0.1}s`}} />)}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* כפתור עדכון מהיר מהקנבס */}
              <div className="p-6 bg-white/5 border-t border-white/5 flex gap-4">
                <button 
                  onClick={() => triggerAiResponse("עמאר, בזה הרגע עדכנתי את השעה 15:00 ביומן עבור אבי לוי. הכל מסונכרן.")}
                  className="flex-1 bg-white/10 hover:bg-white/20 text-white text-xs font-black py-4 rounded-2xl transition-all border border-white/10"
                >
                  עדכן שעה מהצ'אט
                </button>
                <button className="px-6 bg-green-500 text-black rounded-2xl font-black">
                  <Clock size={20} />
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}
