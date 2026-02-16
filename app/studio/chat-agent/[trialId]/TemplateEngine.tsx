/* app/studio/chat-agent/[trialId]/TemplateEngine.tsx */
"use client";

import React, { useState } from 'react';
import { Sparkles, Phone, MapPin, Calendar, CheckCircle2, MessageSquare, UploadCloud, FileCheck } from 'lucide-react';
import { uploadToDriveAction } from "@/app/actions/drive-actions";

export default function TemplateEngine({ manifest, trialId }: { manifest: any, trialId: string }) {
  const [uploading, setUploading] = useState(false);
  const [uploaded, setUploaded] = useState(false);

  if (!manifest) return null;

  const theme = manifest.appConfig?.theme || {};
  const primaryColor = theme.primaryColor || "#3b82f6";
  const folderId = manifest.driveFolderId || "";

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0] || !folderId) return;
    
    setUploading(true);
    const formData = new FormData();
    formData.append("file", e.target.files[0]);
    formData.append("folderId", folderId);
    formData.append("trialId", trialId);

    const res = await uploadToDriveAction(formData);
    setUploading(false);
    if (res.success) setUploaded(true);
  };

  return (
    <div className="flex-1 bg-white overflow-y-auto flex flex-col h-full" style={{ fontFamily: 'Inter, sans-serif' }}>
      
      {/* Hero Section */}
      <section className="p-8 pt-10 text-center">
        <div style={{ backgroundColor: `${primaryColor}15`, color: primaryColor }} className="w-16 h-16 rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-sm">
          <Sparkles size={32} />
        </div>
        <h1 className="text-2xl font-black text-slate-900 mb-2">{manifest.businessName}</h1>
        <p className="text-slate-500 text-xs mb-6 px-4">{manifest.appConfig?.blocks?.[0]?.subtitle}</p>
      </section>

      {/* Upload Block - המנוע החדש */}
      <section className="px-6 mb-6">
        <div className="p-6 bg-slate-50 rounded-[2rem] border-2 border-dashed border-slate-200 text-center transition-all">
          {uploaded ? (
            <div className="flex flex-col items-center gap-2 text-emerald-600">
              <FileCheck size={32} />
              <span className="text-[10px] font-black uppercase tracking-widest">הקובץ נשמר בתיק הרפואי</span>
            </div>
          ) : (
            <>
              <UploadCloud size={32} className="mx-auto mb-3 text-slate-400" />
              <h4 className="text-xs font-bold text-slate-700 mb-4">צילומים או מסמכים רפואיים</h4>
              <input type="file" id="simulator-upload" hidden onChange={handleFileUpload} disabled={uploading} />
              <label 
                htmlFor="simulator-upload"
                style={{ backgroundColor: uploading ? '#94a3b8' : primaryColor }}
                className="px-6 py-3 text-white rounded-xl text-[10px] font-black uppercase tracking-widest cursor-pointer shadow-lg inline-block"
              >
                {uploading ? "מעלה לדרייב..." : "העלאת קובץ"}
              </label>
            </>
          )}
        </div>
      </section>

      {/* Services List */}
      <section className="px-6 flex-1">
        <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
          <CheckCircle2 size={12} style={{ color: primaryColor }} /> שירותים נבחרים
        </h2>
        <div className="space-y-2">
          {manifest.trainingHistory?.slice(-3).map((item: any, i: number) => (
            <div key={i} className="p-4 bg-white border border-slate-100 rounded-2xl flex items-center justify-between shadow-sm">
              <span className="text-[11px] font-bold text-slate-600">{item.text.substring(0,25)}</span>
              <Calendar size={14} style={{ color: primaryColor }} />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
