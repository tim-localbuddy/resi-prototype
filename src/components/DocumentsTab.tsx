import { useState, useEffect } from 'react';
import { fetchAllDocuments, formatBytes, getFileIcon, formatDate, type GDriveFile } from '../lib/gdrive';

export function DocumentsTab({ role = 'resident' }: { role?: 'resident' | 'committee' | 'agent' }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [residentsDocs, setResidentsDocs] = useState<GDriveFile[]>([]);
  const [committeeDocs, setCommitteeDocs] = useState<GDriveFile[]>([]);

  useEffect(() => {
    setLoading(true);
    fetchAllDocuments()
      .then(({ residentsFiles, committeeFiles }) => {
        setResidentsDocs(residentsFiles);
        setCommitteeDocs(committeeFiles);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="tc on">
      {role === 'resident' && (
        <div className="alert a-blue">
          <div className="alert-ic">📋</div>
          <div><div className="alert-title">Your building documents</div>These are documents your committee has shared with all residents. For further queries, use the AI assistant.</div>
        </div>
      )}
      {(role === 'committee' || role === 'agent') && (
        <div className="alert a-blue">
          <div className="alert-ic">📋</div>
          <div><div className="alert-title">Building Documents</div>Manage all building documents. You can upload new documents and control visibility.</div>
        </div>
      )}

      {(role === 'committee' || role === 'agent') && (
        <div style={{ marginBottom: '16px' }}>
          <button className="btn btn-primary btn-sm">+ Upload Document</button>
        </div>
      )}

      {error && <div className="alert a-red" style={{ marginBottom: '16px' }}>{error}</div>}

      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text2)' }}>Loading documents securely...</div>
      ) : (
        <div className="doc-grid">
          {residentsDocs.map(doc => (
            <div key={doc.id} className="doc-card" onClick={() => window.open(doc.webViewLink, '_blank')}>
              <div className="doc-ic">{getFileIcon(doc.mimeType)}</div>
              <div className="doc-name">{doc.name}</div>
              <div className="doc-meta">Uploaded {formatDate(doc.createdTime)}</div>
              <div className="doc-foot">
                <span className="badge b-green">All Residents</span>
                <span className="text-xs text2">{formatBytes(doc.size)}</span>
              </div>
            </div>
          ))}

          {(role === 'committee' || role === 'agent') && committeeDocs.map(doc => (
            <div key={doc.id} className="doc-card" onClick={() => window.open(doc.webViewLink, '_blank')}>
              <div className="doc-ic">{getFileIcon(doc.mimeType)}</div>
              <div className="doc-name">{doc.name}</div>
              <div className="doc-meta">Uploaded {formatDate(doc.createdTime)}</div>
              <div className="doc-foot">
                <span className="badge b-gray">Committee Only</span>
                <span className="text-xs text2">{formatBytes(doc.size)}</span>
              </div>
            </div>
          ))}

          {residentsDocs.length === 0 && committeeDocs.length === 0 && !error && (
             <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '20px', color: 'var(--text2)' }}>No documents found.</div>
          )}
        </div>
      )}

      {role === 'resident' && (
        <div style={{ marginTop: '16px', padding: '14px', background: 'var(--amber2)', border: '1px solid #FDE68A', borderRadius: '10px', fontSize: '13px', color: '#78350F' }}>
          🔒 <strong>Additional documents</strong> are available to committee members only. Contact your director if you need access.
        </div>
      )}
    </div>
  );
}
