/* app/studio/chat-agent/[trialId]/page.tsx (חלק ה-Console) */

// ... (שאר ה-Imports נשארים אותו דבר)

export default function BrainConsole({ manifest }: { manifest: any }) {
  const [viewMode, setViewMode] = useState<'visual' | 'raw'>('visual');
  const [themeMode, setThemeMode] = useState<'dark' | 'light'>('dark');
  const [expandedSection, setExpandedSection] = useState<string | null>('context');

  // הגנה ראשונה: אם אין מניפסט, נציג מצב טעינה קטן במקום לקרוס
  if (!manifest) {
    return <div className="p-8 text-blue-500 animate-pulse font-bold">טוען נתוני מוח...</div>;
  }

  const formatDate = (ts: any) => {
    if (!ts) return "--";
    try {
      const date = ts.seconds ? new Date(ts.seconds * 1000) : new Date(ts);
      return date.toLocaleDateString('he-IL') + " " + date.toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' });
    } catch (e) {
      return "--";
    }
  };

  const toggleSection = (id: string) => setExpandedSection(expandedSection === id ? null : id);

  return (
    <div className={`w-full h-full flex flex-col transition-colors duration-500 ${themeMode === 'dark' ? 'bg-[#020617] text-white' : 'bg-slate-50 text-slate-900'}`}>
      
      {/* Header */}
      <div className="p-6 border-b border-white/10 flex items-center justify-between backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-600 rounded-lg shadow-lg">
            <LayoutDashboard size={20} className="text-white" />
          </div>
          <h2 className="font-black text-sm uppercase tracking-widest">Nielapp Intelligence</h2>
        </div>
        
        <div className="flex bg-white/5 p-1 rounded-xl border border-white/10">
          <button onClick={() => setThemeMode('light')} className={`p-2 rounded-lg transition-all ${themeMode === 'light' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-400'}`}><Sun size={16}/></button>
          <button onClick={() => setThemeMode('dark')} className={`p-2 rounded-lg transition-all ${themeMode === 'dark' ? 'bg-blue-600 text-white' : 'text-slate-400'}`}><Moon size={16}/></button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex p-4 gap-2">
        <button onClick={() => setViewMode('visual')} className={`flex-1 py-2 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${viewMode === 'visual' ? 'bg-blue-600 text-white' : 'bg-white/5 text-slate-400'}`}>
          <Database size={14}/> תובנות עסק
        </button>
        <button onClick={() => setViewMode('raw')} className={`flex-1 py-2 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${viewMode === 'raw' ? 'bg-blue-600 text-white' : 'bg-white/5 text-slate-400'}`}>
          <Eye size={14}/> JSON
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
        {viewMode === 'raw' ? (
          <div className="p-4 bg-black/40 rounded-3xl border border-white/5 font-mono text-[11px] text-blue-300 leading-relaxed">
            <pre>{JSON.stringify(manifest, null, 2)}</pre>
          </div>
        ) : (
          <div className="space-y-4">
            
            {/* כרטיסיית לקוחות - עם בדיקת קיום (Null Check) */}
            <Section title="לקוחות פעילים" id="customers" icon={<User size={16}/>} current={expandedSection} onToggle={toggleSection}>
              <div className="overflow-hidden rounded-2xl border border-white/5 bg-white/5">
                <table className="w-full text-right text-xs">
                  <thead className="bg-white/5 text-slate-400 font-bold">
                    <tr>
                      <th className="p-3">שם</th>
                      <th className="p-3">טלפון</th>
                      <th className="p-3">שירות</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {/* כאן התיקון הקריטי: שימוש ב-?. ובמערך ריק כברירת מחדל */}
                    {manifest?.customers?.length > 0 ? (
                      manifest.customers.map((c: any, i: number) => (
                        <tr key={c.id || i} className="hover:bg-white/5 transition-colors">
                          <td className="p-3 font-bold">{c.name || "ללא שם"}</td>
                          <td className="p-3 text-slate-400">{c.phone || "--"}</td>
                          <td className="p-3"><span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded-md">{c.service || "כללי"}</span></td>
                        </tr>
                      ))
                    ) : (
                      <tr><td colSpan={3} className="p-6 text-center text-slate-500 italic">אין לקוחות רשומים כרגע</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </Section>

            {/* כרטיסיית ידע - עם בדיקת קיום */}
            <Section title="ידע שנלמד" id="context" icon={<Clock size={16}/>} current={expandedSection} onToggle={toggleSection}>
              <div className="space-y-2">
                {manifest?.trainingHistory?.length > 0 ? (
                  manifest.trainingHistory.map((item: any, i: number) => (
                    <div key={i} className="p-3 bg-white/5 rounded-2xl border border-white/5 flex flex-col gap-1">
                      <span className="text-[10px] text-blue-400 font-bold">{item.date}</span>
                      <p className="text-sm font-medium">{item.text}</p>
                    </div>
                  ))
                ) : (
                  <p className="p-4 text-xs text-slate-500 italic">לא נאסף ידע עדיין</p>
                )}
              </div>
            </Section>

            {/* כרטיסיית עיצוב */}
            <Section title="עיצוב" id="theme" icon={<Palette size={16}/>} current={expandedSection} onToggle={toggleSection}>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-white/5 rounded-2xl border border-white/5">
                  <span className="text-[10px] text-slate-500 uppercase block mb-1">צבע ראשי</span>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full border border-white/10" style={{backgroundColor: manifest?.appConfig?.theme?.primaryColor || '#3b82f6'}} />
                    <span className="text-xs font-mono">{manifest?.appConfig?.theme?.primaryColor || '#3b82f6'}</span>
                  </div>
                </div>
              </div>
            </Section>
          </div>
        )}
      </div>
      
      <div className="p-4 border-t border-white/10 flex items-center justify-between text-[10px] font-bold text-slate-500">
        <span>עודכן: {formatDate(manifest?.lastUpdate)}</span>
        <span className="text-emerald-500 uppercase">System Active</span>
      </div>
    </div>
  );
}

// ... (קומפוננטת Section נשארת אותו דבר)
