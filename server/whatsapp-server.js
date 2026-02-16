// פונקציה לשליחת התראה ל-Studio (ניתן לממש עם OneSignal או פשוט עדכון שדה ב-Trial)
async function notifyStudio(trialId, customerName) {
    await db.doc(`trials/${trialId}`).update({
        lastActivity: {
            type: 'NEW_CUSTOMER',
            name: customerName,
            time: admin.firestore.FieldValue.serverTimestamp()
        }
    });
}

// לוגיקה משולבת: יצירה, שמירה ומענה
async function handleIncomingMessage(trialId, msg, sock) {
    const phone = msg.key.remoteJid.replace('@s.whatsapp.net', '');
    const messageContent = msg.message.conversation || msg.message.extendedTextMessage?.text || "";
    const customerName = msg.pushName || "לקוח חדש";

    const customerRef = db.collection('trials').doc(trialId).collection('customers').doc(phone);
    const doc = await customerRef.get();

    if (!doc.exists) {
        // 1. יצירה אוטומטית במאגר
        await customerRef.set({
            name: customerName,
            phone: phone,
            status: "active",
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            lastMessage: messageContent,
            source: "WhatsApp Agent"
        });

        // 2. שליחת התראה לסטודיו
        await notifyStudio(trialId, customerName);

        // 3. הודעת ברוך הבא אוטומטית מהסוכן
        await sock.sendMessage(msg.key.remoteJid, { 
            text: `שלום ${customerName}, הגעת ל-${trialId}. תודה על פנייתך! הסוכן החכם שלנו בודק את הפרטים ויחזור אליך מיד. ✅` 
        });
    } else {
        // עדכון היסטוריה ללקוח קיים
        await customerRef.update({
            lastMessage: messageContent,
            lastSeen: admin.firestore.FieldValue.serverTimestamp()
        });
    }
}

// הפעלה בתוך המאזין של Baileys
sock.ev.on('messages.upsert', async ({ messages }) => {
    const msg = messages[0];
    if (!msg.key.fromMe && msg.message) {
        await handleIncomingMessage('יוסי-הספר-qgcym', msg, sock);
    }
});
