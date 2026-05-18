import { onCall, HttpsError } from "firebase-functions/v2/https";
import { db, storage } from "./lib/admin";
import * as crypto from "crypto";

const BUCKET_NAME = "bofast-documents";

async function getUserProfile(uid: string): Promise<{ properties: Record<string, string> }> {
  const doc = await db.collection("users").doc(uid).get();
  if (doc.exists) {
    const data = doc.data()!;
    return { properties: data.properties || {} };
  }
  return { properties: {} };
}

export const getUploadUrl = onCall(async (request) => {
  if (!request.auth) {
    throw new HttpsError("unauthenticated", "Must be logged in");
  }

  const { name, mimeType, size, readAccess, writeAccess, propertyId } = request.data;
  if (!name || !mimeType || !readAccess || !writeAccess || !propertyId) {
    throw new HttpsError("invalid-argument", "Missing file metadata");
  }

  const profile = await getUserProfile(request.auth.uid);
  const userRoleForProperty = profile.properties[propertyId];

  if (!["committee", "director", "agent"].includes(userRoleForProperty)) {
    throw new HttpsError("permission-denied", `Only authorized roles can upload to this property: ${userRoleForProperty}`);
  }

  const documentId = crypto.randomUUID();
  const filePath = `documents/${propertyId}/${documentId}/${name}`;

  // 1. Create Firestore document (status: pending)
  await db.collection("documents").doc(documentId).set({
    id: documentId,
    name,
    mimeType,
    size: size || 0,
    uploadedBy: request.auth.uid,
    propertyId,
    createdAt: new Date().toISOString(),
    readAccess,
    writeAccess,
    filePath,
    status: "pending"
  });

  // 2. Generate Signed Upload URL
  const bucket = storage.bucket(BUCKET_NAME);
  const file = bucket.file(filePath);

  const [url] = await file.getSignedUrl({
    version: 'v4',
    action: 'write',
    expires: Date.now() + 15 * 60 * 1000, // 15 minutes
    contentType: mimeType
  });

  return { documentId, uploadUrl: url, storagePath: filePath };
});

export const markDocumentUploaded = onCall(async (request) => {
  if (!request.auth) {
    throw new HttpsError("unauthenticated", "Must be logged in");
  }

  const { documentId } = request.data;
  if (!documentId) {
    throw new HttpsError("invalid-argument", "Missing documentId");
  }

  const docRef = db.collection("documents").doc(documentId);
  const doc = await docRef.get();

  if (!doc.exists) {
    throw new HttpsError("not-found", "Document not found");
  }

  const docData = doc.data()!;

  const profile = await getUserProfile(request.auth.uid);
  const userRoleForProperty = profile.properties[docData.propertyId];

  if (docData.uploadedBy !== request.auth.uid && (!userRoleForProperty || !docData.writeAccess.includes(userRoleForProperty))) {
    throw new HttpsError("permission-denied", "Cannot modify this document");
  }

  await docRef.update({ status: "ready" });
  return { success: true };
});

export const getDownloadUrl = onCall(async (request) => {
  if (!request.auth) {
    throw new HttpsError("unauthenticated", "Must be logged in");
  }

  const { documentId } = request.data;
  if (!documentId) {
    throw new HttpsError("invalid-argument", "Missing documentId");
  }

  const doc = await db.collection("documents").doc(documentId).get();
  if (!doc.exists) {
    throw new HttpsError("not-found", "Document not found");
  }

  const docData = doc.data()!;

  // Verify read access and property assignment
  const profile = await getUserProfile(request.auth.uid);
  const userRoleForProperty = profile.properties[docData.propertyId];

  if (!userRoleForProperty) {
    throw new HttpsError("permission-denied", "You are not assigned to this property");
  }

  if (!docData.readAccess.includes(userRoleForProperty) && docData.uploadedBy !== request.auth.uid) {
    throw new HttpsError("permission-denied", `You don't have permission to view this document: ${userRoleForProperty}`);
  }


  // Generate Signed Download URL
  const bucket = storage.bucket(BUCKET_NAME);
  const file = bucket.file(docData.filePath);

  const [url] = await file.getSignedUrl({
    version: 'v4',
    action: 'read',
    expires: Date.now() + 60 * 60 * 1000, // 1 hour
  });

  return { url };
});

export const deleteDocument = onCall(async (request) => {
  if (!request.auth) {
    throw new HttpsError("unauthenticated", "Must be logged in");
  }

  const { documentId } = request.data;
  if (!documentId) {
    throw new HttpsError("invalid-argument", "Missing documentId");
  }

  const docRef = db.collection("documents").doc(documentId);
  const doc = await docRef.get();

  if (!doc.exists) {
    throw new HttpsError("not-found", "Document not found");
  }

  const docData = doc.data()!;

  const profile = await getUserProfile(request.auth.uid);
  const userRoleForProperty = profile.properties[docData.propertyId];

  if (docData.uploadedBy !== request.auth.uid && (!userRoleForProperty || !docData.writeAccess.includes(userRoleForProperty))) {
    throw new HttpsError("permission-denied", "Cannot delete this document");
  }

  // Delete from Storage
  const bucket = storage.bucket(BUCKET_NAME);
  const file = bucket.file(docData.filePath);
  try {
    await file.delete();
  } catch (err) {
    // If file doesn't exist in storage, just proceed to delete firestore doc
    console.warn("Storage file not found or couldn't be deleted:", err);
  }

  // Delete from Firestore
  await docRef.delete();

  return { success: true };
});
