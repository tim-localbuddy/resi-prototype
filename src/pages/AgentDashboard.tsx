import { useNavigate } from 'react-router-dom';

export function AgentDashboard() {
  const navigate = useNavigate();

  return (
    <div id="view-agent" className="view on" style={{ paddingTop: 0 }}>
      <div className="dash-wrap">
        <aside className="sidebar">
          <div className="sb-logo">
            <div className="sb-logo-mark">R</div>
            <span className="sb-logo-txt">Resi<span>.ai</span></span>
          </div>
          <div className="sb-section">
            <div className="sb-sec-label">Portfolio</div>
            <div className="sb-item on"><span className="ic">🏢</span>Buildings</div>
            <div className="sb-item"><span className="ic">🔍</span>All Issues</div>
          </div>
          <div className="sb-user">
            <div className="sb-av" style={{ background: 'var(--amber)' }}>AG</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div className="sb-uname">Agent Portal</div>
              <div className="sb-urole">Management Agent</div>
            </div>
            <div className="sb-logout" onClick={() => navigate('/')} title="Sign out">↩</div>
          </div>
        </aside>
        
        <main className="main">
          <div className="ph">
            <div><div className="pt">Agent Portfolio</div><div className="ps">Manage all your buildings from one place</div></div>
          </div>
          
          <div className="block-card">
            <div className="block-name">Maple House</div>
            <div className="block-addr">42 Elm Road, London E1 4AB</div>
            <div className="block-stats">
              <div className="bstat"><div className="bstat-val">3</div><div className="bstat-lbl">Open Issues</div></div>
              <div className="bstat"><div className="bstat-val">2</div><div className="bstat-lbl">Overdue</div></div>
              <div className="bstat"><div className="bstat-val" style={{ color: 'var(--green)' }}>98%</div><div className="bstat-lbl">Compliance</div></div>
            </div>
            <button className="btn btn-outline btn-sm mt-4" onClick={() => navigate('/committee')}>Log in as Committee →</button>
          </div>

        </main>
      </div>
    </div>
  );
}
