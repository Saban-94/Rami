"use client";

import React, { useState, useEffect, useRef } from "react";
import { db } from "../../../lib/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import ChatInterface from "../../../components/ChatInterface";
import Navigation from "../../../components/Navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Brain, Sparkles, Lock, MessageSquare, CheckCircle2, Loader2 } from "lucide-react";

export default function ProtectedChatPage({ params }: { params: { trialId: string } }) {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [inputCode, setInputCode] = useState("");
  const [businessData, setBusinessData] = useState<any>(null);
  const [extraContext, setExtraContext] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [showAiFeedback, setShowAiFeedback] = useState(false);
  const [aiMessage, setAiMessage] = useState("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDoc = async () => {
      const docRef = doc(db, "trials", params.trialId);
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        setBusinessData(snap.data());
        setExtraContext(snap.data().businessContext || "");
      }
      setLoading(false);
    };
    fetchDoc();
  }, [params.trialId]);

  const handleVerify = () => {
    if (inputCode === businessData?.accessCode) {
      new Audio("/sounds/whatsapp.mp3").play().catch(() => {});
      setIsAuthorized(true);
    } else {
      setError(true);
      setTimeout(() => setError(false), 2000);
    }
  };

  // אפקט ההקלדה של ה-AI
  const typeMessage = (text: string) => {
    setAiMessage("");
    setShowAiFeedback(true);
    let i = 0;
    const interval = setInterval(() => {
      setAiMessage((prev) => prev + text.charAt(i));
      i++;
      if (i >= text.length) {
        clearInterval(interval);
        setTimeout(() => setShowAiFeedback(false), 4000); // נעלם אחרי 4 שניות
      }
    }, 50);
  };

  const saveAITraining = async () => {
    setIsSaving(true);
    try {
      const docRef = doc(db, "trials", params.trialId);
      await updateDoc(docRef, { businessContext: extraContext });
      
      // משמיע צליל הצלחה
      new Audio("/sounds/whatsapp.mp3").play().catch(() => {});
      
      // מפעיל את אפקט ה-AI
      typeMessage(`היי ${businessData.fullName}, קיבלתי! עדכנתי את המוח שלי במחיר התספורת החדש ובשאר הפרטים. אני מוכן לענות ללקוחות שלך.`);
      
    } catch (e) {
      alert("שגיאה בעדכון");
    }
    setIsSaving(false);
  };

  if (loading) return <div className="min-h-screen bg-[#020617] flex items-center justify-center text-green-500 italic animate-pulse tracking-tighter text-2xl">SabanOS AI...</div>;

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center p-4 font-sans" dir="rtl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white/5 border border-white/10 p-10 rounded-[3rem] max-w-sm w-full text-center backdrop-blur-2xl shadow-2xl">
          <div className="w-20 h-20 bg-green-500 rounded-3xl mx-auto mb-6 flex items-center justify-center shadow-[0_0_30px_rgba(34,197,94,0.3)]">
             <Lock className="text-black" size={32} />
          </div>
          <h2 className="text-2xl font-black text-white mb-2 italic tracking-tight">{businessData?.businessName}</h2>
          <p className="text-white/40 text-sm mb-8">הזן קוד גישה לניהול המוח</p>
          <input 
            type="password" 
            maxLength={4}
            value={inputCode}
            onChange={(e) => setInputCode(e.target.value)}
            className="w-full bg-black/40 border-2 border-white/10 rounded-2xl p-5 text-center text-3xl tracking-[15px] text-green-500 outline-none focus:border-green-500 transition-all"
            placeholder="****"
          />
          {error && <p className="text-red-500 text-xs mt-4">קוד שגוי</p>}
          <button onClick={handleVerify} className="w-full bg-green-500 text-black font-black py-4 rounded-2xl mt-8 hover:shadow-[0_0_20px_rgba(34,197,94,0.3)] transition-all">
            כניסה למערכת
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#020617] text-white overflow-x-hidden" dir="rtl">
      <Navigation />
      
      <div className="pt-24 px-6 max-w-6xl mx-auto pb-20 relative">
        
        {/* פידבק צף מה-AI ברגע שמעדכנים */}
        <AnimatePresence>
          {showAiFeedback && (
            <motion.div 
              initial={{ opacity: 0, y: 50, scale: 0.9 }} 
              animate={{ opacity: 1, y: 0, scale: 1 }} 
              exit={{ opacity: 0, scale: 0.9 }}
              className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[100] w-full max-w-md px-4"
            >
              <div className="bg-green-500 text-black p-6 rounded-[2rem] shadow-[0_20px_50px_rgba(34,197,94,0.4)] border-2 border-white/20 relative">
                <div className="flex items-start gap-4">
                  <div className="bg-black text-green-500 p-2 rounded-xl">
                    <Brain size={20} />
                  </div>
                  <div>
                    <p className="text-xs font-black uppercase tracking-widest opacity-60 mb-1">עדכון מערכת SabanOS</p>
                    <p className="font-bold leading-tight">{aiMessage}</p>
                  </div>
                </div>
                <div className="absolute -bottom-2 right-10 w-4 h-4 bg-green-500 rotate-45" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* צד שמאל: מרכז האימון */}
          <div className="space-y-6">
            <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-8 backdrop-blur-xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-green-500/20 rounded-2xl text-green-500">
                  <Sparkles size={28} />
                </div>
                <div>
                  <h2 className="text-2xl font-black italic tracking-tighter">אימון ה-AI שלי</h2>
                  <p className="text-white/40 text-sm font-medium italic">עדכן מחירים, שירותים וחוקים</p>
                </div>
              </div>

              <div className="space-y-4">
                <textarea 
                  value={extraContext}
                  onChange={(e) => setExtraContext(e.target.value)}
                  placeholder="למשל: תספורת עולה 60 ש''ח. מניקור ב-80 ש''ח. תמיד תציע כוס קפה למי שקובע..."
                  className="w-full h-72 bg-black/40 border border-white/10 rounded-[2rem] p-6 text-white outline-none focus:border-green-500 transition-all resize-none leading-relaxed shadow-inner font-medium"
                />
                
                <button 
                  onClick={saveAITraining}
                  disabled={isSaving}
                  className="w-full bg-green-500 text-black font-black py-5 rounded-2xl flex items-center justify-center gap-2 hover:bg-green-400 transition-all shadow-xl disabled:opacity-50 group"
                >
                  {isSaving ? <Loader2 className="animate-spin" /> : <CheckCircle2 size={20} />}
                  {isSaving ? "צורק נתונים..." : "עדכן את המוח של העסק"}
                </button>
              </div>
            </div>
          </div>

          {/* צד ימין: סימולטור וואטסאפ */}
          <div className="h-full min-h-[600px] flex flex-col">
            <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-4 flex-1 flex flex-col backdrop-blur-xl">
               <div className="p-4 flex items-center gap-3 border-b border-white/5 mb-4">
                  <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center font-black text-black italic">AI</div>
                  <div>
                    <h3 className="text-sm font-bold">סימולטור SabanOS</h3>
                    <p className="text-[10px] text-green-500">מחובר ומוכן לעבודה</p>
                  </div>
               </div>
               <div className="flex-1 rounded-[2rem] overflow-hidden bg-black/20 border border-white/5">
                  <ChatInterface trialId={params.trialId} />
               </div>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}
