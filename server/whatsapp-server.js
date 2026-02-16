// פונקציה ליצירת לקוח חדש או עדכון קיים באופן אוטומטי
async function autoUpdateCustomer(trialId, msg) {
    const phone = msg.key.remoteJid.replace('@s.whatsapp.net', '');
    const messageContent = msg.message.conversation || msg.message.extendedTextMessage?.text || "";

    // מיקום ב-Database: trials -> {trialId} -> customers -> {phone}
    const customerRef = db
        .collection('trials')
        .doc(trialId)
        .collection('customers')
        .doc(phone);

    try {
        const doc = await customerRef.get();

        if (!doc.exists) {
            // ✨ יצירת לקוח חדש אוטומטית (Collection ייוצר מעצמו)
            console.log(`🌟 Creating new customer document for: ${phone}`);
            await customerRef.set({
                phone: phone,
                name: "לקוח חדש (WhatsApp)", // ניתן לחלץ את השם מהפרופיל אם קיים
                source: "whatsapp_bot",
                status: "active",
                createdAt: admin.firestore.FieldValue.serverTimestamp(),
                lastMessage: messageContent,
                messagesCount: 1
            });
        } else {
            // 🔄 עדכון לקוח קיים
            console.log(`📝 Updating existing customer: ${phone}`);
            await customerRef.update({
                lastMessage: messageContent,
                lastContact: admin.firestore.FieldValue.serverTimestamp(),
                messagesCount: admin.firestore.FieldValue.increment(1)
            });
        }

        // שמירת ההודעה בהיסטוריית ההודעות (Sub-collection נוסף)
        await customerRef.collection('chat_history').add({
            text: messageContent,
            role: "user",
            timestamp: admin.firestore.FieldValue.serverTimestamp()
        });

    } catch (error) {
        console.error("Error in auto-sync to Firestore:", error);
    }
}

// שילוב בתוך מאזין ההודעות של השרת
sock.ev.on('messages.upsert', async ({ messages }) => {
    const msg = messages[0];
    if (!msg.key.fromMe && msg.message) {
        // קריאה לפונקציית היצירה האוטומטית
        await autoUpdateCustomer('יוסי-הספר-qgcym', msg);
    }
});
