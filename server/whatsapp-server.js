const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const admin = require('firebase-admin');
const path = require('path');
const http = require('http'); // הכרזה אחת בלבד על http

// 1. אתחול Firebase
let serviceAccount;
try {
    if (process.env.FIREBASE_SERVICE_ACCOUNT) {
        serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
    } else {
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

// 2. שרת HTTP מזויף כדי ש-Render לא יכבה את השירות
const port = process.env.PORT || 3000;
http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('SabanOS WhatsApp Server is Online\n');
}).listen(port, '0.0.0.0', () => {
    console.log(`📡 Fake server listening on port ${port}`);
});

// 3. הגדרות WhatsApp
const client = new Client({
    authStrategy: new LocalAuth({
        dataPath: path.join(__dirname, '.wwebjs_auth')
    }),
puppeteer: {
        handleSIGINT: false,
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-gpu'
        ]
    }
});

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

// דופק כל 30 שניות
setInterval(() => updateFirestoreStatus(), 30000);

client.on('qr', (qr) => {
    console.log('🔍 QR Code Generated');
    updateFirestoreStatus({ qr: qr, status: 'waiting_for_scan' });
});

client.on('ready', () => {
    console.log('✅ Client is ready!');
    updateFirestoreStatus({ status: 'authenticated', qr: '' });
});

console.log("🚀 Initializing WhatsApp Client...");
client.initialize();
