/* app/api/drive/upload/route.ts */
import { NextRequest, NextResponse } from "next/server";
import { google } from "googleapis";
import { getGoogleAuth } from "@/lib/googleAuth";
import { Readable } from "stream";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const folderId = formData.get("folderId") as string;

    if (!file || !folderId) return NextResponse.json({ error: "Missing data" }, { status: 400 });

    const auth = getGoogleAuth(["https://www.googleapis.com/auth/drive.file"]);
    const drive = google.drive({ version: "v3", auth });

    // המרת ה-File ל-Stream
    const buffer = Buffer.from(await file.arrayBuffer());
    const bufferStream = new Readable();
    bufferStream.push(buffer);
    bufferStream.push(null);

    const response = await drive.files.create({
      requestBody: { name: file.name, parents: [folderId] },
      media: { mimeType: file.type, body: bufferStream },
      fields: "id, webViewLink",
    });

    return NextResponse.json({ success: true, webViewLink: response.data.webViewLink });
  } catch (error: any) {
    console.error("Drive API Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
