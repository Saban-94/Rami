"use client";

import React, { useState, useEffect, useRef } from "react";
import { Send, CheckCheck, Paperclip, MoreVertical, ChevronRight, Camera } from "lucide-react";
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
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // הגדרות "שירה קוסמטיקה" - יגיעו מה-DB בהמשך
  const businessOwner = {
    name: "שירה קוסמטיקה",
    image: "https://ui-avatars.com/api/?name=Shira+Cosmetics&background=f472b6&color=fff&rounded=true",
    status: "פעיל/ה כעת"
  };

  useEffect(() => {
    // אתחול האודיו מראש
    audioRef.current = new Audio("/sounds/whatsapp.mp3");
    audioRef.current.load();
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const playNotification = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => console.log("Audio blocked"));
    }
  };

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    // "דריכת" הסאונד בלחיצה הראשונה של המשתמש (חיוני למובייל)
    if (messages.length === 0 && audioRef.current) {
      audioRef.current.play().then(() => audioRef.current?.pause()).catch(() => {});
    }

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
        role: m.role,
        parts: [{ text: m.content }]
      }));

      const response = await processBusinessRequest(input, chatHistory, { name: businessOwner.name });

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
      setIsTyping(false);
      console.error(error);
    }
  };

  return (
    <div className="flex flex-col h-[100dvh] w-full max-w-md mx-auto bg-[#efeae2] overflow-hidden border-x border-gray-300 shadow-xl" dir="rtl">
      
      {/* Header מתוקן - שכבה אחת נקייה */}
      <header className="bg-[#075e54] p-3 flex items-center justify-between text-white shadow-lg z-50">
        <div className="flex items-center gap-2">
          <ChevronRight className="cursor-pointer ml-1" />
          <div className="relative">
            <img 
              src={businessOwner.image} 
              alt="Profile" 
              className="w-10 h-10 rounded-full border border-white/20 object-cover"
            />
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-[#075e54] rounded-full"></div>
          </div>
          <div className="flex flex-col mr-2">
            <span className="font-bold text-[15px] leading-tight">{businessOwner.name}</span>
            <span className="text-[11px] opacity-90 font-medium">
              {isTyping ? "מקליד/ה..." : businessOwner.status}
            </span>
          </div>
        </div>
        <div className="flex gap-4 opacity-90">
          <Camera size={20} className="cursor-pointer" />
          <MoreVertical size={20} className="cursor-pointer" />
        </div>
      </header>

      {/* אזור הצ'אט */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 space-y-3 bg-[url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')] bg-repeat bg-fixed"
      >
        {messages.length === 0 && (
          <div className="bg-[#fff9c4] text-slate-700 text-[12px] p-2 rounded-lg text-center shadow-sm mx-auto max-w-[80%] mb-4">
            הודעות לצ'אט זה מאובטחות מקצה לקצה. SabanOS AI זמין עבור {businessOwner.name}.
          </div>
        )}

        {messages.map((msg, index) => (
          <div key={index} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[85%] p-2 px-3 rounded-lg shadow-sm relative ${
              msg.role === "user" ? "bg-[#d9fdd3] rounded-tr-none" : "bg-white rounded-tl-none"
            }`}>
              <p className="text-[14.5px] text-slate-800 leading-relaxed font-medium whitespace-pre-wrap">{msg.content}</p>
              <div className="flex items-center justify-end gap-1 mt-1 opacity-50">
                <span className="text-[9px]">{msg.timestamp}</span>
                {msg.role === "user" && <CheckCheck size={14} className="text-sky-500" />}
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

      {/* Input Area - מותאם למובייל שלא יסתיר */}
      <footer className="bg-[#f0f2f5] p-2 flex items-center gap-2 border-t border-gray-200 pb-safe">
        <div className="bg-white flex-1 rounded-full flex items-center px-4 py-2 shadow-sm border border-gray-200">
          <input 
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="הודעה"
            className="flex-1 bg-transparent outline-none text-[15px]"
          />
          <Paperclip size={20} className="text-slate-500 rotate-45 cursor-pointer ml-2" />
        </div>
        <button 
          onClick={handleSend}
          disabled={isTyping}
          className="bg-[#00a884] p-3 rounded-full text-white shadow-lg active:scale-90 transition-all flex items-center justify-center min-w-[48px] min-h-[48px]"
        >
          <Send size={20} />
        </button>
      </footer>
    </div>
  );
}
