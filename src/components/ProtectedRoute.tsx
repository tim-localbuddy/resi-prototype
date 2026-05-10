import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import type { UserRole } from '../lib/auth/types';

interface ProtectedRouteProps {
  allowedRoles?: UserRole[];
}

export function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '100px' }}>
        <div style={{ color: 'var(--text2)' }}>Loading authentication state...</div>
      </div>
    );
  }

  // Not authenticated
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Authenticated but email not verified
  if (!user.emailVerified && location.pathname !== '/verify') {
    return <Navigate to="/verify" replace />;
  }

  const userRoles = Object.values(user.properties || {});
  const hasAllowedRole = allowedRoles ? userRoles.some(r => allowedRoles.includes(r)) : true;

  // Role not allowed
  if (!hasAllowedRole) {
    // Redirect to default dashboard based on highest role they do have
    if (userRoles.includes('agent')) return <Navigate to="/agent" replace />;
    if (userRoles.includes('director')) return <Navigate to="/committee" replace />;
    if (userRoles.includes('resident')) return <Navigate to="/resident" replace />;
    
    return <Navigate to="/login" replace />; // Error fallback
  }

  return <Outlet />;
}
