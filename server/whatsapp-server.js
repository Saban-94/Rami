const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const admin = require('firebase-admin');
const path = require('path');
const http = require('http');

// 1. אתחול Firebase Admin מתוך משתנה הסביבה (Secret)
let serviceAccount;
try {
    if (process.env.FIREBASE_SERVICE_ACCOUNT) {
        serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
    } else {
        // גיבוי למקרה שמריצים מקומית עם קובץ
        serviceAccount = require('./serviceAccountKey.json');
    }
} catch (e) {
    console.error("❌ Firebase Auth Error:", e.message);
}

if (!admin.apps.length && serviceAccount) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
}

const db = admin.firestore();
const trialId = "NhbnQKJjZCUWdtWAIdPy"; 

// 2. שרת HTTP מזויף - קריטי כדי ש-Render לא יכבה את השירות (Port Binding)
const port = process.env.PORT || 10000;
http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('SabanOS WhatsApp Server is Live\n');
}).listen(port, '0.0.0.0', () => {
    console.log(`📡 Fake web server listening on port ${port}`);
});

// 3. הגדרות WhatsApp Client עם תיקון נתיב לדפדפן ב-Render
const client = new Client({
    authStrategy: new LocalAuth({
        dataPath: path.join(__dirname, '.wwebjs_auth')
    }),
    puppeteer: {
        handleSIGINT: false,
        executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || 
                       path.join(process.cwd(), 'chrome/chrome/linux-145.0.7632.67/chrome-linux64/chrome'),
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-gpu'
        ]
    }
});

// פונקציה לעדכון הסטטוס וה"דופק" (הלב של המלשינון)
async function updateFirestoreStatus(data = {}) {
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
        console.log('📡 Pulse sent to Firestore');
    } catch (err) {
        console.error('❌ Firestore Update Error:', err.message);
    }
}

// שליחת דופק כל 20 שניות כדי שהסטודיו ידע שהשרת חי
setInterval(() => updateFirestoreStatus(), 20000);

// אירוע קבלת קוד QR
client.on('qr', (qr) => {
    console.log('🔍 New QR Code Received');
    updateFirestoreStatus({
        qr: qr,
        status: 'waiting_for_scan'
    });
});

// אירוע חיבור מוצלח
client.on('ready', () => {
    console.log('✅ WhatsApp Agent is READY!');
    updateFirestoreStatus({
        status: 'authenticated',
        qr: '' // מוחק את ה-QR אחרי שהתחברנו
    });
});

// שגיאות התחברות
client.on('auth_failure', (msg) => {
    console.error('❌ Auth failure:', msg);
    updateFirestoreStatus({ status: 'auth_error' });
});

console.log("🚀 Initializing WhatsApp Client...");
client.initialize();
