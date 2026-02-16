const { default: makeWASocket, useMultiFileAuthState, DisconnectReason } = require('@whiskeysockets/baileys');
const admin = require('firebase-admin');
const pino = require('pino');

// התחברות ל-Firebase עם הקובץ שיצרנו
const serviceAccount = require('./serviceAccountKey.json');

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
}
const db = admin.firestore();

async function startWhatsAppAgent(trialId) {
    // יצירת תיקיית סשן לשמירת החיבור
    const { state, saveCreds } = await useMultiFileAuthState(`./server/auth_sessions/${trialId}`);

    const sock = makeWASocket({
        auth: state,
        logger: pino({ level: 'silent' }),
        printQRInTerminal: true // לדיבאג ראשוני
    });

    sock.ev.on('connection.update', async (update) => {
        const { connection, lastDisconnect, qr } = update;

        if (qr) {
            // עדכון ה-QR האמיתי ב-DB לסריקה בסטודיו
            console.log(`[${trialId}] QR Code Updated - Waiting for scan...`);
            await db.doc(`trials/${trialId}/whatsapp_agent/status`).set({
                qr: qr,
                connected: false,
                lastUpdate: admin.firestore.FieldValue.serverTimestamp()
            }, { merge: true });
        }

        if (connection === 'open') {
            console.log(`[${trialId}] ✅ Connected Successfully!`);
            await db.doc(`trials/${trialId}/whatsapp_agent/status`).set({
                connected: true,
                qr: null, // מנקים את ה-QR אחרי חיבור
                lastUpdate: admin.firestore.FieldValue.serverTimestamp()
            }, { merge: true });
        }

        if (connection === 'close') {
            const shouldReconnect = lastDisconnect.error?.output?.statusCode !== DisconnectReason.loggedOut;
            if (shouldReconnect) {
                console.log('Reconnecting...');
                startWhatsAppAgent(trialId);
            }
        }
    });

    sock.ev.on('creds.update', saveCreds);

    // לוגיקה בסיסית של AI למענה (דוגמה)
    sock.ev.on('messages.upsert', async ({ messages }) => {
        const msg = messages[0];
        if (!msg.key.fromMe && msg.message) {
            const remoteJid = msg.key.remoteJid;
            const text = msg.message.conversation || msg.message.extendedTextMessage?.text;
            
            console.log(`Incoming message from ${remoteJid}: ${text}`);
            // כאן נשלב את הקריאה ל-Gemini API בהמשך
        }
    });
}

// הפעלה (תוכל להריץ בלופ על רשימת Trial IDs מה-DB)
startWhatsAppAgent('YOUR_TRIAL_ID_HERE');
