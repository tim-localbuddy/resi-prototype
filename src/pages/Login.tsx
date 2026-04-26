import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authProvider } from '../lib/auth';
import { Logo } from '../components/Logo';

export function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const routeByUserRole = (role: string | null) => {
    if (role === 'director') navigate('/committee');
    else if (role === 'agent') navigate('/agent');
    else navigate('/resident');
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const user = await authProvider.signInWithEmail(email, password);
      // ProtectedRoute will actually handle unverified/role issues, 
      // but we optimistically route them to their likely destination here
      if (!user.emailVerified) {
        navigate('/verify');
      } else {
        routeByUserRole(user.role);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to sign in.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError('');
    try {
      const user = await authProvider.signInWithGoogle();
      if (!user.emailVerified) {
        navigate('/verify');
      } else {
        routeByUserRole(user.role);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to sign in with Google.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="view-login" className="view on" style={{ paddingTop: 0 }}>
      <div className="auth-wrap">
        <div className="auth-card">
          <Logo variant="auth" style={{ marginBottom: '28px' }} />
          <h2>Welcome back</h2>
          <p className="sub">Sign in to your building community account</p>

          {error && (
            <div className="alert a-red" style={{ marginBottom: '16px' }}>
              <div className="alert-ic">⚠️</div>
              <div>{error}</div>
            </div>
          )}

          <form onSubmit={handleLogin}>
            <div className="fg">
              <label className="fl">Email address</label>
              <input 
                className="fi" 
                type="email" 
                required 
                placeholder="you@example.com" 
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
            </div>
            <div className="fg">
              <label className="fl">Password</label>
              <input 
                className="fi" 
                type="password" 
                required 
                placeholder="••••••••" 
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', cursor: 'pointer' }}>
                <input type="checkbox" defaultChecked /> Remember me
              </label>
              <a style={{ fontSize: '13px', color: 'var(--blue)', cursor: 'pointer' }}>Forgot password?</a>
            </div>
            
            <button type="submit" className="btn btn-primary w-full" disabled={loading}>
              {loading ? 'Logging in...' : 'Sign In'}
            </button>
          </form>

          <div className="divider"></div>

          <button 
            type="button" 
            className="btn btn-outline w-full" 
            onClick={handleGoogleSignIn}
            disabled={loading}
          >
            Continue with Google
          </button>

          <div style={{ textAlign: 'center', marginTop: '24px' }}>
            <div className="auth-ft">Don't have an account? <Link to="/register">Register here</Link></div>
          </div>
        </div>
      </div>
    </div>
  );
}
