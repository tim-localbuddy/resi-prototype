import { Outlet, NavLink } from 'react-router-dom';

export function AgentLayout() {
  return (
    <>
      <div className="tab-bar">
        <NavLink to="/dashboard/buildings" className={({ isActive }) => `tab ${isActive ? 'on' : ''}`} style={{ textDecoration: 'none' }}>🏢 Buildings</NavLink>
        <NavLink to="/dashboard/docs" className={({ isActive }) => `tab ${isActive ? 'on' : ''}`} style={{ textDecoration: 'none' }}>📁 Documents</NavLink>
        <NavLink to="/dashboard/issues" className={({ isActive }) => `tab ${isActive ? 'on' : ''}`} style={{ textDecoration: 'none' }}>🔍 All Issues</NavLink>
      </div>
      <Outlet />
    </>
  );
}
