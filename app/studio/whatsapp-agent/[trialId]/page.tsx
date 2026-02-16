'use client';

import { QRCodeSVG } from 'qrcode.react';
import { useDocumentData } from 'react-firebase-hooks/firestore';
import { db } from '@/lib/firebase';
import { doc } from 'firebase/firestore';

export default function QRScanner({ trialId }: { trialId: string }) {
  const [statusDoc, loading] = useDocumentData(
    doc(db, "trials", trialId, "whatsapp_agent", "status")
  );

  if (loading) return <div className="animate-pulse">Loading connection...</div>;

  return (
    <div className="p-10 bg-white rounded-[3rem] shadow-2xl flex flex-col items-center">
      {statusDoc?.connected ? (
        <div className="text-green-600 font-black italic text-center text-2xl">
          ✅ מחובר בהצלחה!
        </div>
      ) : statusDoc?.qr ? (
        <>
          <h3 className="text-black font-black mb-6 uppercase tracking-tighter italic">Scan to Connect Agent</h3>
          <div className="border-8 border-slate-100 p-4 rounded-3xl">
            <QRCodeSVG value={statusDoc.qr} size={250} level="H" />
          </div>
          <p className="mt-6 text-[10px] text-slate-400 font-bold italic animate-pulse">
            Waiting for WhatsApp Scan...
          </p>
        </>
      ) : (
        <div className="text-slate-400 italic">מייצר קוד QR חדש...</div>
      )}
    </div>
  );
}
