import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Logo } from '../components/Logo';
import { DocumentsTab } from '../components/DocumentsTab';
import { ChatTab } from '../components/ChatTab';

export function ResidentDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('docs');

  return (
    <div id="view-resident" className="view on" style={{ paddingTop: 0 }}>
      <div className="dash-wrap">
        <aside className="sidebar">
          <Logo variant="sidebar" />
          <div className="sb-section">
            <div className="sb-sec-label">My Building</div>
            <div className={`sb-item ${activeTab === 'docs' ? 'on' : ''}`} onClick={() => setActiveTab('docs')}>
              <span className="ic">📁</span>Documents
            </div>
            <div className={`sb-item ${activeTab === 'chat' ? 'on' : ''}`} onClick={() => setActiveTab('chat')}>
              <span className="ic">🤖</span>Ask AI
            </div>
            <div className={`sb-item ${activeTab === 'issues' ? 'on' : ''}`} onClick={() => setActiveTab('issues')}>
              <span className="ic">🔍</span>Issue Log<span className="sb-badge">2</span>
            </div>
          </div>
          <div className="sb-section">
            <div className="sb-sec-label">Account</div>
            <div className="sb-item" onClick={() => navigate('/login')}><span className="ic">⚙️</span>Settings</div>
          </div>
          <div className="sb-user">
            <div className="sb-av">TM</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div className="sb-uname">Terry Ma</div>
              <div className="sb-urole">Resident · Flat 3A</div>
            </div>
            <div className="sb-logout" onClick={() => navigate('/')} title="Sign out">↩</div>
          </div>
        </aside>

        <main className="main">
          {/* Welcome Banner */}
          <div style={{ background: 'linear-gradient(135deg,var(--navy),#1e3a8a)', borderRadius: '14px', padding: '24px 28px', marginBottom: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', color: '#60A5FA', marginBottom: '4px' }}>Maple House · Flat 3A</div>
              <div style={{ fontSize: '20px', fontWeight: 800, color: '#fff', marginBottom: '4px' }}>Good morning, Terry 👋</div>
              <div style={{ fontSize: '13px', color: '#94A3B8' }}>3 documents available · 2 issues open · Next AGM: November 2026</div>
            </div>
            <button className="btn btn-primary btn-sm" onClick={() => setActiveTab('chat')}>🤖 Ask AI about your building</button>
          </div>

          {/* Resident Tabs */}
          <div className="tab-bar">
            <div className={`tab ${activeTab === 'docs' ? 'on' : ''}`} onClick={() => setActiveTab('docs')}>📁 Documents</div>
            <div className={`tab ${activeTab === 'chat' ? 'on' : ''}`} onClick={() => setActiveTab('chat')}>🤖 Ask AI</div>
            <div className={`tab ${activeTab === 'issues' ? 'on' : ''}`} onClick={() => setActiveTab('issues')}>🔍 Issue Log</div>
          </div>

          {/* Docs Tab */}
          {activeTab === 'docs' && (
            <DocumentsTab role="resident" />
          )}

          {/* Chat Tab */}
          {activeTab === 'chat' && (
            <ChatTab role="resident" />
          )}

          {/* Issues Tab */}
          {activeTab === 'issues' && (
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
                      {/* Placeholder generic issue */}
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
          )}
        </main>
      </div>
    </div>
  );
}
