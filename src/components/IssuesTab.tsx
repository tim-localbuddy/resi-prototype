interface IssuesTabProps {
  role: 'resident' | 'committee' | 'agent';
}

export function IssuesTab({ role }: IssuesTabProps) {
  if (role === 'resident') {
    return (
      <div className="tc on">
        <div className="log-form">
          <h4>➕ Log a New Issue</h4>
          <div className="fg"><label className="fl">Issue Title</label><input className="fi" type="text" placeholder="e.g. Broken light in corridor, Floor 2" /></div>
          <div className="fg"><label className="fl">Description</label><textarea className="fi" rows={3} placeholder="Describe the issue in detail…" style={{ resize: 'vertical' }}></textarea></div>
          <div className="frow">
            <div className="fg">
              <label className="fl">Category</label>
              <select className="fselect">
                <option>Maintenance</option><option>Safety</option><option>Communal Area</option><option>Noise</option><option>Other</option>
              </select>
            </div>
            <div className="fg">
              <label className="fl">Urgency</label>
              <select className="fselect">
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
            <table className="it">
              <thead><tr><th>ID</th><th>Issue</th><th>Logged</th><th>Status</th><th>Last Update</th></tr></thead>
              <tbody>
                <tr>
                  <td><span className="issue-id">#001</span></td>
                  <td><div className="issue-title" style={{ fontSize: '13px' }}>Water leak – Flat 4B</div></td>
                  <td><span className="badge b-gray">12 Apr</span></td>
                  <td><span className="badge s-progress">In Progress</span></td>
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
