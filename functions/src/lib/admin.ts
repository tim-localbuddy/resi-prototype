import * as admin from 'firebase-admin';
import * as path from "path";
import * as fs from "fs";

// Initialize the app only if it hasn't been initialized already
if (!admin.apps.length) {
  const saPath = path.join(__dirname, "../../.secrets", "service-account.json");
  if (fs.existsSync(saPath)) {
    admin.initializeApp({
      credential: admin.credential.cert(saPath)
    });
  } else {
    admin.initializeApp();
  }
}

export const db = admin.firestore();
export const storage = admin.storage();
