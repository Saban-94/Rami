"use client";

import React, { useState, useEffect, useRef } from "react";
import { Send, CheckCheck, Paperclip, MoreVertical, ChevronRight } from "lucide-react";
import { processBusinessRequest } from "../app/actions/gemini-brain";

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

  const playNotificationSound = () => {
    try {
      const audio = new Audio("https://raw.githubusercontent.com/Saban-94/Rami/main/public/sounds/whatsapp_incoming.mp3");
      audio.play().catch(() => console.log("Audio blocked by browser"));
    } catch (e) { console.error(e); }
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    const userMsg: Message = {
      role: "user",
      content: input,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsTyping(true); // הפעלת אפקט "מקליד"

    try {
      const businessContext = { name: "SabanOS", industry: "Automation & CRM" };
      
      // המרה לפורמט היסטוריה שגימני מבין
      const history = messages.map(m => ({
        role: m.role,
        parts: [{ text: m.content }]
      }));

      const response = await processBusinessRequest(input, history, businessContext);

      if (response) {
        const aiMsg: Message = {
          role: "model",
          content: response,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages(prev => [...prev, aiMsg]);
        playNotificationSound();
      }
    } catch (error) {
      console.error("Gemini Error:", error);
      setMessages(prev => [...prev, { 
        role: "model", 
        content: "אופס, יש תקלה זמנית. נסה שוב בעוד רגע.", 
        timestamp: "עכשיו" 
      }]);
    } finally {
      setIsTyping(false); // כיבוי אפקט "מקליד"
    }
  };

  return (
    <div className="flex flex-col h-screen max-w-md mx-auto bg-[#efeae2] shadow-2xl overflow-hidden font-sans border-x border-slate-300 relative" dir="rtl">
      
      {/* WhatsApp Header */}
      <header className="bg-[#075e54] p-3 flex items-center justify-between text-white shadow-md z-10">
        <div className="flex items-center gap-3">
          <ChevronRight className="cursor-pointer" />
          <div className="w-10 h-10 bg-slate-300 rounded-full flex items-center justify-center text-[#075e54] font-black">SO</div>
          <div className="flex flex-col">
            <span className="font-bold text-base leading-tight">SabanOS Smart AI</span>
            {isTyping ? (
              <span className="text-[12px] font-black text-emerald-400 animate-pulse">מקליד...</span>
            ) : (
              <span className="text-[10px] opacity-80">זמין כעת</span>
            )}
          </div>
        </div>
        <MoreVertical size={20} className="opacity-80" />
      </header>

      {/* Chat Area */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 space-y-3 bg-[url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')] bg-repeat"
      >
        {messages.map((msg, index) => (
          <div key={index} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[85%] p-2 rounded-lg shadow-sm relative ${
              msg.role === "user" ? "bg-[#d9fdd3] rounded-tr-none" : "bg-white rounded-tl-none"
            }`}>
              <p className="text-[14.5px] text-slate-800 leading-relaxed font-medium">{msg.content}</p>
              <div className="flex items-center justify-end gap-1 mt-1 opacity-60">
                <span className="text-[9px]">{msg.timestamp}</span>
                {msg.role === "user" && <CheckCheck size={14} className="text-sky-500" />}
              </div>
            </div>
          </div>
        ))}
        {isTyping && (
           <div className="flex justify-start animate-in fade-in duration-300">
             <div className="bg-white p-3 rounded-lg rounded-tl-none shadow-sm flex gap-1">
               <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
               <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
               <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
             </div>
           </div>
        )}
      </div>

      {/* Input Area */}
      <footer className="bg-[#f0f2f5] p-2 flex items-center gap-2">
        <div className="bg-white flex-1 rounded-full flex items-center px-4 py-2 shadow-sm">
          <input 
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="הקלד הודעה..."
            className="flex-1 bg-transparent outline-none text-sm"
          />
          <Paperclip size={20} className="text-slate-500 rotate-45 cursor-pointer" />
        </div>
        <button 
          onClick={handleSend}
          disabled={isTyping}
          className="bg-[#00a884] p-3 rounded-full text-white shadow-lg active:scale-90 transition-all disabled:opacity-50"
        >
          <Send size={20} />
        </button>
      </footer>
    </div>
  );
}
