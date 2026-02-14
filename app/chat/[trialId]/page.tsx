"use client";

import React, { useState, useEffect } from "react";
import { db } from "../../../lib/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import ChatInterface from "../../../components/ChatInterface";
import Navigation from "../../../components/Navigation";
import { motion } from "framer-motion";
import { Brain, Save, Sparkles, Lock, MessageSquare } from "lucide-react";

export default function ProtectedChatPage({ params }: { params: { trialId: string } }) {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [inputCode, setInputCode] = useState("");
  const [businessData, setBusinessData] = useState<any>(null);
  const [extraContext, setExtraContext] = useState("");
  const [isSaving, setIsSaving] = useState(false);
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

  const saveAITraining = async () => {
    setIsSaving(true);
    try {
      const docRef = doc(db, "trials", params.trialId);
      await updateDoc(docRef, { businessContext: extraContext });
      alert("ה-AI שלך עודכן בהצלחה!");
    } catch (e) {
      alert("שגיאה בעדכון ה-AI");
    }
    setIsSaving(false);
  };

  if (loading) return <div className="min-h-screen bg-[#020617] flex items-center justify-center text-green-500 italic animate-pulse">SabanOS AI...</div>;

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center p-4 font-sans" dir="rtl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white/5 border border-white/10 p-10 rounded-[3rem] max-w-sm w-full text-center backdrop-blur-2xl">
          <div className="w-20 h-20 bg-green-500 rounded-3xl mx-auto mb-6 flex items-center justify-center shadow-[0_0_30px_rgba(34,197,94,0.3)]">
             <Lock className="text-black" size={32} />
          </div>
          <h2 className="text-2xl font-black text-white mb-2 italic">{businessData?.businessName}</h2>
          <p className="text-white/40 text-sm mb-8">הזן קוד גישה לניהול ה-AI</p>
          <input 
            type="password" 
            maxLength={4}
            value={inputCode}
            onChange={(e) => setInputCode(e.target.value)}
            className="w-full bg-black/40 border-2 border-white/10 rounded-2xl p-5 text-center text-3xl tracking-[15px] text-green-500 outline-none focus:border-green-500 transition-all"
            placeholder="****"
          />
          {error && <p className="text-red-500 text-xs mt-4">קוד שגוי</p>}
          <button onClick={handleVerify} className="w-full bg-green-500 text-black font-black py-4 rounded-2xl mt-8 hover:bg-green-400 transition-all">
            כניסה למערכת
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#020617] text-white" dir="rtl">
      <Navigation />
      
      <div className="pt-24 px-6 max-w-6xl mx-auto pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* צד שמאל: אימון ה-AI */}
          <div className="space-y-8">
            <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-8 backdrop-blur-xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-green-500/20 rounded-2xl text-green-500">
                  <Brain size={28} />
                </div>
                <div>
                  <h2 className="text-2xl font-black italic">מרכז אימון AI</h2>
                  <p className="text-white/40 text-sm">למד את הסוכן שלך על העסק</p>
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-sm font-bold text-white/60 block mr-2">הנחיות, מחירון ושעות פעילות:</label>
                <textarea 
                  value={extraContext}
                  onChange={(e) => setExtraContext(e.target.value)}
                  placeholder="למשל: תספורת גבר עולה 60 ש''ח. אנחנו סגורים ביום שלישי. תמיד תציע ללקוחות קפה כשהם מגיעים..."
                  className="w-full h-64 bg-black/40 border border-white/10 rounded-[2rem] p-6 text-white outline-none focus:border-green-500 transition-all resize-none leading-relaxed"
                />
                <button 
                  onClick={saveAITraining}
                  disabled={isSaving}
                  className="w-full bg-green-500 text-black font-black py-5 rounded-2xl flex items-center justify-center gap-2 hover:shadow-[0_0_30px_rgba(34,197,94,0.3)] transition-all disabled:opacity-50"
                >
                  {isSaving ? "מעדכן את המוח..." : "עדכן AI ושמור שינויים"} <Sparkles size={20} />
                </button>
              </div>
            </div>
          </div>

          {/* צד ימין: סימולטור צ'אט */}
          <div className="space-y-8">
            <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-8 h-full min-h-[500px] flex flex-col">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-blue-500/20 rounded-2xl text-blue-500">
                  <MessageSquare size={28} />
                </div>
                <div>
                  <h2 className="text-2xl font-black italic">סימולציית וואטסאפ</h2>
                  <p className="text-white/40 text-sm">בדוק איך ה-AI עונה ללקוחות שלך</p>
                </div>
              </div>
              
              <div className="flex-1 bg-black/40 rounded-[2rem] border border-white/5 overflow-hidden">
                <ChatInterface trialId={params.trialId} />
              </div>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}
