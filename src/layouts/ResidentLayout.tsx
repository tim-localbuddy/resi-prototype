import { Outlet, NavLink } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';

export function ResidentLayout() {
  const { user } = useAuth();
  const firstName = user?.firstName || 'there';

  return (
    <>
      {/* Welcome Banner */}
      <div style={{ background: 'linear-gradient(135deg,var(--navy),#1e3a8a)', borderRadius: '14px', padding: '24px 28px', marginBottom: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', color: '#60A5FA', marginBottom: '4px' }}>Maple House · Flat 3A</div>
          <div style={{ fontSize: '20px', fontWeight: 800, color: '#fff', marginBottom: '4px' }}>Good morning, {firstName} 👋</div>
          <div style={{ fontSize: '13px', color: '#94A3B8' }}>3 documents available · 2 issues open · Next AGM: November 2026</div>
        </div>
        <Link to="/dashboard/chat" className="btn btn-primary btn-sm" style={{ textDecoration: 'none' }}>💬✨ Ask AI about your building</Link>
      </div>

      {/* Tab Bar */}
      <div className="tab-bar">
        <NavLink to="/dashboard/docs" className={({ isActive }) => `tab ${isActive ? 'on' : ''}`} style={{ textDecoration: 'none' }}>📁 Documents</NavLink>
        <NavLink to="/dashboard/chat" className={({ isActive }) => `tab ${isActive ? 'on' : ''}`} style={{ textDecoration: 'none' }}>💬✨ Ask AI</NavLink>
        <NavLink to="/dashboard/issues" className={({ isActive }) => `tab ${isActive ? 'on' : ''}`} style={{ textDecoration: 'none' }}>🔍 Issue Log</NavLink>
      </div>

      <Outlet />
    </>
  );
}
