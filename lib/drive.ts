/* lib/drive.ts */
import { google } from 'googleapis';
import { getGoogleAuth } from './googleAuth';
import { Readable } from 'stream';

/**
 * יוצר מבנה תיקיות: SabanOS_Warehouse -> [AppName]_[ID]
 */
export async function createBusinessStorage(businessName: string, trialId: string) {
  const auth = getGoogleAuth(['https://www.googleapis.com/auth/drive.file']);
  const drive = google.drive({ version: 'v3', auth });

  const parentFolderId = process.env.NEXT_PUBLIC_DRIVE_FOLDER_ID; // התיקייה הראשית שלך

  const fileMetadata = {
    name: `${businessName}_${trialId}`,
    mimeType: 'application/vnd.google-apps.folder',
    parents: parentFolderId ? [parentFolderId] : []
  };

  const folder = await drive.files.create({
    requestBody: fileMetadata,
    fields: 'id',
  });

  return folder.data.id; // זה ה-ID שנשמור ב-Manifest תחת driveFolderId
}

/**
 * מעלה לוגו לתיקייה הספציפית של העסק
 */
export async function uploadLogoToFolder(folderId: string, fileBuffer: Buffer, fileName: string) {
  const auth = getGoogleAuth(['https://www.googleapis.com/auth/drive.file']);
  const drive = google.drive({ version: 'v3', auth });

  const bufferStream = new Readable();
  bufferStream.push(fileBuffer);
  bufferStream.push(null);

  const res = await drive.files.create({
    requestBody: {
      name: `LOGO_${fileName}`,
      parents: [folderId],
    },
    media: {
      mimeType: 'image/png',
      body: bufferStream,
    },
    fields: 'id, webViewLink',
  });

  // הפיכת הקובץ לציבורי לקריאה (כדי שיוצג באפליקציה)
  await drive.permissions.create({
    fileId: res.data.id!,
    requestBody: { role: 'reader', type: 'anyone' },
  });

  return res.data.webViewLink;
}
