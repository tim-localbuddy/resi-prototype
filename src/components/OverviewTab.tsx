import { Link } from 'react-router-dom';

export function OverviewTab() {
  return (
    <div className="tc on">
      <div className="ph">
        <div><div className="pt">Maple House</div><div className="ps">42 Elm Road, London E1 4AB · Committee Director Dashboard</div></div>
        <Link to="/committee/docs" className="btn btn-primary btn-sm" style={{ textDecoration: 'none' }}>+ Upload Document</Link>
      </div>
      <div className="stats">
        <div className="sc"><div className="sl">Documents</div><div className="sv">5</div><div className="sm">2 committee only</div></div>
        <div className="sc"><div className="sl">Open Issues</div><div className="sv" style={{ color: 'var(--amber)' }}>3</div><div className="sm">2 overdue ⚠️</div></div>
        <div className="sc"><div className="sl">Residents</div><div className="sv">12</div><div className="sm">8 registered</div></div>
        <div className="sc"><div className="sl">Next AGM</div><div className="sv" style={{ fontSize: '16px', paddingTop: '4px' }}>Nov '26</div><div className="sm">~8 months away</div></div>
      </div>
      <div className="alert a-amber">
        <div className="alert-ic">⏰</div>
        <div><div className="alert-title">Weekly Reminder — 2 issues unresolved for 7+ days</div>Issues #001 (10 days) and #002 (7 days) remain open. The management agent has been automatically reminded. <Link to="/committee/issues" style={{ color: 'var(--amber)', fontWeight: 700, textDecoration: 'none' }}>View issue log →</Link></div>
      </div>
      <div className="alert a-red">
        <div className="alert-ic">🤖</div>
        <div><div className="alert-title">AI Self-Discovered Issue — Lift Maintenance Certificate Overdue</div>Bofast has flagged that the lift maintenance certificate in your documents appears to have expired. This has been automatically logged as issue #003. <Link to="/committee/issues" style={{ color: 'var(--red)', fontWeight: 700, textDecoration: 'none' }}>Review now →</Link></div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        <div className="card">
          <div className="card-hd"><div className="card-title">Recent Issues</div><Link to="/committee/issues" className="text-xs" style={{ color: 'var(--blue)', textDecoration: 'none' }}>View all →</Link></div>
          <div className="card-body" style={{ padding: 0 }}>
            <table className="it" style={{ fontSize: '12px' }}>
              <tbody>
                <tr><td><span className="issue-id">#001</span></td><td><div className="issue-title" style={{ fontSize: '12px' }}>Water leak – Flat 4B</div></td><td><span className="badge s-progress">In Progress</span></td></tr>
                <tr><td><span className="issue-id">#002</span></td><td><div className="issue-title" style={{ fontSize: '12px' }}>Broken intercom</div></td><td><span className="badge s-open">Open</span></td></tr>
                <tr><td><span className="issue-id">#003</span></td><td><div className="issue-title" style={{ fontSize: '12px' }}>Lift cert overdue 🤖</div></td><td><span className="badge s-open">Open</span></td></tr>
              </tbody>
            </table>
          </div>
        </div>
        <div className="card">
          <div className="card-hd"><div className="card-title">Recent Documents</div><Link to="/committee/docs" className="text-xs" style={{ color: 'var(--blue)', textDecoration: 'none' }}>View all →</Link></div>
          <div className="card-body" style={{ padding: 0 }}>
            <table className="it" style={{ fontSize: '12px' }}>
              <tbody>
                <tr><td>📋</td><td><div className="issue-title" style={{ fontSize: '12px' }}>Service Charge 2024/25</div><div className="issue-sub">Committee only</div></td><td><span className="badge b-gray">15 Mar</span></td></tr>
                <tr><td>🏗️</td><td><div className="issue-title" style={{ fontSize: '12px' }}>Major Works – Phase 1</div><div className="issue-sub">All residents</div></td><td><span className="badge b-gray">1 Mar</span></td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
