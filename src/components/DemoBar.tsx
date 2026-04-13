import { Link, useLocation } from 'react-router-dom';

export function DemoBar() {
  const location = useLocation();

  const routes = [
    { name: 'Landing', path: '/' },
    { name: 'Login', path: '/login' },
    { name: 'Register', path: '/register' },
    { name: 'Email Verify', path: '/verify' },
    { name: 'Resident', path: '/resident' },
    { name: 'Committee Director', path: '/committee' },
    { name: 'Management Agent', path: '/agent' },
  ];

  return (
    <div className="demo-bar">
      <span className="label">🧭 PROTOTYPE:</span>
      {routes.map((r) => (
        <Link
          key={r.path}
          to={r.path}
          className={`db ${location.pathname === r.path ? 'on' : ''}`}
          style={{ textDecoration: 'none', display: 'inline-block' }}
        >
          {r.name}
        </Link>
      ))}
    </div>
  );
}
