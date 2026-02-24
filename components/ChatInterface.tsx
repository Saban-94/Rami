"use client";

import React, { useState, useEffect, useRef } from "react";
import { Send, CheckCheck, Paperclip, MoreVertical, ChevronRight, Smile, Mic, Image as ImageIcon, Camera } from "lucide-react";
import { processBusinessRequest } from "@/app/actions/gemini-brain";

interface Message {
  role: "user" | "model";
  content: string;
  timestamp: string;
  type?: "text" | "image";
  imageUrl?: string;
}

export default function ChatInterface({ trialId, businessData }: any) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "model",
      content: `שלום! כאן המערכת החכמה של ${businessData?.businessName || "הובלות אבו ראסם"}. במה אפשר לעזור לכם היום? 🚚`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // גלילה אוטומטית חלקה
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
    const currentInput = input;
    setInput("");
    setIsTyping(true);

    try {
      const chatHistory = messages.map(m => ({
        role: m.role === "user" ? "user" : "model",
        parts: [{ text: m.content }]
      }));

      const response = await processBusinessRequest(currentInput, chatHistory, businessData);

      setIsTyping(false);
      setMessages(prev => [...prev, {
        role: "model",
        content: response || "מצטער, חלה שגיאה בחיבור. נסה שוב.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
      playNotification();
    } catch (error) {
      setIsTyping(false);
      console.error("Chat Error:", error);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // כאן אפשר להוסיף לוגיקה של העלאה ל-Storage
      // כרגע נציג את זה כהודעה זמנית
      const reader = new FileReader();
      reader.onload = (en) => {
        setMessages(prev => [...prev, {
          role: "user",
          content: "שלחתי תמונה של התכולה",
          type: "image",
          imageUrl: en.target?.result as string,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }]);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex flex-col h-full w-full bg-[#efeae2] font-sans overflow-hidden shadow-inner" dir="rtl">
      
      {/* WhatsApp Header */}
      <header className="bg-[#075e54] text-white px-4 py-3 flex items-center justify-between shadow-lg z-20 shrink-0">
        <div className="flex items-center gap-3">
          <ChevronRight className="cursor-pointer md:hidden" />
          <div className="relative">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-[#075e54] font-black text-lg shadow-md">
              {businessData?.businessName?.charAt(0) || "A"}
            </div>
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-400 border-2 border-[#075e54] rounded-full"></div>
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-[15px] sm:text-base leading-tight">
              {businessData?.businessName || "הובלות אבו ראסם"}
            </span>
            <span className="text-[11px] opacity-90">
              {isTyping ? "מקליד/ה..." : "מחובר/ת"}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Camera size={20} className="cursor-pointer opacity-80 hover:opacity-100 hidden sm:block" />
          <MoreVertical size={20} className="cursor-pointer opacity-80" />
        </div>
      </header>

      {/* אזור ההודעות */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 space-y-4 relative scroll-smooth"
        style={{ 
          backgroundImage: `url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')`,
          backgroundBlendMode: 'overlay',
          backgroundColor: '#efeae2'
        }}
      >
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start animate-in fade-in slide-in-from-bottom-2 duration-300"}`}>
            <div className={`max-w-[85%] sm:max-w-[70%] p-2 px-3 rounded-lg shadow-sm relative ${
              msg.role === "user" ? "bg-[#d9fdd3] rounded-tr-none" : "bg-white rounded-tl-none border border-slate-200"
            }`}>
              {msg.type === "image" && msg.imageUrl && (
                <img src={msg.imageUrl} alt="upload" className="rounded-md mb-2 max-h-60 w-full object-cover" />
              )}
              <p className="text-[14.5px] sm:text-[15.5px] text-slate-800 leading-relaxed font-medium">
                {msg.content}
              </p>
              <div className="flex items-center justify-end gap-1 mt-1 opacity-50">
                <span className="text-[10px] font-bold">{msg.timestamp}</span>
                {msg.role === "user" && <CheckCheck size={16} className="text-sky-500" />}
              </div>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-white p-3 rounded-lg rounded-tl-none shadow-sm flex gap-1 items-center border border-slate-100">
              <span className="w-1.5 h-1.5 bg-[#075e54] rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
              <span className="w-1.5 h-1.5 bg-[#075e54] rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
              <span className="w-1.5 h-1.5 bg-[#075e54] rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <footer className="bg-[#f0f2f5] p-3 flex items-center gap-2 shrink-0 border-t border-slate-200">
        <div className="bg-white flex-1 rounded-full flex items-center px-3 py-1 shadow-md">
          <Smile className="text-slate-500 cursor-pointer ml-2 hover:text-[#075e54] transition-colors" size={24} />
          <input 
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="הקלד הודעה..."
            className="flex-1 bg-transparent outline-none text-sm sm:text-base py-2"
          />
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleImageUpload} 
            className="hidden" 
            accept="image/*" 
          />
          <ImageIcon 
            className="text-slate-500 cursor-pointer mx-2 hover:text-[#075e54]" 
            size={22} 
            onClick={() => fileInputRef.current?.click()}
          />
          <Paperclip className="text-slate-500 rotate-45 cursor-pointer hover:text-[#075e54]" size={22} />
        </div>
        <button 
          onClick={handleSend}
          disabled={isTyping}
          className="bg-[#00a884] p-3.5 rounded-full text-white shadow-lg active:scale-95 transition-all flex items-center justify-center disabled:opacity-50"
        >
          {input.trim() ? <Send size={20} fill="currentColor" /> : <Mic size={20} fill="currentColor" />}
        </button>
      </footer>
    </div>
  );
}
