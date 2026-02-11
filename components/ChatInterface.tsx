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

  // פונקציה להשמעת צליל וואטסאפ
  const playNotificationSound = () => {
    const audio = new Audio("https://raw.githubusercontent.com/Saban-94/Rami/main/public/sounds/whatsapp_incoming.mp3");
    // לינק חלופי למקרה שהקובץ עוד לא במאגר שלך:
    // const audio = new Audio("https://actions.google.com/sounds/v1/foley/notification_high_intensity.ogg");
    audio.play().catch(e => console.log("Audio play blocked"));
  };

  // גלילה אוטומטית למטה
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      role: "user",
      content: input,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    try {
      // שליחת ההודעה יחד עם ההיסטוריה למוח של גימני
      const businessContext = { name: "SabanOS", industry: "Automation & CRM" };
      const response = await processBusinessRequest(input, messages, businessContext);

      const aiMessage: Message = {
        role: "model",
        content: response,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setIsTyping(false);
      setMessages(prev => [...prev, aiMessage]);
      playNotificationSound(); // השמעת צליל בקבלת תשובה
    } catch (error) {
      console.error("Chat Error:", error);
      setIsTyping(false);
    }
  };

  return (
    <div className="flex flex-col h-screen max-w-md mx-auto bg-[#efeae2] shadow-2xl overflow-hidden font-sans border-x border-slate-300" dir="rtl">
      
      {/* Header - בעיצוב וואטסאפ ירוק כהה */}
      <header className="bg-[#075e54] p-3 flex items-center justify-between text-white shadow-md">
        <div className="flex items-center gap-3">
          <ChevronRight className="cursor-pointer" />
          <div className="w-10 h-10 bg-slate-200 rounded-full overflow-hidden flex items-center justify-center">
            <span className="text-slate-600 font-bold">SO</span>
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-base leading-tight">SabanOS Smart AI</span>
            {isTyping ? (
              <span className="text-[11px] font-black text-emerald-300 animate-pulse tracking-wide">מקליד...</span>
            ) : (
              <span className="text-[10px] opacity-80">זמין כעת</span>
            )}
          </div>
        </div>
        <div className="flex gap-4 opacity-80">
          <MoreVertical size={20} className="cursor-pointer" />
        </div>
      </header>

      {/* הודעות צ'אט */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 space-y-3 bg-[url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')] bg-repeat"
      >
        {messages.map((msg, index) => (
          <div 
            key={index}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start animate-in fade-in slide-in-from-bottom-2"}`}
          >
            <div className={`max-w-[80%] p-2 rounded-lg shadow-sm relative ${
              msg.role === "user" ? "bg-[#d9fdd3] rounded-tr-none" : "bg-white rounded-tl-none"
            }`}>
              <p className="text-[14.5px] text-slate-800 leading-relaxed ml-8">{msg.content}</p>
              <div className="flex items-center justify-end gap-1 mt-1">
                <span className="text-[10px] text-slate-500">{msg.timestamp}</span>
                {msg.role === "user" && <CheckCheck size={14} className="text-sky-500" />}
              </div>
            </div>
          </div>
        ))}
        
        {/* בועת טעינה "חושב" */}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-white p-3 rounded-lg rounded-tl-none shadow-sm flex gap-1">
              <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
              <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
              <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
            </div>
          </div>
        )}
      </div>

      {/* תיבת טקסט */}
      <footer className="bg-[#f0f2f5] p-2 flex items-center gap-2 border-t border-slate-200">
        <div className="bg-white flex-1 rounded-full flex items-center px-4 py-1.5 shadow-sm">
          <input 
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="הקלד הודעה..."
            className="flex-1 bg-transparent border-none focus:outline-none text-sm py-1"
          />
          <Paperclip size={20} className="text-slate-500 cursor-pointer rotate-45" />
        </div>
        <button 
          onClick={handleSend}
          className="bg-[#00a884] p-2.5 rounded-full text-white shadow-md active:scale-95 transition-transform"
        >
          <Send size={20} />
        </button>
      </footer>
    </div>
  );
}
