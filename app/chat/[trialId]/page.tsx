"use client";

import React, { useState, useEffect } from "react";
import { db } from "../../../lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import ChatInterface from "../../../components/ChatInterface";
import Navigation from "../../../components/Navigation";
import { motion } from "framer-motion";

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
      if (snap.exists()) setBusinessData(snap.data());
      setLoading(false);
    };
    fetchBusiness();
  }, [params.trialId]);

  const handleVerify = () => {
    if (inputCode === businessData?.accessCode) {
      // צליל וואטסאפ מהמאגר שלך
      const audio = new Audio("/sounds/whatsapp.mp3");
      audio.play().catch(() => console.log("Sound blocked"));
      
      setIsAuthorized(true);
    } else {
      setError(true);
      setTimeout(() => setError(false), 2000);
    }
  };

  if (loading) return <div className="min-h-screen bg-[#020617] flex items-center justify-center text-green-500 italic animate-pulse">SabanOS...</div>;

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center p-4 font-sans" dir="rtl">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-white/5 border border-white/10 p-10 rounded-[3rem] max-w-sm w-full text-center backdrop-blur-2xl">
          <div className="mb-6 flex flex-col items-center">
            {/* הצגת הלוגו של עמאר או האות הראשונה של העסק */}
            <div className="w-24 h-24 rounded-3xl bg-green-500/20 border border-green-500/30 flex items-center justify-center overflow-hidden mb-4 shadow-[0_0_30px_rgba(34,197,94,0.2)]">
              {businessData?.logoUrl ? (
                <img src={businessData.logoUrl} className="w-full h-full object-cover" />
              ) : (
                <span className="text-4xl font-black text-green-500 italic">{businessData?.businessName?.[0]}</span>
              )}
            </div>
            <h2 className="text-2xl font-black text-white italic">{businessData?.businessName}</h2>
            <p className="text-white/40 text-sm">ברוך הבא, {businessData?.fullName}</p>
          </div>

          <input 
            type="password" 
            maxLength={4}
            value={inputCode}
            onChange={(e) => setInputCode(e.target.value)}
            className="w-full bg-black/40 border-2 border-white/5 rounded-2xl p-5 text-center text-3xl font-bold tracking-[15px] text-green-500 focus:border-green-500 outline-none transition-all"
            placeholder="****"
          />
          {error && <p className="text-red-500 text-xs mt-4">קוד שגוי</p>}
          <button onClick={handleVerify} className="w-full bg-green-500 text-black font-black py-5 rounded-2xl mt-6 hover:shadow-[0_0_30px_rgba(34,197,94,0.4)] transition-all">
            כניסה לאפליקציה
          </button>
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
