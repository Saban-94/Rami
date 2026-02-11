"use client";

import React, { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import { db } from "../../../lib/firebase";
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
          if (Date.now() - createdAt > 10 * 24 * 60 * 60 * 1000) {
            setIsExpired(true);
          } else {
            setTrial(data);
          }
        }
      } catch (e) {
        console.error(e);
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
      setMessages(prev => [...prev, { role: "assistant", content: aiResponse, time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) }]);
    } catch (e) {
      console.error(e);
    } finally {
      setIsTyping(false);
    }
  };

  if (loading) return <div className="h-screen flex items-center justify-center dark:bg-slate-950 dark:text-white">טוען...</div>;

  if (isExpired) return (
    <div className="h-screen flex flex-col items-center justify-center p-6 text-center bg-slate-50 dark:bg-slate-950" dir="rtl">
      <Lock size={40} className="text-rose-500 mb-6" />
      <h1 className="text-2xl font-black mb-4 dark:text-white">תקופת הניסיון הסתיימה</h1>
      <p className="text-slate-500 mb-8">הלינק פג תוקף לאחר 10 ימים.</p>
      <button className="bg-slate-900 dark:bg-white dark:text-black text-white px-8 py-4 rounded-2xl font-bold">רכישת מנוע AI</button>
    </div>
  );

  return (
    <div className="h-screen flex flex-col bg-[#E5DDD5] dark:bg-slate-950 overflow-hidden" dir="rtl">
      <header className="bg-[#075E54] p-4 flex items-center gap-3 shadow-lg z-10 text-white">
        <User size={30} />
        <div>
          <h2 className="font-bold">{trial?.name || "שירות לקוחות AI"}</h2>
          <p className="text-xs opacity-80">{isTyping ? "מקליד..." : "זמין"}</p>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[80%] p-3 rounded-xl shadow-sm ${msg.role === "user" ? "bg-[#DCF8C6]" : "bg-white"}`}>
              <p className="text-sm">{msg.content}</p>
              <div className="flex justify-end mt-1 italic text-[10px] text-slate-400">
                {msg.time} {msg.role === "user" && <CheckCheck size={12} className="text-blue-500 ml-1" />}
              </div>
            </div>
          </div>
        ))}
        <div ref={scrollRef} />
      </div>

      <footer className="p-3 bg-[#F0F2F5] dark:bg-slate-900 flex items-center gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="הקלד הודעה..."
          className="flex-1 p-3 rounded-full outline-none text-sm dark:bg-slate-800 dark:text-white"
        />
        <button onClick={handleSend} className="bg-[#00A884] p-3 rounded-full text-white"><Send size={20} /></button>
      </footer>
    </div>
  );
}
