"use client";

import React, { useState } from "react";
import { Camera, Save, UploadCloud, CheckCircle2 } from "lucide-react";
import { uploadProfileImage } from "@/app/actions/drive-actions"; // הסקריפט שבנינו

export default function AdminProfile() {
  const [preview, setPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // טיפול בבחירת קובץ ותצוגה מקדימה
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsUploading(true);
    
    const formData = new FormData(e.currentTarget);
    const result = await uploadProfileImage(formData);

    if (result.success) {
      setIsSuccess(true);
      setTimeout(() => setIsSuccess(false), 3000);
    } else {
      alert("שגיאה בהעלאה: " + result.error);
    }
    setIsUploading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6" dir="rtl">
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <h1 className="text-2xl font-black text-gray-800 mb-2">הגדרות פרופיל עסק</h1>
        <p className="text-gray-500 mb-8">עדכן את פרטי העסק והלוגו שיופיעו בצ'אט ללקוחות.</p>

        <form onSubmit={handleSave} className="space-y-8">
          {/* אזור העלאת תמונה - כמו בוואטסאפ */}
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="relative group">
              <div className="w-32 h-32 rounded-full border-4 border-emerald-50 bg-gray-100 overflow-hidden flex items-center justify-center shadow-inner">
                {preview ? (
                  <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <Camera className="w-10 h-10 text-gray-300" />
                )}
              </div>
              <label htmlFor="file-upload" className="absolute bottom-0 right-0 bg-emerald-600 p-2 rounded-full text-white cursor-pointer hover:bg-emerald-700 transition-colors shadow-lg">
                <UploadCloud size={20} />
              </label>
              <input 
                id="file-upload" 
                name="file" 
                type="file" 
                accept="image/*" 
                className="hidden" 
                onChange={handleFileChange}
              />
            </div>
            <span className="text-sm font-bold text-gray-600">תמונת פרופיל (שירה קוסמטיקה)</span>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">שם העסק</label>
              <input 
                type="text" 
                defaultValue="שירה קוסמטיקה"
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">תיאור קצר ל-AI</label>
              <textarea 
                rows={3}
                placeholder="ספרי לגימני על השירותים שלך..."
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
              />
            </div>
          </div>

          <button 
            type="submit"
            disabled={isUploading}
            className={`w-full py-4 rounded-xl font-black text-white transition-all flex items-center justify-center gap-2 shadow-lg ${
              isSuccess ? 'bg-emerald-500' : 'bg-[#075e54] hover:bg-[#0c4a43]'
            }`}
          >
            {isUploading ? (
              <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : isSuccess ? (
              <><CheckCircle2 /> נשמר בהצלחה!</>
            ) : (
              <><Save /> שמור שינויים</>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
