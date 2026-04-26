import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Logo } from '../components/Logo';
import { DocumentsTab } from '../components/DocumentsTab';

export function CommitteeDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div id="view-committee" className="view on" style={{ paddingTop: 0 }}>
      <div className="dash-wrap">
        <aside className="sidebar">
          <Logo variant="sidebar" />
          <div className="sb-section">
            <div className="sb-sec-label">Committee</div>
            <div className={`sb-item ${activeTab === 'overview' ? 'on' : ''}`} onClick={() => setActiveTab('overview')}><span className="ic">📊</span>Overview</div>
            <div className={`sb-item ${activeTab === 'docs' ? 'on' : ''}`} onClick={() => setActiveTab('docs')}><span className="ic">📁</span>Documents</div>
            <div className={`sb-item ${activeTab === 'chat' ? 'on' : ''}`} onClick={() => setActiveTab('chat')}><span className="ic">🤖</span>AI Assistant</div>
            <div className={`sb-item ${activeTab === 'issues' ? 'on' : ''}`} onClick={() => setActiveTab('issues')}><span className="ic">🔍</span>Issue Log<span className="sb-badge">3</span></div>
            <div className={`sb-item ${activeTab === 'timeline' ? 'on' : ''}`} onClick={() => setActiveTab('timeline')}><span className="ic">📅</span>Governance</div>
          </div>
          <div className="sb-section">
            <div className="sb-sec-label">Admin</div>
            <div className="sb-item"><span className="ic">👥</span>Residents</div>
            <div className="sb-item" onClick={() => navigate('/login')}><span className="ic">⚙️</span>Settings</div>
          </div>
          <div className="sb-user">
            <div className="sb-av" style={{ background: '#7C3AED' }}>ED</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div className="sb-uname">Emma Davies</div>
              <div className="sb-urole">Committee Director</div>
            </div>
            <div className="sb-logout" onClick={() => navigate('/')} title="Sign out">↩</div>
          </div>
        </aside>
        
        <main className="main">
          <div className="tab-bar">
            <div className={`tab ${activeTab === 'overview' ? 'on' : ''}`} onClick={() => setActiveTab('overview')}>📊 Overview</div>
            <div className={`tab ${activeTab === 'docs' ? 'on' : ''}`} onClick={() => setActiveTab('docs')}>📁 Documents</div>
            <div className={`tab ${activeTab === 'chat' ? 'on' : ''}`} onClick={() => setActiveTab('chat')}>🤖 AI Assistant</div>
            <div className={`tab ${activeTab === 'issues' ? 'on' : ''}`} onClick={() => setActiveTab('issues')}>🔍 Issue Log</div>
            <div className={`tab ${activeTab === 'timeline' ? 'on' : ''}`} onClick={() => setActiveTab('timeline')}>📅 Governance</div>
          </div>

          {/* Overview */}
          {activeTab === 'overview' && (
            <div className="tc on">
              <div className="ph">
                <div><div className="pt">Maple House</div><div className="ps">42 Elm Road, London E1 4AB · Committee Director Dashboard</div></div>
                <button className="btn btn-primary btn-sm" onClick={() => setActiveTab('docs')}>+ Upload Document</button>
              </div>
              <div className="stats">
                <div className="sc"><div className="sl">Documents</div><div className="sv">5</div><div className="sm">2 committee only</div></div>
                <div className="sc"><div className="sl">Open Issues</div><div className="sv" style={{ color: 'var(--amber)' }}>3</div><div className="sm">2 overdue ⚠️</div></div>
                <div className="sc"><div className="sl">Residents</div><div className="sv">12</div><div className="sm">8 registered</div></div>
                <div className="sc"><div className="sl">Next AGM</div><div className="sv" style={{ fontSize: '16px', paddingTop: '4px' }}>Nov '26</div><div className="sm">~8 months away</div></div>
              </div>
              <div className="alert a-amber">
                <div className="alert-ic">⏰</div>
                <div><div className="alert-title">Weekly Reminder — 2 issues unresolved for 7+ days</div>Issues #001 (10 days) and #002 (7 days) remain open. The management agent has been automatically reminded. <a style={{ color: 'var(--amber)', fontWeight: 700, cursor: 'pointer' }} onClick={() => setActiveTab('issues')}>View issue log →</a></div>
              </div>
              <div className="alert a-red">
                <div className="alert-ic">🤖</div>
                <div><div className="alert-title">AI Self-Discovered Issue — Lift Maintenance Certificate Overdue</div>Bofast has flagged that the lift maintenance certificate in your documents appears to have expired. This has been automatically logged as issue #003. <a style={{ color: 'var(--red)', fontWeight: 700, cursor: 'pointer' }} onClick={() => setActiveTab('issues')}>Review now →</a></div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div className="card">
                  <div className="card-hd"><div className="card-title">Recent Issues</div><a className="text-xs" style={{ color: 'var(--blue)', cursor: 'pointer' }} onClick={() => setActiveTab('issues')}>View all →</a></div>
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
                  <div className="card-hd"><div className="card-title">Recent Documents</div><a className="text-xs" style={{ color: 'var(--blue)', cursor: 'pointer' }} onClick={() => setActiveTab('docs')}>View all →</a></div>
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
          )}

          {activeTab === 'docs' && (
            <DocumentsTab role="committee" />
          )}

          {activeTab !== 'overview' && activeTab !== 'docs' && (
            <div className="tc on" style={{ padding: '24px', textAlign: 'center', color: 'var(--text2)', background: 'var(--surface)', borderRadius: '14px', border: '1px dashed var(--border)' }}>
              <h3>{activeTab} Content</h3>
              <p>Placeholder for the detailed view of this tab.</p>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}
