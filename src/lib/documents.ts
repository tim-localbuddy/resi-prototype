import { httpsCallable } from 'firebase/functions';
import { collection, query, where, getDocs, or, and } from 'firebase/firestore';
import { ref as storageRef, uploadBytes } from 'firebase/storage';
import { db, functionsEu, storage } from './auth/firebaseProvider';

export interface DocumentMeta {
  id: string;
  name: string;
  mimeType: string;
  size: number;
  uploadedBy: string;
  createdAt: string;
  readAccess: string[];
  writeAccess: string[];
  status: string;
  propertyId: string;
}

export async function fetchDocuments(role: string, propertyId: string): Promise<DocumentMeta[]> {
  // Using array-contains to check if the user's role is in the readAccess or writeAccess array
  const q = query(
    collection(db, 'documents'),
    and(
      where('propertyId', '==', propertyId),
      or(
        where('readAccess', 'array-contains', role),
        where('writeAccess', 'array-contains', role)
      ),
      where('status', '==', 'ready')
    )
  );

  const snapshot = await getDocs(q);
  const docs = snapshot.docs.map(doc => doc.data() as DocumentMeta);
  // Sort by createdAt descending
  return docs.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export async function getDocumentDownloadUrl(documentId: string): Promise<string> {
  const getDownloadUrl = httpsCallable(functionsEu, 'getDownloadUrl');
  const result = await getDownloadUrl({ documentId });
  return (result.data as any).url;
}

export async function uploadDocument(
  file: File,
  readAccess: string[],
  writeAccess: string[],
  propertyId: string
): Promise<void> {
  const getUploadUrl = httpsCallable(functionsEu, 'getUploadUrl');
  const markUploaded = httpsCallable(functionsEu, 'markDocumentUploaded');

  // 1. Get signed upload URL and document ID
  const result = await getUploadUrl({
    name: file.name,
    mimeType: file.type || 'application/octet-stream',
    size: file.size,
    readAccess,
    writeAccess,
    propertyId
  });
  const { documentId, uploadUrl, storagePath } = result.data as any;

  // 2. Upload file directly to Storage using the client SDK if in development, else signed URL
  if (import.meta.env.DEV && storagePath) {
    const fileRef = storageRef(storage, storagePath);
    await uploadBytes(fileRef, file);
  } else {
    const uploadRes = await fetch(uploadUrl, {
      method: 'PUT',
      mode: 'cors',
      body: file,
      headers: {
        'Content-Type': file.type || 'application/octet-stream'
      }
    });

    if (!uploadRes.ok) {
      throw new Error(`Upload failed: ${uploadRes.statusText}`);
    }
  }

  // 3. Mark document as ready in Firestore
  await markUploaded({ documentId });
}

export function formatBytes(bytes?: number | string, decimals = 2) {
  if (!bytes) return '0 Bytes';
  const b = Number(bytes);
  if (b === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  const i = Math.floor(Math.log(b) / Math.log(k));
  return parseFloat((b / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

export function getFileIcon(mimeType: string) {
  if (mimeType.includes('pdf')) return '📄';
  if (mimeType.includes('spreadsheet') || mimeType.includes('excel') || mimeType.includes('csv')) return '📊';
  if (mimeType.includes('document') || mimeType.includes('word')) return '📝';
  if (mimeType.includes('image')) return '🖼️';
  return '📋';
}

export function formatDate(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

export async function deleteDocument(documentId: string): Promise<void> {
  const deleteDoc = httpsCallable(functionsEu, 'deleteDocument');
  await deleteDoc({ documentId });
}
