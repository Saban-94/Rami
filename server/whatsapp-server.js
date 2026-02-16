const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const admin = require('firebase-admin');
const path = require('path');

// 1. אתחול Firebase Admin (וודא שהקובץ serviceAccountKey.json נמצא בתיקייה)
const serviceAccount = require('./serviceAccountKey.json');

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
}

const db = admin.firestore();

// מזהה ה-Trial (במציאות כדאי להעביר את זה כארגומנט או משתנה סביבה)
// כרגע מוגדר לפי ה-ID שמופיע בכתובת שלך
const trialId = "NhbnQKJjZCUWdtWAIdPy"; 

console.log(`🚀 Starting SabanOS WhatsApp Server for Trial: ${trialId}`);

const client = new Client({
    authStrategy: new LocalAuth({
        dataPath: path.join(__dirname, '.wwebjs_auth')
    }),
    puppeteer: {
        handleSIGINT: false,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    }
});

// פונקציית עזר לעדכון הסטטוס ב-Firestore (הלב של המלשינון)
async function updateFirestoreStatus(data) {
    try {
        await db.collection('trials')
            .doc(trialId)
            .collection('whatsapp_agent')
            .doc('status')
            .set({
                ...data,
                lastServerPulse: admin.firestore.FieldValue.serverTimestamp(),
                updatedAt: admin.firestore.FieldValue.serverTimestamp()
            }, { merge: true });
        console.log('📡 Firestore Sync:', data.status || 'Pulse Updated');
    } catch (err) {
        console.error('❌ Firestore Update Error:', err);
    }
}

// מנגנון Heartbeat - שולח "דופק" כל 30 שניות כדי שהסטודיו ידע שהשרת חי
setInterval(() => {
    updateFirestoreStatus({}); 
}, 30000);

// --- אירועי הלקוח ---

client.on('qr', (qr) => {
    console.log('🔍 New QR Received!');
    qrcode.generate(qr, { small: true }); // מציג גם בטרמינל
    
    // עדכון ה-QR ל-Firestore כדי שהסטודיו יציג אותו
    updateFirestoreStatus({
        qr: qr,
        status: 'waiting_for_scan'
    });
});

client.on('ready', () => {
    console.log('✅ WhatsApp Client is READY!');
    updateFirestoreStatus({
        status: 'authenticated',
        qr: '', // מוחק את ה-QR כי כבר התחברנו
        lastLogin: admin.firestore.FieldValue.serverTimestamp()
    });
});

client.on('authenticated', () => {
    console.log('🔓 Authenticated successfully');
});

client.on('auth_failure', (msg) => {
    console.error('❌ Authentication failure:', msg);
    updateFirestoreStatus({ status: 'auth_error', message: msg });
});

client.on('disconnected', (reason) => {
    console.log('🔌 Client was logged out:', reason);
    updateFirestoreStatus({ status: 'disconnected', qr: '' });
});

// טיפול בהודעות נכנסות (דוגמה בסיסית לשילוב AI בעתיד)
client.on('message', async (msg) => {
    if (msg.body.toLowerCase() === 'פינג') {
        msg.reply('פונג! SabanOS פועל.');
    }
});

// הפעלה
client.initialize();

// טיפול בסגירה מסודרת
process.on('SIGINT', async () => {
    console.log('Shutting down...');
    await client.destroy();
    process.exit(0);
});
