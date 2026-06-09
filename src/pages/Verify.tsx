import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { authProvider } from '../lib/auth';
import styles from './Auth.module.css';

export function Verify() {
  const { user, refreshUser } = useAuth();
  const navigate = useNavigate();
  const [resending, setResending] = useState(false);
  const [msg, setMsg] = useState('');

  // Auto redirect if they suddenly become verified
  useEffect(() => {
    if (user?.emailVerified) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleResend = async () => {
    setResending(true);
    setMsg('');
    try {
      await authProvider.resendVerificationEmail();
      setMsg('Verification email forcibly resent! Check your inbox.');
    } catch (err: any) {
      setMsg(err.message || 'Failed to resend. Please wait before trying again.');
    } finally {
      setResending(false);
    }
  };

  const handleSignOut = async () => {
    await authProvider.signOut();
    navigate('/login');
  };

  return (
    <div id="view-verify" className="view on" style={{ paddingTop: 0 }}>
      {/* We add a refresh button to check status without reloading entirely */}
      <div style={{ position: 'absolute', top: '16px', right: '16px' }}>
        <button className="btn btn-sm btn-ghost" onClick={refreshUser}>🔄 Refresh Status</button>
      </div>

      <div className={styles.authWrap}>
        <div className={styles.authCard} style={{ textAlign: 'center' }}>
          <div className={styles.verifyIcon}>📧</div>
          <h2 className={styles.authTitle}>Check your inbox</h2>
          <p className={styles.authSub} style={{ marginBottom: '20px' }}>
            We've sent a verification link to your email address: <strong>{user?.email || 'your email'}</strong>. 
            Click the link to activate your account and access your dashboard.
          </p>
          
          <div className="alert a-blue" style={{ textAlign: 'left', marginBottom: '20px' }}>
            <div className="alert-ic">ℹ️</div>
            <div><div className="alert-title">Founding Member Access</div>Once verified, you'll have immediate free access to all Tier 2 features during our beta programme.</div>
          </div>
          
          {msg && (
            <div className="alert a-green" style={{ marginBottom: '16px', textAlign: 'left' }}>
              <div className="alert-ic">✓</div>
              <div>{msg}</div>
            </div>
          )}

          <p style={{ fontSize: '13px', color: 'var(--text2)', marginBottom: '20px' }}>Didn't receive it? Check your spam folder or</p>
          
          <button 
            className="btn btn-outline w-full" 
            style={{ marginBottom: '12px' }}
            onClick={handleResend}
            disabled={resending || !user}
          >
            {resending ? 'Sending...' : 'Resend verification email'}
          </button>
          
          <button className="btn btn-ghost w-full" onClick={handleSignOut}>
            ← Sign out
          </button>
        </div>
      </div>
    </div>
  );
}
