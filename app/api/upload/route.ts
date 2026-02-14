export const runtime = 'edge';console.log("=== Drive Auth Check ===");
console.log("Credentials exists:", !!process.env.GOOGLE_DRIVE_CREDENTIALS);
if (process.env.GOOGLE_DRIVE_CREDENTIALS) {
  try {
    const creds = JSON.parse(process.env.GOOGLE_DRIVE_CREDENTIALS);
    console.log("Project ID from JSON:", creds.project_id);
    console.log("Client Email exists:", !!creds.client_email);
  } catch (e) {
    console.error("❌ Error: GOOGLE_DRIVE_CREDENTIALS is not a valid JSON!");
  }
}
console.log("Folder ID:", process.env.NEXT_PUBLIC_DRIVE_FOLDER_ID);
console.log("========================");
