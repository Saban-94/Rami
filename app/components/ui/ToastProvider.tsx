/* app/components/ui/ToastProvider.tsx */
"use client";

import React, { createContext, useContext, useState } from 'react';

const ToastContext = createContext<any>(null);

export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  const [toasts, setToasts] = useState<any[]>([]);

  const addToast = (message: string, type: 'success' | 'error' = 'success') => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  };

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div className="fixed bottom-4 left-4 z-[9999] flex flex-col gap-2">
        {toasts.map((t) => (
          <div 
            key={t.id} 
            className={`px-6 py-3 rounded-2xl shadow-2xl text-white text-xs font-black animate-bounce-in ${
              t.type === 'success' ? 'bg-emerald-500' : 'bg-red-500'
            }`}
          >
            {t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => useContext(ToastContext);
