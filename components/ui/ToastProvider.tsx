"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, X, CheckCircle2, AlertCircle } from "lucide-react";

// --- Types ---
type ToastType = 'ai' | 'success' | 'error';

type Toast = {
  id: string;
  title: string;
  message: string;
  type: ToastType;
};

type ToastContextType = {
  showToast: (title: string, message: string, type?: ToastType) => void;
  hideToast: (id: string) => void;
};

const ToastContext = createContext<ToastContextType | null>(null);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [mounted, setMounted] = useState(false);

  // מונע שגיאות Hydration ב-Next.js
  useEffect(() => {
    setMounted(true);
  }, []);

  const showToast = (title: string, message: string, type: ToastType = 'ai') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, title, message, type }]);
    
    // סגירה אוטומטית אחרי 5 שניות
    setTimeout(() => hideToast(id), 5000);
  };

  const hideToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast, hideToast }}>
      {children}
      
      {/* רינדור ההתראות בתוך Portal כדי שיהיו מעל ה-Z-Index של הסטודיו */}
      {mounted && createPortal(
        <div className="fixed bottom-8 left-8 z-[9999] flex flex-col gap-4 pointer-events-none" dir="rtl">
          <AnimatePresence>
            {toasts.map((t) => (
              <motion.div
                key={t.id}
                layout
                initial={{ opacity: 0, x: -50, scale: 0.9 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.2 } }}
                className="pointer-events-auto min-w-[340px] max-w-md bg-white/90 dark:bg-slate-900/90 backdrop-blur-2xl border border-white/20 dark:border-white/10 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.2)] p-6 flex items-start gap-4"
              >
                {/* Icon Logic */}
                <div className={`p-3 rounded-2xl shadow-lg ${
                  t.type === 'ai' ? 'bg-green-500 text-white shadow-green-500/30' :
                  t.type === 'success' ? 'bg-blue-500 text-white shadow-blue-500/30' :
                  'bg-red-500 text-white shadow-red-500/30'
                }`}>
                  {t.type === 'ai' && <Sparkles size={20} />}
                  {t.type === 'success' && <CheckCircle2 size={20} />}
                  {t.type === 'error' && <AlertCircle size={20} />}
                </div>

                {/* Content */}
                <div className="flex-1 pr-1">
                  <h4 className="font-black italic text-slate-900 dark:text-white text-sm leading-none">
                    {t.title}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-2 leading-relaxed">
                    {t.message}
                  </p>
                </div>

                {/* Close Button */}
                <button 
                  onClick={() => hideToast(t.id)}
                  className="text-slate-300 hover:text-slate-600 dark:hover:text-white transition-colors p-1"
                >
                  <X size={16} />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>,
        document.body
      )}
    </ToastContext.Provider>
  );
};
