"use client";

import React, { useState, useRef, useEffect } from "react";
import { Send, Camera, User, Bot, Paperclip } from "lucide-react";
import { processBusinessRequest } from "@/app/actions/gemini-brain";

interface Message {
  role: "user" | "model";
  content: string;
  image?: string;
}

export default function ChatInterface({ trialId, businessData }: any) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "model",
      content: `שלום! כאן המערכת החכמה של ${businessData?.businessName || "הובלות אבו אל ראסם"}. במה אפשר לעזור לכם היום? 🚚`,
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (text?: string, imageData?: string) => {
    const messageContent = text || input;
    if (!messageContent.trim() && !imageData) return;

    const userMsg: Message = { role: "user", content: messageContent, image: imageData };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await processBusinessRequest(
        messageContent,
        messages,
        businessData
      );

      setMessages((prev) => [...prev, { role: "model", content: response }]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { role: "model", content: "מצטער, חלה שגיאה קטנה. בוא ננסה שוב? 🛠️" },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        handleSend("שלחתי לך תמונה של הציוד 📸", reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#efeae2] font-sans">
      {/* Header */}
      <div className="bg-[#075e54] p-4 flex items-center gap-3 text-white shadow-md">
        <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
          <Truck className="text-white" size={24} />
        </div>
        <div>
          <h2 className="font-bold text-lg">{businessData?.businessName || "אבו ראסם הובלות"}</h2>
          <p className="text-xs text-green-200 italic">מחובר | המוח של אבו ראסם זמין</p>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[85%] p-3 rounded-2xl shadow-sm ${
                msg.role === "user"
                  ? "bg-[#dcf8c6] text-slate-800 rounded-tr-none"
                  : "bg-white text-slate-800 rounded-tl-none border border-slate-200"
              }`}
            >
              {msg.image && (
                <img 
                  src={msg.image} 
                  alt="תמונת ציוד" 
                  className="rounded-lg mb-2 max-w-full border-2 border-white shadow-sm"
                />
              )}
              <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>
              <span className="text-[10px] text-slate-400 block text-left mt-1">
                {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start italic text-slate-500 text-xs animate-pulse">
            אבו ראסם חושב... 🚛
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-[#f0f2f5] flex items-center gap-2 border-t border-slate-200">
        <input
          type="file"
          accept="image/*"
          className="hidden"
          ref={fileInputRef}
          onChange={handleFileChange}
        />
        
        <button
          onClick={() => fileInputRef.current?.click()}
          className="p-3 text-slate-500 hover:bg-slate-200 rounded-full transition-all"
          title="צרף תמונה"
        >
          <Camera size={26} />
        </button>

        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="כתוב הודעה..."
          className="flex-1 p-3 bg-white rounded-full outline-none shadow-sm text-right px-5"
          dir="rtl"
        />

        <button
          onClick={() => handleSend()}
          disabled={!input.trim() || isLoading}
          className={`p-3 rounded-full transition-all shadow-md ${
            !input.trim() ? "bg-slate-300" : "bg-[#00a884] hover:bg-[#008f6f] text-white"
          }`}
        >
          <Send size={22} className={isLoading ? "animate-ping" : ""} />
        </button>
      </div>
    </div>
  );
}

// קומפוננטת אייקון קטנה להדר
function Truck({ size, className }: { size: number; className?: string }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2" />
      <path d="M15 18H9" />
      <path d="M19 18h2a1 1 0 0 0 1-1v-5h-7v7" />
      <path d="M13 9h4" />
      <circle cx="7" cy="18" r="2" />
      <circle cx="17" cy="18" r="2" />
    </svg>
  );
}
