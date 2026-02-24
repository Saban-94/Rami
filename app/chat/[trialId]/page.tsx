"use client";

import React, { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { doc, onSnapshot } from "firebase/firestore";
import ChatInterface from "@/components/ChatInterface";
import { useToast } from "@/components/ui/ToastProvider";

export default function ChatPage({ params }: { params: { trialId: string } }) {
  const [businessData, setBusinessData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();

  useEffect(() => {
    if (!params.trialId) return;

    const docRef = doc(db, "trials", params.trialId);
    const unsubscribe = onSnapshot(docRef, (snap) => {
      if (snap.exists()) {
        setBusinessData(snap.data());
      } else {
        addToast("השיחה לא נמצאה", "error");
      }
      setLoading(false);
    }, (err) => {
      console.error("Firestore Error:", err);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [params.trialId, addToast]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#020617] text-green-500 font-black">
        SabanOS Loading...
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#F8FAFC]">
      <Navigation />
      <div className="max-w-4xl mx-auto pt-24 px-4 h-screen flex flex-col">
        <div className="mb-4">
          <h1 className="text-2xl font-black italic">
            Chat with {businessData?.businessName || "SabanOS AI"}
          </h1>
        </div>
        <div className="flex-1 bg-white rounded-[2rem] shadow-xl overflow-hidden border border-slate-100">
          <ChatInterface trialId={params.trialId} />
        </div>
      </div>
    </main>
  );
}
