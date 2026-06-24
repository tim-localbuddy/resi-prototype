import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { collection, query, onSnapshot, orderBy, where, Timestamp } from 'firebase/firestore';
import { db } from '../lib/auth/firebaseProvider';
import { getFileIcon } from '../lib/documents';
import { IssueCategory, IssueStatus, IssueUrgency } from '../types/issues';

interface Issue {
  id: string;
  title: string;
  description: string;
  category: IssueCategory;
  urgency: IssueUrgency;
  status: IssueStatus;
  loggedByUid: string;
  loggedByName: string;
  loggedByRole: string;
  createdAt: Timestamp | null;
  updatedAt: Timestamp | null;
}

interface DocumentMeta {
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

export function OverviewTab() {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [documents, setDocuments] = useState<DocumentMeta[]>([]);
  const [usersCount, setUsersCount] = useState<number>(0);

  useEffect(() => {
    // Subscribe to issues
    const qIssues = query(collection(db, 'issues'), orderBy('createdAt', 'desc'));
    const unsubscribeIssues = onSnapshot(qIssues, (snapshot) => {
      const fetchedIssues: Issue[] = [];
      snapshot.forEach((doc) => {
        fetchedIssues.push({ id: doc.id, ...doc.data() } as Issue);
      });
      setIssues(fetchedIssues);
    });

    // Subscribe to documents
    const qDocs = query(collection(db, 'documents'), where('status', '==', 'ready'));
    const unsubscribeDocs = onSnapshot(qDocs, (snapshot) => {
      const fetchedDocs: DocumentMeta[] = [];
      snapshot.forEach((doc) => {
        fetchedDocs.push({ id: doc.id, ...doc.data() } as DocumentMeta);
      });
      // Sort by date desc
      fetchedDocs.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      setDocuments(fetchedDocs);
    });

    // Subscribe to users
    const qUsers = query(collection(db, 'users'));
    const unsubscribeUsers = onSnapshot(qUsers, (snapshot) => {
      setUsersCount(snapshot.size);
    });

    return () => {
      unsubscribeIssues();
      unsubscribeDocs();
      unsubscribeUsers();
    };
  }, []);

  const unresolvedIssues = issues.filter(i => i.status !== 'Resolved');
  const openIssuesCount = unresolvedIssues.length;

  const overdueIssues = unresolvedIssues.filter(i => {
    if (!i.createdAt) return false;
    const days = Math.floor((Date.now() - i.createdAt.toMillis()) / (1000 * 60 * 60 * 24));
    return days >= 7;
  });
  const overdueCount = overdueIssues.length;

  const aiDiscoveredIssue = issues.find(i =>
    i.status === IssueStatus.AiFlagged ||
    (i.status !== IssueStatus.Resolved && i.loggedByRole === 'AI Monitor')
  );

  const getStatusBadgeClass = (status: IssueStatus) => {
    switch (status) {
      case IssueStatus.Open: return 'b-amber';
      case IssueStatus.InProgress: return 'b-blue';
      case IssueStatus.AiFlagged: return 'b-purple';
      case IssueStatus.Resolved: return 'b-green';
      default: return 'b-gray';
    }
  };

  const formatShortDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
  };

  const formatIssueId = (id: string) => {
    return `#${id.slice(0, 4).toUpperCase()}`;
  };

  const recentIssues = issues.slice(0, 3);
  const recentDocs = documents.slice(0, 3);

  const committeeOnlyDocsCount = documents.filter(d => !d.readAccess.includes('resident')).length;

  return (
    <div className="tc on">
      <div className="ph">
        <div>
          <div className="pt">Maple House</div>
          <div className="ps">42 Elm Road, London E1 4AB · Committee Director Dashboard</div>
        </div>
        <Link to="/dashboard/docs" className="btn btn-primary btn-sm" style={{ textDecoration: 'none' }}>+ Upload Document</Link>
      </div>

      <div className="stats">
        <div className="sc">
          <div className="sl">Documents</div>
          <div className="sv">{documents.length}</div>
          <div className="sm">{committeeOnlyDocsCount} committee only</div>
        </div>
        <div className="sc">
          <div className="sl">Open Issues</div>
          <div className="sv" style={{ color: 'var(--amber)' }}>{openIssuesCount}</div>
          <div className="sm">{overdueCount} overdue ⚠️</div>
        </div>
        <div className="sc">
          <div className="sl">Residents</div>
          <div className="sv">12</div>
          <div className="sm">{usersCount} registered</div>
        </div>
        <div className="sc">
          <div className="sl">Next AGM</div>
          <div className="sv" style={{ fontSize: '16px', paddingTop: '4px' }}>Nov '26</div>
          <div className="sm">~8 months away</div>
        </div>
      </div>

      {overdueCount > 0 && (
        <div className="alert a-amber">
          <div className="alert-ic">⏰</div>
          <div>
            <div className="alert-title">Weekly Reminder — {overdueCount} issue{overdueCount > 1 ? 's' : ''} unresolved for 7+ days</div>
            Issues {overdueIssues.map(i => {
              const days = i.createdAt ? Math.floor((Date.now() - i.createdAt.toMillis()) / (1000 * 60 * 60 * 24)) : 0;
              return `${formatIssueId(i.id)} (${days} days)`;
            }).join(', ')} remain open. The management agent has been automatically reminded. <Link to="/dashboard/issues" style={{ color: 'var(--amber)', fontWeight: 700, textDecoration: 'none' }}>View issue log →</Link>
          </div>
        </div>
      )}

      {aiDiscoveredIssue && (
        <div className="alert a-red">
          <div className="alert-ic">💬✨</div>
          <div>
            <div className="alert-title">AI Self-Discovered Issue — {aiDiscoveredIssue.title}</div>
            Bofast has flagged this issue automatically. This has been logged as issue {formatIssueId(aiDiscoveredIssue.id)}. <Link to="/dashboard/issues" style={{ color: 'var(--red)', fontWeight: 700, textDecoration: 'none' }}>Review now →</Link>
          </div>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        <div className="card">
          <div className="card-hd">
            <div className="card-title">Recent Issues</div>
            <Link to="/dashboard/issues" className="text-xs" style={{ color: 'var(--blue)', textDecoration: 'none' }}>View all →</Link>
          </div>
          <div className="card-body" style={{ padding: 0 }}>
            <table className="it" style={{ fontSize: '12px' }}>
              <tbody>
                {recentIssues.map((issue) => (
                  <tr key={issue.id}>
                    <td><span className="issue-id">{formatIssueId(issue.id)}</span></td>
                    <td>
                      <div className="issue-title" style={{ fontSize: '12px', fontWeight: 600 }}>{issue.title}</div>
                    </td>
                    <td>
                      <span className={`badge ${getStatusBadgeClass(issue.status)}`}>{issue.status}</span>
                    </td>
                  </tr>
                ))}
                {recentIssues.length === 0 && (
                  <tr><td colSpan={3} style={{ textAlign: 'center', padding: '12px', color: 'var(--text2)' }}>No recent issues.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="card">
          <div className="card-hd">
            <div className="card-title">Recent Documents</div>
            <Link to="/dashboard/docs" className="text-xs" style={{ color: 'var(--blue)', textDecoration: 'none' }}>View all →</Link>
          </div>
          <div className="card-body" style={{ padding: 0 }}>
            <table className="it" style={{ fontSize: '12px' }}>
              <tbody>
                {recentDocs.map((doc) => (
                  <tr key={doc.id}>
                    <td style={{ fontSize: '16px', paddingLeft: '14px', width: '32px' }}>{getFileIcon(doc.mimeType)}</td>
                    <td>
                      <div className="issue-title" style={{ fontSize: '12px', fontWeight: 600 }}>{doc.name}</div>
                      <div className="issue-sub" style={{ fontSize: '10px', color: 'var(--text2)' }}>
                        {doc.readAccess.includes('resident') ? 'All residents' : 'Committee only'}
                      </div>
                    </td>
                    <td>
                      <span className="badge b-gray">{formatShortDate(doc.createdAt)}</span>
                    </td>
                  </tr>
                ))}
                {recentDocs.length === 0 && (
                  <tr><td colSpan={3} style={{ textAlign: 'center', padding: '12px', color: 'var(--text2)' }}>No recent documents.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
