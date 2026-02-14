"use client";

import React, { useState, useEffect } from "react";
import { db } from "../../../lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import ChatInterface from "../../../components/ChatInterface";
import Navigation from "../../../components/Navigation";
import { motion, AnimatePresence } from "framer-motion";

export default function ProtectedChatPage({ params }: { params: { trialId: string } }) {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [inputCode, setInputCode] = useState("");
  const [businessData, setBusinessData] = useState<any>(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBusiness = async () => {
      const docRef = doc(db, "trials", params.trialId);
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        setBusinessData(snap.data());
      }
      setLoading(false);
    };
    fetchBusiness();
  }, [params.trialId]);

  const playWelcomeSound = () => {
    const audio = new Audio("/sounds/whatsapp.mp3");
    audio.play().catch(e => console.log("Sound blocked by browser"));
  };

  const handleVerify = () => {
    if (inputCode === businessData?.accessCode) {
      setIsAuthorized(true);
      playWelcomeSound();
      // הפעלת OneSignal במידת הצורך
      if (typeof window !== "undefined" && (window as any).OneSignal) {
        (window as any).OneSignal.showNativePrompt();
      }
    } else {
      setError(true);
      setTimeout(() => setError(false), 2000);
    }
  };

  if (loading) return <div className="min-h-screen bg-[#020617] flex items-center justify-center text-green-500 font-black italic animate-pulse">SabanOS...</div>;

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center p-4 font-sans" dir="rtl">
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/5 border border-white/10 p-10 rounded-[3rem] max-w-sm w-full text-center backdrop-blur-2xl shadow-2xl"
        >
          {/* לוגו המשתמש - המחשה אישית */}
          <div className="mb-8 flex flex-col items-center">
            <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-green-500 to-blue-600 p-1 mb-4 shadow-lg">
              <div className="w-full h-full bg-[#020617] rounded-[22px] flex items-center justify-center overflow-hidden">
                {businessData?.logoUrl ? (
                  <img src={businessData.logoUrl} alt="Logo" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-3xl font-black italic text-green-500">
                    {businessData?.businessName?.charAt(0)}
                  </span>
                )}
              </div>
            </div>
            <h2 className="text-2xl font-black italic text-white leading-tight">
              שלום, {businessData?.fullName}<br />
              <span className="text-green-500 text-lg not-italic opacity-80">{businessData?.businessName}</span>
            </h2>
          </div>

          <div className="space-y-4">
            <p className="text-white/40 text-sm">הזן קוד גישה לכניסה מאובטחת</p>
            <input 
              type="password" 
              maxLength={4}
              value={inputCode}
              onChange={(e) => setInputCode(e.target.value)}
              className="w-full bg-black/40 border-2 border-white/5 rounded-2xl p-5 text-center text-3xl font-bold tracking-[15px] text-green-500 focus:border-green-500 outline-none transition-all shadow-inner"
              placeholder="0000"
            />
            {error && <motion.p initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="text-red-500 text-xs">קוד שגוי, בדוק שוב</motion.p>}
            <button 
              onClick={handleVerify} 
              className="w-full bg-green-500 text-black font-black py-5 rounded-2xl mt-4 hover:shadow-[0_0_30px_rgba(34,197,94,0.4)] transition-all active:scale-95"
            >
              כניסה לאפליקציה
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#020617]">
      <Navigation />
      <div className="pt-20">
        <ChatInterface trialId={params.trialId} />
      </div>
    </main>
  );
}
