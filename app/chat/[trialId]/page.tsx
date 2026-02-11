"use client";

import React, { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import { db } from "../../../lib/firebase"; 
import { doc, getDoc, setDoc, updateDoc, arrayUnion, serverTimestamp } from "firebase/firestore";
import { Send, User, CheckCheck, Lock } from "lucide-react";
import { processBusinessRequest } from "../../actions/gemini-brain";

export default function WhatsAppChat() {
  const { trialId } = useParams();
  const [trial, setTrial] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isExpired, setIsExpired] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // פונקציה שיוצרת את המסמך אוטומטית אם הוא לא קיים
  const ensureTrialExists = async (id: string) => {
    const docRef = doc(db, "trials", id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      // אם המסמך לא קיים - ניצור אותו עכשיו
      const newData = {
        businessId: "rami_demo_1", // מזהה ברירת מחדל
        name: "לקוח חדש",
        status: "active",
        createdAt: serverTimestamp(), // זמן יצירה של Firebase
        messages: []
      };
      await setDoc(docRef, newData);
      return newData;
    }
    return docSnap.data();
  };

  useEffect(() => {
    async function initChat() {
      if (!trialId) return;
      try {
        const data = await ensureTrialExists(trialId as string);
        
        // בדיקת תוקף (10 ימים)
        const createdAt = data.createdAt?.seconds ? data.createdAt.seconds * 1000 : Date.now();
        const tenDaysInMs = 10 * 24 * 60 * 60 * 1000;
        
        if (Date.now() - createdAt > tenDaysInMs) {
          setIsExpired(true);
        } else {
          setTrial(data);
          setMessages(data.messages || []);
        }
      } catch (error) {
        console.error("Initialization error:", error);
      } finally {
        setLoading(false);
      }
    }
    initChat();
  }, [trialId]);

  const handleSend = async () => {
    if (!input.trim() || !trialId) return;

    const userMsg = { 
      role: "user", 
      content: input, 
      time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) 
    };

    setMessages(prev => [...prev, userMsg]);
    const currentInput = input;
    setInput("");
    setIsTyping(true);

    try {
      const docRef = doc(db, "trials", trialId as string);
      
      // שמירת הודעת המשתמש במאגר (ייווצר אוטומטית אם לא היה)
      await updateDoc(docRef, {
        messages: arrayUnion(userMsg)
      });

      const aiResponse = await processBusinessRequest(currentInput, { 
        name: trial?.name || "העסק", 
        industry: trial?.industry || "כללי" 
      });

      const aiMsg = { 
        role: "assistant", 
        content: aiResponse, 
        time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) 
      };

      setMessages(prev => [...prev, aiMsg]);
      
      // שמירת תשובת ה-AI במאגר
      await updateDoc(docRef, {
        messages: arrayUnion(aiMsg)
      });

    } catch (error) {
      console.error("Chat error:", error);
    } finally {
      setIsTyping(false);
    }
  };

  // גלילה אוטומטית לסוף הצ'אט
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (loading) return <div className="h-screen flex items-center justify-center dark:bg-slate-950 dark:text-white font-sans">טוען צ'אט...</div>;

  if (isExpired) return (
    <div className="h-screen flex flex-col items-center justify-center p-6 text-center bg-[#f0f2f5] dark:bg-slate-950" dir="rtl">
      <Lock size={60} className="text-rose-500 mb-6" />
      <h1 className="text-3xl font-black mb-4 dark:text-white">פג תוקף</h1>
      <p className="text-slate-500 mb-8 text-lg">הגישה לצ'אט זה הסתיימה לאחר 10 ימים.</p>
      <button className="bg-[#00a884] text-white px-10 py-4 rounded-full font-bold shadow-lg">צור קשר עם המנהל</button>
    </div>
  );

  return (
    <div className="h-screen flex flex-col bg-[#e5ddd5] dark:bg-slate-950 overflow-hidden font-sans" dir="rtl">
      {/* Header */}
      <header className="bg-[#075e54] p-4 flex items-center gap-3 shadow-md text-white z-10">
        <div className="w-10 h-10 bg-slate-300 rounded-full flex items-center justify-center">
          <User className="text-slate-600" />
        </div>
        <div>
          <h2 className="font-bold">{trial?.name || "שירות לקוחות AI"}</h2>
          <p className="text-[10px] opacity-80">{isTyping ? "מקליד..." : "מחובר"}</p>
        </div>
      </header>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')] bg-repeat opacity-95">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[85%] p-3 rounded-xl shadow-sm relative ${msg.role === "user" ? "bg-[#dcf8c6] rounded-tr-none" : "bg-white rounded-tl-none"}`}>
              <p className="text-sm text-slate-800">{msg.content}</p>
              <div className="flex items-center justify-end gap-1 mt-1 text-[9px] text-slate-400">
                {msg.time}
                {msg.role === "user" && <CheckCheck size={12} className="text-blue-500" />}
              </div>
            </div>
          </div>
        ))}
        <div ref={scrollRef} />
      </div>

      {/* Footer Input */}
      <footer className="p-3 bg-[#f0f2f5] dark:bg-slate-900 flex items-center gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="הקלד הודעה..."
          className="flex-1 p-3 rounded-full border-none outline-none text-sm shadow-sm dark:bg-slate-800 dark:text-white"
        />
        <button onClick={handleSend} className="bg-[#00a884] p-3 rounded-full text-white shadow-md active:scale-95 transition-transform">
          <Send size={20} />
        </button>
      </footer>
    </div>
  );
}
