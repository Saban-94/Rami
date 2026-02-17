const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const admin = require('firebase-admin');
const path = require('path');
const http = require('http');

// 1. אתחול Firebase Admin מתוך ה-Secrets של Replit
let serviceAccount;
try {
    if (process.env.FIREBASE_SERVICE_ACCOUNT) {
        serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
    } else {
        // למקרה שאתה מריץ מקומית
        serviceAccount = require('./serviceAccountKey.json');
    }
} catch (e) {
    console.error("❌ Firebase Auth Error: Make sure FIREBASE_SERVICE_ACCOUNT is set in Secrets");
}

if (!admin.apps.length && serviceAccount) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
}

const db = admin.firestore();
const trialId = "NhbnQKJjZCUWdtWAIdPy"; 

// 2. שרת HTTP פשוט - Replit משתמש בזה כדי לזהות שהאפליקציה פעילה
const port = process.env.PORT || 3000;
http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('SabanOS WhatsApp Server is Online on Replit\n');
}).listen(port, '0.0.0.0', () => {
    console.log(`📡 Replit Web View active on port ${port}`);
});

// 3. הגדרות WhatsApp Client מותאמות ל-Replit
const client = new Client({
    authStrategy: new LocalAuth({
        // שמירת הסשן בתיקייה מקומית בתוך ה-Repl
        dataPath: path.join(__dirname, '.wwebjs_auth')
    }),
    puppeteer: {
        handleSIGINT: false,
        // ב-Replit לא מגדירים executablePath ידני, הוא מזהה לבד
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-gpu',
            '--single-process' // חוסך זיכרון קריטי לסריקה
        ]
    }
});

// פונקציה לעדכון הסטטוס ב-Firestore (ה"דופק")
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
        console.error('❌ Firestore Error:', err.message);
    }
}

// דופק כל 20 שניות
setInterval(() => updateFirestoreStatus(), 20000);

// אירוע QR
client.on('qr', (qr) => {
    console.log('🔍 QR Code Generated - Scan it in your Studio');
    // מדפיס גם לטרמינל ליתר ביטחון
    qrcode.generate(qr, { small: true });
    updateFirestoreStatus({ qr: qr, status: 'waiting_for_scan' });
});

// אירוע חיבור
client.on('ready', () => {
    console.log('✅ WhatsApp Client is READY on Replit!');
    updateFirestoreStatus({ status: 'authenticated', qr: '' });
});

console.log("🚀 Initializing WhatsApp Client...");
// --- כאן מתחיל הכיף: הבוט מקשיב להודעות ---
client.on('message', async (msg) => {
    const chat = await msg.getChat();
    const user = msg.from;
    const text = msg.body.toLowerCase();

    console.log(`📩 הודעה חדשה מ-${user}: ${text}`);

    // דוגמה לבוט פשוט: מגיב למילת מפתח
    if (text === 'שלום' || text === 'היי') {
        await client.sendMessage(user, 'היי! ברוך הבא ל-SabanOS. איך אני יכול לעזור לך היום? 🎨');
    }

    // בוט "מידע"
    if (text === 'שעות' || text === 'שעות פעילות') {
        await client.sendMessage(user, 'אנחנו פתוחים בימים א-ה בין 09:00 ל-18:00. נשמח לראותך!');
    }
});
client.initialize();
