import { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot, orderBy, Timestamp } from 'firebase/firestore';
import { httpsCallable } from 'firebase/functions';
import { db, functionsEu } from '../lib/auth/firebaseProvider';
import { useAuth } from '../contexts/AuthContext';
import issueStyles from './Issues.module.css';
import formStyles from '../pages/Auth.module.css';
import type { UserRole } from '../lib/auth/userRole';
import { IssueStatus, IssueUrgency, IssueCategory, ALLOWED_STATUSES } from '../types/issues';

interface IssuesTabProps {
  role: UserRole;
}

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

export function IssuesTab({ role }: IssuesTabProps) {
  const { user } = useAuth();
  const [issues, setIssues] = useState<Issue[]>([]);
  
  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<IssueCategory>(IssueCategory.Maintenance);
  const [urgency, setUrgency] = useState<IssueUrgency>(IssueUrgency.Low);
  const [submitting, setSubmitting] = useState(false);

  // Status Filter for Committee/Agent
  const [statusFilter, setStatusFilter] = useState<IssueStatus | 'All statuses'>('All statuses');

  useEffect(() => {
    if (!user) return;

    let q;
    if (role === 'resident') {
      q = query(
        collection(db, 'issues'),
        where('loggedByUid', '==', user.uid),
        orderBy('createdAt', 'asc')
      );
    } else {
      q = query(
        collection(db, 'issues'),
        orderBy('createdAt', 'asc')
      );
    }

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedIssues: Issue[] = [];
      snapshot.forEach((doc) => {
        fetchedIssues.push({ id: doc.id, ...doc.data() } as Issue);
      });
      setIssues(fetchedIssues);
    });

    return () => unsubscribe();
  }, [user, role]);

  const handleLogIssue = async () => {
    if (!title.trim() || !user) return;
    setSubmitting(true);
    try {
      const logIssueFn = httpsCallable<{ title: string, description: string, category: string, urgency: string }, { success: boolean, id: string }>(functionsEu, 'logIssue');
      await logIssueFn({
        title,
        description,
        category,
        urgency,
      });
      setTitle('');
      setDescription('');
      setCategory(IssueCategory.Maintenance);
      setUrgency(IssueUrgency.Low);
      alert('Issue logged!');
    } catch (err) {
      console.error(err);
      alert('Failed to log issue');
    }
    setSubmitting(false);
  };

  const handleUpdateStatus = async (issueId: string, newStatus: string) => {
    try {
      const updateIssueStatusFn = httpsCallable<{ issueId: string, newStatus: string }, { success: boolean }>(functionsEu, 'updateIssueStatus');
      await updateIssueStatusFn({
        issueId,
        newStatus,
      });
    } catch (err) {
      console.error('Failed to update status', err);
      alert('Failed to update status');
    }
  };

  const formatDate = (ts: Timestamp | null) => {
    if (!ts) return 'Pending...';
    return ts.toDate().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const filteredIssues = issues.filter(issue => {
    if (statusFilter === 'All statuses') return true;
    return issue.status === statusFilter;
  });

  const getStatusBadgeClass = (status: IssueStatus) => {
    switch(status) {
      case IssueStatus.Open: return issueStyles.sOpen;
      case IssueStatus.InProgress: return issueStyles.sProgress;
      case IssueStatus.Resolved: return issueStyles.sResolved;
      case IssueStatus.AiFlagged: return issueStyles.sAi;
    }
  };

  const getUrgencyDotClass = (urgency: IssueUrgency) => {
    switch(urgency) {
      case IssueUrgency.Urgent: return issueStyles.pUrgent;
      case IssueUrgency.High: return issueStyles.pHigh;
      case IssueUrgency.Medium: return issueStyles.pMedium;
      case IssueUrgency.Low: return issueStyles.pLow;
    }
  };

  if (role === 'resident') {
    return (
      <div className="tc on">
        <div className={issueStyles.logForm}>
          <h4 className={issueStyles.logFormTitle}>➕ Log a New Issue</h4>
          <div className={formStyles.formGroup}>
            <label className={formStyles.formLabel}>Issue Title</label>
            <input 
              className={formStyles.formInput} 
              type="text" 
              placeholder="e.g. Broken light in corridor, Floor 2" 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className={formStyles.formGroup}>
            <label className={formStyles.formLabel}>Description</label>
            <textarea 
              className={`${formStyles.formInput} ${issueStyles.issueTextarea}`} 
              rows={3} 
              placeholder="Describe the issue in detail…" 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>
          </div>
          <div className={formStyles.frow}>
            <div className={formStyles.formGroup}>
              <label className={formStyles.formLabel}>Category</label>
              <select className={formStyles.fselect} value={category} onChange={(e) => setCategory(e.target.value as IssueCategory)}>
                {Object.values(IssueCategory).map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className={formStyles.formGroup}>
              <label className={formStyles.formLabel}>Urgency</label>
              <select className={formStyles.fselect} value={urgency} onChange={(e) => setUrgency(e.target.value as IssueUrgency)}>
                {Object.values(IssueUrgency).map(u => <option key={u} value={u}>{u}</option>)}
              </select>
            </div>
          </div>
          <button className="btn btn-primary btn-sm" onClick={handleLogIssue} disabled={submitting}>
            {submitting ? 'Submitting...' : 'Submit Issue'}
          </button>
        </div>
        
        <div className="card">
          <div className="card-hd">
            <div className="card-title">My Issue Log</div>
            <span className="badge b-amber">{issues.filter(i => i.status === IssueStatus.Open).length} Open</span>
          </div>
          <div className={issueStyles.tableContainer}>
            <table className={issueStyles.it}>
              <thead><tr><th>ID</th><th>Issue</th><th>Logged</th><th>Status</th><th>Last Update</th></tr></thead>
              <tbody>
                {issues.map((issue) => (
                  <tr key={issue.id}>
                    <td><span className={issueStyles.issueId}>#{issue.id.slice(0, 4).toUpperCase()}</span></td>
                    <td>
                      <div className={issueStyles.issueTitleCell}>
                         <span className={`${issueStyles.pd} ${getUrgencyDotClass(issue.urgency)} ${issueStyles.pdMargin}`}></span>
                         {issue.title}
                      </div>
                    </td>
                    <td><span className="badge b-gray">{formatDate(issue.createdAt)}</span></td>
                    <td><span className={`badge ${getStatusBadgeClass(issue.status)}`}>{issue.status}</span></td>
                    <td>{formatDate(issue.updatedAt)}</td>
                  </tr>
                ))}
                {issues.length === 0 && (
                  <tr><td colSpan={5} className={issueStyles.emptyMessage}>No issues logged.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  // Committee and Agent view
  const oldIssues = issues.filter(i => {
    if (!i.createdAt || i.status === IssueStatus.Resolved) return false;
    const days = Math.floor((Date.now() - i.createdAt.toMillis()) / (1000 * 60 * 60 * 24));
    return days >= 7;
  });

  return (
    <div className="tc on">
      {oldIssues.length > 0 && (
        <div className={issueStyles.reminderBanner}>
          <h4 className={issueStyles.reminderTitle}>
            ⏰ Action Required — Weekly Reminder
          </h4>
          <p className={issueStyles.reminderDesc}>
            Issues {oldIssues.map(i => `#${i.id.slice(0, 4).toUpperCase()}`).join(', ')} have been unresolved for 7+ days.
          </p>
        </div>
      )}

      <div className="card">
        <div className={`${issueStyles.cardHeader} card-hd`}>
          <div className="card-title">All Issues ({issues.length})</div>
          <div className={issueStyles.cardHeaderBadges}>
            <span className="badge b-amber">{issues.filter(i => i.status === IssueStatus.Open).length} Open</span>
            <span className="badge b-blue">{issues.filter(i => i.status === IssueStatus.InProgress).length} In Progress</span>
            <span className="badge b-green">{issues.filter(i => i.status === IssueStatus.Resolved).length} Resolved</span>
          </div>
        </div>
        
        <div className={issueStyles.filterContainer}>
          <select 
            className={issueStyles.sStat} 
            value={statusFilter} 
            onChange={(e) => setStatusFilter(e.target.value as IssueStatus | 'All statuses')}
          >
            <option value="All statuses">All statuses</option>
            {ALLOWED_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        <div className={issueStyles.tableContainer}>
          <table className={issueStyles.it}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Issue</th>
                <th>Logged By</th>
                <th>Date</th>
                <th>Time Lapse</th>
                <th>Status</th>
                <th>Last Update</th>
                {role === 'agent' && <th>Action</th>}
              </tr>
            </thead>
            <tbody>
              {filteredIssues.map((issue) => {
                const daysLapsed = issue.createdAt ? Math.floor((Date.now() - issue.createdAt.toMillis()) / (1000 * 60 * 60 * 24)) : 0;
                return (
                  <tr key={issue.id}>
                    <td><span className={issueStyles.issueId}>#{issue.id.slice(0, 4).toUpperCase()}</span></td>
                    <td>
                      <div className={issueStyles.issueTitleCell}>
                        <span className={`${issueStyles.pd} ${getUrgencyDotClass(issue.urgency)} ${issueStyles.pdMargin}`}></span>
                        {issue.title}
                      </div>
                    </td>
                    <td>
                      <div className={issueStyles.loggedByName}>{issue.loggedByName}</div>
                      <div className={issueStyles.issueSub}>{issue.loggedByRole}</div>
                    </td>
                    <td>{formatDate(issue.createdAt)}</td>
                    <td>
                      {daysLapsed > 0 ? (
                        <span className={`badge b-gray ${daysLapsed >= 7 ? issueStyles.lapseWarning : ''}`}>
                          {daysLapsed} days {daysLapsed >= 7 && '⚠️'}
                        </span>
                      ) : 'Today'}
                    </td>
                    <td><span className={`badge ${getStatusBadgeClass(issue.status)}`}>{issue.status}</span></td>
                    <td>{formatDate(issue.updatedAt)}</td>
                    {role === 'agent' && (
                      <td>
                         <select 
                          className={issueStyles.sStat}
                          value={issue.status}
                          onChange={(e) => handleUpdateStatus(issue.id, e.target.value as IssueStatus)}
                        >
                          {ALLOWED_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </td>
                    )}
                  </tr>
                );
              })}
              {filteredIssues.length === 0 && (
                <tr><td colSpan={role === 'agent' ? 8 : 7} className={issueStyles.emptyMessage}>No issues found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
