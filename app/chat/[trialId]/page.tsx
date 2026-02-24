"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { useToast } from "@/components/ui/ToastProvider";

const ChatInterfaceNoSSR = dynamic(
  () => import("@/components/ChatInterface"),
  { ssr: false }
);

export default function ChatPage({ params }: { params: { trialId: string } }) {
  const [businessData, setBusinessData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isMounted, setIsMounted] = useState(false);
  const { addToast } = useToast();

  useEffect(() => {
    setIsMounted(true);
    const fetchBusiness = async () => {
      try {
        const { db } = await import("@/lib/firebase");
        const { doc, getDoc } = await import("firebase/firestore");
        const docSnap = await getDoc(doc(db, "trials", params.trialId));
        if (docSnap.exists()) {
          setBusinessData(docSnap.data());
        }
        setLoading(false);
      } catch (e) {
        addToast("שגיאה בטעינת נתוני העסק", "error");
        setLoading(false);
      }
    };
    fetchBusiness();
  }, [params.trialId]);

  if (!isMounted || loading) return <div className="h-screen bg-[#020617] flex items-center justify-center text-green-500 font-bold italic">SabanOS Loading...</div>;

  return (
    // המסגרת החיצונית נועלת את הגובה ל-100% מהמסך
    <main className="fixed inset-0 flex flex-col bg-[#dadbd3]">
      <div className="flex-1 w-full max-w-[1600px] mx-auto bg-white shadow-2xl flex flex-col overflow-hidden">
        <ChatInterfaceNoSSR trialId={params.trialId} businessData={businessData} />
      </div>
    </main>
  );
}
