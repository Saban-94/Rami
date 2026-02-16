const { default: makeWASocket, useMultiFileAuthState, DisconnectReason } = require('@whiskeysockets/baileys');
const admin = require('firebase-admin');

// 1. התחברות ל-Firebase Admin
const serviceAccount = require('./serviceAccountKey.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});
const db = admin.firestore();

async function startAgent(trialId) {
  // ניהול סשן - שומר את החיבור גם אם השרת קורס
  const { state, saveCreds } = await useMultiFileAuthState(`auth_info_${trialId}`);

  const sock = makeWASocket({
    auth: state,
    printQRInTerminal: true // לדיבאג בשרת
  });

  // האזנה לאירועי חיבור
  sock.ev.on('connection.update', async (update) => {
    const { connection, lastDisconnect, qr } = update;

    if (qr) {
      // ✅ ה-QR האמיתי! אנחנו מעדכנים אותו ב-Firebase כדי שראמי יראה אותו בסטודיו
      console.log('New QR Received for:', trialId);
      await db.doc(`trials/${trialId}/whatsapp_agent/status`).set({
        qr: qr,
        connected: false,
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      }, { merge: true });
    }

    if (connection === 'open') {
      console.log('✅ Agent Connected Successfully!');
      await db.doc(`trials/${trialId}/whatsapp_agent/status`).set({
        connected: true,
        qr: null // מסירים את ה-QR כי כבר התחברנו
      }, { merge: true });
    }

    if (connection === 'close') {
      const shouldReconnect = lastDisconnect.error?.output?.statusCode !== DisconnectReason.loggedOut;
      if (shouldReconnect) startAgent(trialId);
    }
  });

  // האזנה להודעות נכנסות - כאן נכנס ה-AI (Gemini)
  sock.ev.on('messages.upsert', async ({ messages }) => {
    const msg = messages[0];
    if (!msg.key.fromMe && msg.message) {
       const incomingText = msg.message.conversation || msg.message.extendedTextMessage?.text;
       console.log(`Message from ${msg.key.remoteJid}: ${incomingText}`);
       
       // כאן אתה מחבר את הפונקציה של Gemini שכתבנו קודם:
       // 1. שולף את ה-Prompt מה-DB
       // 2. שולח ל-Gemini
       // 3. מחזיר תשובה ללקוח דרך sock.sendMessage
    }
  });

  sock.ev.on('creds.update', saveCreds);
}

// הפעלה עבור trial ספציפי (במערכת מלאה זה ירוץ בלופ על כל ה-Trials הפעילים)
startAgent('YOUR_TRIAL_ID');
