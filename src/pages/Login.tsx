import { Link, useNavigate } from 'react-router-dom';

export function Login() {
  const navigate = useNavigate();

  return (
    <div id="view-login" className="view on" style={{ paddingTop: 0 }}>
      <div className="auth-wrap">
        <div className="auth-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '28px' }}>
            <div className="logo-mark">R</div>
            <span className="logo-txt">Resi<span>.ai</span></span>
          </div>
          <h2>Welcome back</h2>
          <p className="sub">Sign in to your building community account</p>
          <div className="fg">
            <label className="fl">Email address</label>
            <input className="fi" type="email" placeholder="you@example.com" />
          </div>
          <div className="fg">
            <label className="fl">Password</label>
            <input className="fi" type="password" placeholder="••••••••" />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', cursor: 'pointer' }}>
              <input type="checkbox" defaultChecked /> Remember me
            </label>
            <a style={{ fontSize: '13px', color: 'var(--blue)', cursor: 'pointer' }}>Forgot password?</a>
          </div>
          <button className="btn btn-primary w-full" onClick={() => navigate('/committee')}>Sign In</button>
          <div className="divider"></div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '12px', color: 'var(--text2)', marginBottom: '10px' }}>Sign in as:</div>
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button className="btn btn-ghost btn-sm" onClick={() => navigate('/resident')}>👤 Resident</button>
              <button className="btn btn-ghost btn-sm" onClick={() => navigate('/committee')}>🏛 Director</button>
              <button className="btn btn-ghost btn-sm" onClick={() => navigate('/agent')}>🏢 Agent</button>
            </div>
          </div>
          <div className="auth-ft">Don't have an account? <Link to="/register">Register here</Link></div>
        </div>
      </div>
    </div>
  );
}
