import { google } from "googleapis";
import { v1beta } from "@google-cloud/discoveryengine";
import * as path from "path";
import * as fs from "fs";

export const GDRIVE_ROOT_FOLDER_ID = "1YEUJ4E-1C7So8DbxWl52vl6pADnpw6Np";

export async function getDriveAuth() {
  const keyPath = path.join(__dirname, "../../../.secrets", "service-account.json");
  if (!fs.existsSync(keyPath)) {
    throw new Error("service-account.json not found");
  }

  const auth = new google.auth.GoogleAuth({
    keyFile: keyPath,
    scopes: ["https://www.googleapis.com/auth/drive.readonly"],
  });
  return auth.getClient();
}

export async function getDiscoveryClient() {
  const keyPath = path.join(__dirname, "../../../.secrets", "service-account.json");
  if (!fs.existsSync(keyPath)) {
    throw new Error("service-account.json not found");
  }

  return new v1beta.ConversationalSearchServiceClient({
    keyFilename: keyPath,
    apiEndpoint: "eu-discoveryengine.googleapis.com",
  });
}

export async function getFolderIdByName(drive: any, parentId: string, folderName: string) {
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

export async function getFilesInFolder(drive: any, folderId: string) {
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
