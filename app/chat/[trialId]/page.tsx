"use client";

import React, { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { motion, AnimatePresence } from "framer-motion";
import { Send, User, CheckCheck, Lock } from "lucide-react";
import { processBusinessRequest } from "@/app/actions/gemini-brain";

export default function WhatsAppChat() {
  const { trialId } = useParams();
  const [trial, setTrial] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isExpired, setIsExpired] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function checkTrial() {
      if (!trialId) return;
      try {
        const docRef = doc(db, "trials", trialId as string);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          const createdAt = data.createdAt?.seconds ? data.createdAt.seconds * 1000 : Date.now();
          const tenDaysInMs = 10 * 24 * 60 * 60 * 1000;
          
          if (Date.now() - createdAt > tenDaysInMs) {
            setIsExpired(true);
          } else {
            setTrial(data);
            setMessages(data.messages || []);
          }
        }
      } catch (error) {
        console.error("Error fetching trial:", error);
      } finally {
        setLoading(false);
      }
    }
    checkTrial();
  }, [trialId]);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg = { role: "user", content: input, time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) };
    setMessages(prev => [...prev, userMsg]);
    const currentInput = input;
    setInput("");
    setIsTyping(true);

    try {
      const aiResponse = await processBusinessRequest(currentInput, { name: trial?.name || "העסק", industry: trial?.industry || "כללי" });
      const aiMsg = { role: "assistant", content: aiResponse, time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) };
      setMessages(prev => [...prev, aiMsg]);
    } catch (error) {
      console.error("AI Error:", error);
    } finally {
      setIsTyping(false);
    }
  };

  if (loading) {
    return <div className="h-screen flex items-center justify-center dark:bg-slate-950 dark:text-white">טוען...</div>;
  }

  if (isExpired) {
    return (
      <div className="h-screen flex flex-col items-center justify-center p-6 text-center bg-slate-50 dark:bg-slate-950" dir="rtl">
        <div className="w-20 h-20 bg-rose-500/10 rounded-full flex items-center justify-center mb-6 text-rose-500">
          <Lock size={40} />
        </div>
        <h1 className="text-2xl font-black mb-4 dark:text-white">תקופת הניסיון הסתיימה</h1>
        <p className="text-slate-500 mb-8">הלינק הזה פג תוקף לאחר 10 ימי התנסות. כדי להמשיך להשתמש בשירות, יש ליצור קשר עם בעל העסק.</p>
        <button className="bg-slate-900 dark:bg-white dark:text-black text-white px-8 py-4 rounded-2xl font-bold w-full max-w-xs shadow-xl">רכישת מנוע AI לעסק</button>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-[#E5DDD5] dark:bg-slate-950 overflow-hidden" dir="rtl">
      <header className="bg-[#075E54] p-4 flex items-center gap-3 shadow-lg z-10">
        <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center overflow-hidden">
          <User className="text-slate-500" />
        </div>
        <div className="flex-1">
          <h2 className="text-white font-bold leading-tight">{trial?.name || "שירות לקוחות AI"}</h2>
          <p className="text-emerald-100 text-xs">{isTyping ? "מקליד..." : "זמין"}</p>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[url('
