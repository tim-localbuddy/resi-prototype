import issueStyles from './Issues.module.css';
import formStyles from '../pages/Auth.module.css';
import type { UserRole } from '../lib/auth/userRole';

interface IssuesTabProps {
  role: UserRole;
}

export function IssuesTab({ role }: IssuesTabProps) {
  if (role === 'resident') {
    return (
      <div className="tc on">
        <div className={issueStyles.logForm}>
          <h4 className={issueStyles.logFormTitle}>➕ Log a New Issue</h4>
          <div className={formStyles.formGroup}>
            <label className={formStyles.formLabel}>Issue Title</label>
            <input className={formStyles.formInput} type="text" placeholder="e.g. Broken light in corridor, Floor 2" />
          </div>
          <div className={formStyles.formGroup}>
            <label className={formStyles.formLabel}>Description</label>
            <textarea className={formStyles.formInput} rows={3} placeholder="Describe the issue in detail…" style={{ resize: 'vertical' }}></textarea>
          </div>
          <div className={formStyles.frow}>
            <div className={formStyles.formGroup}>
              <label className={formStyles.formLabel}>Category</label>
              <select className={formStyles.fselect}>
                <option>Maintenance</option><option>Safety</option><option>Communal Area</option><option>Noise</option><option>Other</option>
              </select>
            </div>
            <div className={formStyles.formGroup}>
              <label className={formStyles.formLabel}>Urgency</label>
              <select className={formStyles.fselect}>
                <option>Low</option><option>Medium</option><option>High</option><option>Urgent</option>
              </select>
            </div>
          </div>
          <button className="btn btn-primary btn-sm" onClick={() => alert('Issue logged!')}>Submit Issue</button>
        </div>
        <div className="card">
          <div className="card-hd">
            <div className="card-title">My Issue Log</div>
            <span className="badge b-amber">2 Open</span>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table className={issueStyles.it}>
              <thead><tr><th>ID</th><th>Issue</th><th>Logged</th><th>Status</th><th>Last Update</th></tr></thead>
              <tbody>
                <tr>
                  <td><span className={issueStyles.issueId}>#001</span></td>
                  <td><div className={issueStyles.issueTitle} style={{ fontSize: '13px' }}>Water leak – Flat 4B</div></td>
                  <td><span className="badge b-gray">12 Apr</span></td>
                  <td><span className={`badge ${issueStyles.sProgress}`}>In Progress</span></td>
                  <td>Today</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  // Fallback placeholder for agent and committee
  return (
    <div className="tc on" style={{ padding: '24px', textAlign: 'center', color: 'var(--text2)', background: 'var(--surface)', borderRadius: '14px', border: '1px dashed var(--border)' }}>
      <h3>Issues Content ({role})</h3>
      <p>Placeholder for the detailed view of this tab.</p>
    </div>
  );
}
