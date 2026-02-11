"use client";

import React, { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import { db } from "../../../lib/firebase"; 
import { doc, getDoc, setDoc, arrayUnion, serverTimestamp } from "firebase/firestore";
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

  // טעינת נתונים ראשונית ובדיקת תוקף
  useEffect(() => {
    async function initChat() {
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
        } else {
          // אם המסמך לא קיים, עדיין נאפשר צ'אט (הוא ייווצר בשליחה הראשונה)
          setTrial({ name: "לקוח חדש" });
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

    // עדכון מקומי מהיר
    setMessages(prev => [...prev, userMsg]);
    const currentInput = input;
    setInput("");
    setIsTyping(true);

    try {
      const docRef = doc(db, "trials", trialId as string);
      
      // שימוש ב-setDoc כדי ליצור/לעדכן את המסמך והאוסף אוטומטית
      await setDoc(docRef, {
        messages: arrayUnion(userMsg),
        lastUpdate: serverTimestamp(),
        createdAt: serverTimestamp(), // יתעדכן רק ביצירה הראשונה בגלל ה-merge
        status: "active",
        name: trial?.name || "לקוח חדש"
      }, { merge: true });

      // שליחה ל-Gemini
      const aiResponse = await processBusinessRequest(currentInput, { 
        name: trial?.name || "העסק", 
        industry: "בדיקה" 
      });

      const aiMsg = { 
        role: "assistant", 
        content: aiResponse, 
        time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) 
      };

      setMessages(prev => [...prev, aiMsg]);
      
      // שמירת תשובת ה-AI
      await setDoc(docRef, {
        messages: arrayUnion(aiMsg),
        lastUpdate: serverTimestamp()
      }, { merge: true });

    } catch (error) {
      console.error("Firebase Error:", error);
      // אם יש שגיאת הרשאות, כאן נראה אותה בקונסולה
    } finally {
      setIsTyping(false);
    }
  };

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (loading) return <div className="h-screen flex items-center justify-center bg-[#e5ddd5]">טוען מערכת AI...</div>;

  if (isExpired) return (
    <div className="h-screen flex flex-col items-center justify-center p-6 text-center bg-white" dir="rtl">
      <Lock size={50} className="text-red-500 mb-4" />
      <h1 className="text-2xl font-bold">תקופת הניסיון הסתיימה</h1>
      <p className="text-gray-500 mt-2">הגישה לבוט זה מוגבלת ל-10 ימים.</p>
    </div>
  );

  return (
    <div className="h-screen flex flex-col bg-[#e5ddd5] overflow-hidden font-sans" dir="rtl">
      {/* Header */}
      <header className="bg-[#075e54] p-4 flex items-center gap-3 text-white shadow-md">
        <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center text-gray-600">
          <User />
        </div>
        <div>
          <h2 className="font-bold">{trial?.name || "שירות לקוחות AI"}</h2>
          <p className="text-[10px] opacity-80">{isTyping ? "מקליד..." : "זמין"}</p>
        </div>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')]">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[85%] p-3 rounded-xl shadow-sm ${msg.role === "user" ? "bg-[#dcf8c6]" : "bg-white"}`}>
              <p className="text-sm">{msg.content}</p>
              <div className="flex justify-end items-center gap-1 mt-1 text-[9px] text-gray-400 italic">
                {msg.time}
                {msg.role === "user" && <CheckCheck size={12} className="text-blue-500" />}
              </div>
            </div>
          </div>
        ))}
        <div ref={scrollRef} />
      </div>

      {/* Input */}
      <footer className="p-3 bg-[#f0f2f5] flex items-center gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="הקלד הודעה..."
          className="flex-1 p-3 rounded-full border-none outline-none shadow-sm text-sm"
        />
        <button 
          onClick={handleSend}
          className="bg-[#00a884] p-3 rounded-full text-white shadow-md active:scale-90 transition-transform"
        >
          <Send size={20} />
        </button>
      </footer>
    </div>
  );
}
