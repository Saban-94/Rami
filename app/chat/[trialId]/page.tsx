"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { useToast } from "@/components/ui/ToastProvider";

// ייבוא דינמי של ה-Interface כדי למנוע את שגיאת ה-Constructor בשרת
const ChatInterfaceNoSSR = dynamic(
  () => import("@/components/ChatInterface"),
  { ssr: false }
);

export default function ChatPage({ params }: { params: { trialId: string } }) {
  const [businessData, setBusinessData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isMounted, setIsMounted] = useState(false);
  const { addToast } = useToast();

  // וודא שאנחנו בדפדפן לפני הפעלת Firebase
  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted || !params.trialId) return;

    let unsubscribe: () => void;

    // ייבוא דינמי של Firebase רק בתוך ה-Effect
    const setupSnapshot = async () => {
      try {
        const { db } = await import("@/lib/firebase");
        const { doc, onSnapshot } = await import("firebase/firestore");

        const docRef = doc(db, "trials", params.trialId);
        unsubscribe = onSnapshot(docRef, (snap) => {
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
      } catch (error) {
        console.error("Failed to load Firebase:", error);
        setLoading(false);
      }
    };

    setupSnapshot();

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [params.trialId, addToast, isMounted]);

  if (!isMounted || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#020617] text-green-500 font-black">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="animate-pulse">SabanOS Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#F8FAFC]">
      {/* כאן שמתי את הקומפוננטה שלך - וודא שהיא קיימת בתיקיית הרכיבים */}
      <div className="max-w-4xl mx-auto pt-24 px-4 h-[calc(100vh-20px)] flex flex-col">
        <div className="mb-4 flex items-center justify-between">
          <h1 className="text-2xl font-black italic text-slate-800">
            Chat with {businessData?.businessName || businessData?.name || "SabanOS AI"}
          </h1>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-ping"></span>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-tighter">Live System</span>
          </div>
        </div>
        
        <div className="flex-1 bg-white rounded-[2rem] shadow-2xl overflow-hidden border border-slate-100 mb-4">
          {/* שימוש בגרסה ללא SSR כדי למנוע את השגיאה סופית */}
          <ChatInterfaceNoSSR trialId={params.trialId} businessData={businessData} />
        </div>
      </div>
    </main>
  );
}
