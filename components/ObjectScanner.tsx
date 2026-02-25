"use client";

import React, { useState } from "react";
import { Camera, RefreshCw, Check } from "lucide-react";

export default function ObjectScanner({ onScanComplete }: { onScanComplete: (items: string[]) => void }) {
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleCapture = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    
    // קריאה לקובץ וכיווץ ראשוני (לחיסכון בעלויות AI)
    const reader = new FileReader();
    reader.onload = async (event) => {
      const imgBase64 = event.target?.result as string;
      setImage(imgBase64);

      // שליחה ל-API שלנו שמנתח את התמונה בזול
      const response = await fetch("/api/vision/analyze", {
        method: "POST",
        body: JSON.stringify({ image: imgBase64.split(",")[1] }), // שולחים רק את הדאטה
      });

      const data = await response.json();
      onScanComplete(data.items); // מחזיר רשימה: ["ספה", "מקרר", "5 ארגזים"]
      setLoading(false);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="bg-slate-900/50 p-6 rounded-[2rem] border border-white/10 text-center">
      {!image ? (
        <label className="cursor-pointer flex flex-col items-center gap-3">
          <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center shadow-lg shadow-blue-500/30">
            <Camera className="text-white" size={28} />
          </div>
          <span className="text-sm font-bold text-slate-300">צלם את החדר להערכת ציוד</span>
          <input type="file" accept="image/*" capture="environment" className="hidden" onChange={handleCapture} />
        </label>
      ) : (
        <div className="relative">
          <img src={image} alt="captured" className="w-full h-40 object-cover rounded-2xl opacity-50" />
          <div className="absolute inset-0 flex items-center justify-center">
            {loading ? (
              <RefreshCw className="animate-spin text-blue-500" size={32} />
            ) : (
              <div className="bg-green-500 p-2 rounded-full"><Check className="text-white" /></div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
