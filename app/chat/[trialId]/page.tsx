"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { db } from "@/lib/firebase"; // ייבוא ישיר במקום dynamic import בתוך ה-Effect
import { doc, getDoc } from "firebase/firestore";

const ChatInterfaceNoSSR = dynamic(
  () => import("@/components/ChatInterface"),
  { 
    ssr: false,
    loading: () => <div className="text-green-500">טוען ממשק...</div>
  }
);

export default function ChatPage({ params }: { params: { trialId: string } }) {
  const [businessData, setBusinessData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        console.log("Starting to fetch trialId:", params.trialId);
        
        if (!params.trialId) {
          setError("חסר trialId בכתובת");
          return;
        }

        const docRef = doc(db, "trials", params.trialId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          console.log("Data found!");
          setBusinessData(docSnap.data());
        } else {
          console.error("No such document!");
          setError("העסק לא נמצא במערכת (404)");
        }
      } catch (err: any) {
        console.error("Firebase Error:", err);
        setError(`שגיאת תקשורת: ${err.message}`);
      }
    }
    loadData();
  }, [params.trialId]);

  if (error) {
    return (
      <div className="h-screen bg-black text-red-500 flex flex-col items-center justify-center p-4">
        <h1 className="text-xl font-bold mb-2">🚨 מלשינון כשל עליה</h1>
        <p className="bg-red-900/20 p-3 rounded border border-red-500">{error}</p>
        <button onClick={() => window.location.reload()} className="mt-4 underline">נסה שוב</button>
      </div>
    );
  }

  if (!businessData) {
    return (
      <div className="h-screen bg-[#020617] flex flex-col items-center justify-center">
        <div className="w-12 h-12 border-4 border-t-green-500 border-white/10 rounded-full animate-spin"></div>
        <h2 className="text-green-500 mt-4 font-mono tracking-widest animate-pulse">SabanOS Loading...</h2>
        {/* המלשינון הקטן למטה שיגיד לנו איפה זה תקוע */}
        <p className="text-white/30 text-[10px] mt-2 italic">Checking Firebase Connection...</p>
      </div>
    );
  }

  return (
    <main className="fixed inset-0 flex flex-col bg-[#dadbd3]">
      <div className="flex-1 w-full max-w-[1600px] mx-auto bg-white flex flex-col overflow-hidden">
        <ChatInterfaceNoSSR trialId={params.trialId} businessData={businessData} />
      </div>
    </main>
  );
}
