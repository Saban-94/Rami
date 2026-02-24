"use client";

import React, { useState, useEffect, useRef } from "react";
import { Send, CheckCheck, Paperclip, MoreVertical, ChevronRight, Smile, Mic } from "lucide-react";
import { processBusinessRequest } from "@/app/actions/gemini-brain";

interface Message {
  role: "user" | "model";
  content: string;
  timestamp: string;
}

export default function ChatInterface({ trialId, businessData }: any) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // גלילה אוטומטית לתחתית
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages, isTyping]);

  const playNotification = () => {
    if (typeof window === "undefined") return;
    try {
      const audio = new Audio(`/sounds/whatsapp.mp3?v=${Date.now()}`);
      audio.volume = 0.4;
      audio.play().catch(() => {});
    } catch (e) {}
  };

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    const userMsg: Message = {
      role: "user",
      content: input,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    try {
      const chatHistory = messages.map(m => ({
        role: m.role === "user" ? "user" : "model",
        parts: [{ text: m.content }]
      }));

      const response = await processBusinessRequest(input, chatHistory, businessData);

      setIsTyping(false);
      setMessages(prev => [...prev, {
        role: "model",
        content: response || "מצטער, נסה שוב.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
      playNotification();
    } catch (error) {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex flex-col h-full w-full bg-[#efeae2] font-sans overflow-hidden" dir="rtl">
      
      {/* WhatsApp Header */}
      <header className="bg-[#075e54] text-white px-4 py-2 flex items-center justify-between shadow-md shrink-0">
        <div className="flex items-center gap-3">
          <ChevronRight className="cursor-pointer sm:hidden" />
          <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center text-[#075e54] font-bold shadow-inner">
            {businessData?.businessName?.charAt(0) || "SO"}
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-sm sm:text-base leading-tight">
              {businessData?.businessName || "SabanOS Smart AI"}
            </span>
            <span className="text-[11px] opacity-90 italic">
              {isTyping ? "מקליד/ה..." : "מחובר/ת"}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-4 opacity-80">
          <MoreVertical size={20} className="cursor-pointer" />
        </div>
      </header>

      {/* אזור ההודעות עם רקע וואטסאפ אייקוני */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 space-y-3 relative"
        style={{ 
          backgroundImage: `url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')`,
          backgroundSize: '400px'
        }}
      >
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[85%] sm:max-w-[70%] p-2 px-3 rounded-lg shadow-sm relative ${
              msg.role === "user" ? "bg-[#d9fdd3] rounded-tr-none" : "bg-white rounded-tl-none"
            }`}>
              <p className="text-[14px] sm:text-[15px] text-slate-800 whitespace-pre-wrap">{msg.content}</p>
              <div className="flex items-center justify-end gap-1 mt-1 opacity-50">
                <span className="text-[10px]">{msg.timestamp}</span>
                {msg.role === "user" && <CheckCheck size={15} className="text-sky-500" />}
              </div>
            </div>
          </div>
        ))}

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

      {/* Input Area - תואם וואטסאפ מובייל */}
      <footer className="bg-[#f0f2f5] p-2 flex items-center gap-2 shrink-0">
        <div className="bg-white flex-1 rounded-full flex items-center px-3 py-1.5 shadow-sm border border-slate-200">
          <Smile className="text-slate-500 cursor-pointer ml-2" size={24} />
          <input 
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="הקלד הודעה..."
            className="flex-1 bg-transparent outline-none text-sm py-1"
          />
          <Paperclip className="text-slate-500 rotate-45 cursor-pointer mr-2" size={20} />
        </div>
        <button 
          onClick={handleSend}
          className="bg-[#00a884] p-3 rounded-full text-white shadow-md active:scale-90 transition-transform flex items-center justify-center"
        >
          {input.trim() ? <Send size={20} /> : <Mic size={20} />}
        </button>
      </footer>
    </div>
  );
}
