import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Logo } from '../components/Logo';
import { DocumentsTab } from '../components/DocumentsTab';

export function AgentDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('buildings');

  return (
    <div id="view-agent" className="view on" style={{ paddingTop: 0 }}>
      <div className="dash-wrap">
        <aside className="sidebar">
          <Logo variant="sidebar" />
          <div className="sb-section">
            <div className="sb-sec-label">Portfolio</div>
            <div className={`sb-item ${activeTab === 'buildings' ? 'on' : ''}`} onClick={() => setActiveTab('buildings')}><span className="ic">🏢</span>Buildings</div>
            <div className={`sb-item ${activeTab === 'docs' ? 'on' : ''}`} onClick={() => setActiveTab('docs')}><span className="ic">📁</span>Documents</div>
            <div className={`sb-item ${activeTab === 'issues' ? 'on' : ''}`} onClick={() => setActiveTab('issues')}><span className="ic">🔍</span>All Issues</div>
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
          {activeTab === 'buildings' && (
            <>
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
            </>
          )}

          {activeTab === 'docs' && (
            <DocumentsTab role="agent" />
          )}

          {activeTab === 'issues' && (
            <div className="tc on" style={{ padding: '24px', textAlign: 'center', color: 'var(--text2)', background: 'var(--surface)', borderRadius: '14px', border: '1px dashed var(--border)' }}>
              <h3>Issues Content</h3>
              <p>Placeholder for the detailed view of this tab.</p>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}
