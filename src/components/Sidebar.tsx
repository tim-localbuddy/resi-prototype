import { useNavigate, NavLink } from 'react-router-dom';
import { Logo } from './Logo';
import { useAuth } from '../contexts/AuthContext';
import { authProvider } from '../lib/auth';
import styles from '../layouts/Dashboard.module.css';

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
        { icon: '🏢', label: 'Buildings', path: '/dashboard/buildings' },
        { icon: '📁', label: 'Documents', path: '/dashboard/docs' },
        { icon: '🔍', label: 'All Issues', path: '/dashboard/issues' },
      ]
    },
    {
      label: 'Account',
      items: [
        { icon: '⚙️', label: 'Settings', path: '/settings/profile' },
      ]
    }
  ],
  committee: [
    {
      label: 'Committee',
      items: [
        { icon: '📊', label: 'Overview', path: '/dashboard/overview' },
        { icon: '📁', label: 'Documents', path: '/dashboard/docs' },
        { icon: '✨', label: 'AI Assistant', path: '/dashboard/chat' },
        { icon: '🔍', label: 'Issue Log', badge: 3, path: '/dashboard/issues' },
        { icon: '📅', label: 'Governance', path: '/dashboard/timeline' },
      ]
    },
    {
      label: 'Admin',
      items: [
        { icon: '👥', label: 'Residents', path: '/dashboard/residents' },
        { icon: '⚙️', label: 'Settings', path: '/settings/profile' },
      ]
    }
  ],
  resident: [
    {
      label: 'My Building',
      items: [
        { icon: '📁', label: 'Documents', path: '/dashboard/docs' },
        { icon: '✨', label: 'Ask AI', path: '/dashboard/chat' },
        { icon: '🔍', label: 'Issue Log', badge: 2, path: '/dashboard/issues' },
      ]
    },
    {
      label: 'Account',
      items: [
        { icon: '⚙️', label: 'Settings', path: '/settings/profile' },
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
  const { user } = useAuth();

  const handleSignOut = async () => {
    await authProvider.signOut();
    navigate('/');
  };

  const roles = Object.values(user?.properties || {});
  let activeRole = 'resident';
  if (roles.includes('agent')) activeRole = 'agent';
  else if (roles.includes('director')) activeRole = 'committee';
  
  const sections = sectionsByRole[activeRole] || [];
  const avatarBg = avatarColors[activeRole] || '';

  const fullName = user ? `${user.firstName} ${user.lastName}`.trim() : 'User';
  const initials = fullName.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase();

  const getRoleDisplay = () => {
    if (!user?.properties) return '';
    const entries = Object.entries(user.properties);
    if (entries.length === 0) return 'User';
    const [property, role] = entries[0];
    return `${role.charAt(0).toUpperCase() + role.slice(1)} · ${property}`;
  };

  return (
    <aside className={styles.sidebar}>
      <Logo variant="sidebar" />

      {sections.map((section, idx) => (
        <div key={idx} className={styles.sbSection}>
          <div className={styles.sbSecLabel}>{section.label}</div>
          {section.items.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `${styles.sbItem} ${isActive ? styles.on : ''}`}
              style={{ textDecoration: 'none' }}
            >
              <span className={styles.ic}>{item.icon}</span>
              {item.label}
              {item.badge !== undefined && <span className={styles.sbBadge}>{item.badge}</span>}
            </NavLink>
          ))}
        </div>
      ))}

      <div className={styles.sbUser}>
        <div className={styles.sbAv} style={avatarBg ? { background: avatarBg } : {}}>
          {initials}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className={styles.sbUname} style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{fullName}</div>
          <div className={styles.sbUrole} style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{getRoleDisplay()}</div>
        </div>
        <div className={styles.sbLogout} onClick={handleSignOut} title="Sign out" style={{ cursor: 'pointer' }}>↩</div>
      </div>
    </aside>
  );
}
