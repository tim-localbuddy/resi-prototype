import { Outlet, NavLink } from 'react-router-dom';

export function CommitteeLayout() {
  return (
    <>
      {/* Tab Bar */}
      <div className="tab-bar">
        <NavLink to="/dashboard/overview" className={({ isActive }) => `tab ${isActive ? 'on' : ''}`} style={{ textDecoration: 'none' }}>📊 Overview</NavLink>
        <NavLink to="/dashboard/docs" className={({ isActive }) => `tab ${isActive ? 'on' : ''}`} style={{ textDecoration: 'none' }}>📁 Documents</NavLink>
        <NavLink to="/dashboard/chat" className={({ isActive }) => `tab ${isActive ? 'on' : ''}`} style={{ textDecoration: 'none' }}>💬✨ AI Assistant</NavLink>
        <NavLink to="/dashboard/issues" className={({ isActive }) => `tab ${isActive ? 'on' : ''}`} style={{ textDecoration: 'none' }}>🔍 Issue Log</NavLink>
        <NavLink to="/dashboard/timeline" className={({ isActive }) => `tab ${isActive ? 'on' : ''}`} style={{ textDecoration: 'none' }}>📅 Governance</NavLink>
      </div>

      <Outlet />
    </>
  );
}
