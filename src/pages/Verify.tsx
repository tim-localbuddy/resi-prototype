import { Link } from 'react-router-dom';

export function Verify() {
  return (
    <div id="view-verify" className="view on" style={{ paddingTop: 0 }}>
      <div className="auth-wrap">
        <div className="auth-card" style={{ textAlign: 'center' }}>
          <div className="verify-icon">📧</div>
          <h2>Check your inbox</h2>
          <p className="sub" style={{ marginBottom: '20px' }}>We've sent a verification link to your email address. Click the link to activate your account and get started.</p>
          <div className="alert a-blue" style={{ textAlign: 'left' }}>
            <div className="alert-ic">ℹ️</div>
            <div><div className="alert-title">Founding Member Access</div>Once verified, you'll have immediate free access to all Tier 2 features during our beta programme.</div>
          </div>
          <p style={{ fontSize: '13px', color: 'var(--text2)', marginBottom: '20px' }}>Didn't receive it? Check your spam folder or</p>
          <button className="btn btn-outline w-full" style={{ marginBottom: '12px' }}>Resend verification email</button>
          <Link to="/login" className="btn btn-ghost w-full">← Back to sign in</Link>
        </div>
      </div>
    </div>
  );
}
