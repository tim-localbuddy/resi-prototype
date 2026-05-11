import { getFunctions, httpsCallable, connectFunctionsEmulator, type Functions } from 'firebase/functions';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';

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

let functionsEu: Functions | null = null;

function getEuFunctions() {
  if (!functionsEu) {
    functionsEu = getFunctions(undefined, 'europe-west1');
    if (import.meta.env.DEV) {
      connectFunctionsEmulator(functionsEu, 'localhost', 5001);
    }
  }
  return functionsEu;
}

export async function fetchDocuments(role: string, propertyId: string): Promise<DocumentMeta[]> {
  const db = getFirestore();
  // Using array-contains to check if the user's role is in the readAccess array
  const q = query(
    collection(db, 'documents'),
    where('propertyId', '==', propertyId),
    where('readAccess', 'array-contains', role),
    where('status', '==', 'ready')
  );

  const snapshot = await getDocs(q);
  const docs = snapshot.docs.map(doc => doc.data() as DocumentMeta);
  // Sort by createdAt descending
  return docs.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export async function getDocumentDownloadUrl(documentId: string): Promise<string> {
  const fns = getEuFunctions();
  const getDownloadUrl = httpsCallable(fns, 'getDownloadUrl');
  const result = await getDownloadUrl({ documentId });
  return (result.data as any).url;
}

export async function uploadDocument(
  file: File,
  readAccess: string[],
  writeAccess: string[],
  propertyId: string
): Promise<void> {
  const fns = getEuFunctions();
  const getUploadUrl = httpsCallable(fns, 'getUploadUrl');
  const markUploaded = httpsCallable(fns, 'markDocumentUploaded');

  // 1. Get signed upload URL and document ID
  const result = await getUploadUrl({
    name: file.name,
    mimeType: file.type || 'application/octet-stream',
    size: file.size,
    readAccess,
    writeAccess,
    propertyId
  });
  const { documentId, uploadUrl } = result.data as any;

  // 2. Upload file directly to Storage using the signed URL
  const uploadRes = await fetch(uploadUrl, {
    method: 'PUT',
    body: file,
    headers: {
      'Content-Type': file.type || 'application/octet-stream'
    }
  });

  if (!uploadRes.ok) {
    throw new Error(`Upload failed: ${uploadRes.statusText}`);
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
