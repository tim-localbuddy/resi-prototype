import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import type { AppUser } from '../lib/auth/types';

interface ProtectedRouteProps {
  allowedRoles?: AppUser['role'][];
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

  // Role not allowed
  if (allowedRoles && (!user.role || !allowedRoles.includes(user.role))) {
    // Redirect to default dashboard based on role
    if (user.role === 'resident') return <Navigate to="/resident" replace />;
    if (user.role === 'director') return <Navigate to="/committee" replace />;
    if (user.role === 'agent') return <Navigate to="/agent" replace />;
    
    return <Navigate to="/login" replace />; // Error fallback
  }

  return <Outlet />;
}
