'use server';
import { db } from "@/lib/firebase-admin";

export async function initWhatsAppStatus(trialId: string) {
  try {
    const statusRef = db.collection('trials').doc(trialId).collection('whatsapp_agent').doc('status');
    const doc = await statusRef.get();
    
    if (!doc.exists) {
      await statusRef.set({
        status: 'initializing',
        createdAt: new Date().toISOString(),
        qr: ''
      });
      return { success: true };
    }
    return { success: false, message: 'Exists' };
  } catch (e) {
    console.error(e);
    return { success: false };
  }
}
