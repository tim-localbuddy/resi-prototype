import { onCall, HttpsError } from "firebase-functions/v2/https";
import { google } from "googleapis";
import { getDriveAuth, getFolderIdByName, getFilesInFolder, GDRIVE_ROOT_FOLDER_ID } from "./lib/utils";

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
