export function DocumentsTab({ role = 'resident' }: { role?: 'resident' | 'committee' | 'agent' }) {
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

      <div className="doc-grid">
        <div className="doc-card" onClick={() => alert('📄 Opening AGM Minutes – November 2025...')}>
          <div className="doc-ic">📋</div>
          <div className="doc-name">AGM Minutes – November 2025</div>
          <div className="doc-meta">Uploaded 20 Nov 2025</div>
          <div className="doc-foot">
            <span className="badge b-green">All Residents</span>
            <span className="text-xs text2">PDF · 340KB</span>
          </div>
        </div>
        <div className="doc-card" onClick={() => alert('📄 Opening Building Insurance Certificate 2025...')}>
          <div className="doc-ic">🛡️</div>
          <div className="doc-name">Building Insurance Certificate 2025</div>
          <div className="doc-meta">Uploaded 3 Jan 2026</div>
          <div className="doc-foot">
            <span className="badge b-green">All Residents</span>
            <span className="text-xs text2">PDF · 210KB</span>
          </div>
        </div>
        <div className="doc-card" onClick={() => alert('📄 Opening Major Works Consultation – Phase 1...')}>
          <div className="doc-ic">🏗️</div>
          <div className="doc-name">Major Works Consultation – Phase 1</div>
          <div className="doc-meta">Uploaded 1 Mar 2026</div>
          <div className="doc-foot">
            <span className="badge b-green">All Residents</span>
            <span className="text-xs text2">PDF · 890KB</span>
          </div>
        </div>

        {(role === 'committee' || role === 'agent') && (
          <>
            <div className="doc-card" onClick={() => alert('📄 Opening Service Charge 2024/25...')}>
              <div className="doc-ic">💷</div>
              <div className="doc-name">Service Charge 2024/25</div>
              <div className="doc-meta">Uploaded 15 Mar 2026</div>
              <div className="doc-foot">
                <span className="badge b-gray">Committee Only</span>
                <span className="text-xs text2">Excel · 1.2MB</span>
              </div>
            </div>
            <div className="doc-card" onClick={() => alert('📄 Opening Lift Maintenance Contract...')}>
              <div className="doc-ic">📝</div>
              <div className="doc-name">Lift Maintenance Contract</div>
              <div className="doc-meta">Uploaded 10 Jan 2026</div>
              <div className="doc-foot">
                <span className="badge b-gray">Committee Only</span>
                <span className="text-xs text2">PDF · 450KB</span>
              </div>
            </div>
          </>
        )}
      </div>

      {role === 'resident' && (
        <div style={{ marginTop: '16px', padding: '14px', background: 'var(--amber2)', border: '1px solid #FDE68A', borderRadius: '10px', fontSize: '13px', color: '#78350F' }}>
          🔒 <strong>2 additional documents</strong> are available to committee members only. Contact your director if you need access.
        </div>
      )}
    </div>
  );
}
