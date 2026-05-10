import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

/**
 * Wraps public-only routes (Landing, Login, Register).
 * If the user is already authenticated and verified, redirect them
 * straight to their role-specific dashboard.
 */
export function PublicOnlyRoute() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '100px' }}>
        <div style={{ color: 'var(--text2)' }}>Loading...</div>
      </div>
    );
  }

  if (user && user.emailVerified) {
    const roles = Object.values(user.properties || {});
    if (roles.includes('agent')) return <Navigate to="/agent" replace />;
    if (roles.includes('director')) return <Navigate to="/committee" replace />;
    return <Navigate to="/resident" replace />;
  }

  return <Outlet />;
}
