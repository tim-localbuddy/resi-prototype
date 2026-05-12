import { useState, useEffect, useRef, useCallback } from 'react';
import { fetchDocuments, getDocumentDownloadUrl, uploadDocument, formatBytes, getFileIcon, formatDate, type DocumentMeta } from '../lib/documents';
import { useAuth } from '../contexts/AuthContext';
import type { UserRole } from '../lib/auth/types';

export function DocumentsTab({ role = 'resident' }: { role?: UserRole }) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [documents, setDocuments] = useState<DocumentMeta[]>([]);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  // Upload modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [fileToUpload, setFileToUpload] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  // Default to everyone can read, only managers can write
  const [readAccess, setReadAccess] = useState<UserRole[]>(['resident', 'committee', 'director', 'agent']);
  const [writeAccess, setWriteAccess] = useState<UserRole[]>(['committee', 'director', 'agent']);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Default to the first property the user has, or 'property1'
  const propertyId = Object.keys(user?.properties || {})[0] || 'property1';
  // Use the specific role the user has for this property, fallback to the prop
  const activeRole = user?.properties?.[propertyId] || role;

  const loadDocs = useCallback(() => {
    // Defer state update to avoid "cascading renders" warning in useEffect
    Promise.resolve().then(() => setLoading(true));
    
    fetchDocuments(activeRole, propertyId)
      .then(docs => setDocuments(docs))
      .catch(err => setError((err as Error).message))
      .finally(() => setLoading(false));
  }, [activeRole, propertyId]);

  useEffect(() => {
    if (user) {
      loadDocs();
    }
  }, [user, loadDocs]);

  const handleDocClick = async (docId: string) => {
    if (downloadingId) return;
    try {
      setDownloadingId(docId);
      const url = await getDocumentDownloadUrl(docId);
      window.open(url, '_blank');
    } catch (err: unknown) {
      setError('Failed to open document: ' + (err as Error).message);
    } finally {
      setDownloadingId(null);
    }
  };

  const submitUpload = async () => {
    if (!fileToUpload) return;
    if (readAccess.length === 0) {
      alert("Please select at least one role for read access.");
      return;
    }
    try {
      setUploading(true);
      await uploadDocument(fileToUpload, readAccess, writeAccess, propertyId);
      setIsModalOpen(false);
      setFileToUpload(null);
      loadDocs(); // refresh list
    } catch (err: unknown) {
      alert((err as Error).message);
    } finally {
      setUploading(false);
    }
  };

  const toggleRole = (array: UserRole[], setArray: (a: UserRole[]) => void, r: UserRole) => {
    if (array.includes(r)) {
      setArray(array.filter(item => item !== r));
    } else {
      setArray([...array, r]);
    }
  };

  const canManage = role === 'committee' || role === 'director' || role === 'agent';
  const availableRoles: UserRole[] = ['resident', 'committee', 'director', 'agent'];

  return (
    <div className="tc on">
      {role === 'resident' && (
        <div className="alert a-blue">
          <div className="alert-ic">📋</div>
          <div><div className="alert-title">Your building documents</div>These are documents your committee has shared with all residents. For further queries, use the AI assistant.</div>
        </div>
      )}
      {canManage && (
        <div className="alert a-blue">
          <div className="alert-ic">📋</div>
          <div><div className="alert-title">Building Documents</div>Manage all building documents. You can upload new documents and control visibility.</div>
        </div>
      )}

      {canManage && (
        <div style={{ marginBottom: '16px' }}>
          <button className="btn btn-primary btn-sm" onClick={() => setIsModalOpen(true)}>+ Upload Document</button>
        </div>
      )}

      {error && <div className="alert a-red" style={{ marginBottom: '16px' }}>{error}</div>}

      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text2)' }}>Loading documents securely...</div>
      ) : (
        <div className="doc-grid">
          {documents.map(doc => {
            const isRestricted = !doc.readAccess.includes('resident');
            return (
              <div
                key={doc.id}
                className="doc-card"
                onClick={() => handleDocClick(doc.id)}
                style={{ opacity: downloadingId === doc.id ? 0.6 : 1, cursor: downloadingId === doc.id ? 'wait' : 'pointer' }}
              >
                <div className="doc-ic">{getFileIcon(doc.mimeType)}</div>
                <div className="doc-name">{doc.name}</div>
                <div className="doc-meta">Uploaded {formatDate(doc.createdAt)}</div>
                <div className="doc-foot">
                  {isRestricted ? (
                    <span className="badge b-gray">Restricted</span>
                  ) : (
                    <span className="badge b-green">All Residents</span>
                  )}
                  <span className="text-xs text2">{formatBytes(doc.size)}</span>
                </div>
              </div>
            );
          })}

          {documents.length === 0 && !error && (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '20px', color: 'var(--text2)' }}>No documents found.</div>
          )}
        </div>
      )}

      {role === 'resident' && (
        <div style={{ marginTop: '16px', padding: '14px', background: 'var(--amber2)', border: '1px solid #FDE68A', borderRadius: '10px', fontSize: '13px', color: '#78350F' }}>
          🔒 <strong>Additional documents</strong> are available to committee members only. Contact your director if you need access.
        </div>
      )}

      {/* Upload Modal */}
      {isModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: 'var(--bg)', padding: '24px', borderRadius: '12px', width: '400px', maxWidth: '90%' }}>
            <h3 style={{ marginTop: 0, marginBottom: '16px' }}>Upload Document</h3>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>File</label>
              <input type="file" ref={fileInputRef} onChange={(e) => {
                if (e.target.files && e.target.files[0]) setFileToUpload(e.target.files[0]);
              }} />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Who can read this?</label>
              {availableRoles.map(r => (
                <label key={'read_' + r} style={{ display: 'block', marginBottom: '4px' }}>
                  <input type="checkbox" checked={readAccess.includes(r)} onChange={() => toggleRole(readAccess, setReadAccess, r)} /> {r}
                </label>
              ))}
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Who can edit/delete this?</label>
              {availableRoles.map(r => (
                <label key={'write_' + r} style={{ display: 'block', marginBottom: '4px' }}>
                  <input type="checkbox" checked={writeAccess.includes(r)} onChange={() => toggleRole(writeAccess, setWriteAccess, r)} /> {r}
                </label>
              ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              <button className="btn btn-secondary" onClick={() => setIsModalOpen(false)} disabled={uploading}>Cancel</button>
              <button className="btn btn-primary" onClick={submitUpload} disabled={uploading || !fileToUpload}>
                {uploading ? 'Uploading...' : 'Upload'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
