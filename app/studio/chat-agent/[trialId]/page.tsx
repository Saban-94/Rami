/* app/studio/chat-agent/[trialId]/page.tsx */
// ... (ייבוא רכיבים)
import { generateWebsiteAsset } from "../../../lib/chat-logic";

export default function NielappChatStudio() {
  // ... (States קודמים)
  const [showWebsitePreview, setShowWebsitePreview] = useState(false);

  const handleGenerateWebsite = async () => {
    const website = generateWebsiteAsset(manifest);
    await updateDoc(doc(db, "chatManifests", trialId as string), {
      "assets.website": website,
      aiConfidence: 1.0 // סיום התהליך
    });
    setShowWebsitePreview(true);
  };

  return (
    <div className="h-screen bg-[#020617] text-white flex overflow-hidden font-sans" dir="rtl">
      {/* ... Brain Console (נשאר אותו דבר) */}

      <div className="flex-1 flex flex-col items-center justify-center relative">
        <div className="w-[320px] h-[650px] bg-black rounded-[3.5rem] border-[10px] border-slate-800 shadow-2xl relative overflow-hidden flex flex-col">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-slate-800 rounded-b-3xl z-30" />
          
          {showWebsitePreview && manifest.assets?.website ? (
            <div className="flex-1 bg-white overflow-y-auto no-scrollbar">
               {/* כאן אנחנו משתמשים ב-Renderer הקיים שלך כדי להציג את האתר שנוצר */}
               <ManifestRenderer manifest={{ blocks: manifest.assets.website.blocks }} />
               <button 
                 onClick={() => setShowWebsitePreview(false)}
                 className="fixed bottom-10 left-1/2 -translate-x-1/2 bg-blue-600 text-white px-6 py-2 rounded-full font-bold shadow-xl"
               >
                 חזרה לצ'אט
               </button>
            </div>
          ) : (
            /* ... ממשק הצ'אט הקיים */
          )}
        </div>

        {/* הצגת כפתור יצירה כשהמידע מושלם */}
        {manifest.aiConfidence >= 0.8 && !showWebsitePreview && (
          <motion.button 
            initial={{ scale: 0 }} animate={{ scale: 1 }}
            onClick={handleGenerateWebsite}
            className="absolute top-10 bg-emerald-500 text-white px-8 py-4 rounded-full font-black shadow-lg shadow-emerald-500/20 flex items-center gap-2"
          >
            <Smartphone size={20}/> בנה לי את האתר עכשיו ✨
          </motion.button>
        )}
      </div>
    </div>
  );
}
