/* בתוך קומפוננטת BrainConsole */
import { FileText, ExternalLink, Image as ImageIcon, Paperclip } from 'lucide-react';

function BrainConsole({ manifest, proposal, approve, reject }: any) {
  const [viewMode, setViewMode] = useState<'visual' | 'raw'>('visual');

  // סינון הקבצים מתוך היסטוריית הלמידה
  const uploadedFiles = manifest.trainingHistory?.filter((item: any) => item.fileLink) || [];

  return (
    <div className="h-full flex flex-col bg-[#020617] text-white">
      {/* Header נשאר אותו דבר */}
      <div className="p-6 border-b border-white/10 flex items-center justify-between sticky top-0 bg-[#020617] z-10">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-600 rounded-lg shadow-lg shadow-blue-500/20"><LayoutDashboard size={18} /></div>
          <h2 className="font-black text-[11px] uppercase tracking-[0.2em]">Medical Intel</h2>
        </div>
        <div className="flex bg-white/5 p-1 rounded-xl border border-white/10">
          <button onClick={() => setViewMode('visual')} className={`p-2 px-4 rounded-lg text-[10px] font-bold transition-all ${viewMode === 'visual' ? 'bg-blue-600 text-white' : 'text-slate-400'}`}>DASHBOARD</button>
          <button onClick={() => setViewMode('raw')} className={`p-2 px-4 rounded-lg text-[10px] font-bold transition-all ${viewMode === 'raw' ? 'bg-blue-600 text-white' : 'text-slate-400'}`}>JSON</button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
        {viewMode === 'raw' ? (
          <pre className="p-4 bg-black/40 rounded-[2rem] text-[10px] text-blue-300 font-mono overflow-auto border border-white/5 shadow-inner">
            {JSON.stringify(manifest, null, 2)}
          </pre>
        ) : (
          <div className="space-y-8">
            
            {/* 1. AI PROPOSALS (Upsell/Fixes) */}
            <AnimatePresence>
              {proposal && (
                <motion.div initial={{scale:0.9, opacity:0}} animate={{scale:1, opacity:1}} className="p-6 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[2.5rem] border border-white/20 shadow-2xl">
                  <div className="flex items-center gap-2 mb-3 text-white/70 text-[10px] font-black uppercase tracking-widest">
                    <Sparkles size={14} className="animate-pulse" /> AI Insight
                  </div>
                  <p className="text-sm font-bold text-white mb-6 leading-relaxed">{proposal.rationale}</p>
                  <div className="flex gap-2">
                    <button onClick={approve} className="flex-1 bg-white text-blue-700 py-4 rounded-2xl font-black text-[10px] uppercase shadow-lg active:scale-95 transition-all">Approve Patch</button>
                    <button onClick={reject} className="p-4 bg-black/20 text-white rounded-2xl hover:bg-black/30 transition-all"><X size={16}/></button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* 2. גלריית קבצים רפואיים (Drive Integration) */}
            <div className="space-y-4">
              <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2">
                <Paperclip size={12} className="text-blue-500" /> קבצים וצילומים (Google Drive)
              </h4>
              <div className="grid grid-cols-1 gap-3">
                {uploadedFiles.length > 0 ? (
                  uploadedFiles.map((file: any, i: number) => (
                    <a 
                      key={i} 
                      href={file.fileLink} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="group p-4 bg-white/5 border border-white/5 rounded-3xl flex items-center justify-between hover:bg-white/10 hover:border-blue-500/30 transition-all shadow-sm"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-3 bg-blue-500/10 rounded-2xl text-blue-400 group-hover:scale-110 transition-transform">
                          {file.text.includes('png') || file.text.includes('jpg') ? <ImageIcon size={18} /> : <FileText size={18} />}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-xs font-bold text-slate-200 truncate max-w-[150px]">{file.text.replace('📁 קובץ חדש הועלה: ', '')}</span>
                          <span className="text-[10px] text-slate-500 font-medium">{file.date}</span>
                        </div>
                      </div>
                      <ExternalLink size={14} className="text-slate-600 group-hover:text-blue-400 transition-colors" />
                    </a>
                  ))
                ) : (
                  <div className="p-8 border-2 border-dashed border-white/5 rounded-[2.5rem] text-center">
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">אין קבצים בתיקייה עדיין</p>
                  </div>
                )}
              </div>
            </div>

            {/* 3. רשימת לקוחות */}
            <div className="space-y-4">
               <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2"><User size={12} className="text-blue-500" /> מטופלים אחרונים</h4>
               <div className="space-y-2">
                 {manifest.customers?.map((c: any, i: number) => (
                   <div key={i} className="flex items-center justify-between p-4 bg-white/5 border border-white/5 rounded-3xl hover:bg-white/10 transition-all">
                     <div className="flex flex-col">
                        <span className="text-[11px] font-bold text-white">{c.name}</span>
                        <span className="text-[10px] text-slate-500 font-mono">{c.phone}</span>
                     </div>
                     <div className="w-2 h-2 bg-emerald-500 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                   </div>
                 ))}
               </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}
