import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authProvider } from '../lib/auth';
import { Logo } from '../components/Logo';

export function Register() {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [building, setBuilding] = useState('');
  const [role, setRole] = useState('resident');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await authProvider.signUpWithEmail(email, password, role, building, firstName, lastName);
      // Registration complete, Firebase will auto-trigger sendEmailVerification per our backend provider.
      navigate('/verify');
    } catch (err: any) {
      setError(err.message || 'Failed to register.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    setLoading(true);
    setError('');
    try {
      const user = await authProvider.signInWithGoogle();
      // Google popups generally self-verify email. Route appropriately:
      if (!user.emailVerified) navigate('/verify');
      else {
        const roles = Object.values(user.properties || {});
        if (roles.includes('agent')) navigate('/agent');
        else if (roles.includes('director')) navigate('/committee');
        else navigate('/resident');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to sign up with Google.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="view-register" className="view on" style={{ paddingTop: 0 }}>
      <div className="auth-wrap">
        <div className="auth-card">
          <Logo variant="auth" style={{ marginBottom: '24px' }}>
            <span className="badge b-blue" style={{ marginLeft: '4px' }}>Beta</span>
          </Logo>
          <h2>Create your account</h2>
          <p className="sub">Founding members receive free beta access — no card needed.</p>

          {error && (
            <div className="alert a-red" style={{ marginBottom: '16px' }}>
              <div className="alert-ic">⚠️</div>
              <div>{error}</div>
            </div>
          )}

          <form onSubmit={handleRegister}>
            <div className="frow">
              <div className="fg">
                <label className="fl">First name</label>
                <input className="fi" type="text" required placeholder="Terry" value={firstName} onChange={e => setFirstName(e.target.value)} />
              </div>
              <div className="fg">
                <label className="fl">Last name</label>
                <input className="fi" type="text" required placeholder="Ma" value={lastName} onChange={e => setLastName(e.target.value)} />
              </div>
            </div>
            
            <div className="fg">
              <label className="fl">Email address</label>
              <input className="fi" type="email" required placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} />
            </div>
            
            <div className="fg">
              <label className="fl">Building / Block name</label>
              <input className="fi" type="text" required placeholder="e.g. Maple House, 42 Elm Road" value={building} onChange={e => setBuilding(e.target.value)} />
            </div>
            
            <div className="fg">
              <label className="fl">Your role</label>
              <select className="fselect" value={role} onChange={e => setRole(e.target.value)}>
                <option value="resident">Resident</option>
                <option value="director">Committee Director / RTM</option>
                <option value="agent">Managing Agent</option>
                <option value="freeholder">Freeholder / Landlord</option>
              </select>
            </div>
            
            <div className="fg">
              <label className="fl">Password</label>
              <input className="fi" type="password" required placeholder="At least 8 characters" value={password} onChange={e => setPassword(e.target.value)} />
            </div>
            
            <div className="fg" style={{ marginBottom: '20px' }}>
              <label style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '13px', cursor: 'pointer', color: 'var(--text2)' }}>
                <input type="checkbox" required style={{ marginTop: '2px' }} /> I agree to the Terms of Service and Privacy Policy
              </label>
            </div>
            
            <button type="submit" className="btn btn-primary w-full" disabled={loading}>
              {loading ? 'Registering...' : 'Create Account & Verify Email →'}
            </button>
          </form>

          <div className="divider"></div>

          <button 
            type="button" 
            className="btn btn-outline w-full" 
            onClick={handleGoogleSignUp}
            disabled={loading}
          >
            Continue with Google
          </button>

          <div className="auth-ft">Already have an account? <Link to="/login">Sign in</Link></div>
        </div>
      </div>
    </div>
  );
}
