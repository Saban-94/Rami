'use client';

import { useDocumentData } from 'react-firebase-hooks/firestore';
import { db } from '@/lib/firebase';
import { doc } from 'firebase/firestore';
import { useParams } from 'next/navigation';

export default function WhatsAppAgentPage() {
  const params = useParams();
  const trialId = params?.trialId as string;

  // התיקון הקריטי: אם trialId לא קיים, אל תיתן ל-doc() לרוץ
  // אנחנו מעבירים null או נתיב זמני כדי למנוע את השגיאה
  const docRef = trialId ? doc(db, "trials", trialId, "whatsapp_agent", "status") : null;
  
  const [statusDoc, loading, error] = useDocumentData(docRef);

  if (!trialId) return <div>שגיאה: חסר מזהה תקופת ניסיון</div>;
  if (loading) return <div>טוען חיבור לוואטסאפ...</div>;
  if (error) return <div>שגיאה בטעינת נתונים: {error.message}</div>;

  return (
    <div>
      {/* שאר הקוד של ה-QR והסטודיו */}
      {statusDoc?.qr && <QRCodeSVG value={statusDoc.qr} />}
    </div>
  );
}
