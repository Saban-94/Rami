const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const admin = require('firebase-admin');
const path = require('path');

// 1. אתחול Firebase Admin
// וודא שהקובץ serviceAccountKey.json נמצא פיזית בתיקיית server/
const serviceAccount = require('./serviceAccountKey.json');

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
}

const db = admin.firestore();

// מזהה ה-Trial שאליו השרת יתחבר
const trialId = "NhbnQKJjZCUWdtWAIdPy"; 

console.log(`🚀 SabanOS WhatsApp Server starting for Trial: ${trialId}`);

const client = new Client({
    authStrategy: new LocalAuth({
        dataPath: path.join(__dirname, '.wwebjs_auth')
    }),
    puppeteer: {
        handleSIGINT: false,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    }
});

// פונקציית עזר לעדכון הסטטוס והדופק (הלב של המלשינון)
async function updateFirestoreStatus(data = {}) {
    try {
        await db.collection('trials')
            .doc(trialId)
            .collection('whatsapp_agent')
            .doc('status')
            .set({
                ...data,
                lastServerPulse: admin.firestore.FieldValue.serverTimestamp(), // שולח דופק
                updatedAt: admin.firestore.FieldValue.serverTimestamp()
            }, { merge: true });
        console.log('📡 Pulse sent to Firestore');
    } catch (err) {
        console.error('❌ Firestore Update Error:', err.message);
    }
}

// מנגנון "דופק" - שולח עדכון כל 20 שניות כדי שהסטודיו ידע שהשרת חי
setInterval(() => {
    updateFirestoreStatus(); 
}, 20000);

// --- אירועי WhatsApp ---

client.on('qr', (qr) => {
    console.log('🔍 New QR Code generated!');
    qrcode.generate(qr, { small: true }); // מציג בטרמינל
    
    // מעדכן את ה-QR ל-Firestore כדי שהסטודיו יציג אותו
    updateFirestoreStatus({
        qr: qr,
        status: 'waiting_for_scan'
    });
});

client.on('ready', () => {
    console.log('✅ WhatsApp Client is READY!');
    updateFirestoreStatus({
        status: 'authenticated',
        qr: '' // מוחק את ה-QR כי כבר התחברנו
    });
});

client.on('auth_failure', (msg) => {
    console.error('❌ Authentication failure:', msg);
    updateFirestoreStatus({ status: 'error', message: msg });
});

client.on('disconnected', (reason) => {
    console.log('🔌 Disconnected:', reason);
    updateFirestoreStatus({ status: 'disconnected' });
});

// הפעלה
client.initialize();

// טיפול בסגירה
process.on('SIGINT', async () => {
    console.log('Shutting down server...');
    await client.destroy();
    process.exit(0);
});
