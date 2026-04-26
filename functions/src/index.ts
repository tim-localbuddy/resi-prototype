import { onCall, HttpsError } from "firebase-functions/v2/https";
import { setGlobalOptions } from "firebase-functions/v2";
import { google } from "googleapis";
import * as path from "path";
import * as fs from "fs";

// Set concurrency and region if needed
setGlobalOptions({ maxInstances: 10, region: "europe-west1" });

const GDRIVE_ROOT_FOLDER_ID = "1YEUJ4E-1C7So8DbxWl52vl6pADnpw6Np";

async function getDriveAuth() {
  const keyPath = path.join(__dirname, "../../.secrets", "service-account.json");
  if (!fs.existsSync(keyPath)) {
    throw new Error("service-account.json not found");
  }

  const auth = new google.auth.GoogleAuth({
    keyFile: keyPath,
    scopes: ["https://www.googleapis.com/auth/drive.readonly"],
  });
  return auth.getClient();
}

async function getFolderIdByName(drive: any, parentId: string, folderName: string) {
  const q = `'${parentId}' in parents and mimeType='application/vnd.google-apps.folder' and name='${folderName}' and trashed=false`;
  const res = await drive.files.list({
    q,
    fields: "files(id,name)",
    supportsAllDrives: true,
    includeItemsFromAllDrives: true,
  });
  if (res.data.files && res.data.files.length > 0) return res.data.files[0].id;
  return null;
}

async function getFilesInFolder(drive: any, folderId: string) {
  const q = `'${folderId}' in parents and mimeType != 'application/vnd.google-apps.folder' and trashed=false`;
  const res = await drive.files.list({
    q,
    orderBy: "name",
    fields: "files(id,name,mimeType,createdTime,size,webViewLink)",
    supportsAllDrives: true,
    includeItemsFromAllDrives: true,
  });
  return res.data.files || [];
}

export const getDocuments = onCall(async (request) => {
  // 1. Verify user is authenticated
  if (!request.auth) {
    throw new HttpsError("unauthenticated", "User must be authenticated to view documents.");
  }

  try {
    const authClient = await getDriveAuth();
    const drive = google.drive({ version: "v3", auth: authClient as any });

    const residentsId = await getFolderIdByName(drive, GDRIVE_ROOT_FOLDER_ID, "residents").catch(() => null);
    const committeeId = await getFolderIdByName(drive, GDRIVE_ROOT_FOLDER_ID, "committee").catch(() => null);

    const residentsFiles = residentsId ? await getFilesInFolder(drive, residentsId).catch(() => []) : [];
    const committeeFiles = committeeId ? await getFilesInFolder(drive, committeeId).catch(() => []) : [];

    return { residentsFiles, committeeFiles };
  } catch (error: any) {
    console.error("Error fetching documents:", error);
    throw new HttpsError("internal", "Failed to fetch documents", error.message);
  }
});
