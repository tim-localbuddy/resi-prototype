import { useLocation, useNavigate, NavLink } from 'react-router-dom';
import { Logo } from './Logo';
import { useAuth } from '../contexts/AuthContext';
import { authProvider } from '../lib/auth';

interface SidebarItem {
  icon: string;
  label: string;
  path: string;
  badge?: number;
}

interface SidebarSection {
  label: string;
  items: SidebarItem[];
}

const sectionsByRole: Record<string, SidebarSection[]> = {
  agent: [
    {
      label: 'Portfolio',
      items: [
        { icon: '🏢', label: 'Buildings', path: '/agent/buildings' },
        { icon: '📁', label: 'Documents', path: '/agent/docs' },
        { icon: '🔍', label: 'All Issues', path: '/agent/issues' },
      ]
    }
  ],
  committee: [
    {
      label: 'Committee',
      items: [
        { icon: '📊', label: 'Overview', path: '/committee/overview' },
        { icon: '📁', label: 'Documents', path: '/committee/docs' },
        { icon: '🤖', label: 'AI Assistant', path: '/committee/chat' },
        { icon: '🔍', label: 'Issue Log', badge: 3, path: '/committee/issues' },
        { icon: '📅', label: 'Governance', path: '/committee/timeline' },
      ]
    },
    {
      label: 'Admin',
      items: [
        { icon: '👥', label: 'Residents', path: '/committee/residents' },
        { icon: '⚙️', label: 'Settings', path: '/login' },
      ]
    }
  ],
  resident: [
    {
      label: 'My Building',
      items: [
        { icon: '📁', label: 'Documents', path: '/resident/docs' },
        { icon: '🤖', label: 'Ask AI', path: '/resident/chat' },
        { icon: '🔍', label: 'Issue Log', badge: 2, path: '/resident/issues' },
      ]
    },
    {
      label: 'Account',
      items: [
        { icon: '⚙️', label: 'Settings', path: '/login' },
      ]
    }
  ],
};

const avatarColors: Record<string, string> = {
  agent: 'var(--amber)',
  committee: '#7C3AED',
};

export function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const handleSignOut = async () => {
    await authProvider.signOut();
    navigate('/');
  };

  const basePath = location.pathname.split('/').filter(Boolean)[0] || '';
  const sections = sectionsByRole[basePath] || [];
  const avatarBg = avatarColors[basePath] || '';

  const displayName = user?.displayName || user?.email || 'User';
  const initials = displayName.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase();

  const getRoleDisplay = () => {
    if (!user?.properties) return '';
    const entries = Object.entries(user.properties);
    if (entries.length === 0) return 'User';
    const [property, role] = entries[0];
    return `${role.charAt(0).toUpperCase() + role.slice(1)} · ${property}`;
  };

  return (
    <aside className="sidebar">
      <Logo variant="sidebar" />
      
      {sections.map((section, idx) => (
        <div key={idx} className="sb-section">
          <div className="sb-sec-label">{section.label}</div>
          {section.items.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `sb-item ${isActive ? 'on' : ''}`}
              style={{ textDecoration: 'none' }}
            >
              <span className="ic">{item.icon}</span>
              {item.label}
              {item.badge !== undefined && <span className="sb-badge">{item.badge}</span>}
            </NavLink>
          ))}
        </div>
      ))}

      <div className="sb-user">
        <div className="sb-av" style={avatarBg ? { background: avatarBg } : {}}>
          {initials}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="sb-uname" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{displayName}</div>
          <div className="sb-urole" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{getRoleDisplay()}</div>
        </div>
        <div className="sb-logout" onClick={handleSignOut} title="Sign out" style={{ cursor: 'pointer' }}>↩</div>
      </div>
    </aside>
  );
}
