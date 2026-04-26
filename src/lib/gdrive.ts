import { getFunctions, httpsCallable, connectFunctionsEmulator } from 'firebase/functions';

export interface GDriveFile {
  id: string;
  name: string;
  mimeType: string;
  createdTime: string;
  size?: string;
  webViewLink: string;
}

let functionsEu: any = null;

export async function fetchAllDocuments(): Promise<{ residentsFiles: GDriveFile[], committeeFiles: GDriveFile[] }> {
  try {
    if (!functionsEu) {
      functionsEu = getFunctions(undefined, 'europe-west1');
      if (import.meta.env.DEV) {
        connectFunctionsEmulator(functionsEu, 'localhost', 5001);
      }
    }
    const getDocuments = httpsCallable(functionsEu, 'getDocuments');
    
    const result = await getDocuments();
    return result.data as { residentsFiles: GDriveFile[], committeeFiles: GDriveFile[] };
  } catch (error: any) {
    throw new Error(error.message || 'Failed to fetch documents');
  }
}

export function formatBytes(bytes?: string, decimals = 2) {
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
