"use client";
import { Camera } from "lucide-react";

export default function VisionScanner({ onDetected }: { onDetected: (items: any) => void }) {
  const processImage = async (e: any) => {
    const file = e.target.files[0];
    // כאן מתבצע כיווץ התמונה (Client Side) לחיסכון בעלויות
    const compressedImage = await compressFile(file); 
    
    const res = await fetch("/api/ai/vision", {
      method: "POST",
      body: JSON.stringify({ image: compressedImage })
    });
    const data = await res.json();
    onDetected(data.items);
  };

  return (
    <label className="p-3 bg-blue-600 rounded-full cursor-pointer hover:scale-110 transition-transform">
      <Camera className="text-white" size={20} />
      <input type="file" capture="environment" className="hidden" onChange={processImage} />
    </label>
  );
}

async function compressFile(file: File): Promise<string> {
  // לוגיקת כיווץ פשוטה להקטנת טוקנים של AI
  return "base64_data_here"; 
}
