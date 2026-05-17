import { Outlet, NavLink } from 'react-router-dom';

export function CommitteeLayout() {
  return (
    <>
      {/* Tab Bar */}
      <div className="tab-bar">
        <NavLink to="/committee/overview" className={({ isActive }) => `tab ${isActive ? 'on' : ''}`} style={{ textDecoration: 'none' }}>📊 Overview</NavLink>
        <NavLink to="/committee/docs" className={({ isActive }) => `tab ${isActive ? 'on' : ''}`} style={{ textDecoration: 'none' }}>📁 Documents</NavLink>
        <NavLink to="/committee/chat" className={({ isActive }) => `tab ${isActive ? 'on' : ''}`} style={{ textDecoration: 'none' }}>🤖 AI Assistant</NavLink>
        <NavLink to="/committee/issues" className={({ isActive }) => `tab ${isActive ? 'on' : ''}`} style={{ textDecoration: 'none' }}>🔍 Issue Log</NavLink>
        <NavLink to="/committee/timeline" className={({ isActive }) => `tab ${isActive ? 'on' : ''}`} style={{ textDecoration: 'none' }}>📅 Governance</NavLink>
      </div>

      <Outlet />
    </>
  );
}
