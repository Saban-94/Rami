"use client";

import React, { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import { db } from "../../../lib/firebase";
import { doc, getDoc, setDoc, arrayUnion, serverTimestamp } from "firebase/firestore";
import { 
  Send, User, CheckCheck, Sun, Plus, 
  Calendar, Image as ImageIcon, Tag, Phone 
} from "lucide-react";
import { processBusinessRequest } from "../../actions/gemini-brain";

export default function SmartSabanChat() {
  const { trialId } = useParams();
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showPlusMenu, setShowPlusMenu] = useState(false);
  
  // בורר גוונים למסגרת (Emerald, Blue, Gold)
  const [themeColor, setThemeColor] = useState("border-emerald-500");
  const themes = [
    { id: 'emerald', class: 'border-emerald-500', bg: 'bg-emerald-500' },
    { id: 'blue', class: 'border-blue-500', bg: 'bg-blue-500' },
    { id: 'gold', class: 'border-amber-500', bg: 'bg-amber-500' }
  ];

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function loadChat() {
      if (!trialId) return;
      const docSnap = await getDoc(doc(db, "trials", trialId as string));
      if (docSnap.exists()) setMessages(docSnap.data().messages || []);
    }
    loadChat();
  }, [trialId]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (customText?: string) => {
    const textToSend = customText || input;
    if (!textToSend.trim() || !trialId) return;

    const userMsg = { 
      role: "user", 
      content: textToSend, 
      time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) 
    };

    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setShowPlusMenu(false);
    setIsTyping(true);

    try {
      const docRef = doc(db, "trials", trialId as string);
      await setDoc(docRef, {
        messages: arrayUnion(userMsg),
        lastUpdate: serverTimestamp()
      }, { merge: true });

      // כאן ה-AI מקבל את הבקשה. הוא יזהה אם מדובר ביומן.
      const aiResponse = await processBusinessRequest(textToSend, { name: "SabanOS Business" });

      const aiMsg = { 
        role: "assistant", 
        content: aiResponse, 
        time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) 
      };

      setMessages(prev => [...prev, aiMsg]);
      await setDoc(docRef, { messages: arrayUnion(aiMsg), lastUpdate: serverTimestamp() }, { merge: true });
    } catch (e) { console.error(e); }
    setIsTyping(false);
  };

  return (
    <div className={`h-screen flex items-center justify-center bg-slate-100 dark:bg-slate-950 p-2 md:p-4 overflow-hidden font-sans`} dir="rtl">
      
      {/* Container הצאט עם המסגרת המשתנה */}
      <div className={`w-full max-w-md h-full flex flex-col bg-[#e5ddd5] dark:bg-slate-900 border-t-4 shadow-2xl rounded-2xl overflow-hidden transition-all duration-500 ${themeColor}`}>
        
        {/* Header */}
        <header className="bg-[#075e54] dark:bg-slate-800 p-3 flex items-center justify-between text-white shadow-lg z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-slate-300 rounded-full flex items-center justify-center text-slate-600"><User /></div>
            <div>
              <h2 className="text-sm font-bold">SabanOS Smart AI</h2>
              <p className="text-[10px] opacity-80">{isTyping ? "מקליד..." : "זמין כעת"}</p>
            </div>
          </div>
          
          {/* בורר גוונים */}
          <div className="flex gap-1 items-center bg-black/20 p-1 rounded-full">
            {themes.map(t => (
              <button 
                key={t.id} 
                onClick={() => setThemeColor(t.class)}
                className={`w-4 h-4 rounded-full ${t.bg} border border-white/20 hover:scale-110 transition-transform`}
              />
            ))}
            <Sun size={16} className="mr-1 text-amber-300" />
          </div>
        </header>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')] dark:bg-blend-overlay dark:bg-slate-900">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start animate-in fade-in slide-in-from-left-2"}`}>
              <div className={`max-w-[85%] p-3 rounded-2xl shadow-sm ${
                msg.role === "user" 
                ? "bg-[#dcf8c6] dark:bg-[#056162] text-slate-900 dark:text-slate-50" 
                : "bg-white dark:bg-[#1F2C33] text-slate-800 dark:text-slate-100"
              }`}>
                <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                <div className="flex justify-end items-center gap-1 mt-1 text-[9px] opacity-50 italic">
                  {msg.time}
                  {msg.role === "user" && <CheckCheck size={12} className="text-blue-500" />}
                </div>
              </div>
            </div>
          ))}
          <div ref={scrollRef} />
        </div>

        {/* Plus Menu Modal */}
        {showPlusMenu && (
          <div className="absolute bottom-20 right-6 flex flex-col gap-3 animate-in slide-in-from-bottom-5">
            <button onClick={() => handleSend("אני רוצה לקבוע תור")} className="bg-blue-500 text-white p-3 rounded-full shadow-xl flex items-center gap-2 text-xs font-bold"><Calendar size={18}/> קביעת תור</button>
            <button onClick={() => handleSend("אילו מבצעים יש כרגע?")} className="bg-orange-500 text-white p-3 rounded-full shadow-xl flex items-center gap-2 text-xs font-bold"><Tag size={18}/> מבצעים</button>
            <button className="bg-purple-500 text-white p-3 rounded-full shadow-xl flex items-center gap-2 text-xs font-bold"><ImageIcon size={18}/> שלח תמונה</button>
          </div>
        )}

        {/* Input Bar */}
        <footer className="p-2 bg-[#f0f2f5] dark:bg-slate-800 flex items-center gap-2 border-t dark:border-slate-700">
          <button 
            onClick={() => setShowPlusMenu(!showPlusMenu)}
            className={`transition-transform duration-300 ${showPlusMenu ? 'rotate-45 text-red-500' : 'text-slate-500'}`}
          >
            <Plus size={28} />
          </button>
          
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="הקלד הודעה..."
            className="flex-1 p-3 rounded-full bg-white dark:bg-slate-700 dark:text-white outline-none text-sm shadow-inner"
          />
          
          <button onClick={() => handleSend()} className="bg-[#00a884] p-3 rounded-full text-white shadow-md active:scale-90 transition-transform">
            <Send size={20} />
          </button>
        </footer>
      </div>
    </div>
  );
}
