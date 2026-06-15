import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import type { UserRole } from "../lib/auth/userRole";

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

  // Role not allowed (if we actually passed allowedRoles and they didn't have it)
  // For now, since everything is under /dashboard, we might not even need this, 
  // but if they hit a route they shouldn't, we can just send them to /dashboard
  if (!hasAllowedRole) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}
