"use server";

import { google } from 'googleapis';
import { Readable } from 'stream';

const FOLDER_ID = '12Hnqog3tV83PGGXzQpg6xsnVEQu3RKOw';

// הגדרת הזדהות (דורש קובץ Credentials מ-Google Cloud Console)
const auth = new google.auth.GoogleAuth({
  credentials: JSON.parse(process.env.GOOGLE_DRIVE_CREDENTIALS!),
  scopes: ['https://www.googleapis.com/auth/drive.file'],
});

const drive = google.drive({ version: 'v3', auth });

export async function uploadProfileImage(formData: FormData) {
  try {
    const file = formData.get('file') as File;
    if (!file) throw new Error("No file uploaded");

    const buffer = Buffer.from(await file.arrayBuffer());
    const stream = new Readable();
    stream.push(buffer);
    stream.push(null);

    const response = await drive.files.create({
      requestBody: {
        name: `profile_${Date.now()}.jpg`,
        parents: [FOLDER_ID],
      },
      media: {
        mimeType: file.type,
        body: stream,
      },
      fields: 'id, webViewLink',
    });

    return { success: true, fileId: response.data.id, url: response.data.webViewLink };
  } catch (error) {
    console.error("Drive Upload Error:", error);
    return { success: false, error: "Failed to upload to Drive" };
  }
}
