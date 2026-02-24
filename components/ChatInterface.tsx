"use client";

import React, { useState, useEffect, useRef } from "react";
import { Send, CheckCheck, Paperclip, MoreVertical, ChevronRight } from "lucide-react";
import { processBusinessRequest } from "@/app/actions/gemini-brain";

interface Message {
  role: "user" | "model";
  content: string;
  timestamp: string;
}

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // הפעלת סאונד - מוגן לריצה בדפדפן בלבד
  const playNotification = () => {
    if (typeof window === "undefined") return;
    try {
      const audio = new Audio(`/sounds/whatsapp.mp3?v=${Date.now()}`);
      audio.volume = 0.5;
      audio.play().catch(() => console.log("Sound blocked by browser"));
    } catch (e) {
      console.error("Audio error:", e);
    }
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  // אתחול אינטראקציות דפדפן
  useEffect(() => {
    if (typeof window === "undefined") return;

    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }

    const unlockAudio = () => {
      const audio = new Audio("/sounds/whatsapp.mp3");
      audio.play().then(() => {
        audio.pause();
        audio.currentTime = 0;
      }).catch(() => {});
      document.removeEventListener('click', unlockAudio);
    };
    document.addEventListener('click', unlockAudio);
    return () => document.removeEventListener('click', unlockAudio);
  }, []);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    const userText = input;
    const userMsg: Message = {
      role: "user",
      content: userText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    try {
      const businessContext = { name: "SabanOS", industry: "Automation & CRM" };
      const chatHistory = messages.map(m => ({
        role: m.role,
        parts: [{ text: m.content }]
      }));

      const response = await processBusinessRequest(userText, chatHistory, businessContext);

      if (response) {
        setIsTyping(false);
        setMessages(prev => [...prev, {
          role: "model",
          content: response,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }]);
        playNotification();
      }
    } catch (error) {
      console.error("Chat Error:", error);
      setIsTyping(false);
    }
  };

  return (
    <div className="flex flex-col h-[90vh] max-w-md mx-auto bg-[#efeae2] shadow-2xl overflow-hidden font-sans border-x border-slate-300 relative rounded-2xl" dir="rtl">
      {/* Header */}
      <header className="bg-[#075e54] p-3 flex items-center justify-between text-white z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-slate-300 rounded-full flex items-center justify-center text-[#075e54] font-black">SO</div>
          <div className="flex flex-col">
            <span className="font-bold text-base">SabanOS Smart AI</span>
            <span className="text-[10px] opacity-80">{isTyping ? "מקליד..." : "זמין כעת"}</span>
          </div>
        </div>
      </header>

      {/* Messages Area */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3 bg-[url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')] bg-repeat">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[85%] p-2 px-3 rounded-lg shadow-sm ${msg.role === "user" ? "bg-[#d9fdd3]" : "bg-white"}`}>
              <p className="text-[14.5px] text-slate-800">{msg.content}</p>
              <div className="text-[9px] text-right opacity-60 mt-1">{msg.timestamp}</div>
            </div>
          </div>
        ))}
        {isTyping && <div className="text-xs text-slate-500 animate-pulse">ה-AI מקליט תשובה...</div>}
      </div>

      {/* Footer */}
      <footer className="bg-[#f0f2f5] p-2 flex items-center gap-2">
        <input 
          type="text" 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="הקלד הודעה..."
          className="flex-1 bg-white rounded-full px-4 py-2 outline-none text-sm"
        />
        <button onClick={handleSend} className="bg-[#00a884] p-3 rounded-full text-white">
          <Send size={20} />
        </button>
      </footer>
    </div>
  );
}
