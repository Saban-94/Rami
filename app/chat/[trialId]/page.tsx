"use client";

import React, { useState, useEffect } from "react";
import { db } from "../../../lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import ChatInterface from "../../../components/ChatInterface";
import Navigation from "../../../components/Navigation";

export default function ProtectedChatPage({ params }: { params: { trialId: string } }) {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [inputCode, setInputCode] = useState("");
  const [correctCode, setCorrectCode] = useState("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDoc = async () => {
      const docRef = doc(db, "trials", params.trialId);
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        setCorrectCode(snap.data().accessCode);
      }
      setLoading(false);
    };
    fetchDoc();
  }, [params.trialId]);

  const handleVerify = () => {
    if (inputCode === correctCode) {
      setIsAuthorized(true);
    } else {
      setError(true);
      setTimeout(() => setError(false), 2000);
    }
  };

  if (loading) return <div className="min-h-screen bg-[#020617] animate-pulse" />;

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center p-4" dir="rtl">
        <div className="bg-white/5 border border-white/10 p-10 rounded-[2.5rem] max-w-sm w-full text-center backdrop-blur-xl">
          <h2 className="text-2xl font-black mb-2 italic">כניסה מאובטחת</h2>
          <p className="text-white/40 text-sm mb-8">הזן את 4 הספרות שקיבלת</p>
          <input 
            type="text" 
            maxLength={4}
            value={inputCode}
            onChange={(e) => setInputCode(e.target.value)}
            className="w-full bg-black/40 border-2 border-white/10 rounded-2xl p-5 text-center text-3xl font-bold tracking-[12px] text-green-500 focus:border-green-500 outline-none transition-all"
            placeholder="0000"
          />
          {error && <p className="text-red-500 text-xs mt-4">קוד שגוי, נסה שוב</p>}
          <button onClick={handleVerify} className="w-full bg-green-500 text-black font-black py-4 rounded-2xl mt-8 hover:scale-[1.02] active:scale-[0.98] transition-all">
            פתח ממשק ניהול
          </button>
        </div>
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
