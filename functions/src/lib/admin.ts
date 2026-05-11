import * as admin from 'firebase-admin';
import * as path from "path";

// Initialize the app only if it hasn't been initialized already
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(path.join(__dirname, "../../../.secrets", "service-account.json"))
  });
}

export const db = admin.firestore();
export const storage = admin.storage();
