"use client";
import React, { useState, useEffect } from "react";
import { Send, Calendar, Loader2, Volume2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function ChatBox() {
  const [input, setInput] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const [messages, setMessages] = useState([{ role: "ai", content: "אהלן אחי! אבו אל ראסם כאן. איך עוזרים לך היום? 🚛" }]);

  // אפקט צלצול כניסה
  useEffect(() => {
    const audio = new Audio("/ping.mp3");
    audio.play().catch(() => {});
  }, []);

  const handleSend = () => {
    if (!input) return;
    setMessages([...messages, { role: "user", content: input }]);
    setInput("");
    setIsThinking(true);
    
    // סימולציית מחשבה של AI
    setTimeout(() => {
      setIsThinking(false);
      setMessages(prev => [...prev, { role: "ai", content: "**הבנתי אחי!** בוא נתאם הובלת קירור." }]);
    }, 2000);
  };

  return (
    <div className="flex flex-col h-[600px] bg-slate-900 rounded-[3rem] border border-white/10 overflow-hidden shadow-2xl shadow-blue-500/10">
      {/* מסך הודעות */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        <AnimatePresence>
          {messages.map((m, i) => (
            <motion.div 
              initial={{ opacity: 0, x: m.role === "user" ? -20 : 20 }}
              animate={{ opacity: 1, x: 0 }}
              key={i} 
              className={`flex ${m.role === "user" ? "justify-start" : "justify-end"}`}
            >
              <div className={`max-w-[85%] p-4 rounded-3xl font-bold text-lg ${
                m.role === "user" ? "bg-slate-800 text-white" : "bg-blue-600 text-white shadow-lg"
              }`}>
                {m.content}
              </div>
            </motion.div>
          ))}
          {isThinking && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-end italic text-blue-400 text-xs gap-2 items-center">
              <span>SabanOS AI חושב...</span>
              <Loader2 className="animate-spin" size={12} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Input מחוזק - תיקון טקסט דהוי */}
      <div className="p-6 bg-slate-950/50 backdrop-blur-md border-t border-white/5">
        <div className="relative flex items-center gap-3">
          {/* כפתור יומן */}
          <button className="p-4 bg-white/5 rounded-2xl hover:bg-blue-600 transition-all group">
            <Calendar className="text-slate-400 group-hover:text-white" size={24} />
          </button>
          
          <input 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="כתוב כאן הודעה..."
            className="flex-1 bg-slate-800 h-14 px-6 rounded-2xl text-white text-lg font-black placeholder:text-slate-500 border-2 border-transparent focus:border-blue-500 focus:outline-none transition-all"
          />
          
          <button onClick={handleSend} className="p-4 bg-blue-600 rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-lg shadow-blue-500/40">
            <Send className="text-white" size={24} />
          </button>
        </div>
      </div>
    </div>
  );
}
